import { Block } from "../block";
import { Doc, Param } from "../doc";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents an var block
 */
export default class Variable extends Block
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*(\$[a-z0-9_]+)\s*\=?\s*([^;]*)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        let doc = new Doc(TypeUtil.instance.getDefaultMessage(String(params[1]).substr(1), 'variable'));
        doc.template = Config.instance.get('variableTemplate');

        if (params[2]) {
            doc.var = this.getTypeFromValue(params[2]);
        } else {
            doc.var = TypeUtil.instance.getUnknownType();
        }
        if (Config.instance.get('variableWithKey')) {
            doc.var += ' ' + params[1];
        }

        doc.inline = Config.instance.get('variableInline');
        if (doc.inline) {
            doc.message = '';
        }

        return doc;
    }
}
