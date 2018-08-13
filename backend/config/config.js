var env = process.env.NODE_ENV;

if (env === 'development' || env === 'test' || env === 'prod') {

    var cfg = require('./config.json');

    var envCfg = cfg[env];

    Object.keys(envCfg).forEach((key) => {
        process.env[key] = envCfg[key];
    });
}