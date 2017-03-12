import * as vscode from "vscode";

export class Documentor
{
    getConfig() {
        return vscode.workspace.getConfiguration('php-docblocker');
    }

    document(message: string, props, editor: vscode.TextEditor) {
        let snippet = new vscode.SnippetString();

        let stop = 2;
        let gap = !this.getConfig().get('gap');

        snippet.appendText("\n * ");
        snippet.appendVariable('1', message);

        if (props.params) {
            if (!gap) {
                snippet.appendText("\n * ");
                gap = true;
            }
            props.params.forEach(param => {
                snippet.appendText("\n * @param ");
                snippet.appendVariable(stop++ + '', param.type);
                snippet.appendText(" ");
                snippet.appendVariable(stop++ + '', param.name);
            });
        }

        if (props.var) {
            if (!gap) {
                snippet.appendText("\n * ");
                gap = true;
            }
            snippet.appendText("\n * @var ");
            snippet.appendVariable(stop++ + '', props.var);
        }

        if (props.return) {
            if (!gap) {
                snippet.appendText("\n * ");
                gap = true;
            }
            snippet.appendText("\n * @return ");
            snippet.appendVariable(stop++ + '', props.return);
        }

        let extra = this.getConfig().get('extra');

        if (Array.isArray(extra) && extra.length > 0) {
            if (!gap) {
                snippet.appendText("\n * ");
                gap = true;
            }
            for (var index = 0; index < extra.length; index++) {
                var element = extra[index];
                snippet.appendText("\n * " + element);
            }
        }

        snippet.appendText("\n */");
        editor.insertSnippet(snippet);
    }
}