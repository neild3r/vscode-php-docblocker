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
                let parts = arg.match(/^\s*([A-Za-z0-9_]+)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)$/m);
                doc.params.push(new Param(parts[1] ? parts[1] : '[type]', parts[2]));
            }
        }

        doc.return = 'void';

        return doc;
    }
}