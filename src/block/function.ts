import { Block } from "../block";
import { Doc, Param } from "../doc";

export default class Function extends Block {

    protected pattern:RegExp = /^\s*((.*)(protected|private|public))?(.*)?\s*function\s+([A-Za-z0-9_]+)\s*\(([^{;]*)/m;

    parse():Doc {
        let params = this.match();

        let doc = new Doc('Undocumented function');
        let argString = this.getEnclosed(params[6], "(", ")");

        if (argString != "") {
            let args = argString.split(',');
            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                let parts = arg.match(/^\s*([A-Za-z0-9_]+)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)\s*/m);
                var type = '[type]';

                if (parts[1] != null) {
                    type = parts[1];
                } else if (parts[3] != null && parts[3] != "") {
                    type = this.getTypeFromValue(parts[3]);
                }

                doc.params.push(new Param(type, parts[2]));
            }
        }

        doc.return = this.getReturnFromName(params[5]);

        return doc;
    }

    getReturnFromName(name:string) {
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
