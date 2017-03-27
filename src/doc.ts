import {workspace, SnippetString, WorkspaceConfiguration} from 'vscode';

export class Doc {
    public params:Array<Param> = [];
    public return:string;
    public var:string;
    public message:string;
    protected config:{};

    constructor(message:string = '') {
        this.message = message;
    }

    fromObject(input:any) {
        if (input.return !== undefined) {
            this.return = input.return;
        }
        if (input.var !== undefined) {
            this.var = input.var;
        }
        if (input.message !== undefined) {
            this.message = input.message;
        }
        if (input.params !== undefined && Array.isArray(input.params)) {
            input.params.forEach(param => {
                this.params.push(new Param(param.type, param.name));
            });
        }
    }

    getConfig():any {
        if (this.config == null) {
            this.config = workspace.getConfiguration().get('php-docblocker');
        }
        return this.config;
    }

    setConfig(config:any) {
        this.config = config;
    }

    build(isEmpty:boolean = false):SnippetString {
        let snippet = new SnippetString();
        let extra = this.getConfig().extra;
        let gap = !this.getConfig().gap;

        if (isEmpty) {
            gap = true;
            extra = [];
        }

        let stop = 2;

        snippet.appendText("/**");
        snippet.appendText("\n * ");
        snippet.appendVariable('1', this.message);

        if (this.params && this.params.length) {
            if (!gap) {
                snippet.appendText("\n *");
                gap = true;
            }
            this.params.forEach(param => {
                snippet.appendText("\n * @param ");
                snippet.appendVariable(stop++ + '', param.type);
                snippet.appendText(" ");
                snippet.appendVariable(stop++ + '', param.name);
            });
        }

        if (this.var) {
            if (!gap) {
                snippet.appendText("\n *");
                gap = true;
            }
            snippet.appendText("\n * @var ");
            snippet.appendVariable(stop++ + '', this.var);
        }

        if (this.return) {
            if (!gap) {
                snippet.appendText("\n *");
                gap = true;
            }
            snippet.appendText("\n * @return ");
            snippet.appendVariable(stop++ + '', this.return);
        }

        if (Array.isArray(extra) && extra.length > 0) {
            if (!gap) {
                snippet.appendText("\n *");
                gap = true;
            }
            for (var index = 0; index < extra.length; index++) {
                var element = extra[index];
                snippet.appendText("\n * " + element);
            }
        }

        snippet.appendText("\n */");

        return snippet;
    }
}

export class Param {
    public type;
    public name;

    constructor(type:string, name:string) {
        this.type = type;
        this.name = name;
    }
}
