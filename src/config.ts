export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  PROXY_SERVER: process.env.PROXY_SERVER,
  PROXY_USERNAME: process.env.PROXY_USERNAME,
  PROXY_PASSWORD: process.env.PROXY_PASSWORD
});
