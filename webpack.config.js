const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env) => ({ // env.production
	entry: {
		main: './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
		publicPath: '/',
	},
	mode: 'development',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		open: true,
		compress: true,
		port: 8080,
		historyApiFallback: {
			disableDotRule: true,
		}
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: {
					loader: 'html-loader',
					options: {
						minimize: true,
						sources: {
							urlFilter: (attribute, value, resourcePath) => {
								if (/\.(png|jpg|jpeg|gif|svg)$/.test(value)) {
									return true
								}
								return false
							},
						},
					},
				},
			},
			{
				test: /\.js$/,
				use: "babel-loader",
				exclude: "/node_modules/",
			},
			{
				test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
				type: "asset/resource",
				generator: {
					filename: 'assets/[hash][ext]'
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
						}
					},
					"postcss-loader",
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
	],
})