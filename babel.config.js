const presets = [
	[
		'@babel/preset-env',
		{
			targets: "> 0.5%, last 2 versions, not dead",
			useBuiltIns: 'usage',
			corejs: 3
		}
	]
]
module.exports = { presets }