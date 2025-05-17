import { Server } from "socket.io";
import { logger } from "../utils/logger";
import type { MediaSoupManager } from "./MediaSoupManager";
import type { DtlsParameters } from "mediasoup/types";




export class SocketManager {
    
    constructor(private io: Server, private mediaSoupManager: MediaSoupManager) {
    
        this.initialize();
    }

    private initialize() {
        // Socket initialization logic will go here
        this.io.on("connection", (socket) => {
            socket.on("join-room", async ({roomId} : {roomId: string}) => {

                if(roomId) {
                    // TODO: Handle error if user is already in the room
                    socket.join(roomId);
                    const router = await this.mediaSoupManager.createRoom(roomId, socket.id);
                    socket.emit("RouterRtpCapabilities", {roomId : roomId, rtpCapabilities : router.rtpCapabilities});
                    console.log(`User joined room ${roomId}`);
                }else{
                    socket.emit("error", "Room ID is required");
                    logger.error("Room ID is required", {Service: "SocketManager(join-room)", roomId: roomId});
                }
            });
            socket.on("leave-room", (roomId: string) => {
                socket.leave(roomId);
                console.log(`User left room ${roomId}`);
            });

            socket.on("createSendTransport", async (roomId: string) => {
                console.log("createSendTransport", roomId, socket.id);
                const transportParams = await this.mediaSoupManager.createTransportListener(roomId, socket.id);
                socket.emit("sendTransport", {roomId : roomId, transportParams : transportParams});
            });

            socket.on("connectSendTransport", async ({roomId, transportId, dtlsParameters}: {roomId: string, transportId: string, dtlsParameters: DtlsParameters}) => {
                console.log("connectSendTransport", roomId, transportId, dtlsParameters);
                await this.mediaSoupManager.connectTransport(roomId, socket.id, transportId, dtlsParameters);
                console.log(`Transport connected for room ${roomId} and socket ${socket.id}`);
                socket.emit("sendTransportConnected");
            });
        });
    }
}