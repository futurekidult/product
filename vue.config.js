module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:
          'https://94a8788c-11bb-45e8-98d6-38185e3cbd12.mock.pstmn.io/api',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
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
