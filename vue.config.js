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
  }
};
