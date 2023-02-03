import { Request, Response } from "express";


export abstract class Controller {
    public  fail(res: Response<any, Record<string, any>>, error: string | Error) {
        console.log(error);
        res.type('application/json')
        return res.status(400).json({message: error.toString()});
        // The server has encountered a situation it does not know how to handle.
    }

    public jsonResponse(res: Response<any, Record<string, any>>, code: number, message: string) {
        res.type('application/json')
        return res.status(code).json({ message: message });
    }

    public jsonReturn(res: Response<any, Record<string, any>>, code: number, value: any) {
        res.type('application/json')
        return res.status(code).json({value}.value);
    }

    public validateEmptyBody(req: Request, res: Response): void {
        if (Object.keys(req.body).length === 0) {
            // return this.jsonResponse(res, 404, "Not body passed in request" )
            throw new Error("Not body passed in request");
        }
        
    }

    public validateIfUserIdPassed(req: Request, res: Response): void {
        if(!req.body.idUser && !req.params.id && !req.query.id) {
            // return this.jsonResponse(res, 404, "Not user id passed in body's request" )
            throw new Error("Not user id passed in request");
        }    
    }

    // public validatePassedParam(req: Request, res: Response): void {
    //     const body = JSON.parse(req.body);
    //     const query = JSON.parse(req.query);
    //     if((!req.params.id)) {
    //         return this.jsonResponse(res, 404, "Not user id passed")
    //     }    
    //     return res;    
    // }

    protected removeNullBodyFields(body: Object): Object {
        const keys = Object.keys(body);
        for (let i = 0; i < keys.length; i++) {
          if (body[keys[i]] === undefined) {
            delete body[keys[i]];
          }
        }
        return body;
      }
}