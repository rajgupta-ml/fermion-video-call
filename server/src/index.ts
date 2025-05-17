import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { config } from "./utils/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { SocketManager } from "./manager/SocketManager";
import { logger } from "./utils/logger";
import { MediaSoupManager } from "./manager/MediaSoupManager";
const PORT = config.port;



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/health", (request: Request, response: Response) => {
  response.send("Healthy");
});

httpServer.listen(PORT, () => {
  try {
    const mediaSoupManager = new MediaSoupManager();
    new SocketManager(io, mediaSoupManager);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    // TODO: Add retry logic here
    logger.error("Error starting server", error as Error );
  }
});
