import {Range, Position, TextEditor, workspace, SnippetString} from "vscode";
import {Param, Doc} from './doc';

/**
 * Represents a potential code block.
 *
 * This abstract class serves as a base class that includes lots of
 * helpers for dealing with blocks of code and has the basic interface
 * for working with the documenter object
 */
export abstract class Block
{
    /**
     * Regex pattern for the basic signiture match
     *
     * @type {RegExp}
     */
    protected pattern:RegExp;

    /**
     * The position of the starting signiture
     *
     * @type {Position}
     */
    protected position:Position;

    /**
     * Text editor instance which we'll need to do things like
     * get text and ranges and things between ranges
     *
     * @type {TextEditor}
     */
    protected editor:TextEditor;

    /**
     * The whole signature string ready for parsing
     *
     * @type {string}
     */
    protected signature:string;

    /**
     * Default signature end pattern
     *
     * @type {RegExp}
     */
    protected signatureEnd:RegExp = /[\{;]/;

    /**
     * Creates an instance of Block.
     *
     * @param {Position} position
     * @param {TextEditor} editor
     */
    public constructor(position:Position, editor:TextEditor)
    {
        this.position = position;
        this.editor = editor;
        this.setSignature(this.getBlock(position, this.signatureEnd));
    }

    /**
     * This should be a simple test to determine wether this matches
     * our intended block signiture and we can proceed to properly
     * match
     *
     * @returns {boolean}
     */
    public test():boolean
    {
        return this.pattern.test(this.signature)
    }

    /**
     * Run a match to break the signiture into the constituent parts
     *
     * @returns {object}
     */
    public match():object
    {
        return this.signature.match(this.pattern);
    }

    /**
     * Set up the signiture string.
     *
     * This is usually detected from the position
     *
     * @param {string} signiture
     */
    public setSignature(signiture:string):void
    {
        this.signature = signiture;
    }

    /**
     * This matches a block and tries to find everything up to the
     * end character which is a regex to determine if it's the right
     * character
     *
     * @param {Position} initial
     * @param {RegExp} endChar
     * @returns {string}
     */
    public getBlock(initial:Position, endChar:RegExp):string
    {
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

    /**
     * Parse a nested block of code
     *
     * @param {string} context
     * @param {string} [opening="{"]
     * @param {string} [closing="}"]
     * @returns {string}
     */
    public getEnclosed(context:string, opening:string = "{", closing:string = "}"):string
    {
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

    /**
     * Take the value and parse and try to infer its type
     *
     * @param {string} value
     * @returns {string}
     */
    public getTypeFromValue(value:string):string
    {
        let result:Array<string>;

        // Check for bool
        if (value.match(/^\s*(false|true)\s*$/i) !== null) {
            return TypeUtil.getFormattedTypeByName('bool');
        }

        // Check for int
        if (value.match(/^\s*([\d-]+)\s*$/) !== null) {
            return TypeUtil.getFormattedTypeByName('int');
        }

        // Check for float
        if (value.match(/^\s*([\d.-]+)\s*$/) !== null) {
            return 'float';
        }

        // Check for string
        if (value.match(/^\s*(["'])/) !== null) {
            return 'string';
        }

        // Check for array
        if (value.match(/^\s*(array\(|\[)/) !== null) {
            return 'array';
        }

        return '[type]';
    }

    /**
     * This is where we parse the code block into a Doc
     * object which represents our snippet
     *
     * @returns {Doc}
     */
    public abstract parse():Doc;
}
