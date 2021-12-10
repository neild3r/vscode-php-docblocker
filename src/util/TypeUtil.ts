import { TextEditor, Range, Position, TextDocument } from "vscode";
import Config from "./config";

/**
 * Provides helper function to types
 */
export default class TypeUtil {
    /**
    * Holds the current instance
    *
    * @type {TypeUtil}
    */
    private static _instance: TypeUtil;

    /**
     * Returns the instance for this util
     *
     * @returns {TypeUtil}
     */
    public static get instance(): TypeUtil {
        return this._instance || (this._instance = new this());
    }

    /**
     * Resolve a type string that may contain union types
     * 
     * @param {string} types 
     * @param {string} head 
     * @returns {string}
     */
    public getResolvedTypeHints(types:string, head:string = null): string
    {
        let union:string[] = types.split("|");
        
        for (let index = 0; index < union.length; index++) {
            union[index] = this.getFullyQualifiedType(union[index], head);
            union[index] = this.getFormattedTypeByName(union[index]);
        }

        return union.join("|");
    }

    /**
     * Get the full qualified class namespace for a type
     * we'll need to access the document
     *
     * @param {string} type
     * @param {string} head
     * @returns {string}
     */
    public getFullyQualifiedType(type:string, head:string):string
    {
        if (!head) {
            return type;
        }
        if (!Config.instance.get('qualifyClassNames')) {
            return type;
        }

        let useEx = /[\s;]?use\s+(?:(const|function)\s*)?([\s\S]*?)\s*;/gmi;
        let exec: RegExpExecArray;
        while (exec = useEx.exec(head)) {
            let is_const_or_func = exec[1];
            let value = exec[2];

            if (is_const_or_func) {
                continue;
            }

            let classes: string[];
            let prefix: string;
            let with_bracket = value.indexOf('{') !== -1;
            if (with_bracket) {
                let bracket_begin = value.indexOf('{');
                let bracket_end = value.indexOf('}');
                prefix = value.substring(0, bracket_begin).trim();
                classes = value.substring(bracket_begin + 1, bracket_end === -1 ? undefined : bracket_end).split(',');
            } else {
                prefix = '';
                classes = value.split(',');
            }

            for (let index = 0; index < classes.length; index++) {
                value = classes[index].trim();
                if (!value) {
                    continue;
                }
                value = prefix + value;
                let [clazz, alias] = value.split(/\s+as\s+/gmi, 2);
                if (!clazz) {
                    continue;
                }
                if (alias === undefined && clazz.endsWith('\\' + type)) {
                    // aa\bb
                } else if (alias === type) {
                    // aa\bb as cc
                } else {
                    continue;
                }
                if (clazz.charAt(0) != '\\') {
                    clazz = '\\' + clazz;
                }
                return clazz;
            }
        }

        return type;
    }

    /**
     * Returns the user configuration based name for the given type
     *
     * @param {string} name
     */
    public getFormattedTypeByName(name:string) {
        switch (name) {
            case 'bool':
            case 'boolean':
                if (!Config.instance.get('useShortNames')) {
                    return 'boolean';
                }
                return 'bool';
            case 'int':
            case 'integer':
                if (!Config.instance.get('useShortNames')) {
                    return 'integer';
                }
                return 'int';
            default:
                return name;
        }
    }


    /**
     * Take the value and parse and try to infer its type
     *
     * @param {string} value
     * @returns {string}
     */
    public getTypeFromValue(value:string):string
    {
        let result:Array<string>;

        // Check for bool
        if (value.match(/^\s*(false|true)\s*$/i) !== null || value.match(/^\s*\!/i) !== null) {
            return this.getFormattedTypeByName('bool');
        }

        // Check for int
        if (value.match(/^\s*([\d-]+)\s*$/) !== null) {
            return this.getFormattedTypeByName('int');
        }

        // Check for float
        if (value.match(/^\s*([\d.-]+)\s*$/) !== null) {
            return 'float';
        }

        // Check for string
        if (value.match(/^\s*(["'])/) !== null || value.match(/^\s*<<</) !== null) {
            return 'string';
        }

        // Check for array
        if (value.match(/^\s*(array\(|\[)/) !== null) {
            return 'array';
        }

        return '[type]';
    }
}
