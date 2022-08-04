const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const router = require('./src/routes');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})