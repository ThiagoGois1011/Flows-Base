'use client';

import { useState } from 'react';
import { FlowProvider } from '@/contexts/FlowContext';
import FlowSelectorModal from '@/components/FlowSelectorModal/FlowSelectorModal';
import HomeSidebar from "@/components/HomeSidebar/HomeSidebar";
import HomeWelcome from "@/components/HomeWelcome/HomeWelcome";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FlowProvider>
      <div className="flex h-screen">
        <HomeSidebar />
        <HomeWelcome onNewFlow={() => setIsModalOpen(true)} />
        <FlowSelectorModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </FlowProvider>
  );
}
