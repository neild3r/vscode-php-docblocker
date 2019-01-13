import * as vscode from 'vscode';
import Completions from "./completions";
import Documenter from './documenter';

/**
 * Run a set up when the function is activated
 *
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext)
{
    ['php', 'hack'].forEach(lang => {
        if (lang == 'hack') {
            vscode.languages.setLanguageConfiguration(lang, {
                wordPattern: /(-?\d*\.\d\w*)|([^\-\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
                onEnterRules: [
                    {
                        // e.g. /** | */
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        afterText: /^\s*\*\/$/,
                        action: { indentAction: vscode.IndentAction.IndentOutdent, appendText: ' * ' }
                    }, {
                        // e.g. /** ...|
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        action: { indentAction: vscode.IndentAction.None, appendText: ' * ' }
                    }, {
                        // e.g.  * ...|
                        beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                        action: { indentAction: vscode.IndentAction.None, appendText: '* ' }
                    }, {
                        // e.g.  */|
                        beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                        action: { indentAction: vscode.IndentAction.None, removeText: 1 }
                    }
                ]
            });
        }

        vscode.languages.registerCompletionItemProvider(lang, new Completions(), '*', '@');
    });

    vscode.commands.registerTextEditorCommand('php-docblocker.trigger', (textEditor:vscode.TextEditor) => {
        textEditor.selection = new vscode.Selection(textEditor.selection.start, textEditor.selection.start);
        let range = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
        let documenter = new Documenter(range, textEditor);
        let snippet = documenter.autoDocument();
        textEditor.insertSnippet(snippet);
    });
}

/**
 * Shutdown method for the extension
 */
export function deactivate()
{
}
