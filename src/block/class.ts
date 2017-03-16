import { Block } from "../block";
import { Doc, Param } from "../doc";

export default class Class extends Block {

    protected pattern:RegExp = /^\s*(abstract|final)?\s*(class|trait|interface)\s+([A-Za-z0-9_]+)\s*/;

    parse():Doc {
        let params = this.match();
        let doc = new Doc('Undocumented '+ params[2]);

        return doc;
    }
}
