'use client';

import { useState } from 'react';
import FlowSelectorModal from '@/components/FlowSelectorModal/FlowSelectorModal';
import HomeSidebar from "@/components/HomeSidebar/HomeSidebar";
import HomeWelcome from "@/components/HomeWelcome/HomeWelcome";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <HomeSidebar />
      <HomeWelcome />
      <FlowSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
