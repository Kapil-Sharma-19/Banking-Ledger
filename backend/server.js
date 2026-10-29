require('dotenv').config();
const app = require('./src/app');
const connectToDatabase = require('./src/config/database.config');

connectToDatabase();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}
click to open: http://localhost:${port}`);
});