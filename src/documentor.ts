import * as vscode from "vscode";

export class Documentor
{
    getConfig() {
        return vscode.workspace.getConfiguration('php-docblocker');
    }

    document(message: string, props, editor: vscode.TextEditor) {
        let snippet = new vscode.SnippetString();

        var stop = 1;

        snippet.appendText("\n * ");
        snippet.appendVariable('0', message);
        snippet.appendText("\n * ");

        if (props.params) {
            props.params.forEach(param => {
                snippet.appendText("\n * @param ");
                snippet.appendVariable(stop++ + '', param.type);
                snippet.appendText(" ");
                snippet.appendVariable(stop++ + '', param.name);
            });
        }

        if (props.var) {
            snippet.appendText("\n * @var ");
            snippet.appendVariable(stop++ + '', props.var);
        }

        if (props.return) {
            snippet.appendText("\n * @return ");
            snippet.appendVariable(stop++ + '', props.return);
        }

        let extra = this.getConfig().get('extra');

        if (Array.isArray(extra)) {
            for (var index = 0; index < extra.length; index++) {
                var element = extra[index];
                snippet.appendText("\n * " + element);
            }
        }

        snippet.appendText("\n */");
        editor.insertSnippet(snippet);
    }
}