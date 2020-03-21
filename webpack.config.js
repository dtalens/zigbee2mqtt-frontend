const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
	RelativeCiAgentWebpackPlugin
} = require('@relative-ci/agent');

const path = require('path');

module.exports = (env, args) => {
	let production = false;

	if (args && args.mode === 'production') {
		production = true;
		// console.log('== Production mode');
	} else {
		console.log('== Development mode');
	}

	const plugins = [
		new RelativeCiAgentWebpackPlugin(),
		new ForkTsCheckerWebpackPlugin({
			silent: true
		}),
		new CopyWebpackPlugin([{
			from: '**/*',
			context: './api-mocks/'
		}, ]),
		new HtmlWebpackPlugin({
			template: 'src/index.ejs'
		}),
		new HtmlWebpackPlugin({
			template: 'src/static/map.html',
			filename: 'map.html'
		}),
		new HtmlWebpackPlugin({
			template: 'src/static/zigbee.html',
			filename: 'zigbee.html'
		}),
		new HtmlWebpackPlugin({
			template: 'src/static/join.html',
			filename: 'join.html'
		}),
		new HtmlWebpackPlugin({
			template: 'src/static/zigbee/config.html',
			filename: 'zigbee/config.html'
		}),
		new HtmlWebpackPlugin({
			template: 'src/static/0x91C9.html',
			filename: '0x91C9.html'
		})
	];
	if (production) {
		plugins.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			logLevel: 'silent'
		}));
	}


	return {
		entry: {
			'scripts/main': './src/index.ts',
		},
		output: {
			filename: '[name].[contenthash:4].js',
			path: path.resolve('./dist'),
		},
		target: 'web',
		devtool: production ? false : 'source-map',
		optimization: {
			usedExports: true,
			moduleIds: 'hashed',
			// runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /node_modules/,
						name: 'scripts/vendor',
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		resolve: {
			mainFields: ['module', 'main'],
			extensions: ['.ts', '.tsx', '.js', '.html', '.txt']
		},
		module: {
			rules: [{
					test: /\.tsx?$/,
					use: [{
						loader: 'ts-loader'
					}],
				},
				{
					test: /\.css$/i,
					use: [
						"style-loader",
						"@teamsupercell/typings-for-css-modules-loader",
						{
							loader: "css-loader",
							options: {
								modules: true
							}
						}
					]
				}
			],
		},
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: './dist',
			compress: true,
			host: '0.0.0.0',
			port: 3030
		},
		plugins,

		stats: {
			assets: true,
			chunks: true,
			entrypoints: true,
			modules: true,
		}

	};
};