import { Response } from "express";


export abstract class Controller {
    public fail(res: Response<any, Record<string, any>>, error: string | Error) {
        console.log(error);
        res.type('application/json')
        return res.status(500).json({message: error.toString()});
        // The server has encountered a situation it does not know how to handle.
    }

    public jsonResponse(res: Response<any, Record<string, any>>, code: number, message: string) {
        res.type('application/json')
        return res.status(code).json({ message: message });
    }
}