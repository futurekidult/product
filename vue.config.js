const path = require('path');

const resolve = (dir) => {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:
          'http://npd.test.heymenology.cn/api',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        cookieDomainRewrite: {
          '.test.heymenology.cn': 'localhost'
        }
      }
    }
  },
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      args[0]['process.env'].VERSION = (function () {
        const now = new Date();
        return (
          now.getFullYear() +
          format(now.getMonth() + 1) +
          format(now.getDate()) +
          format(now.getHours()) +
          format(now.getMinutes())
        );
      })();
      return args;
    });
    config.resolve.alias
    .set('@', resolve('src'))
    .set('assets', resolve('src/assets'));
  },
  publicPath: './',
  assetsDir: 'static'
};

const format = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};
