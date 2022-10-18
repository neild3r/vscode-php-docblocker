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
        let union:string[] = types.split(/([|&])/);
        for (let index = 0; index < union.length; index += 2) {
            if (union[index] === '') {
                delete union[index];
                delete union[index+1];
                continue;
            }
            union[index] = this.getFullyQualifiedType(union[index], head);
            union[index] = this.getFormattedTypeByName(union[index]);
        }

        return union.join('');
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
            let isConstOrFunc = exec[1];
            let use = exec[2];

            if (isConstOrFunc) {
                continue;
            }

            let clazz = this.getClassesFromUse(use)[type];
            if (clazz === undefined) {
                continue;
            }

            if (clazz.charAt(0) != '\\') {
                clazz = '\\' + clazz;
            }
            return clazz;
        }

        return type;
    }

    /**
     * Returns the classes from the use
     * 
     * @param use 
     * @returns 
     */
    public getClassesFromUse(use: string): { [index: string]: string } {
        let namespace: string;
        let classes: string[];
        let hasBracket = use.indexOf('{') !== -1;
        if (hasBracket) {
            let bracketBegin = use.indexOf('{');
            let bracketEnd = (use + '}').indexOf('}');
            namespace = use.substring(0, bracketBegin).trim();
            classes = use.substring(bracketBegin + 1, bracketEnd).split(',');
        } else {
            namespace = '';
            classes = use.split(',');
        }

        var results: { [index: string]: string } = {};
        for (let index = 0; index < classes.length; index++) {
            let alias: string;
            let clazz = classes[index].trim();
            if (clazz === '') {
                continue;
            }

            clazz = namespace + clazz;

            [clazz, alias] = clazz.split(/\s+as\s+/gmi, 2);

            if (alias === undefined || alias === '') {
                alias = clazz.substring(clazz.lastIndexOf('\\') + 1);
            }

            results[alias] = clazz;
        }
        return results;
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
            case 'real':
            case 'double':
                return 'float';
            case 'unset':
                return 'null';
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
        // Check for bool `false` `true` `!exp`
        if (value.match(/^\s*(false|true)\s*$/i) !== null || value.match(/^\s*\!/i) !== null) {
            return this.getFormattedTypeByName('bool');
        }

        // Check for int `-1` `1` `1_000_000`
        if (value.match(/^\s*(\-?\d[\d_]*)\s*$/) !== null) {
            return this.getFormattedTypeByName('int');
        }

        // Check for float
        if (value.match(/^\s*([\d.-]+)\s*$/) !== null) {
            return 'float';
        }

        // Check for float `.1` `1.1` `-1.1` `0.1_000_1`
        if (value.match(/^\s*(\-?[\d_\.]*)\s*$/) !== null) {
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
        
        // Check for class
        var match = value.match(/^\s*new\s+([a-z0-9_\\\|]+)/i);
        if (match) {
            if (match[1] === 'class') {
                return 'object';
            }
            return match[1];
        }

        // Check for closure
        var match = value.match(/^\s*function\s*\(/i) || value.match(/^\s*fn\s*\(/i);
        if (match) {
            return '\\Closure';
        }

        // Check for type casting
        var match = value.match(/^\s*\(\s*(int|integer|bool|boolean|float|double|real|string|array|object|unset)\s*\)/i);
        if (match) {
            return this.getFormattedTypeByName(match[1]);
        }

        return this.getDefaultType();
    }

    /**
     * Get the default type
     *
     * @returns {string}
     */
    public getDefaultType(): string
    {
        return Config.instance.get('defaultType');
    }
}
