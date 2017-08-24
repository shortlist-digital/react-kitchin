const merge = require('webpack-merge')
const devConfig = require('./dev-config')

module.exports = (config, options, webpack) => {

  console.log(devConfig)

  const customConfig = {
    plugins: [
      // Set global variables to be used at compile time
      // https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        __CMS_ENDPOINT__: JSON.stringify(devConfig.cmsEndpoint),
        __KITCHIN_BRAND_ID__: devConfig.kitchinBrandId,
        __KITCHIN_ENDPOINT__: JSON.stringify(devConfig.kitchinEndpoint)
      })
    ]
  }

  return merge(config, customConfig)
}
