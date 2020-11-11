const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DIST_DIR = 'dist';
const isDevMode = process.env.NODE_ENV !== 'production';

const rules = [
  {
    test: /\.js$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/transform-runtime", "syntax-dynamic-import", ['angularjs-annotate', { explicitOnly: false }],
            'lodash'
          ],
        }
      }
    ],
    include: [
      path.join(__dirname, 'src')
    ],
    exclude: /node_modules/
  },
  {
    test: /\.scss$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDevMode,
          import: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: isDevMode
        }
      },
    ]
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDevMode,
        }
      }
    ]
  },
  {
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|cur)$/i,
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: 'assets/img/[name].[contenthash].[ext]'
    },
  },
  {
    test: /\.jade$/,
    loaders: [
      'apply-loader',
      'pug-loader'
    ]
  }
];

const plugins = [
  new webpack.ProgressPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src/index.html'),
    filename: './index.html',
    minify: false,
    inject: 'body',
    hash: false
  }),
  new webpack.ProvidePlugin({
    moment: 'moment-timezone',
    _: 'lodash'
  }),
  new CopyWebpackPlugin([
    { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, `${DIST_DIR}/assets`) },
  ])
];

if (isDevMode) {
  plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
}

if (!isDevMode) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  );
}

module.exports = {
  mode: process.env.NODE_ENV,
  cache: true,
  context: __dirname,
  performance: {
    hints: false
  },
  devtool: isDevMode ? 'eval-cheap-module-source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, DIST_DIR),
    compress: true,
    inline: true,
    hot: true,
    quiet: false,
    port: 9999,
    historyApiFallback: true,
    disableHostCheck: true,
    stats: {
      chunks: false,
      chunkModules: false
    }
  },
  entry: {
    app: ['./src/app/index.module.js'],
  },
  output: {
    filename: '[name].bundle-[hash]-[id].js',
    chunkFilename: '[name].chunk-[hash]-[id].js',
    sourceMapFilename: '[name].bundle-[hash]-[id].map',
    path: path.join(__dirname, DIST_DIR)
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        ie8: false,
        mangle: true,
        toplevel: false,
        compress: {
          booleans: true,
          conditionals: true,
          dead_code: true,
          drop_debugger: true,
          drop_console: true,
          evaluate: true,
          sequences: true,
          unused: true
        },
        output: {
          comments: false,
          beautify: false,
        }
      }
    })]
  },
  module: {
    rules
  },
  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty'
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules', __dirname]
  },
  plugins
};
