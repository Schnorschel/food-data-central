const config = {
  apiServer: 'https://localhost:5001',
  apiFoodEP: '/fdc/Food',
  apiFavoriteEP: '/api',
  apiAuthEP: '/auth',
}

if (process.env.NODE_ENV.toLowerCase() === 'production') {
  config.apiServer = 'https://food-data-central.herokuapp.com'
}
export default config
