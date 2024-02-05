import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: "src/extension/background.ts",
		output: {
		  sourcemap: true,
		  format: "iife",
		  file: "build/background.js",
		},
		plugins: [resolve(), commonjs(), typescript()],
		watch: {
		  clearScreen: false,
		},
	},
	{
		input: "src/extension/injection.ts",
		output: {
			sourcemap: true,
			format: "iife",
			file: "build/injection.js",
		},
		plugins: [resolve(), commonjs(), typescript()],
		watch: {
			clearScreen: false,
		},
	},
]