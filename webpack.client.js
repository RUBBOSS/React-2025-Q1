import path from 'path';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'web',
  entry: './src/entry-client.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'client.js',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
