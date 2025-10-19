// main.ts
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { auth } from "./controllers/auth.js";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from "express";
import { Request} from "express"
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express4';
import {readFile} from 'node:fs/promises';
import { pages } from "./controllers/pages.js";

import { activities } from "./controllers/activities.js";
import { limiter, strictLimiter } from "./middlewares/rateLimit.js";
import { resolvers } from "./graphql/resolvers.js";
import { testConnection } from "./DB/nodePG/dbConnection.js";
import path from "node:path";

const __dirname=process.cwd();
const app = express();

// Run testConnection at cold start
testConnection().catch(err => {
  console.error("DB connection failed:", err);
});

const schemaPath = path.join(__dirname, 'src','./graphql/schema.graphql')
const typeDefs = await readFile(schemaPath, 'utf8') 
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV === 'production' 
    ? [ApolloServerPluginLandingPageDisabled()]
    : [], // Sandbox auto-enabled in dev
  csrfPrevention: true,
});

await apolloServer.start()

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
//app.use(cors())

app.use("/api/activities",limiter, activities);
app.use("/api/login",strictLimiter,auth)
app.use('/api/graphql',[limiter],apolloMiddleware(apolloServer,
  {
    context: async ({ req, res }) => ({
      req, res,
    }),
  }
))

app.use("/",limiter, pages);

export default app; // ✅ don't call app.listen()


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`Apollo server running on http://localhost:${PORT}/api/graphql`);
  });
}