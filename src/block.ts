import {Range, TextEditor, workspace, SnippetString} from "vscode";
import {Param, Doc} from './doc';

export abstract class Block
{
    protected pattern:RegExp;
    protected line:string;

    constructor(line:string) {
        this.line = line;
    }

    test():boolean {
        return this.pattern.test(this.line)
    }

    match():object {
        return this.line.match(this.pattern);
    }

    abstract parse():Doc;
}