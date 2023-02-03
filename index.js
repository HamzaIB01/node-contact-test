const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));

app.use("/contact-us", require("./controllers/contact-us"));


//const PORT = process.env.PORT || 4111;
const PORT = 25080
app.listen(PORT, console.log("Server started on port: " + PORT))
