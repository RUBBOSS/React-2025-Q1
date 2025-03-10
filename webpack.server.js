import path from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'node',
  entry: './server.ts',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['null-loader'],
      },
    ],
  },
};
