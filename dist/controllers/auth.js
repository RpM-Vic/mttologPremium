"use strict";
// import { Router } from "express"
// import { createNewUser, getUser } from "../DB/bunSQL/user"
// import { verifySync } from "@node-rs/bcrypt"
// export const auth=Router()
// auth.post('/login',async (req,res)=>{
//   const {email,password}=req.body
//   if(!email||!password){
//     return res.status(400).json({
//       msg:"Some fields are missing"
//     })
//   }
//   const user=await getUser(email)
//   if(!user){
//     return res.status(404).json({
//       msg:"User not found"
//     })
//   }
//   if(!verifySync(user.password,password)){
//     res.status(401).json({
//       msg:"Access denied, try again"
//     })
//   }
//   res.json({
//     msg:"Access granted",
//     userNAme:user.name,
//     subscription_end:user.subscription_ends
//   })
// })
// auth.post('/signup',async(req,res)=>{
//   const {name,email,password}=req.body
//   if(!email||!password||!name){
//     return res.status(400).json({
//       msg:"Some fields are missing"
//     })
//   }
//   const user=await getUser(email)
//   if(user){
//     res.status(409).json({
//       msg:"User already exists"
//     })
//     return
//   }
//   try{
//     const newUser=await createNewUser(name,email,password)
//     res.status(201).json({
//     msg:`user ${newUser?.name} created succesfully ✅`
//   })
//   }
//   catch(e){
//     console.log(e)
//     res.status(409).json({
//       msg:"An error ocurred, we are working on it"
//     })
//   }
// })
// auth.get('/logout',(req,res)=>{
// })
