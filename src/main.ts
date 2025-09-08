// index.ts
import express from "express";
import { testConnection } from "./DB/nodePG/dbConnection";
import { pages } from "./controllers/pages";
import { activities } from "./controllers/activities";
import { getAllActivities } from "./DB/nodePG/activities";
const PORT=process.env.PORT||4000

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

