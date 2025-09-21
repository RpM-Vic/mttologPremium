import { Router } from "express"
import { verifySync } from "@node-rs/bcrypt"
import { createUser, getUserByEmail } from "../DB/nodePG/users.js"
import z from "zod"
import { IUser } from "../interfaces"
import { eAccessGranted, emptyCookie, generateAndSerializeToken } from "../middlewares/cookies.js"
import { strictLimiter } from "../middlewares/rateLimit.js"

export const auth = Router()

// Define Zod schema for login input
const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

auth.post('/', strictLimiter,async (req, res) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: validationResult.error
      })
    }

    const { email, password } = validationResult.data

    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (!verifySync(password, user.password)) {
      return res.status(401).json({
        message: "Access denied, try again"
      })
    }

    const token=generateAndSerializeToken(email,eAccessGranted.Granted,user?.user_id,user.name,user.roles)

    res.setHeader('Set-Cookie', token).status(201).json({
      ok: true,
      message: "Welcome",
      user:{ name: user.name, email: user.email}
    });

  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      message: "Internal server error"
    })
  }
})

auth.post('/signup',strictLimiter,async(req,res)=>{
  const {name,email,password}=req.body
  if(!email||!password||!name){
    res.status(400).json({
      message:"Some fields are missing"
    })
    return 
  }

  //validate password
  if (password.length < 8) {
    res.status(400).json({
      message:"Password is too short"
    })
    return 
  }
  if (!/\d/.test(password)) {
    res.status(400).json({
      message:"Pass needs a number"
    })
    return 
  }
  if (!/[A-Z]/.test(password)) {
    res.status(400).json({
      message:"Pass needs an uppercase"
    })
    return 
  }
  if (!/[a-z]/.test(password)) {
    res.status(400).json({
      message:"Pass needs a lowercase"
    })
    return 
  }

  //the user is valid
  const prospect:IUser={name,email,password}
  try{
    const user=await getUserByEmail(email)
    if(user){
      res.status(409).json({
        message:"User already exists"
      })
      return
    }
    const newUser=await createUser(prospect)
    if(!newUser){
      res.status(500).json({
        message:`We couldn't create the user`
      })
      return
    }

    const token=generateAndSerializeToken(email,eAccessGranted.Granted,newUser?.user_id,newUser.name,newUser.roles)

    res.setHeader('Set-Cookie', token).status(201).json({
      ok: true,
      message: "User created",
      user:{ name: newUser.name, email: newUser.email}
    });
  }
  catch(e){
    console.log(e)
    res.status(409).json({
      message:"An error ocurred, we are working on it"
    })
  }
})

auth.get('/logout',async (req, res) => {
  const serialized = await emptyCookie();
  // Set the cleared cookie in the response header
  res.setHeader('Set-Cookie', serialized).json({
    message:"You are logged out now",
    ok:true
  })
});
