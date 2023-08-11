require("dotenv").config();
const database = require("./src/database/index")
const app = require('./index');
const PORT = process.env.PORT

database();

app.listen(PORT, () => { console.log('listening on port ' + PORT); });