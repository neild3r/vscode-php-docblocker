import {Range, Position, TextEditor, TextEditorEdit, workspace, SnippetString} from "vscode";
import FunctionBlock from "./block/function";
import Property from "./block/property";
import Class from "./block/class";
import {Doc, Param} from "./doc";

export default class Documenter
{
    protected targetPosition:Position;
    protected editor:TextEditor;

    constructor(range:Range, editor:TextEditor) {
        this.targetPosition = range.start;
        this.editor = editor;
    }

    autoDocument():SnippetString {
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

        return new Doc().build();
    }
}
