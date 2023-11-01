const Dotenv = require('dotenv-webpack');

module.exports = {
  // Your existing webpack configuration goes here...

  plugins: [
    new Dotenv()
  ]
};
