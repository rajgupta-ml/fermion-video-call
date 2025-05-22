import { config } from "@/config";
import { RtpCapabilities } from "mediasoup-client/types";
import { io, Socket } from "socket.io-client";
import { MediaSoupManager } from "./MediaSoupManager";
import { setupDTLSConnectionResponse, TransportParams } from "@/types/mediaSoupTypes";
import { json } from "stream/consumers";



//Singleton class to manage socket connection
// better Error handling and logging
// better connection management
// better room management



export class SocketManager {
    private socket: Socket | null = null;
    private socketUrl: string = config.socketUrl;
    private mediaStream: MediaStream | null = null;
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
                console.log("Send Transport :", {roomId, transportParams});
    
                this.mediaSoupManager.setupDTLSConnection(transportParams, this.socket as Socket, roomId);

                const interval = setInterval(async () => {
                    console.log(this.mediaStream);
                    // if (!this.mediaStream) {
                    //     console.warn("Waiting for media stream...");
                    //     return;
                    // }
                
                    // try {
                    //     const mediaProducer = await this.mediaSoupManager.produceMedia(this.mediaStream);
                    //     console.log("Media producer initialized:", mediaProducer);
                
                    //     clearInterval(interval); // Stop polling once successful
                    // } catch (err) {
                    //     console.error("Failed to produce media:", err);
                    // }
                }, 1000);
                
                  
                console.log("The control Reaches here");

                
                // console.log("Media Stream is available")
                // this.socket?.emit("produce", {roomId, mediaProducer}, (id: string) => {
                //     console.log("produce", roomId, mediaProducer);
                // });
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


    public setMediaStream(mediaStream: MediaStream) {
        console.log("setMediaStrem is called")
        this.mediaStream = mediaStream;
    }

    public getMediaStream() {
        return this.mediaStream;
    }
    
}
