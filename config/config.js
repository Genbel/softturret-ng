// That file load the proper environment file
// Encapsulates environment managment code into a single unit of code
module.exports = require('./env/' + process.env.NODE_ENV + '.js');