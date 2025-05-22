import { setupDTLSConnectionResponse, TransportParams } from "@/types/mediaSoupTypes";
import { Device } from "mediasoup-client";
import { DtlsParameters, Producer, RtpCapabilities, Transport } from "mediasoup-client/types";
import { EventEmitter } from "events";

import type { Socket } from "socket.io-client";

export class MediaSoupManager extends EventEmitter {
    private device : Device;
    private sendTransport! : Transport;

    constructor() {
        super();
        this.device = new Device();
    }
    async load(rtpCapabilities: RtpCapabilities) {
        await this.device.load({
            routerRtpCapabilities : rtpCapabilities,
        });
    }
    setupDTLSConnection(transportParams: TransportParams, socket : Socket, roomId : string) {

    
        this.sendTransport = this.device.createSendTransport(transportParams);

        if(!this.sendTransport) {
            throw new Error("Failed to create send transport");
        }
        console.log("I reach Here")
        this.sendTransport.on("connect", ({ dtlsParameters }, callback) => {
            const transportId = this.sendTransport.id;
        
            socket.emit("connectSendTransport", { roomId, transportId, dtlsParameters });
        
            console.log("connectSendTransport", roomId, transportId, dtlsParameters);
        
            socket.once("sendTransportConnected", () => {
                console.log("sendTransportConnected");
                callback(); // Must be called after server acknowledgment
            });
        });        



        this.sendTransport.on("produce", ({kind, rtpParameters, appData}, callback) => {
            console.log("Produce event Firec", kind);

            socket.emit("produce", {
                roomId,
                transportId : this.sendTransport.id,
                kind,
                rtpParameters,
                appData
            })

            socket.once("produced", ({ id, error }) => {
                if (error) {
                    console.error("❌ Produce error:", error);
                    // callback(new Error(error as string));
                } else {
                    console.log("✅ Media produced with ID:", id);
                    callback({ id });
                }
            });
        })


        this.sendTransport.on("connectionstatechange", (state) => {
            console.log("🔄 Transport connection state:", state);
            if (state === "failed" || state === "disconnected" || state === "closed") {
                console.error("❌ Transport connection failed:", state);
                this.emit("transportError", state);
            }
        });


        this.sendTransport.on("icegatheringstatechange", (state) => {
            console.log("🧊 ICE state changed:", state);
        });
        
    }


    async produceMedia() {
        const mediaStream = new MediaStream();
        if (!this.sendTransport) {
            throw new Error("Send transport not initialized. Call setupDTLSConnection first.");
        }
        
        console.log("🎥 Starting media production...");
        
        const videoTrack = mediaStream.getVideoTracks()[0];
        // if (!videoTrack) {
        //     throw new Error("No video track found in media stream");
        // }
        
        try {
            // This will trigger the 'connect' event if not already connected
            const mediaProducer = await this.sendTransport.produce({
                track: videoTrack,
                encodings: [
                    { maxBitrate: 500000, scaleResolutionDownBy: 1 }, // Original quality
                    { maxBitrate: 200000, scaleResolutionDownBy: 2 }, // Half resolution
                    { maxBitrate: 100000, scaleResolutionDownBy: 4 }  // Quarter resolution
                ],
                codecOptions: {}
            });
            
            console.log("✅ Media producer created:", mediaProducer.id);
            return mediaProducer;
        } catch (error) {
            console.error("❌ Failed to produce media:", error);
            throw error;
        }

        // Save the recording locally
    }

    
}