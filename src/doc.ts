import {workspace, SnippetString, WorkspaceConfiguration} from 'vscode';
import Config from './util/config';

interface MaxParamLength {
    type: number,
    name: number
}

interface AlignmentSpaces {
    prepend: string,
    append: string
}

/**
 * Represents a comment block.
 *
 * This class collects data about the snippet then builds
 * it with the appropriate tags
 */
export class Doc
{
    /**
     * List of param tags
     *
     * @type {Array<Param>}
     */
    public params:Array<Param> = [];

    /**
     * Return tag
     *
     * @type {string}
     */
    public return:string;

    /**
     * Var tag
     *
     * @type {string}
     */
    public var:string;

    /**
     * The message portion of the block
     *
     * @type {string}
     */
    public message:string;

    /**
     * Define the template for the documentor
     *
     * @type {Object}
     */
    protected _template:Object;

    /**
     * Creates an instance of Doc.
     *
     * @param {string} [message='']
     */
    public constructor(message:string = '')
    {
        this.message = message;
    }

    /**
     * Define indent character for param alignment.
     *
     * @type {string}
     */
    public indentCharacter:string = ' ';

    /**
     * Set class properties from a standard object
     *
     * @param {*} input
     */
    public fromObject(input:any):void
    {
        if (input.return !== undefined) {
            this.return = input.return;
        }
        if (input.var !== undefined) {
            this.var = input.var;
        }
        if (input.message !== undefined) {
            this.message = input.message;
        }
        if (input.params !== undefined && Array.isArray(input.params)) {
            input.params.forEach(param => {
                this.params.push(new Param(param.type, param.name));
            });
        }
    }

    /**
     * Build all the set values into a SnippetString ready for use
     *
     * @param {boolean} [isEmpty=false]
     * @returns {SnippetString}
     */
    public build(isEmpty:boolean = false):SnippetString
    {
        let extra = Config.instance.get('extra');
        let gap = Config.instance.get('gap');
        let returnGap = Config.instance.get('returnGap');
        let alignParams = Config.instance.get('alignParams');
        // Align return is false if align params is not active.
        let alignReturn = alignParams ? Config.instance.get('alignReturn') : false;

        let returnString = "";
        let varString = "";
        let paramString = "";
        let extraString = "";
        let messageString = "";

        if (isEmpty) {
            gap = true;
            extra = [];
        }

        messageString = "\${###" + (this.message != "" ? ':' : '') + this.message + "}";

        // Loop through params and find max length of type and name.
        let maxParamLength = this.getMaxParamLength(this.params, this.return);

        if (this.params.length) {
            paramString = "";
            this.params.forEach(param => {
                if (paramString != "") {
                    paramString += "\n";
                }

                let paramType = param.type;
                let paramName = param.name.replace('$', '\\$');

                let alignmentSpaces = this.getParamAlignmentSpaces(maxParamLength, paramName, paramType);

                paramString +=
                    "@param " +
                    // Add extra space to align '@param' and '@return'.
                    (alignReturn ? this.indentCharacter : '') +
                    "\${###:"+paramType+"} " +
                    alignmentSpaces.prepend + paramName + alignmentSpaces.append;

                let description = Config.instance.get('paramDescription');
                if (description === true) {
                    paramString += "\${###}"
                } else if (typeof description == 'string') {
                    paramString += "\${###:" + description + "}"
                }
            });
        }

        if (this.var) {
            varString = "@var \${###:" +this.var + "}";

            let varDescription = Config.instance.get('varDescription');
            if (varDescription === true) {
                varString += " \${###}"
            } else if (typeof varDescription == 'string') {
                varString += " \${###:" + varDescription + "}"
            }
        }

        if (this.return && (this.return != 'void' || Config.instance.get('returnVoid'))) {
            let alignmentSpaces = this.getReturnAlignmentSpaces(maxParamLength);
            returnString = "@return \${###:" +this.return + "}" + alignmentSpaces.append;

            let description = Config.instance.get('returnDescription');
            if (description === true) {
                returnString += "\${###}"
            } else if (typeof description == 'string') {
                returnString += "\${###:" + description + "}"
            }
        }

        if (Array.isArray(extra) && extra.length > 0) {
            extraString = extra.join("\n");
        }


        let templateArray = [];
        for (let key in this.template) {
            let propConfig = this.template[key];
            let propString:string;
            if (key == 'message' && messageString) {
                propString = messageString;
                if (gap) {
                    propConfig.gapAfter = true;
                }
            } else if (key == 'var' && varString) {
                propString = varString;
            } else if (key == 'return' && returnString) {
                propString = returnString;
                if (returnGap) {
                    propConfig.gapBefore = true;
                }
            } else if (key == 'param' && paramString) {
                propString = paramString;
            } else if (key == 'extra' && extraString) {
                propString = extraString;
            } else if (propConfig.content !== undefined) {
                propString = propConfig.content;
            }

            if (propString && propConfig.gapBefore && templateArray[templateArray.length - 1] != "") {
                templateArray.push("");
            }

            if (propString) {
                templateArray.push(propString);
            }

            if (propString && propConfig.gapAfter) {
                templateArray.push("");
            }
        }

        if (templateArray[templateArray.length - 1] == "") {
            templateArray.pop();
        }

        let templateString:string = templateArray.join("\n");
        let stop = 0;
        templateString = templateString.replace(/###/gm, function():string {
            stop++;
            return stop + "";
        });

        templateString = templateString.replace(/^$/gm, " *");
        templateString = templateString.replace(/^(?!(\s\*|\/\*))/gm, " * $1");

        if (Config.instance.get('autoClosingBrackets') == "never") {
            templateString = "\n" + templateString + "\n */";
        } else {
            templateString = "/**\n" + templateString + "\n */";
        }

        let snippet = new SnippetString(templateString);

        return snippet;
    }

    /**
     * Set the template for rendering
     *
     * @param {Object} template
     */
    public set template(template:Object)
    {
        this._template = template;
    }

    /**
     * Get the template
     *
     * @type {Object}
     */
    public get template():Object
    {
        if (this._template == null) {
            return {
                message: {},
                var: {},
                param: {},
                return: {},
                extra: {}
            }
        }

        return this._template;
    }

    /**
     * Get the max param type length and param name length.
     *
     * @param {Array<Param>} params
     * @param {string} returnStatement
     * @returns {MaxParamLength}
     */
    private getMaxParamLength(params: Array<Param>, returnStatement: string): MaxParamLength
    {
        let alignParams = Config.instance.get('alignParams');
        let alignReturn = alignParams ? Config.instance.get('alignReturn') : false;


        let maxParamTypeLength = 0;
        let maxParamNameLength = 0;
        if (params.length && alignParams) {
            params.forEach(param => {
                let paramType = param.type;
                if (paramType.length > maxParamTypeLength) {
                    maxParamTypeLength = paramType.length;
                }
                let paramName = param.name.replace('$', '\\$')
                if (paramName.length > maxParamNameLength) {
                    maxParamNameLength = paramName.length;
                }
            });
        }
        // If align return is active, check if it has a longer type.
        if (returnStatement && (returnStatement != 'void' || Config.instance.get('returnVoid')) && alignReturn) {
            if (returnStatement.length > maxParamTypeLength) {
                maxParamTypeLength = returnStatement.length;
            }
        }

        return {
            type: maxParamTypeLength,
            name: maxParamNameLength
        }
    }

    /**
     * Get extra spaces for alignment of params.
     *
     * @param {MaxParamLength} maxParamLength
     * @param {string} paramName
     * @param {string} paramType
     * @returns {AlignmentSpaces}
     */
    private getParamAlignmentSpaces(maxParamLength: MaxParamLength, paramName: string, paramType: string): AlignmentSpaces
    {
        let alignParams = Config.instance.get('alignParams');
        let paramDescription = Config.instance.get('paramDescription');

        let prependSpace = '';
        let appendSpace = '';
        if (alignParams) {
            // Append additional spaces on param type and param name.
            prependSpace = Array(maxParamLength.type - paramType.length).fill(this.indentCharacter).join('');
            // Add 1 to array size, so there is already a space appended for typing comments.
            appendSpace = Array(1 + maxParamLength.name - paramName.length).fill(this.indentCharacter).join('');
        }

        return {
            append: paramDescription ? (alignParams ? appendSpace : this.indentCharacter) : '',
            prepend: prependSpace
        };
    }

    /**
     * Get extra spaces for alignment of return statement.
     *
     * @param {MaxParamLength} maxParamLength
     * @returns {AlignmentSpaces}
     */
    private getReturnAlignmentSpaces(maxParamLength: MaxParamLength): AlignmentSpaces
    {
        let alignParams = Config.instance.get('alignParams');
        let alignReturn = alignParams ? Config.instance.get('alignReturn') : false;
        let returnDescription = Config.instance.get('returnDescription');

        let appendSpace = '';
        if (alignReturn) {
            appendSpace =
                Array(1 + maxParamLength.type - this.return.length).fill(this.indentCharacter).join('') +
                Array(maxParamLength.name).fill(this.indentCharacter).join('');
        }

        return {
            append: returnDescription ? (alignReturn ? appendSpace : this.indentCharacter) : '',
            prepend: ''
        };
    }

}

/**
 * A simple paramter object
 */
export class Param
{
    /**
     * The type of the parameter
     *
     * @type {string}
     */
    public type:string;

    /**
     * The parameter name
     *
     * @type {string}
     */
    public name:string;

    /**
     * Creates an instance of Param.
     *
     * @param {string} type
     * @param {string} name
     */
    public constructor(type:string, name:string)
    {
        this.type = type;
        this.name = name;
    }
}
