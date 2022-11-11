import { workspace, TextEditor, Range, Position, TextDocument, WorkspaceConfiguration } from "vscode";

/**
 * Provides helper function to types
 */
export default class Config {

    /**
    * Holds the current instance
    *
    * @type {Config}
    */
    private static _instance: Config;

    /**
     * Data to use when we aren't in live mode
     *
     * @type {Object}
     */
    private data:{}

    /**
     * Are we in test mode or live
     *
     * @type {boolean}
     */
    private isLive:boolean = true;

    /**
     * Returns the instance for this util
     *
     * @returns {Config}
     */
    public static get instance(): Config {
        if (this._instance == null) {
            this._instance = new this();
        }
        return this._instance;
    }

    /**
     * Set whether this is live mode or not
     *
     * @param {boolean} bool
     */
    public set live(bool:boolean)
    {
        this.isLive = bool;
    }

    /**
     * Load in the defaults or the config
     */
    public setFallback(config)
    {
        this.data = config;
    }

    /**
     * Add overrides
     *
     * @param overrides
     */
    public override(overrides)
    {
        this.data = {...this.data, ...overrides};
    }

    /**
     * Get a settings from the config or the mocked config
     *
     * @param {string} setting
     */
    public get(setting:string)
    {
        if (this.isLive) {
            if (setting === "autoClosingBrackets") {
                return workspace.getConfiguration('editor').get(setting);
            } else if (setting.indexOf('env:') > 0) {
                const key = setting.replace('env:', '');
                if (process.env.hasOwnProperty(key)) {
                    return process.env[key];
                }
            }
            return workspace.getConfiguration('php-docblocker').get(setting);
        }

        return this.data[setting];
    }
}
