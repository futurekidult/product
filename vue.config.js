const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://npd.test.heymenology.cn/api',
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
    conditionalCompile(config, 'vue');
    conditionalCompile(config, 'css');
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
    config.plugin('html').tap((args) => {
      args[0].title = '新品开发系统';
      return args;
    });
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: false
          })
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: false
          })
        ]
      })
    ]
  }
};

const format = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};

const conditionalCompile = (config, str) => {
  let rule = config.module.rule(str);
  rule
    .use('js-conditional-compile-loader')
    .loader('js-conditional-compile-loader')
    .tap(() => {
      return {
        heyme: process.env.npm_config_heyme,
        basepoint: process.env.npm_config_basepoint,
        heytool: process.env.npm_config_heytool
      };
    })
    .end();
};
