import { workspace } from "vscode";

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
     * Holds wether we use short names or not
     *
     * @type {bool|null}
     */
    private _useShortNames: any;

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
        if(this._useShortNames == null) {
            let config: any = workspace.getConfiguration().get('php-docblocker');
            this._useShortNames = config.useShortNames || false;
        }

        return this._useShortNames;
    }

    /**
     * Returns the user configuration based name for the given type
     *
     * @param {string} name
     */
    public getFormattedTypeByName(name:string) {
        switch(name) {
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