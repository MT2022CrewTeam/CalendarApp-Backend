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
const usersController = new UsersController(userRepository);



app.get('/', async (req: Request, res: Response) => {
    const updateUserDto: UpdateUserDto = {
        email: 'esteesunnuevo@email.com'
    }
    const users = await userRepository
     .updateUser("63d086982f98d66c6d5d0aa0", updateUserDto);
    res.send(users);

});

app.post('/users', async (req: Request, res: Response) =>{
     usersController.createUser(req, res);
}) 

app.listen(appPort, () => {
    console.log(`Express with Typescript! http://localhost:${appPort}`); 
});

