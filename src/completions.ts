import {TextDocument, Position, CancellationToken, ProviderResult, CompletionItem, CompletionItemProvider, Range, SnippetString, CompletionItemKind, window} from "vscode";
import { Documenter } from "./documenter";

export class Completions implements CompletionItemProvider
{
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
            snippet: '@var ${1:mixed} \$${2:name}'
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

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):ProviderResult<CompletionItem[]> {
        let line = document.lineAt(position.line).text;
        let part = line.substring(0, position.character);
        let result = [];

        let db = part.match(/.*?(\/\*\*)$/);
        if (db !== null) {
            let pos = document.getWordRangeAtPosition(position, /\/\*\*/);
            let documenter:Documenter = new Documenter(pos, window.activeTextEditor);


            let block = new CompletionItem("/**", CompletionItemKind.Snippet);
            block.range = document.getWordRangeAtPosition(position, /\/\*\*/);
            block.insertText = documenter.autoDocument();

            result.push(block);
        }

        let match = part.match(/.*?(@[a-z])$/);

        if (match == null) {
            return result;
        }

        let prefix = match[1];

        let potential = this.tags.filter(function(tag) {
            return tag.tag.match(prefix) !== null;
        });

        let range:Range = document.getWordRangeAtPosition(position, /@[a-z]/);

        potential.forEach(tag => {
            let item = new CompletionItem(tag.tag, CompletionItemKind.Snippet);
            item.range = range;
            item.insertText = new SnippetString(tag.snippet);

            result.push(item);
        });

        return result;
    }
}