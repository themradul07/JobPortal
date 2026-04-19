import {Request , Response, NextFunction, RequestHandler} from 'express'

export const TryCatch =(controller:(req:Request, res:Response, next:NextFunction)=>Promise<any>): RequestHandler=> async (req, res, next)=>{
    try{    
        await controller(req, res, next);

    }catch(e: any){
        console.log(e);
        res.status(500).json({
            message: e.message
        })
    }
}