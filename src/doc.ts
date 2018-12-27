import {workspace, SnippetString, WorkspaceConfiguration} from 'vscode';
import Config from './util/config';

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
     * @type {Array<string>}
     */
    protected _template:Array<string>;

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

        let returnString = "-";
        let varString = "-";
        let gapString = gap ? "" : "-";
        let returnGapString = "-";
        let paramString = "-";
        let extraString = "-";
        let messageString = "-";

        if (isEmpty) {
            gap = true;
            extra = [];
        }

        if (this.message != null) {
            messageString = "\${###" + (this.message != "" ? ':' : '') + this.message + "}";
        }

        if (this.params.length) {
            paramString = "";
            this.params.forEach(param => {
                if (paramString != "") {
                    paramString += "\n";
                }
                paramString += "@param \${###:"+param.type+"} " + param.name.replace('$', '\\$');
            });
        }

        if (this.var) {
            varString = "@var \${###:" +this.var + "}";
        }

        if (this.return && (this.return != 'void' || Config.instance.get('returnVoid'))) {
            returnString = "@return \${###:" +this.return + "}";
        }

        if (Array.isArray(extra) && extra.length > 0) {
            extraString = "";
            for (var index = 0; index < extra.length; index++) {
                var element = extra[index];
                if (index > 0) {
                    extraString += "\n";
                }
                extraString += element;
            }
        }

        if (gap && varString == "-" && returnString == "-" && extraString == "-"  && paramString == "-") {
            gapString = "-";
        }

        if (returnGap && returnString != "-" && paramString != "-") {
            returnGapString = "";
        }

        let templateString:string = this.template.join("\n");
        templateString = "/**\n" + templateString + "\n */";
        templateString = templateString.replace(/{message}/gm, messageString);
        templateString = templateString.replace(/{var}/gm, varString);
        templateString = templateString.replace(/{return}/gm, returnString);
        templateString = templateString.replace(/{params}/gm, paramString);
        templateString = templateString.replace(/{gap}/gm, gapString);
        templateString = templateString.replace(/{returnGap}/gm, returnGapString);
        templateString = templateString.replace(/{extra}/gm, extraString);

        let stop = 0;
        templateString = templateString.replace(/###/gm, function():string {
            stop++;
            return stop + "";
        });

        templateString = templateString.replace(/\n-(?=\n)/gm, "");
        templateString = templateString.replace(/^(?!(\s\*|\/\*))/gm, " * $1");
        templateString = templateString.replace(/^\s\*\s\n/gm, " *\n");

        let snippet = new SnippetString(templateString);

        return snippet;
    }

    /**
     * Set the template for rendering
     *
     * @param {Array<string>} template
     */
    public set template(template:Array<string>)
    {
        this._template = template;
    }

    /**
     * Get the template
     *
     * @type {Array<string>}
     */
    public get template():Array<string>
    {
        if (this._template == null) {
            return [
                "{message}",
                "{gap}",
                "{var}",
                "{params}",
                "{returnGap}",
                "{return}",
                "{extra}"
            ];
        }

        return this._template;
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
