import { Router, type Request, type Response } from "express";
import { createActivities, deleteAllActivitiesFromOneUser, getAllActivities, getAllActivitiesFromOneUser } from "../DB/nodePG/activities.js";

export const activities=Router()


activities.get('/hello',async(req:Request,res:Response)=>{
  const activities=await getAllActivities()
  res.json({
    msg:'Hello World',
    activities
  })
})

activities.get('/',async(req:Request,res:Response)=>{
  // const user_id=req.cookies
  // if(!user_id){
    //     res.status(401).json({
      //       msg:"Something went wrong"
      //     })
      //   return 
    // }

  const user_id="12345"  //TESTING
  try {
    const activities=await getAllActivitiesFromOneUser(user_id)
    res.json({
      msg:"Activities listed",
      activities
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:"Something went wrong"
    })
    
  }

})

activities.post('/',async(req:Request,res:Response)=>{
  // const user_id=req.cookies
  const user_id="12345"
  const {newActivities}=req.body
  console.log({newActivities})
  try{
    await deleteAllActivitiesFromOneUser(user_id)
    await createActivities(user_id,newActivities)
    res.status(201).json({
      msg:"Activities have been created"
    })
  }
  catch(e){
    console.log("error creating activities: ",e)
    res.status(500).json({})
  }

})
