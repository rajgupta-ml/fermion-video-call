import { config } from "@/config";
import { io, Socket } from "socket.io-client";


//Singleton class to manage socket connection
// better Error handling and logging
// better connection management
// better room management

export class SocketManager {
    private socket: Socket | null = null;
    private socketUrl: string = config.socketUrl;
    
    initSocket() {
        try {
            this.socket = io(this.socketUrl);
            this.socket.on("connect", () => {
                console.log("Connected to socket");
            });
            this.socket.on("disconnect", () => {
                console.log("Disconnected from socket");
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

    public sendMessage(message: string) {
        if(this.socket) {
            this.socket.emit("message", { message: message });
        }
    }

    public getSocket() {
        return this.socket;
    }
    
    
}
