"use client"
import React, { useState } from 'react';
import { Video, Users, Plus, Link as LinkIcon, ArrowRight } from 'lucide-react';
import MeetingSetupModal from './MeetingSetupModal';
import { useSocket } from '@/context/SocketProvider';

const Hero: React.FC = () => {
  const [meetingCode, setMeetingCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(meetingCode) {
      handleNewMeeting();
    }else {
      // TODO: Handle error
      //Toastify
      console.error("Meeting code is required")
    }
  };

  const handleNewMeeting = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Premium video meetings. <span className="text-indigo-400">For everyone.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Secure, high-quality video conferencing platform designed for seamless collaboration, available to everyone, anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button 
                onClick={handleNewMeeting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <Video size={20} />
                <span>New Meeting</span>
              </button>
              
              <form onSubmit={handleSubmit} className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="w-full sm:w-64 px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none text-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={!meetingCode}
                >
                  <ArrowRight size={20} className={meetingCode ? 'text-indigo-400' : 'text-gray-600'} />
                </button>
              </form>
            </div>
            
            <div className="text-gray-400 text-sm">
              <a href="#" className="text-indigo-400 hover:underline inline-flex items-center">
                <LinkIcon size={16} className="mr-1" /> Get a meeting link to share
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="aspect-video bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Your meeting preview will appear here</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-3 flex justify-between items-center">
                  <div className="text-gray-300 text-sm">Ready to join</div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MeetingSetupModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Hero;