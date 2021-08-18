import { Block } from "../block";
import { Doc, Param } from "../doc";
import { DocType } from "../DocType";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents a class block
 */
export default class Class extends Block
{
    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*(abstract|final)?\s*(class|trait|interface|enum)\s+([a-z0-9_]+)\s*/i;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        let doc = new Doc(DocType.class, TypeUtil.instance.getDefaultMessage(params[3], params[2]));
        doc.template = Config.instance.get('classTemplate');

        return doc;
    }
}
