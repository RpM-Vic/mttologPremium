import  Jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';
import { getUserByEmail } from '../DB/nodePG/users.js';
// import { Logger } from '../helpers/Logger';

if (!process.env.SECRET) {
  throw new Error('SECRET environment variable is required');
}
const SECRET=process.env.SECRET;
const isDevelopment=process.env.NODE_ENV||"";

export enum eAccessGranted {
  Granted = "is granted",
  NotAllowed = "not allowed"
}

export interface IPayload {
  ValidFrontEnd:string,
  email:string,
  user_id:string,
  renewCookieAfter:string
  name:string,
  roles:string
  accessGranded:eAccessGranted
  iat:number
}

export const generateAndSerializeToken = (email:string,accessGranded:eAccessGranted,_id:string,name:string,roles:string):string=>{

  const now = new Date();
  const renewCookieAfter = new Date(now);//copy to prevent mutation
  renewCookieAfter.setHours(now.getHours() + 2);  // Fixed: Properly adds 2 hours
  // renewCookieAfter.setHours(now.getMinutes() + 2);  // 2 minutes for testing

  const payload:IPayload = {
    ValidFrontEnd:"ValidFrontEnd",
    email,
    accessGranded, 
    user_id:_id.toString(),
    renewCookieAfter:renewCookieAfter.toISOString(),
    iat: Math.floor(now.getTime() / 1000),  //standard unix 
    name,
    roles
  };
  const token = Jwt.sign(payload,SECRET,{
    expiresIn:"72h",
    
  })   

  const serialized= serialize("MyTokenName",token,{
    path:"/",
    maxAge: 60*60*24*3, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: isDevelopment=='development'?false:true,  //https only?
    httpOnly: true   
  })

  return serialized;
}

export interface AuthRequest extends Request{
  user?:{
    ValidFrontEnd:string,
    user_id:string
    email:string,
    name:string,
    roles:string
  }
}

export const validateTokenAPI = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const denyAccess = () => {
    if(req.method=='GET'){
      res.redirect('/auth')
      return
    }
    else{
      res.status(403).json({   
        ok: false,
        message: "forbidden"
      });
    }
    return 
  };

  const token = req.cookies.MyTokenName;
  if (!token) {
    // Logger.error('token not found')
    console.log("token not found")
    return denyAccess();  // Added return
  }
  console.log("token found")
  try {
    const payload = Jwt.verify(token, SECRET) as IPayload;
    
    if (!payload || payload?.ValidFrontEnd !== 'ValidFrontEnd') {
      // Logger.error('Payload not found')
      console.log('Payload not found')
      return denyAccess();  // Added return
    }

    //this logic is to check the cookie only
    if(payload.accessGranded!==eAccessGranted.Granted){
      console.log("access not granted")
      return denyAccess()
    }

    //This logic is to check the database (only after 2 hours)
    const today=new Date()
    if(new Date(payload.renewCookieAfter)<today){ //expired
      // const user=await User.findOne({email:payload.email})
      const user=await getUserByEmail(payload.email)

      if(user==null||user==undefined){
        // Logger.error('User not found')
        console.log('User not found')
        denyAccess()
        return
      }
      console.log("expiration =",user.expiration_date)

      if(user.expiration_date==undefined){
        // Logger.error('Payment required from user',user.email)
        console.log('Payment required from user',user.email)
        denyAccess()
        return
      }

      if(user.expiration_date<today){ //subscription finished
        // Logger.error('Payment required from user',user.email)
        console.log("subscription finished")
        res.status(402).json({
          ok:false,
          message:"Payment required"
        })
        return
      }

      if(user?.expiration_date>today){ //subscription not finished
        // Logger.info('Cookie updated')
        console.log("subscriptoin not finished")

        const newToken=generateAndSerializeToken(user.email,eAccessGranted.Granted,user.user_id,user.name,user.roles)
        res.setHeader('Set-Cookie', newToken)

        req.user=payload
      }
    }

    req.user=payload
    console.log("catching the end")
    next();  // Only call next if validation succeeds
  } catch (error) {
    return denyAccess();  // Added return
  }
}












export const emptyCookie: () => Promise<string>=async()=>{
  const serialized=serialize("MyTokenName","",{
    path:"/",
    maxAge: 0, //this are secconds, don't trust anyone telling the opposite
    sameSite:'strict', //prevents cross site reques forgery
    secure: isDevelopment=='development'?false:true,  //https only?
    httpOnly: true   
  })

  return serialized;
}
