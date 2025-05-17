import React, {useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, VideoOff, Mic, MicOff, Volume2 } from 'lucide-react';
import { useDeviceCheck } from '@/hooks/MettingSetupHooks/useDeviceCheck';
import { useMediaToggle } from '@/hooks/MettingSetupHooks/useMediaToggle';
import { useMediaStream } from '@/hooks/MettingSetupHooks/useMediaStream';
import { useSocket } from '@/context/SocketProvider';

interface MeetingSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeetingSetupModal: React.FC<MeetingSetupModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hasCamera, hasMicrophone } = useDeviceCheck();
  const { setupMediaStream, audioLevel } = useMediaStream(videoRef as React.RefObject<HTMLVideoElement>);
  const { isCameraOn, isMicrophoneOn, toggleCamera, toggleMicrophone } = useMediaToggle(videoRef as React.RefObject<HTMLVideoElement>);
  const navigate = useNavigate();
  const socketManager = useSocket();

  
  const handleJoinMeeting = () => {
    try{
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      socketManager.joinRoom(roomId);
      navigate(`/stream/${roomId}`);
      onClose();
    }catch(error){
      console.error("Error joining meeting", error);
      onClose();
    }
  };

  useEffect(() => {
      if (isOpen) {
        setupMediaStream();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">New Meeting Setup</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff size={48} className="text-gray-600" />
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleCamera}
            disabled={!hasCamera}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              hasCamera
                ? (isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700')
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            <span>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</span>
          </button>

          <button
            onClick={toggleMicrophone}
            disabled={!hasMicrophone}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              hasMicrophone
                ? (isMicrophoneOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700')
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isMicrophoneOn ? <Mic size={20} /> : <MicOff size={20} />}
            <span>{isMicrophoneOn ? 'Turn Off Mic' : 'Turn On Mic'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <Volume2 size={20} />
            <span>Audio Level</span>
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-100"
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleJoinMeeting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSetupModal;