import { workspace, TextEditor, Range, Position, TextDocument, WorkspaceConfiguration } from "vscode";
import * as fs from 'fs';

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
     * List of defaults
     *
     * @type {Object}
     */
    private data:{}

    /**
     * Returns the instance for this util
     *
     * @returns {Config}
     */
    public static get instance(): Config {
        if (this._instance == null) {
            this._instance = new this();
            this._instance.load();
        }
        return this._instance;
    }

    /**
     * Load in the defaults or the config
     */
    public load(force:boolean = false)
    {
        let current:WorkspaceConfiguration = workspace.getConfiguration();
        let config = current.get('php-docblocker');

        if (config == null || force) {
            config = {};
            let packageJson = JSON.parse(fs.readFileSync(__dirname + '/../../../package.json').toString());
            let props = packageJson.contributes.configuration.properties;
            for (var key in props) {
                var item = props[key];
                config[key.replace('php-docblocker.', '')] = item.default;
            }
        }

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
        return this.data[setting];
    }
}
