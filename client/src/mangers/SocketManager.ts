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
    private isProducing: boolean = false;

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
                await this.startMediaProduction();
                
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
        console.log("📹 Media stream set in SocketManager:", {
            videoTracks: mediaStream.getVideoTracks().length,
            audioTracks: mediaStream.getAudioTracks().length,
            id: mediaStream.id
        });
        this.mediaStream = mediaStream;
    }

    public getMediaStream() {
        return this.mediaStream;
    }


    private async startMediaProduction() {
        if(this.isProducing){
            console.log("⚠️ Already producing media");
            return;
        }


        const maxWaitTime = 10000;
        const checkInterval = 500;
        let waitTime = 0;


        const waitForMediaStream = () => {
            return new Promise<void> ((resolve,reject) => {
                const checkMedia = () => {
                    if(this.mediaStream) {
                        console.log("📹 Media stream is available, starting production");
                        resolve();
                        return 
                    }


                    waitTime += checkInterval;
                    if(waitTime >= maxWaitTime) {
                        reject(new Error("Timeout waiting for media stream"));
                        return;
                    }


                    setTimeout(checkMedia, checkInterval);
                }

                checkMedia();

            })
        }



        try{
            await waitForMediaStream();
            this.mediaSoupManager.setMediaStream(this.mediaStream as MediaStream)
            this.isProducing = true;
            const producers = await this.mediaSoupManager.produceMedia();
            console.log("🎬 Media production started:", producers.length, "producers");
        }catch(error){
            console.error("❌ Failed to start media production:", error);
            this.isProducing = false;
        }

    }
    
}
