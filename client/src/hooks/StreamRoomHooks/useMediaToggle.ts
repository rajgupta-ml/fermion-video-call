import { useState } from 'react';

export const useMediaToggle = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsCameraOn(prev => !prev);
    }
  };

  const toggleMicrophone = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMicrophoneOn(prev => !prev);
    }
  };

  return { isCameraOn, isMicrophoneOn, toggleCamera, toggleMicrophone };
};
