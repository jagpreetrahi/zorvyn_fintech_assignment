import express from "express"
const { ServerConfig } = require('./config')
const app  = express();
import apiRoutes from "./routes"

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes)


app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
})

