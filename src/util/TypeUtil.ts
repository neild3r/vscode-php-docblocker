import { workspace, TextEditor, Range, Position, TextDocument } from "vscode";

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
     * Holds whether we use short names or not
     *
     * @type {bool|null}
     */
    private _useShortNames: any;


    /**
     * Whether we should qualify class names or not
     *
     * @type {bool|null}
     */
    private _qualifyClassNames: any;

    /**
     * Returns the instance for this util
     *
     * @returns {TypeUtil}
     */
    public static get instance(): TypeUtil {
        return this._instance || (this._instance = new this());
    }

    /**
     * Overwrites the value
     *
     * @param {boolean} value
     */
    public set useShortNames(value:boolean) {
        this._useShortNames = value;
    }

    /**
     * Returns wether we use long names or not.
     */
    public get useShortNames() {
        if (this._useShortNames == null) {
            let config: any = workspace.getConfiguration().get('php-docblocker');
            this._useShortNames = config.useShortNames || false;
        }

        return this._useShortNames;
    }

    /**
     * Overwrites the value
     *
     * @param {boolean} value
     */
    public set qualifyClassNames(value:boolean) {
        this._qualifyClassNames = value;
    }

    /**
     * Should we qualify class names
     */
    public get qualifyClassNames() {
        if (this._qualifyClassNames == null) {
            let config: any = workspace.getConfiguration().get('php-docblocker');
            this._qualifyClassNames = config.qualifyClassNames || false;
        }

        return this._qualifyClassNames;
    }

    /**
     * Get the full qualified class namespace for a type
     * we'll need to access the document
     *
     * @param {string} type
     * @param {TextDocument} document
     * @returns {string}
     */
    public getFullyQualifiedType(type:string, document:TextDocument):string
    {
        if (!this.qualifyClassNames) {
            return type;
        }

        let text = document.getText();
        let regex = /\s*(abstract|final)?\s*(class|trait|interface)/gm;
        let match = regex.exec(text);
        let end = document.positionAt(match.index);
        let range = new Range(new Position(0, 0), end);
        let head = document.getText(range);

        let useEx = new RegExp("use\\s+([^ ]*?)((?:\\s+as\\s+))?("+type+");", 'gm');
        let full = useEx.exec(head);

        if (full != null && full[3] == type) {
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
     */
    public getFormattedTypeByName(name:string) {
        switch (name) {
            case 'bool':
            case 'boolean':
                if (!this.useShortNames) {
                    return 'boolean';
                }
                return 'bool';
            case 'int':
            case 'integer':
                if (!this.useShortNames) {
                    return 'integer';
                }
                return 'int';
            default:
                return name;
        }
    }

}
