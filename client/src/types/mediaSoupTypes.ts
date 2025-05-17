import { IceCandidate } from "mediasoup-client/types";

import { IceParameters } from "mediasoup-client/types";

import { DtlsParameters } from "mediasoup-client/types";

export interface TransportParams {
    id : string;
    iceParameters : IceParameters;
    iceCandidates : IceCandidate[];
    dtlsParameters : DtlsParameters;
}


export interface setupDTLSConnectionResponse {
    
    transportId: string;
    dtlsParameters: DtlsParameters;
    callback: () => void;
}