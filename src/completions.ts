import * as vscode from "vscode";

export class Completions implements vscode.CompletionItemProvider
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
            tag: '@link',
            snippet: '@link ${1:http://url.com}'
        }
    ];

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):vscode.ProviderResult<vscode.CompletionItem[]> {
        let line = document.lineAt(position.line).text;
        let part = line.substring(0, position.character);
        let match = part.match(/.*?(@[a-z])$/);

        if (match == null) {
            return null;
        }

        let prefix = match[1];

        let potential = this.tags.filter(function(tag) {
            return tag.tag.match(prefix) !== null;
        });

        let range:vscode.Range = document.getWordRangeAtPosition(position, /@[a-z]/);

        let result = [];
        potential.forEach(tag => {
            let item = new vscode.CompletionItem(tag.tag, vscode.CompletionItemKind.Snippet);
            item.range = range;
            item.insertText = new vscode.SnippetString(tag.snippet);

            result.push(item);
        });

        return result;
    }
}