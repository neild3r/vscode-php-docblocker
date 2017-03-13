export class Doc {
    public params:Array<Param> = [];
    public return:string;
    public var:string;
    public message:string;

    constructor(message:string = '') {
        this.message = message;
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