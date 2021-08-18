import { Block } from "../block";
import { Doc, Param } from "../doc";
import { DocType } from "../DocType";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents a enum block
 */
export default class EnumBlock extends Block
{
    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*enum\s+([a-z0-9_]+)[\s:]*/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        let doc = new Doc(DocType.class, TypeUtil.instance.getDefaultMessage(params[2], 'enum'));
        doc.template = Config.instance.get('enumTemplate');

        return doc;
    }
}
