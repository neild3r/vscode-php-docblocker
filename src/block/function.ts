import { Block } from "../block";
import { Doc, Param } from "../doc";
import TypeUtil from "../util/TypeUtil";
import { Range, Position } from "vscode";
import Config from "../util/config";
import { DocType } from "../DocType";

/**
 * Represents a function code block
 *
 * This is probably going to be the most complicated of all the
 * blocks as function signatures tend to be the most complex and
 * varied
 */
export default class FunctionBlock extends Block
{
    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*((.*)(protected|private|public))?(.*)?\s*function\s+&?([a-z0-9_]+)\s*\(([^{;]*)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();

        let doc = new Doc(DocType.function, TypeUtil.instance.getDefaultMessage(params[5], 'function'));
        doc.template = Config.instance.get('functionTemplate');
        let argString = this.getEnclosed(params[6], "(", ")");
        let head:string;

        if (argString != "") {
            let args = this.getSplitWithoutEnclosed(argString);

            if (Config.instance.get('qualifyClassNames')) {
                head = this.getClassHead();
            }

            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                
                // `public ?Object&Object|Object &...$vars = value`
                let parts = arg.match(/^\s*(?:(?:public|protected|private)\s+(?:readonly)?\s*)?(\?)?\s*([a-z_\\][a-z0-9_\\\|&\s]*)?\s*\&?((?:[.]{3})?\$[a-z0-9_]+)\s*\=?\s*(.*)\s*/im);
                if (parts === null) {
                    // trailing comma
                    if (arg.trim() === '') {
                        continue;
                    }

                    // ignore syntax error
                    let tmp = arg.match(/^\s*(\?)?\s*(.*?)\s*(\$[a-z0-9_]+)[\s=]?/im);
                    if (tmp) {
                        parts = [];
                        parts[1] = tmp[1];
                        parts[2] = tmp[2];
                        parts[3] = tmp[3];
                    } else {
                        parts = [];
                        parts[2] = arg;
                        parts[3] = '';
                    }
                }
                
                if (parts[2] !== undefined) {
                    parts[2] = parts[2].trim();
                }

                var type:string;

                if (parts[2] != null && parts[1] === '?') {
                    type = TypeUtil.instance.getResolvedTypeHints(parts[2], true, head);
                } else if (parts[2] != null && parts[2] != "mixed" && parts[1] === undefined && parts[4] === "null") {// int $var = null
                    type = TypeUtil.instance.getResolvedTypeHints(parts[2], true, head);
                } else if (parts[2] != null) {
                    type = TypeUtil.instance.getResolvedTypeHints(parts[2], false, head);
                } else if (parts[4] != null && parts[4] != "") {
                    type = TypeUtil.instance.getResolvedTypeHints(TypeUtil.instance.getTypeFromValue(parts[4]), false, head);
                } else {
                    type = TypeUtil.instance.getUnknownType();
                }

                doc.params.push(new Param(type, parts[3]));
            }
        }

        let returnType:Array<string> = this.signature.match(/.*\)\s*\:\s*(\?)?\s*([a-z_\\][a-z0-9_\\\|&\s]*)\s*$/im);

        if (returnType != null) {
            let head:string;
            if (Config.instance.get('qualifyClassNames')) {
                head = this.getClassHead();
            }
            let nullable = returnType[1] === '?';
            doc.return = TypeUtil.instance.getResolvedTypeHints(returnType[2], nullable, head);
        } else {
            doc.return = this.getReturnFromName(params[5]);
        }

        return doc;
    }

    /**
     * We can usually assume that these function names will
     * be certain return types and we can save ourselves some
     * effort by checking these
     *
     * @param {string} name
     * @returns {string}
     */
    public getReturnFromName(name:string):string
    {
        if (/^(is|has|can|should)(?:[A-Z0-9_]|$)/.test(name)) {
            return TypeUtil.instance.getFormattedTypeByName('bool');
        }

        switch (name) {
            case '__construct':
            case '__destruct':
            case '__set':
            case '__unset':
            case '__wakeup':
                return null;
            case '__isset':
                return TypeUtil.instance.getFormattedTypeByName('bool');
            case '__sleep':
            case '__debugInfo':
                return 'array';
            case '__toString':
                return 'string';
        }

        return 'void';
    }
}
