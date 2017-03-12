'use strict';
import * as vscode from 'vscode';
import { spawn, execFile, exec, ChildProcess } from 'child_process';
import * as path from 'path';
import { Documentor } from "./documentor";
import { Completions } from "./completions";

let documentor: Documentor;

export function activate(context: vscode.ExtensionContext) {
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

    vscode.languages.registerCompletionItemProvider('php', new Completions());

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document.languageId !== "php") {
            return;
        }

        let editor = vscode.window.activeTextEditor;
        if (editor.document !== e.document) {
            return;
        }

        if (e.contentChanges.length > 1) {
            return;
        }

        if (!documentor) {
            documentor = new Documentor();
        }

        const change = e.contentChanges[0];

        let line = e.document.lineAt(change.range.start.line).text;
        let nextLine = e.document.lineAt(change.range.end.line+1).text;

        if (line.search(/^\s*\/\*\*\s+$/) === -1 || nextLine.search(/^\s*\*/) !== -1) {
            return;
        }

        let func = nextLine.match(/^\s*(abstract|final|static)?\s*(protected|private|public)\s+(static)?\s*function\s+([A-Za-z0-9_]+)\s*\((.*?)\)\s*(\{)?\s*$/);
        if (func !== null) {
            let args = func[5].split(',');

            let props = {
                params: [],
                return: null
            }

            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                let parts = arg.match(/^\s*([A-Za-z0-9_]+)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)$/);
                props.params.push({
                    type: parts[1] ? parts[1] : '[type]',
                    name: parts[2]
                });
            }

            props.return = 'void';

            documentor.document('Undocumented function', props, editor);
            return;
        }

        let va = nextLine.match(/^\s*(abstract|final|static)?\s*(protected|private|public)\s+(static)?\s*(\$[A-Za-z0-9_]+)\s*\=?\s*(.*)$/);
        if (va !== null) {
            let props = {
                var: '[type]'
            }

            documentor.document('Undocumented variable', props, editor);
            return;
        }

        let cla = nextLine.match(/^\s*(abstract|final)?\s*(class|trait|inerface)\s+([A-Za-z0-9_]+)\s*/);
        if (cla !== null) {
            documentor.document('Undocumented '+ cla[2], {}, editor);

            return;
        }
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}