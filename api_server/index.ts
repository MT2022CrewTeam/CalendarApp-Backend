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
import swaggerUi  from 'swagger-ui-express'
import xssClean from 'xss-clean';
import hpp from 'hpp';
const {databaseUrl, databaseName, appPort} = configService.getMongodbConnectionConfig();
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const connectionOptions = {
    dbName: databaseName
}

const app: Application = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,    // 10 minutes
  max: 100
})

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());
app.use(limiter);

const mongoConnection: MongooseConnection = 
  new MongooseConnection(databaseUrl, connectionOptions);


const userRepository = new UserRepository(mongoConnection); 
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

const jsondoc = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve ,swaggerUi.setup(jsondoc));
app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`); 
});

