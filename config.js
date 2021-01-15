const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(process.cwd());

let config = {};

module.exports = {
    get Config() {
        const sysConfig = `${rootPath}/config.yml`;
        const sysInfo = yaml.load(fs.readFileSync(sysConfig, 'utf8'));
        config = {
            model: sysInfo.model,
            rootPath
        };
        return config;
    }
}