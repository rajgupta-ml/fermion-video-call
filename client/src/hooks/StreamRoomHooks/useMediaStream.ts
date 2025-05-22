import { SocketManager } from "@/mangers/SocketManager";

export const useMediaStream = (videoRef: React.RefObject<HTMLVideoElement>, socketManager: SocketManager) => {

  const setupMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      socketManager.setMediaStream(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const setMediaStream = (mediaStream: MediaStream) => {
    socketManager.setMediaStream(mediaStream);
  };

  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return { setupMediaStream, cleanup, setMediaStream };
};
