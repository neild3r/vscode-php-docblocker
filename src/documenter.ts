import {Range, Position, TextEditor, TextEditorEdit, workspace, SnippetString} from "vscode";
import FunctionBlock from "./block/function";
import Property from "./block/property";
import Class from "./block/class";
import {Doc, Param} from "./doc";
import VariableBlock from "./block/VariableBlock";
import ForeachBlock from "./block/ForeachBlock";
import WhileBlock from "./block/WhileBlock";
import { DocType } from "./DocType";

/**
 * Check which type of docblock we need and instruct the components to build the
 * snippet and pass it back
 */
export default class Documenter
{
    /**
     * The target position of the comment block
     *
     * @type {Position}
     */
    protected targetPosition:Position;

    /**
     * We'll need an editor to pass to each editor
     *
     * @type {TextEditor}
     */
    protected editor:TextEditor;

    /**
     * Creates an instance of Documenter.
     *
     * @param {Range} range
     * @param {TextEditor} editor
     */
    public constructor(range:Range, editor:TextEditor)
    {
        this.targetPosition = range.start;
        this.editor = editor;
    }

    /**
     * Load and test each type of signature to see if they can trigger and
     * if not load an empty block
     *
     * @returns {SnippetString}
     */
    public autoDocument():SnippetString
    {
        let func = new FunctionBlock(this.targetPosition, this.editor);
        if (func.test()) {
            return func.parse().build();
        }

        let prop = new Property(this.targetPosition, this.editor);
        if (prop.test()) {
            return prop.parse().build();
        }

        let cla = new Class(this.targetPosition, this.editor);
        if (cla.test()) {
            return cla.parse().build();
        }

        let variable = new VariableBlock(this.targetPosition, this.editor);
        if (variable.test()) {
            return variable.parse().build();
        }

        let foreach = new ForeachBlock(this.targetPosition, this.editor);
        if (foreach.test()) {
            return foreach.parse().build();
        }

        let while_ = new WhileBlock(this.targetPosition, this.editor);
        if (while_.test()) {
            return while_.parse().build();
        }

        return new Doc(DocType.empty).build(true);
    }
}
