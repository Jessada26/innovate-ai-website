/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles/sass")],
  },
  env: {
    API_URL: process.env.API_URL,
    API_PARTTY_EXCHANGE_RATE: process.env.API_PARTTY_EXCHANGE_RATE,
    URL_ICON_COIN_CMC: process.env.URL_ICON_COIN_CMC,
  },
};

module.exports = nextConfig;
