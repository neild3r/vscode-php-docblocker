export class Doc {
    public params:Array<Param> = [];
    public return:string;
    public var:string;
    public message:string;

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
}

export class Param {
    public type;
    public name;

    constructor(type:string, name:string) {
        this.type = type;
        this.name = name;
    }
}