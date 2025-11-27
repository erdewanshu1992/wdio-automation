export default class BaseConfig {
    constructor(configs) {
        this.currentEnv = process.env.ENVIRONMENT || 'local';
        this.configs = configs;
    }

    get(path) {
        return path.split('.').reduce((obj, key) => {
            if (!obj[key]) throw new Error(`Missing config: ${path}`);
            return obj[key];
        }, this.configs[this.currentEnv]);
    }
}
