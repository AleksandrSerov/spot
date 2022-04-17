/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on) => {
	const webpackOptions = {
		resolve: {
			extensions: ['.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.ts?$/,
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
					},
				},
			],
		},
	};

	on('file:preprocessor', webpackPreprocessor({ webpackOptions }));
};
