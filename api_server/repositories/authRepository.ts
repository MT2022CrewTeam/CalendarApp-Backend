import moment from "moment";
import { MongooseConnection } from "../database";
import { Role, userSchema } from "../models/users/user.Schema";
import { IAuthRepository, IPayload } from "./authRepository.interface";
import jsonwebtoken from "jsonwebtoken";
import { configService } from "../config/config";
import { CreateUserDto } from "../models/users/createUserDto.class";
import { IUser } from "../models/users/user.interface";
import { compare, genSalt, hash } from 'bcrypt';
import { RedisClientType } from "redis";


export class AuthRepository implements IAuthRepository {
    private readonly usersModel;
    
    constructor(private readonly connection: MongooseConnection,
                private readonly redisClient: RedisClientType) {
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
            exp: moment().add(30, 'minutes').unix()
        }
        return jsonwebtoken.sign(payload, configService.getJWTConfig().jwtSecret);
    }

    async logout(id: string): Promise<any> {
        this.redisClient.del(id);
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

        await this.redisClient.set(String(user._id), '100');
        await this.redisClient.expire(String(user._id), 3600);

        return this.createToken(String(user._id), user.fullname );
    }

    async signup(createUserDto: CreateUserDto): Promise<string> {
        const salt = await genSalt(10);
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
            await user.save();
            return this.createToken(user._id, user.fullname );
    }

    async validateCredentials(username: string, email: string): Promise<boolean> {
        const user = await this.usersModel.findOne({ $or: [
            {username: username},
            {email: email}
        ]
        });
        
        if(user) {
            return true;
        }

        return false;
        
    }

    async validateToken(token: string): Promise<IPayload> {

        const payload = jsonwebtoken.verify(token, 
            configService.getJWTConfig().jwtSecret);
        
        const {sub} = payload;
        const user = await this.usersModel.findOne({_id: sub})
        if(!user) {
            throw new Error('Id passed is not associated with given token');
        }; 
        
        return payload;
    }

    async ensureUserIsLogged (id: string): Promise<any> {
        const isLogged = await this.redisClient.get(id);    
        console.log(isLogged);
        if (!isLogged) {
            throw new Error('User must log in first to use this resource');
        }
    }    



}