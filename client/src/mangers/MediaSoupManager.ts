import { setupDTLSConnectionResponse, TransportParams } from "@/types/mediaSoupTypes";
import { Device } from "mediasoup-client";
import { DtlsParameters, RtpCapabilities } from "mediasoup-client/types";


export class MediaSoupManager {
    private device : Device;

    constructor() {
        this.device = new Device();
    }
    async load(rtpCapabilities: RtpCapabilities) {
        await this.device.load({
            routerRtpCapabilities : rtpCapabilities,
        });
    }
    async setupDTLSConnection(transportParams: TransportParams): Promise<setupDTLSConnectionResponse> {
        const sendTransport = this.device.createSendTransport(transportParams);
    
        return new Promise((resolve, reject) => {
            sendTransport.on("connect", ({ dtlsParameters }, callback) => {
                resolve({
                    transportId: sendTransport.id,
                    dtlsParameters,
                    callback, // must call this later
                    
                });
            });
        

        });
    }
    
}