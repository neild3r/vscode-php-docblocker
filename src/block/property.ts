import { Block } from "../block";
import { Doc, Param } from "../doc";
import { DocType } from "../DocType";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents an property block
 */
export default class Property extends Block
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*(static)?\s*(protected|private|public)\s+(static)?\s*(\??\\?[a-z_\x7f-\xff][a-z0-9_\x7f-\xff\\]+)?\s*(\$[a-z0-9_]+)\s*\=?\s*([^;]*)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();

        let doc = new Doc(DocType.property, TypeUtil.instance.getDefaultMessage(String(params[5]).substr(1), 'property'));
        doc.template = Config.instance.get('propertyTemplate');

        if (params[4]) {
            let parts:Array<string> = params[4].match(/(\?)?(.*)/m);
            let head:string;

            if (Config.instance.get('qualifyClassNames')) {
                head = this.getClassHead();
            }

            let nullable = parts[1] === '?';

            doc.var = TypeUtil.instance.getFormattedTypeByName(parts[2], nullable, head);
        } else if (params[6]) {
            doc.var = this.getTypeFromValue(params[6]);
        } else {
            doc.var = TypeUtil.instance.getUnknownType();
        }

        return doc;
    }
}
