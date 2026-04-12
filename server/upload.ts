import { Router, Request, Response } from "express";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const uploadRouter = Router();

uploadRouter.post("/api/upload", async (req: Request, res: Response) => {
  try {
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("multipart/form-data")) {
      // Parse multipart form data manually using raw body
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const body = Buffer.concat(chunks);

      // Extract boundary from content-type
      const boundaryMatch = contentType.match(/boundary=(.+)/);
      if (!boundaryMatch) {
        res.status(400).json({ error: "No boundary found" });
        return;
      }

      const boundary = boundaryMatch[1];
      const parts = body.toString("binary").split(`--${boundary}`);

      for (const part of parts) {
        if (part.includes("filename=")) {
          const filenameMatch = part.match(/filename="([^"]+)"/);
          const mimeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
          const filename = filenameMatch?.[1] || "image.jpg";
          const mime = mimeMatch?.[1]?.trim() || "image/jpeg";

          // Find the start of file data (after double CRLF)
          const headerEnd = part.indexOf("\r\n\r\n");
          if (headerEnd === -1) continue;

          const fileDataStr = part.substring(headerEnd + 4);
          // Remove trailing \r\n--
          const cleanData = fileDataStr.replace(/\r\n$/, "");
          const fileBuffer = Buffer.from(cleanData, "binary");

          const ext = filename.split(".").pop() || "jpg";
          const key = `products/${nanoid(12)}.${ext}`;

          const { url } = await storagePut(key, fileBuffer, mime);
          res.json({ url, key });
          return;
        }
      }

      res.status(400).json({ error: "No file found in request" });
      return;
    }

    res.status(400).json({ error: "Unsupported content type" });
  } catch (error: any) {
    console.error("[Upload] Error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export { uploadRouter };
