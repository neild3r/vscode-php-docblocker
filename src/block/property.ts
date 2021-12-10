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
    protected pattern:RegExp = /^\s*(static)?\s*(protected|private|public)\s+(static\s*)?(?:readonly\s*)?(\??\\?[a-zA-Z_\x7f-\xff][a-zA-Z0-9|_\x7f-\xff\\]+)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*([^;]*)/m;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();

        let doc = new Doc('Undocumented variable');
        doc.template = Config.instance.get('propertyTemplate');

        if (params[4]) {
            let parts:Array<string> = params[4].match(/(\?)?(.*)/m);
            let head:string;

            if (Config.instance.get('qualifyClassNames')) {
                head = this.getClassHead();
            }

            let varType = TypeUtil.instance.getResolvedTypeHints(parts[2], head);
            varType = TypeUtil.instance.getFormattedTypeByName(varType);

            if (parts[1] === '?') {
                varType += '|null';
            }

            doc.var = varType;
        } else if (params[6]) {
            doc.var = TypeUtil.instance.getTypeFromValue(params[6]);
        } else {
            doc.var = '[type]';
        }

        return doc;
    }
}
