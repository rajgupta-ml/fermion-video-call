import { Server } from "socket.io";

export class SocketManager {
    constructor(private io: Server) {
        this.initialize();
    }

    private initialize() {
        // Socket initialization logic will go here
        this.io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("join-room", (roomId: string) => {
                socket.join(roomId);
                console.log(`User joined room ${roomId}`);
            });
            socket.on("leave-room", (roomId: string) => {
                socket.leave(roomId);
                console.log(`User left room ${roomId}`);
            });
            socket.on("send-message", (message: string, roomId: string) => {
                socket.to(roomId).emit("receive-message", message);
            });
        });
    }
} 