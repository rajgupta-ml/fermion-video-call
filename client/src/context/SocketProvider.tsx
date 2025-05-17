import { createContext, useContext, useRef } from "react";
import { SocketManager } from "@/mangers/SocketManager";
import { MediaSoupManager } from "@/mangers/MediaSoupManager";

const SocketContext = createContext<SocketManager | null>(null);
export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;     
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketManagerRef = useRef<SocketManager | null>(null);
    const mediaSoupManagerRef = useRef<MediaSoupManager | null>(null);
    mediaSoupManagerRef.current = new MediaSoupManager();
    socketManagerRef.current = new SocketManager(mediaSoupManagerRef.current as MediaSoupManager);
    return (
        <SocketContext.Provider value={socketManagerRef.current as SocketManager}>
            {children}
        </SocketContext.Provider>
    );
}