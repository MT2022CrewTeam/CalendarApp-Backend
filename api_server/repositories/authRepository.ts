import moment from "moment";
import { MongooseConnection } from "../database";
import { Role, userSchema } from "../models/users/user.Schema";
import { IAuthRepository, IPayload } from "./authRepository.interface";
import jsonwebtoken from "jsonwebtoken";
import { configService } from "../config/config";
import { CreateUserDto } from "../models/users/createUserDto.class";
import { IUser } from "../models/users/user.interface";


export class AuthRepository implements IAuthRepository {
    private readonly usersModel;
    
    constructor(private readonly connection: MongooseConnection) {
        this.usersModel = this.connection.mongoose.model(
            "user",
            userSchema,
            "Users"
          );
    };

    public createToken(id: string, fullname: string): string {
        const payload: IPayload = {
            sub: id,
            given_name: fullname,
            iat: moment().unix(),
            exp: moment().add(2, 'hours').unix()
        }
        return jsonwebtoken.sign(payload, configService.getJWTConfig().jwtSecret);
    }


    async singin(username: string, password: string): Promise<string> {
        const user: IUser = this.usersModel.findOne({
            username: username,
            password: password
        })
        .then(user => {
            return user;
        })

        if (!user) {
            throw new Error ('Password or username is not valid')
        }
        return this.createToken(user._id, user.fullname );
    }

    async singup(createUserDto: CreateUserDto): Promise<string> {
        let newUser: IUser = {
            fullname: createUserDto.fullname,
            username: createUserDto.username, /* Object.assign(newUser, createUserDto); */
            email: createUserDto.email,
            password: createUserDto.password,
            hasEmailConfirmed: false,
            role: Role.user,
            tasks: [],
            createdCategories: []
            }
            const user = new this.usersModel(newUser).then(user => {return user});
            return this.createToken(user._id, user.fullname );
    }

    async validateCredentials(username: string, email: string): Promise<boolean> {
        const areCredentialsRegistered = this.usersModel.findOne({
            username: username,
            email: email
        })
        .then(user => {
            if(user) return true;
            return false;
        })

        return areCredentialsRegistered;
        
    }

    async validateToken(token: string): Promise<IPayload> {

        const payload = jsonwebtoken.verify(token, 
            configService.getJWTConfig().jwtSecret);

        const {sub} = payload;
        const user = this.usersModel.findOne({_id: sub})
        .then( user => {
            if(!user) {
                throw new Error('User not found');
            }; 

            return user;
        })
        return payload;
    }



}