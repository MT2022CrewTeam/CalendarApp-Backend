import moment from "moment";
import { MongooseConnection } from "../database";
import { Role, userSchema } from "../models/users/user.Schema";
import { IAuthRepository, IPayload } from "./authRepository.interface";
import jsonwebtoken from "jsonwebtoken";
import { configService } from "../config/config";
import { CreateUserDto } from "../models/users/createUserDto.class";
import { IUser } from "../models/users/user.interface";
import { compare, genSalt, hash } from 'bcrypt';


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


    async signin(username: string, password: string): Promise<string> {
        const user: IUser = await this.usersModel.findOne({
            username: username,
        });

        if (!user) {
            throw new Error ('Password or username not valid');
        }        
        
        const hasPasswordMatch = await compare(password, user.password);
        if (!hasPasswordMatch) {
            throw new Error ('Password or username not valid');
        }

        return this.createToken(String(user._id), user.fullname );
    }

    async signup(createUserDto: CreateUserDto): Promise<string> {
        const salt = await genSalt(15);
        let newUser: IUser = {
            fullname: createUserDto.fullname,
            username: createUserDto.username, /* Object.assign(newUser, createUserDto); */
            email: createUserDto.email,
            password: await hash(createUserDto.password, salt),
            hasEmailConfirmed: false,
            role: Role.user,
            tasks: [],
            createdCategories: []
            }
            
            const user = new this.usersModel(newUser);
            user.save();
            return this.createToken(user._id, user.fullname );
    }

    async validateCredentials(username: string, email: string): Promise<boolean> {
        const user = await this.usersModel.findOne({ $or: [
            {username: username},
            {email: email}
        ]
        });

        if(!user) {
            return false;
        }

        return true;
        
    }

    async validateToken(token: string): Promise<IPayload> {

        const payload = jsonwebtoken.verify(token, 
            configService.getJWTConfig().jwtSecret);
        
        const {sub} = payload;
        const user = await this.usersModel.findOne({_id: sub})
        if(!user) {
            throw new Error('User not found');
        }; 
        
        return payload;
        // const payload: IPayload = {
        //     sub: '1',
        //     given_name: 'test',
        // }
        // return payload;
    }



}