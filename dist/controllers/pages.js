import path from 'path';
import mime from 'mime-types';
import express from 'express';
import { validateTokenAPI } from '../middlewares/cookies.js';
const __dirname = process.cwd();
export const pages = express.Router();
pages.use(express.static(path.join(__dirname, "public"), {
    etag: false, // disable etag revalidation
    lastModified: false,
    setHeaders: (res, filePath) => {
        const type = mime.lookup(filePath) || "application/octet-stream";
        res.setHeader("Content-Type", type);
        if (filePath.endsWith(".html")) {
            // Completely disable caching for HTML
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
        }
        else {
            // Cache other assets for a day or a week if versioned
            res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
        }
    },
}));
//express 5 code
/* pages.use(express.static(path.join(__dirname, 'public'), {
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
})); */
pages.get('/private', validateTokenAPI, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
pages.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
pages.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
