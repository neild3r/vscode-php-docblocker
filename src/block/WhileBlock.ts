import { Doc, Param } from "../doc";
import VariableBlock from "./VariableBlock";

/**
 * Represents an var block for `while`
 */
export default class WhileBlock extends VariableBlock
{

    /**
     * @inheritdoc
     */
    protected pattern:RegExp = /^\s*while\s*\((\$[a-z0-9_]+)\s*=(?!=)/im;

    /**
     * @inheritdoc
     */
    public parse():Doc
    {
        let params = this.match();
        return this.parseVar(params[1]);
    }
}

