const express = require("express")
const { ServerConfig } = require('./config')
const app  = express();


app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
})

