
import React, { useState } from 'react';
import WelcomePage from '@/components/WelcomePage';
import InventoryForm from '@/components/InventoryForm';
import InventoryResults from '@/components/InventoryResults';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  unit: 'kg' | 'pkt' | 'ltr' | 'pcs';
  available: boolean;
  notAvailable: boolean;
}

interface InventoryData {
  submitterName: string;
  items: InventoryItem[];
  submissionDate: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'form' | 'results'>('welcome');
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);

  const handleStart = () => {
    setCurrentView('form');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setInventoryData(null);
  };

  const handleFormSubmit = (data: InventoryData) => {
    setInventoryData(data);
    setCurrentView('results');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  const handleNewForm = () => {
    setInventoryData(null);
    setCurrentView('form');
  };

  return (
    <>
      {currentView === 'welcome' && (
        <WelcomePage onStart={handleStart} />
      )}
      
      {currentView === 'form' && (
        <InventoryForm 
          onBack={handleBackToWelcome} 
          onSubmit={handleFormSubmit}
        />
      )}
      
      {currentView === 'results' && inventoryData && (
        <InventoryResults 
          data={inventoryData}
          onBack={handleBackToForm}
          onNewForm={handleNewForm}
        />
      )}
    </>
  );
};

export default Index;
