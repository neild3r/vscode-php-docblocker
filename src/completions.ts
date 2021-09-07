import {workspace, TextDocument, Position, CancellationToken, ProviderResult, CompletionItem, CompletionItemProvider, Range, SnippetString, CompletionItemKind, window} from "vscode";
import Documenter from "./documenter";
import Tags, { Tag } from "./tags";
import Config from "./util/config";

/**
 * Completions provider that can be registered to the language
 */
export default class Completions implements CompletionItemProvider
{
    /**
     * Tags object
     *
     * @type {Tags}
     */
    protected tags: Tags = new Tags();

    /**
     * Implemented function to find and return completions either from
     * the tag list or initiate a complex completion
     *
     * @param {TextDocument} document
     * @param {Position} position
     * @param {CancellationToken} token
     * @returns {ProviderResult<CompletionItem[]>}
     */
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):ProviderResult<CompletionItem[]>
    {
        let result = [];
        let match;

        if ((match = document.getWordRangeAtPosition(position, /\/\*\*/)) !== undefined) {
            let documenter:Documenter = new Documenter(match, window.activeTextEditor);

            let block = new CompletionItem("/**", CompletionItemKind.Snippet);
            block.detail = "PHP DocBlocker";
            block.documentation = "Generate a PHP DocBlock from the code snippet below.";
            let range = document.getWordRangeAtPosition(position, /\/\*\* \*\//);
            block.range = range;
            block.insertText = documenter.autoDocument();
            result.push(block);

            return result;
        }

        if ((match = document.getWordRangeAtPosition(position, /\@[a-z]*/)) === undefined) {
            return result;
        }

        let search = document.getText(match);

        let potential = this.getTags().filter((tag) => {
            return tag.tag.match(search) !== null;
        });

        potential.forEach(tag => {
            let item = new CompletionItem(tag.tag, CompletionItemKind.Snippet);
            item.range = match;
            item.insertText = new SnippetString(tag.snippet);

            result.push(item);
        });

        return result;
    }

    /**
     * Get the tag list for completions
     *
     * @returns {Array<{tag:string, snippet:string}>}
     */
    protected getTags(): Tag[]
    {
        let tags: Tag[] = this.tags.list;

        tags.forEach((tag, index) => {
            if (tag.tag == '@author') {
                tag.snippet = tag.snippet.replace("{{name}}", Config.instance.get('author').name);
                tag.snippet = tag.snippet.replace("{{email}}", Config.instance.get('author').email);
                tags[index] = tag;
            }
        });

        return tags;
    }
}
