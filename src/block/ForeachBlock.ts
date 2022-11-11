import { Doc, Param } from "../doc";
import VariableBlock from "./VariableBlock";

/**
 * Represents an var block for `foreach`
 */
export default class ForeachBlock extends VariableBlock
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*foreach\s*\(.*?as\s+(\$[a-z_][a-z0-9_]*\s*=>\s*)?(\$[a-z_][a-z0-9_]*)\s*\)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        return this.parseVar(params[2]);
    }
}

