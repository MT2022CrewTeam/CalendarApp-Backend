import express, { Application, Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { configService } from './config/config';
import { MongooseConnection  } from './database';
import { UserRepository } from './repositories/users.repository';
import { Role } from './models/users/user.Schema';
import { taskStatus } from './models/tasks/task.Schema'
import { ICategory, IReminder, ITask } from './models/tasks/task.interface';
import { UpdateUserDto } from './models/users/updateUserDto.class';
import { UsersController } from './controllers/user/users.controller';
import { UserRoute } from './routes/users.route';
import { TaskRoute } from './routes/tasks.route';
import { TasksController } from './controllers/tasks/tasks.controller';
const {databaseUrl, databaseName, appPort} = configService.getMongodbConnectionConfig();
const connectionOptions = {
    dbName: databaseName
}

const app: Application = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
const mongoConnection: MongooseConnection = 
  new MongooseConnection(databaseUrl, connectionOptions);
const userRepository = new UserRepository(mongoConnection); //testing 
const usersController = new UsersController(userRepository);
const tasksController = new TasksController(userRepository);
const users = new UserRoute(usersController);
const tasks = new TaskRoute(tasksController);
app.use('/users', users.router);
app.use('/users', tasks.router);

app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`); 
});

