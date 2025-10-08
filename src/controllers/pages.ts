import path from 'path';
import mime from 'mime-types';
import express, { type Request, type Response } from 'express';
import { validateTokenAPI } from '../middlewares/cookies.js';

const __dirname=process.cwd();

export const pages=express.Router();

pages.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // No cache for HTML files
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    res.setHeader(
      'Content-Type',
      mime.lookup(path) || 'application/octet-stream'
    );
  },
}));

pages.get('/premium',validateTokenAPI,(req:Request,res:Response)=>{
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

pages.get("/",(req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

pages.get("/*foo",(req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
