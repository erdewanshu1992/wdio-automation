import BaseConfig from './base.config.js';

export default new BaseConfig({
  local: {
    name: 'Web Browser',
    capabilities: {
      browserName: process.env.BROWSER || 'chrome',
    },
  },
});
