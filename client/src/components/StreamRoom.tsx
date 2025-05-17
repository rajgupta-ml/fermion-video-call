"use client";
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  MoreVertical,
  Presentation as PresentationScreen,
  Settings,
  Hand
} from 'lucide-react';
import { useMediaToggle } from '@/hooks/StreamRoomHooks/useMediaToggle';
import { useMediaStream } from '@/hooks/StreamRoomHooks/useMediaStream';

const StreamRoom: React.FC = () => {
  const { roomId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setupMediaStream, cleanup } = useMediaStream(videoRef as React.RefObject<HTMLVideoElement>);
  const {
    isCameraOn,
    isMicrophoneOn,
    toggleCamera,
    toggleMicrophone
  } = useMediaToggle(videoRef as React.RefObject<HTMLVideoElement>);

  useEffect(() => {
    setupMediaStream();
    return () => cleanup();
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 py-2 px-4 flex justify-between items-center border-b border-gray-700 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-white font-medium">Meet</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{roomId}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full bg-gray-800 rounded-lg overflow-hidden relative">
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
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-700 shrink-0">
            <h2 className="text-white font-semibold mb-2">People (1)</h2>
            <div className="flex items-center space-x-2 text-gray-300 p-2 hover:bg-gray-700 rounded-md">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">Y</span>
              </div>
              <span>You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 py-4 px-6 flex items-center justify-between border-t border-gray-700 shrink-0">
        <div className="text-gray-300 text-sm">
          {new Date().toLocaleTimeString()}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMicrophone}
            className={`p-3 rounded-full transition-colors ${
              isMicrophoneOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isMicrophoneOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <Hand size={20} />
          </button>

          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <PresentationScreen size={20} />
          </button>

          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MoreVertical size={20} />
          </button>

          <button className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
            <PhoneOff size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <Users size={20} />
          </button>
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamRoom;
