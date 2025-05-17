import { useEffect, useRef, useState } from 'react';

export const useMediaStream = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const audioContext = useRef<AudioContext | null>(null);
  const audioAnalyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const setupMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      audioAnalyser.current = audioContext.current.createAnalyser();
      audioAnalyser.current.fftSize = 256;
      source.connect(audioAnalyser.current);

      const analyzeAudio = () => {
        if (!audioAnalyser.current) return;
        const dataArray = new Uint8Array(audioAnalyser.current.frequencyBinCount);
        audioAnalyser.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 128);
        animationFrame.current = requestAnimationFrame(analyzeAudio);
      };

      analyzeAudio();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return { setupMediaStream, cleanup, audioLevel };
};
