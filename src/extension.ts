import * as vscode from 'vscode';
import { spawn, execFile, exec, ChildProcess } from 'child_process';
import * as path from 'path';
import Documenter from "./documenter";
import Completions from "./completions";

/**
 * Run a set up when the function is activated
 *
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext)
{
    ['php', 'hack'].forEach(lang => {
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

        vscode.languages.registerCompletionItemProvider(lang, new Completions(), '*', '@');
    });
}

/**
 * Shutdown method for the extension
 */
export function deactivate()
{
}
