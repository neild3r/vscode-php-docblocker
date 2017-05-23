import { workspace } from "vscode";

/**
 * Provides helper function to types
 */
export default class TypeUtil {
    /**
    * Wether to use long names or not
    *
    * @type {bool}
    */
    static useLongName: any;

    /**
     * Returns the user configuration based name for the given type
     *
     * @param {string} name
     */
    public static getFormattedTypeByName(name:string) {
        if(this.useLongName == null) {
            let config: any = workspace.getConfiguration().get('php-docblocker');

            this.useLongName = config.useLongNames || true;
        }

        switch(name) {
            case 'bool':
            case 'boolean':
                if (this.useLongName) {
                    return 'boolean';
                }
                return 'bool';
            case 'int':
            case 'integer':
                if (this.useLongName) {
                    return 'integer';
                }
                return 'int';
            default:
                return name;
        }
    }

}