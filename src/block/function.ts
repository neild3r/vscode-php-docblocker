import { Block } from "../block";
import { Doc, Param } from "../doc";
import TypeUtil from "../util/TypeUtil";
import { Range, Position } from "vscode";

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
    protected pattern:RegExp = /^\s*((.*)(protected|private|public))?(.*)?\s*function\s+&?([A-Za-z0-9_]+)\s*\(([^{;]*)/m;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();

        let doc = new Doc('Undocumented function');
        let argString = this.getEnclosed(params[6], "(", ")");

        if (argString != "") {
            let args = argString.split(',');
            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                let parts = arg.match(/^\s*(\?)?\s*([A-Za-z0-9_\\]+)?\s*\&?((?:[.]{3})?\$[A-Za-z0-9_]+)\s*\=?\s*(.*)\s*/m);
                var type = '[type]';

                if (parts[2] != null) {
                    parts[2] = this.getFullyQualifiedType(parts[2]);
                }

                if (parts[2] != null && parts[1] === '?') {
                    type = TypeUtil.instance.getFormattedTypeByName(parts[2])+'|null';
                } else if (parts[2] != null) {
                    type = TypeUtil.instance.getFormattedTypeByName(parts[2]);
                } else if (parts[4] != null && parts[4] != "") {
                    type = TypeUtil.instance.getFormattedTypeByName(this.getTypeFromValue(parts[4]));
                }

                doc.params.push(new Param(type, parts[3]));
            }
        }

        let returnType:Array<string> = this.signature.match(/.*\)\s*\:\s*(\?)?\s*([a-zA-Z\\]+)\s*$/m);

        if (returnType != null) {
            doc.return = (returnType[1] === '?')
                ? TypeUtil.instance.getFormattedTypeByName(returnType[2])+'|null'
                : TypeUtil.instance.getFormattedTypeByName(returnType[2]);
        } else {
            doc.return = this.getReturnFromName(params[5]);
        }

        return doc;
    }

    /**
     * Get the full qualified class namespace for a type
     * we'll need to access the document
     *
     * @param {string} type
     * @returns {string}
     */
    public getFullyQualifiedType(type:string):string
    {
        let text = this.editor.document.getText();
        let regex = /\s*(abstract|final)?\s*(class|trait|interface)/gm;
        let match = regex.exec(text);
        let end = this.editor.document.positionAt(match.index);

        let range = new Range(new Position(0, 0), end);
        let head = this.editor.document.getText(range);

        let useEx = new RegExp("use\\s+(.*)(?:\\s+as\\s+)?"+type+";", 'gm');
        let full = useEx.exec(head);

        if (full != null) {
            if (full[2] != null) {
                return full[1];
            }

            return full[1] + type;
        }

        return type;
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
        if (/^(is|has|can)/.test(name)) {
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
