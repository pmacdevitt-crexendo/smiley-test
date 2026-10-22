const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const webpack = require('webpack');
const path = require('path');

// The one name to maintain. The SDK derives the app id ('smiley-faces') from it.
const MODULE_NAME = process.env.MF_NAME || 'smileyFaces';

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    entry: './src/App.tsx',
    devtool: 'source-map', // required by bundle verification
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: isProduction ? 'auto' : 'http://localhost:5010/',
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[id].[contenthash].js' : '[id].js',
      crossOriginLoading: 'anonymous', // required for SRI
      clean: true,
    },
    optimization: {
      nodeEnv: 'production', // keeps bundled JSX runtime matched to the host's React
      splitChunks: { cacheGroups: { default: false } },
    },
    resolve: { extensions: ['.tsx', '.ts', '.js', '.jsx'] },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: MODULE_NAME,
        filename: 'remoteEntry.js',
        exposes: { './App': './src/App' },
        // Do NOT add @netsapiens/flow-sdk here — verification rejects it.
        shared: {
          react: { singleton: true, requiredVersion: '^19.2.0', eager: false },
          'react-dom': { singleton: true, requiredVersion: '^19.2.0', eager: false },
          loglevel: { singleton: true, requiredVersion: '^1.9.2', eager: false },
        },
      }),
      ...(isProduction
        ? [new SubresourceIntegrityPlugin({ hashFuncNames: ['sha384'] })]
        : []),
      new webpack.DefinePlugin({ __MF_NAME__: JSON.stringify(MODULE_NAME) }),
      new HtmlWebpackPlugin({ template: './index.html' }),
    ],
    devServer: {
      port: 5010,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Private-Network': 'true',
      },
      allowedHosts: ['localhost', '127.0.0.1'],
      client: false,
      webSocketServer: false,
    },
  };
};
