import { createContext, useContext, useRef } from "react";
import { SocketManager } from "@/mangers/SocketManager";

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
    socketManagerRef.current = new SocketManager();
    socketManagerRef.current.initSocket();
    return (
        <SocketContext.Provider value={socketManagerRef.current as SocketManager}>
            {children}
        </SocketContext.Provider>
    );
}