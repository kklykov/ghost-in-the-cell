const { defaults } = require('jest-config')
module.exports = {
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
	moduleFileExtensions: ['js'],
	moduleDirectories: ['node_modules', 'src'],
}
