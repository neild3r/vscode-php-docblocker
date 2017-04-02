import { Block } from "../block";
import { Doc, Param } from "../doc";

/**
 * Represents a function code block
 *
 * This is probably going to be the most complicated of all the
 * blocks as function signitures tend to be the most complex and
 * varied
 */
export default class FunctionBlock extends Block
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*((.*)(protected|private|public))?(.*)?\s*function\s+([A-Za-z0-9_]+)\s*\(([^{;]*)/m;

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
                let parts = arg.match(/^\s*([A-Za-z0-9_]+)?\s*\&?((?:[.]{3})?\$[A-Za-z0-9_]+)\s*\=?\s*(.*)\s*/m);
                var type = '[type]';

                if (parts[1] != null) {
                    type = parts[1];
                } else if (parts[3] != null && parts[3] != "") {
                    type = this.getTypeFromValue(parts[3]);
                }

                doc.params.push(new Param(type, parts[2]));
            }
        }

        let returnType:Array<string> = this.signiture.match(/.*\)\s*\:\s*([a-zA-Z]+)\s*$/m);

        if (returnType != null) {
            doc.return = returnType[1];
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
        if (/^(is|has)/.test(name)) {
            return 'boolean';
        }

        switch (name) {
            case '__construct':
            case '__destruct':
            case '__set':
            case '__unset':
            case '__wakeup':
                return null;
            case '__isset':
                return 'boolean';
            case '__sleep':
            case '__debugInfo':
                return 'array';
            case '__toString':
                return 'string';
        }

        return 'void';
    }
}
