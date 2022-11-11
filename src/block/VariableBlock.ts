import { Block } from "../block";
import { Doc, Param } from "../doc";
import Config from "../util/config";
import TypeUtil from "../util/TypeUtil";

/**
 * Represents an var block
 */
export default class VariableBlock extends Block
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
        return this.parseVar(params[1], params[2]);
    }
    
    /**
     * parse
     * 
     * @param key e.g.`$key`
     * @param value
     * @returns 
     */
    protected parseVar(key: string, value: any=undefined): Doc
    {
        let doc = new Doc(key.substring(1));
        if (value) {
            doc.var = TypeUtil.instance.getTypeFromValue(value);
        } else {
            doc.var = TypeUtil.instance.getDefaultType();
        }
        doc.inline = true;

        return doc;
    }
}

