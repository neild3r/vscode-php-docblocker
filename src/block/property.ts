import { Block } from "../block";
import { Doc, Param } from "../doc";
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
    protected pattern:RegExp = /^\s*(protected|private|public|static)\s+([a-z0-9_\?\|\\\s]+)?\s*(\$[a-z0-9_]+)\s*\=?\s*([^;]*)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        
        let type = params[2] ? String(params[2]).trim().split(/\s+/).pop() : false;
        if (type && ['protected', 'private', 'public', 'static'].indexOf(type.toLowerCase()) !== -1) {
            type = false;
        }

        let doc = new Doc(TypeUtil.instance.getDefaultMessage(String(params[3]).substr(1), 'property'));
        doc.template = Config.instance.get('propertyTemplate');

        if (type) {
            let nullable = params[4] === 'null';
            if (type.charAt(0) === '?') {
                nullable = true;
                type = type.substr(1);
            }
            doc.var = TypeUtil.instance.getFormattedTypeByName(type, nullable);
        } else if (params[4]) {
            doc.var = this.getTypeFromValue(params[4]);
        } else {
            doc.var = TypeUtil.instance.getUnknownType();
        }

        if (type && Config.instance.get('autoIgnorePropertyType')) {
            doc.var = undefined;
        }
        return doc;
    }
}
