import express, { Application, Router, Request, Response, NextFunction } from 'express';
import { configService } from './api_server/config/config';
import { MongooseConnection  } from './api_server/database'


const {databaseUrl, databaseName, appPort} = configService.getMongodbConnectionConfig();
const connectionOptions = {
    dbName: databaseName
}

const app: Application = express();
const router: Router = express.Router();
const mongoConnection: MongooseConnection = new MongooseConnection(
    databaseUrl, connectionOptions)


app.use(express.urlencoded({extended: true}));
app.use(express.json); 



app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello world');
})

app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`);
    
})

