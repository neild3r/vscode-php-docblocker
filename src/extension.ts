'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawn, execFile, exec, ChildProcess } from 'child_process';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "php-docblock" is now active!');
    vscode.languages.setLanguageConfiguration('php', {
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

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
        const change = e.contentChanges[0];
        let line = e.document.lineAt(change.range.start.line).text;
        let nextLine = e.document.lineAt(change.range.end.line+1).text;

        if (line.search(/^\s*\/\*\*\s+$/) !== -1 && nextLine.search(/^\s*\*/) === -1) {
            let editor = vscode.window.activeTextEditor;
            let snippet = new vscode.SnippetString();

            let func = nextLine.match(/^\s*(abstract|final|static)?\s*(protected|private|public)\s+(static)?\s*function\s+([A-Za-z0-9_]+)\s*\((.*?)\)\s*(\{)?\s*$/);
            if (func !== null) {
                let args = func[5].split(',');

                var stop = 1;

                snippet.appendText("\n * ");
                snippet.appendVariable('0', 'Undocumented function');
                snippet.appendText("\n * ");

                for (let index = 0; index < args.length; index++) {
                    let arg = args[index];
                    let parts = arg.match(/^\s*([A-Za-z0-9_]+)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)$/);
                    snippet.appendText('\n * @param  ');
                    snippet.appendVariable(stop++ + '', parts[1] ? parts[1] : '[type]');
                    snippet.appendText(' ');
                    snippet.appendVariable(stop++ + '', parts[2]);
                }

                snippet.appendText('\n * @return ');
                snippet.appendVariable(stop++ + '', 'void');

                snippet.appendText("\n * @author Neil Brayfield <neil@d3r.com>");
                snippet.appendText("\n */");
                editor.insertSnippet(snippet);

                return;
            }

            let va = nextLine.match(/^\s*(abstract|final|static)?\s*(protected|private|public)\s+(static)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)$/);
            if (va !== null) {
                snippet.appendText("\n * ");
                snippet.appendVariable('0', 'Undocumented variable');
                snippet.appendText("\n * ");
                snippet.appendText('\n * @var ');
                snippet.appendVariable('1', '[type]');
                snippet.appendText("\n * @author Neil Brayfield <neil@d3r.com>");
                snippet.appendText("\n */");
                editor.insertSnippet(snippet);

                return;
            }

            let cla = nextLine.match(/^\s*(abstract|final)?\s*(class|trait|inerface)\s+([A-Za-z0-9_]+)\s*/);
            if (cla !== null) {
                snippet.appendText("\n * ");
                snippet.appendVariable('0', 'Undocumented ' + cla[2]);
                snippet.appendText("\n * ");
                snippet.appendText("\n * @author Neil Brayfield <neil@d3r.com>");
                snippet.appendText("\n */");
                editor.insertSnippet(snippet);

                return;
            }
        }
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}