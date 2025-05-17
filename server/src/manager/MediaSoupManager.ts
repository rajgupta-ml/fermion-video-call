import { createWorker } from "mediasoup";
import type { Peer, Room, TransportParams } from "../types/mediaSoupTypes";
import type { DtlsParameters, RtpCodecCapability } from "mediasoup/types";

const MEDIA_SOUP_CODECS : RtpCodecCapability[] = [
    {
        kind : "video",
        mimeType : "video/VP8",
        clockRate : 90000,
        channels : 1,
    },
    {
        kind : "audio",
        mimeType : "audio/opus",
        clockRate : 48000,
        channels : 2,
    }
]
export class MediaSoupManager {
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map();
    }

    async createRoom(roomId: string, socketId : string) {
        const worker = await createWorker({
            logLevel : "debug",
            logTags : ["info"],
        });
        const router = await worker.createRouter({
            mediaCodecs : MEDIA_SOUP_CODECS,
        })
        this.rooms.set(roomId, {
            router : router,
            peers : {} as Record<string, Peer>
        });

        this.rooms.get(roomId)!.peers[socketId] = {
            name : socketId,
            producer : [],
            consumer : [],
            transport : [],
        };
        return router;
    }

    async createTransportListener(roomId: string, socketId : string) : Promise<TransportParams> {
        const room = this.rooms.get(roomId);
        if(!room || !room.peers[socketId]) {
            throw new Error("Room not found or peer not found");
        }
        const transport = await room.router.createWebRtcTransport({
            listenIps : [{
                ip : "0.0.0.0",
                announcedIp : "0.0.0.0",
            }],
            enableTcp : true,
            enableUdp : true,
           
        });

        room.peers[socketId].transport.push(transport);
        return {
            id : transport.id,
            iceParameters : transport.iceParameters,
            iceCandidates : transport.iceCandidates,
            dtlsParameters : transport.dtlsParameters 
        };
    }


    async connectTransport(roomId: string, socketId : string, transportId : string, dtlsParameters : DtlsParameters) {
        const room = this.rooms.get(roomId);
        if(!room || !room.peers[socketId]) {
            throw new Error("Room not found or peer not found");
        }
        const transport = room.peers[socketId].transport.find(t => t.id === transportId);
        if(!transport) {
            throw new Error("Transport not found");
        }
        await transport.connect({dtlsParameters});
        console.log("room: ", JSON.stringify(room, null, 2));
        return transport;
    }

}