import puppeteer from 'puppeteer';
import Process from '../../../../src/core/process';
import advance from '../advance';
import config from '../../config';

class CommonProcess extends Process {
    constructor(options = {}) {
        super(options);
        this._config = config;
    }

    get identity() {
        try {
            const {
                project,
                brand
            } = this._options;
            return this._config[project].brand[brand];
        } catch(e) {
            throw new Error(`${project} -> ${brand} need to add setting in 'config.js'`);
        }
    }

    async _launch() {
        this.browser = await this.program.launch({
            ignoreHTTPSErrors: true,
            args: [
                '--use-fake-ui-for-media-stream'
            ],
            ...this._options.settings,
        });
        this.page = await this.browser.newPage();
    }
    
    async _prepare() {
        await advance.call(this, this._options.project);
    }

    async run() {
        await this._launch();
        await this._prepare();
    }

    static stage({
        steps,
        program = puppeteer,
    } = {}) {
        return function (target) {
            Object.defineProperties(target.prototype, {
                program: {
                    ...target.defaultProperty,
                    value: program,
                }
            });
        }
    }
}

export {
    CommonProcess as default,
}
