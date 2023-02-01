import { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../../repositories/authRepository";
import { IPayload } from "../../repositories/authRepository.interface";
import jsonwebtoken from "jsonwebtoken";


export class Authentication {
    constructor (private readonly authRepository :AuthRepository) {}

    public async ensureAuntheticated (req: Request, response: Response, next: NextFunction) {

        try {
            if(!req.headers.authorization){
                throw new Error ('Not auth header was found in request');
            }
            
            const token: string = req.headers.authorization.split(" ")[1];
            const payload: IPayload = await this.authRepository.validateToken(token);
            if (req.params.id !== payload.sub) {
                return response.status(404).send({message: "Id passed not correspond with bearer token"});
            }
            next();
        } catch(err: any) {
            return response.status(401).send({message: err.toString()});
        }
        
    }
}
