const {
   override,
   disableChunk,
} = require('customize-cra')


const disableHash = () => (config) => {
   // JS Overrides
   config.output.filename = 'static/js/[name].js'
   config.output.chunkFilename = 'static/js/[name].chunk.js'

   // find MiniCssExtractPlugin
   const cssPlugin = config.plugins.find(
      p => p.constructor.name === 'MiniCssExtractPlugin'
   )
   if (cssPlugin) {
      cssPlugin.options.filename = 'static/css/[name].css'
      cssPlugin.options.chunkFilename = 'static/css/[name].chunk.css'
   }

   // Media and Assets Overrides
   config.module.rules[2].oneOf = config.module.rules[2].oneOf.map((one) => {
      if (one.options && one.options.name) {
         one.options.name = 'static/media/[name].[ext]'
      }
      return one
   })

   return config
}

module.exports = override(
   disableHash(),
   disableChunk(),
)