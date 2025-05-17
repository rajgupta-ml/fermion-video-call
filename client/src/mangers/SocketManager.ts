import { config } from "@/config";
import { RtpCapabilities } from "mediasoup-client/types";
import { io, Socket } from "socket.io-client";
import { MediaSoupManager } from "./MediaSoupManager";
import { setupDTLSConnectionResponse, TransportParams } from "@/types/mediaSoupTypes";


//Singleton class to manage socket connection
// better Error handling and logging
// better connection management
// better room management



export class SocketManager {
    private socket: Socket | null = null;
    private socketUrl: string = config.socketUrl;

    constructor(private mediaSoupManager: MediaSoupManager) {
        this.initSocket();
    }
    
    initSocket() {
        try {
            this.socket = io(this.socketUrl);
            this.socket.on("connect", () => {
                console.log("Connected to socket");
            });
            this.socket.on("disconnect", () => {
                console.log("Disconnected from socket");
            });

            this.socket.on("RouterRtpCapabilities", async ({roomId, rtpCapabilities}: {roomId: string, rtpCapabilities: RtpCapabilities}) => {
                if(!(roomId || rtpCapabilities)) {
                    console.error("RouterRtpCapabilities", roomId, rtpCapabilities);
                    return;
                }
                await this.mediaSoupManager.load(rtpCapabilities);
                this.socket?.emit("createSendTransport", roomId);
            });

            this.socket.on("sendTransport", async ({roomId, transportParams}: {roomId: string, transportParams: TransportParams}) => {
                if(!(roomId || transportParams)) {
                    console.error("sendTransport", roomId, transportParams);
                    return;
                }
                
                const {transportId, dtlsParameters, callback} = await this.mediaSoupManager.setupDTLSConnection(transportParams) as setupDTLSConnectionResponse;

                this.socket?.emit("connectSendTransport", {roomId, transportId, dtlsParameters});
                console.log("connectSendTransport", roomId, transportId, dtlsParameters);
                this.socket?.once("sendTransportConnected", () => {
                    console.log("sendTransportConnected");
                    callback();
                });
                
            });
            
            this.socket.on("error", (error: string) => {
                // TODO: This Should be handled by the UI
                console.error("Error from socket", error);
            });
        }catch(error) {
            console.error("Error connecting to socket", error);
        }
    }
    public joinRoom(roomId: string) {
        if(this.socket) {
            console.log("current socket", this.socket);
            this.socket.emit("join-room", { roomId: roomId });
        }
    }

    public leaveRoom(roomId: string) {
        if(this.socket) {
            this.socket.emit("leaveRoom", { roomId: roomId });
        }
    }

    public getSocket() {
        return this.socket;
    }
    
    
}
