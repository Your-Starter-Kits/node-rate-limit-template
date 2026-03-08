// Entry point for the application - initializes and starts the Express server
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Start server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
});
