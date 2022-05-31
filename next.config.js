/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compress: false,
  serverRuntimeConfig: {
    backendAddress: `http://${process.env.BACKEND_HOST ?? 'localhost'}:${process.env.BACKEND_PORT ?? '8080'}`
  },
  swcMinify: true
};
