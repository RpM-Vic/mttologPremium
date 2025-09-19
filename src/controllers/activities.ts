import { Router, type Response } from "express";
import { createActivities, deleteAllActivitiesFromOneUser, getAllActivities, getAllActivitiesFromOneUser } from "../DB/nodePG/activities.js";
import { AuthRequest, eAccessGranted, generateAndSerializeToken, validateTokenAPI } from "../middlewares/cookies.js";
// import { validateToken } from "../middlewares/cookies.js";

export const activities=Router()

activities.get('/',validateTokenAPI,async(req:AuthRequest,res:Response)=>{
  // const user_id="12345"  //TESTING
  const payload=req.user
  if(!payload){
    res.status(401).json({
        message:"Something went wrong"
      })
    return 
  }


  try {
    const activities=await getAllActivitiesFromOneUser(payload.user_id)

    res.json({
      message:"Activities listed",
      activities
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"Something went wrong"
    })
    
  }

})

activities.post('/',validateTokenAPI,async(req:AuthRequest,res:Response)=>{
  const payload=req.user
  if(!payload){
    res.status(401).json({
        message:"Something went wrong"
      })
    return 
  }

  const {newActivities}=req.body
  try{
    await deleteAllActivitiesFromOneUser(payload.user_id)
    await createActivities(payload.user_id,newActivities)

    res.status(201).json({
      message:"Activities have been created"
    })
    return
  }
  catch(e){
    console.log("error creating activities: ",e)
    res.status(500).json({})
  }

})
