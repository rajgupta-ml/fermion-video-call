import type { Consumer, DtlsParameters, IceCandidate, IceParameters, Transport } from "mediasoup/types";

import type { Producer } from "mediasoup/types";

import type { Router } from "mediasoup/types";


export interface Peer {
    name : string;
    producer : Producer[];
    consumer : Consumer[];
    transport : Transport[];
}

export interface Room { 
    router : Router;
    peers : Record<string, Peer>;
}

export interface TransportParams {
    id : string;
    iceParameters : IceParameters;
    iceCandidates : IceCandidate[];
    dtlsParameters : DtlsParameters;
}