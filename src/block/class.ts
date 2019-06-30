import { Block } from "../block";
import { Doc, Param } from "../doc";
import Config from "../util/config";

/**
 * Represents a class block
 */
export default class Class extends Block
{
    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*(abstract|final)?\s*(class|trait|interface)\s+([A-Za-z0-9_]+)\s*/;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        let doc = new Doc('Undocumented '+ params[2]);
        doc.template = Config.instance.get('classTemplate');

        return doc;
    }
}
