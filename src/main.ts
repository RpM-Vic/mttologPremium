// main.ts
import express from "express";
import { testConnection } from "./DB/nodePG/dbConnection.js";
import { pages } from "./controllers/pages.js";
import { activities } from "./controllers/activities.js";
import 'dotenv/config'

const PORT=process.env.PORT??80

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());

app.use("/api/activities", activities);
app.use("/",pages)

async function startServer() {
  app.listen(PORT, async () => {
    await testConnection();
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  }); 
}

startServer()

export default startServer

