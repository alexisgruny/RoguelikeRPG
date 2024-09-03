const path = require('path');

module.exports = {
  entry: './src/main.ts',  // Point d'entrée de votre application
  output: {
    filename: 'bundle.js',  // Nom du fichier de sortie
    path: path.resolve(__dirname, 'dist'),  // Dossier de sortie
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Extensions à résoudre
  },
  module: {
    rules: [
      {
        test: /\.ts$/,  // Règle pour les fichiers .ts
        use: 'ts-loader',  // Utilisation du loader TypeScript
        exclude: /node_modules/,  // Exclusion du dossier node_modules
      },
    ],
  },
  devtool: 'source-map',  // Génération des fichiers source map pour le debugging
  mode: 'development',  // Mode de compilation
};