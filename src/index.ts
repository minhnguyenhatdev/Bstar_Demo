import * as dotenv from "dotenv"
dotenv.config();
import express from 'express';
import { AppDataSource } from './configs/typeormConfig';
import { routerConfig } from './configs/routerConfig';
import { options } from './configs/swaggerConfig';
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const app = express();
const PORT = process.env.PORT || 9999;

AppDataSource.initialize().then(async ()=>{
    console.log("DB Connected Successfully!");
});

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`) 
})
app.get('/', (_req, _res) => {_res.send("Hello Inventory Team")});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(options)));

routerConfig(app);

