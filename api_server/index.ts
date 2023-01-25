import express, { Application, Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { configService } from './config/config';
import { MongooseConnection  } from './database';
import { UserRepository } from './repositories/users.repository';
import { Role } from './models/users/user.Schema';
import { taskStatus } from './models/tasks/task.Schema'
import { ICategory, ITask } from './models/tasks/task.interface';
const {databaseUrl, databaseName, appPort} = configService.getMongodbConnectionConfig();
const connectionOptions = {
    dbName: databaseName
}

const app: Application = express();
const router: Router = express.Router();
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
const mongoConnection: MongooseConnection = 
  new MongooseConnection(databaseUrl, connectionOptions);
const userRepository = new UserRepository(mongoConnection); //testing 




app.get('/', async (req: Request, res: Response) => {
    const task: ITask = {
        title: 'MyTAsk',
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        status: taskStatus.in_progress,
        progress: 0,
        categories: [],
        reminders: []
    }
    const users = await userRepository
     .createTask("63d086982f98d66c6d5d0aa0", task);
    res.send(users);
});

app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`); 
});

