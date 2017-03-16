import {Range, Position, TextEditor, workspace, SnippetString} from "vscode";
import {Param, Doc} from './doc';

export abstract class Block
{
    protected pattern:RegExp;
    protected position:Position;
    protected editor:TextEditor;
    protected signiture:string;
    protected signitureEnd:RegExp = /[\{;]/;

    constructor(position:Position = null, editor:TextEditor = null) {
        this.position = position;
        this.editor = editor;
        if (editor != null && position != null) {
            this.signiture = this.getBlock(position, this.signitureEnd);
        }
    }

    test():boolean {
        return this.pattern.test(this.signiture)
    }

    match():object {
        return this.signiture.match(this.pattern);
    }

    setSigniture(signiture:string) {
        this.signiture = signiture;
    }

    getBlock(initial:Position, endChar:RegExp) {
        let line = initial.line+1;
        let part = this.editor.document.lineAt(line).text;

        let initialCharacter = part.search(/[^\s]/);
        if (initialCharacter === -1) {
            return "";
        }

        let start = new Position(initial.line+1, initialCharacter);
        while (!endChar.test(part)) {
            line++;
            part = this.editor.document.lineAt(line).text;
        }
        let end = new Position(line, part.search(endChar));
        let block = new Range(start, end);

        return this.editor.document.getText(block);
    }

    getEnclosed(context:string, opening:string = "{", closing:string = "}") {
        let opened = 0;
        let contextArray:Array<string> = context.split("");
        let endPos = 0;
        for (let index = 0; index < contextArray.length; index++) {
            let char = contextArray[index];
            if (char == closing && opened == 0) {
                endPos = index;
                break;
            } else if (char == closing) {
                opened--;
            } else if (char == opening) {
                opened++;
            }
            endPos = index;
        }

        return context.substr(0, endPos);
    }

    abstract parse():Doc;
}