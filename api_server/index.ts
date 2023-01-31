import express, { Application, Router, Request, Response, NextFunction } from 'express';
import { configService } from './config/config';
import { MongooseConnection  } from './database';
import { UserRepository } from './repositories/users.repository';
import { UsersController } from './controllers/user/users.controller';
import { UserRoute } from './routes/users.route';
import { TaskRoute } from './routes/tasks.route';
import { TasksController } from './controllers/tasks/tasks.controller';
import { Authentication } from './controllers/middleware/authentication.middleware';
import { AuthRepository } from './repositories/authRepository';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthRoute } from './routes/auth.route';
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
const authRepository = new AuthRepository(mongoConnection);
const authenticator = new Authentication(authRepository);
const usersController = new UsersController(userRepository);
const tasksController = new TasksController(userRepository);
const authController = new AuthController(authRepository);

const auth = new AuthRoute(authController);
const users = new UserRoute(usersController, authenticator);
const tasks = new TaskRoute(tasksController, authenticator);

app.use('/auth', auth.router);
app.use('/users', users.router);
app.use('/users', tasks.router);

app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`); 
});

