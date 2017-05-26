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
            tag: '@api',
            snippet: '@api'
        },
        {
            tag: '@author',
            snippet: '@author ${1:Name} <${2:email@email.com}>'
        },
        {
            tag: '@category',
            snippet: '@category ${1:description}'
        },
        {
            tag: '@copyright',
            snippet: '@copyright ${1:' + (new Date()).getFullYear() + '} ${2:Name}'
        },
        {
            tag: '@deprecated',
            snippet: '@deprecated ${1:version}'
        },
        {
            tag: '@example',
            snippet: '@example ${1:location} ${2:description}'
        },
        {
            tag: '@filesource',
            snippet: '@filesource'
        },
        {
            tag: '@group',
            snippet: '@group ${1:group}'
        },
        {
            tag: '@ignore',
            snippet: '@ignore ${1:description}'
        },
        {
            tag: '@internal',
            snippet: '@internal ${1:description}'
        },
        {
            tag: '@license',
            snippet: '@license ${1:MIT}'
        },
        {
            tag: '@link',
            snippet: '@link ${1:http://url.com}'
        },
        {
            tag: '@method',
            snippet: '@method ${1:mixed} \$${2:methodName()}'
        },
        {
            tag: '@package',
            snippet: '@package ${1:category}'
        },
        {
            tag: '@param',
            snippet: '@param ${1:mixed} \$${2:name}'
        },
        {
            tag: '@property',
            snippet: '@property ${1:mixed} \$${2:name}'
        },
        {
            tag: '@property-read',
            snippet: '@property-read ${1:mixed} \$${2:name}'
        },
        {
            tag: '@property-write',
            snippet: '@property-write ${1:mixed} \$${2:name}'
        },
        {
            tag: '@return',
            snippet: '@return ${1:mixed}'
        },
        {
            tag: '@see',
            snippet: '@see ${1:http://url.com}'
        },
        {
            tag: '@since',
            snippet: '@since ${1:1.0.0}'
        },
        {
            tag: '@source',
            snippet: '@source ${1:location} ${2:description}'
        },
        {
            tag: '@subpackage',
            snippet: '@subpackage ${1:category}'
        },
        {
            tag: '@throws',
            snippet: '@throws ${1:Exception}'
        },
        {
            tag: '@todo',
            snippet: '@todo ${1:Something}'
        },
        {
            tag: '@uses',
            snippet: '@uses ${1:MyClass::function} ${2:Name}'
        },
        {
            tag: '@var',
            snippet: '@var ${1:mixed}'
        },
        {
            tag: '@version',
            snippet: '@version ${1:1.0.0}'
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
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):ProviderResult<CompletionItem[]>
    {
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
