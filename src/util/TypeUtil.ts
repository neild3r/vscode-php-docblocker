import { workspace, TextEditor, Range, Position, TextDocument } from "vscode";
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
     * Get the full qualified class namespace for a type
     * we'll need to access the document
     *
     * @param {string} type
     * @param {string} head
     * @returns {string}
     */
    public getFullyQualifiedType(type:string, head:string):string
    {
        if (!Config.instance.get('qualifyClassNames')) {
            return type;
        }

        let useEx = new RegExp("use\\s+([^ ]*?)((?:\\s+as\\s+))?("+type+");", 'gm');
        let full = useEx.exec(head);

        if (full != null && full[3] == type) {
            if (full[1].charAt(0) != '\\') {
                full[1] = '\\' + full[1];
            }

            if (full[2] != null) {
                return full[1];
            }

            return full[1] + type;
        }

        return type;
    }

    /**
     * Returns the user configuration based name for the given type
     *
     * @param {string} name
     * @param {boolean} nullable
     * @param {string} head
     */
     public getFormattedTypeByName(name:string, nullable:boolean=false, head:string=undefined) {
        let result = [];
        let names = name.split("|");
        for (let index = 0; index < names.length; index++) {
            names[index] = names[index].trim();
            switch (names[index]) {
                case '':
                    continue;
                case 'real':
                case 'double':
                    names[index] = 'float';
                    break;
                case 'unset':
                    names[index] = 'null';
                    break;
                case 'bool':
                case 'boolean':
                    if (Config.instance.get('useShortNames')) {
                        names[index] = 'bool';
                    } else {
                        names[index] = 'boolean';
                    }
                    break;
                case 'int':
                case 'integer':
                    if (Config.instance.get('useShortNames')) {
                        names[index] = 'int';
                    } else {
                        names[index] = 'integer';
                    }
                    break;
                default:
                    if (head) {
                        names[index] = TypeUtil.instance.getFullyQualifiedType(names[index], head);
                    }
            }
            result.push(names[index]);
        }
        if (result.length === 0) {
            result.push(this.getUnknownType());
        } else if (nullable && result.indexOf('null') === -1) {
            result.push('null');
        }
        return result.join('|');
    }

    /**
     * Unknown type
     * 
     * @returns {stirng} `[type]` or `mixed`
     */
    public getUnknownType(): string {
        return Config.instance.get('unknownType');
    }
    
    /**
     * Default message
     * 
     * @param message 
     * @param type 
     * @returns 
     */
    public getDefaultMessage(message:string, type:string): string {
        switch (Config.instance.get('defaultMessage')) {
            case 'name':
                return message.replace(/^_+/g, '');
            case 'blank':
                return '';
            default:
                return "Undocumented " + type.toLowerCase();
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
        // Check for bool `false|true` `!exp`
        if (value.match(/^\s*(false|true)\s*$/i) !== null || value.match(/^\s*\!/i) !== null) {
            return TypeUtil.instance.getFormattedTypeByName('bool');
        }

        // Check for int `-1` `1` `1_000_000`
        if (value.match(/^\s*(\-?\d[\d_]*)\s*$/) !== null) {
            return TypeUtil.instance.getFormattedTypeByName('int');
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
            return TypeUtil.instance.getFormattedTypeByName(match[1]);
        }

        return TypeUtil.instance.getUnknownType();
    }
}
