"use client"
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StreamRoom from '@/components/StreamRoom';
import { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';


const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  )
}
export default function Home() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<HomePage />}/>
        <Route path="/stream/:roomId" element = {<StreamRoom />}/>
      </Routes>
      
    </BrowserRouter>
    
  );
}
