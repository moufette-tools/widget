const moufetteConfig = (window as any).moufetteConfig || {}

export default {
   api_host: moufetteConfig.api_host ?
      `${moufetteConfig.api_host}/graphql` : 'http://localhost:5000/graphql',
   token: moufetteConfig.token || null
}