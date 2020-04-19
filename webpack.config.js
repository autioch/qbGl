const { join } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageJson = require('./package.json');

const { argv } = require('yargs').options({
  production: {
    alias: 'p',
    'default': false,
    type: 'boolean'
  },
  watch: {
    'default': false,
    type: 'boolean'
  },
  port: {
    'default': 9090, // eslint-disable-line no-magic-numbers
    type: 'number'
  }
});

const projectPath = __dirname;
const sourcePath = join(projectPath, 'src');
const buildPath = join(projectPath, 'docs');
const nameSuffix = argv.production ? `${new Date().getTime()}.min` : '';

if (argv.watch) {
  require('serve-local')(buildPath, argv.port);
}

module.exports = {
  mode: argv.production ? 'production' : 'development',
  entry: join(sourcePath, 'index.js'),
  devtool: argv.production ? undefined : 'eval',
  output: {
    path: buildPath,
    filename: `files/main${nameSuffix}.js`,
    publicPath: argv.production ? packageJson.name : '/',
    pathinfo: false
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator'
            ]
          }
        }
      },
      {
        test: /\.(fsh|vsh|html)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.(ttf|eot|woff)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(jpg|gif|png)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(txt)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]'
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')({
                cascade: false
              })]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      exclude: ['index.html', 'images/*', 'fonts/*']
    }),
    new MiniCssExtractPlugin({
      filename: `files/[name]${nameSuffix}.css`
    }),
    new (require('html-webpack-plugin'))({
      template: join(sourcePath, 'index.html'),
      filename: `index.html`,
      hash: !argv.production
    }),
    argv.watch ? new (require('webpack-livereload-plugin'))({
      appendScriptTag: true,
      ignore: /.(config|ico|js|json|html|template|woff)$/
    }) : undefined,
    argv.production ? new (require('uglifyjs-webpack-plugin'))({
      sourceMap: false
    }) : undefined
  ].filter(Boolean),
  stats: {
    assetsSort: 'size',
    children: false,
    entrypoints: false,
    hash: false,
    version: false
  }
};
