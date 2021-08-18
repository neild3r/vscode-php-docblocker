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
     */
     public getFormattedTypeByName(name:string, nullable:boolean=false) {
        let result = [];
        let names = name.split("|");
        for (let index = 0; index < names.length; index++) {
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
            }
            result.push(names[index]);
        }
        if (result.length === 0) {
            result.push('mixed');
        }
        if (nullable && result.indexOf('null') === -1) {
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

}
