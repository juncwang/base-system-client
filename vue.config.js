module.exports = {
    publicPath: '/',   // 根路径
    outputDir: 'dist',  // 构建输出目录
    assetsDir: 'assets',    // 静态资源目录(js,css,img,fonts)
    lintOnSave: false,  // 是否开启 eslint 保存检测, 有效值: true || false || 'error'
  
    devServer: {
      open: true,
      host: 'localhost',
      port: 8080,
      https: false,
      proxy: {
        // 配置跨域
        '/api': {
          target: 'http://192.168.78.113:5000',
          changeOrigin: true,
          ws: true,
          changOrigin: true,
          pathRewrite: {
            '^/api': '/api'
          }
        }
      }
    }
  };