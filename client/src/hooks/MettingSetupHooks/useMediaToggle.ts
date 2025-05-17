import { useState } from 'react';

export const useMediaToggle = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(prev => !prev);
    }
  };

  const toggleMicrophone = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneOn(prev => !prev);
    }
  };

  return { isCameraOn, isMicrophoneOn, toggleCamera, toggleMicrophone };
};
