import { useEffect, useState } from 'react';

export const useDeviceCheck = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMicrophone, setHasMicrophone] = useState(false);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setHasCamera(devices.some(device => device.kind === 'videoinput'));
        setHasMicrophone(devices.some(device => device.kind === 'audioinput'));
      } catch (error) {
        console.error('Error checking devices:', error);
      }
    };

    checkDevices();
  }, []);

  return { hasCamera, hasMicrophone };
};
