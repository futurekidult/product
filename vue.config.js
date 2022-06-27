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
  }
};

const format = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};
