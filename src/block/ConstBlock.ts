import { Block } from "../block";
import { Doc, Param } from "../doc";
import { DocType } from "../DocType";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents an const block
 */
export default class ConstBlock extends Block
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*((final|public|protected|private)\s*)*\s*const\s+([a-z0-9_]+)\s*\=/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        let doc = new Doc(DocType.const, TypeUtil.instance.getDefaultMessage(params[3], 'const'));
        doc.template = Config.instance.get('constTemplate');
        return doc;
    }
}
