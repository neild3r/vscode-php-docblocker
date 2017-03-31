import {TextDocument, Position, CancellationToken, ProviderResult, CompletionItem, CompletionItemProvider, Range, SnippetString, CompletionItemKind, window} from "vscode";
import Documenter from "./documenter";

/**
 * Completions provider that can be registered to the language
 */
export default class Completions implements CompletionItemProvider
{
    /**
     * List of tags and snippets that are filled in docblocks
     *
     * @type {Array}
     */
    protected tags = [
        {
            tag: '@return',
            snippet: '@return ${1:mixed}'
        },
        {
            tag: '@var',
            snippet: '@var ${1:mixed}'
        },
        {
            tag: '@param',
            snippet: '@param ${1:mixed} \$${2:name}'
        },
        {
            tag: '@author',
            snippet: '@author ${1:Name} <${2:email@email.com}>'
        },
        {
            tag: '@group',
            snippet: '@group ${1:group}'
        },
        {
            tag: '@throws',
            snippet: '@throws ${1:Exception}'
        },
        {
            tag: '@package',
            snippet: '@package ${1:category}'
        },
        {
            tag: '@link',
            snippet: '@link ${1:http://url.com}'
        }
    ];

    /**
     * Implemented function to find and return completions either from
     * the tag list or initiate a complex completion
     *
     * @param {TextDocument} document
     * @param {Position} position
     * @param {CancellationToken} token
     * @returns {ProviderResult<CompletionItem[]>}
     */
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):ProviderResult<CompletionItem[]> {
        let result = [];
        let match;

        if ((match = document.getWordRangeAtPosition(position, /\/\*\*/)) !== undefined) {
            let documenter:Documenter = new Documenter(match, window.activeTextEditor);

            let block = new CompletionItem("/**", CompletionItemKind.Snippet);
            block.range = match;
            block.insertText = documenter.autoDocument();
            result.push(block);

            return result;
        }

        if ((match = document.getWordRangeAtPosition(position, /\@[a-z]*/)) === undefined) {
            return result;
        }

        let search = document.getText(match);

        let potential = this.tags.filter((tag) => {
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
}
