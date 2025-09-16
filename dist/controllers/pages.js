import path from 'path';
import mime from 'mime-types';
import express from 'express';
import { validateTokenAPI } from '../middlewares/cookies.js';
const __dirname = process.cwd();
export const pages = express.Router();
pages.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        res.setHeader('Content-Type', mime.lookup(path) || 'application/octet-stream');
    },
}));
pages.get('/premium', validateTokenAPI, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
pages.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
pages.get("/*foo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
