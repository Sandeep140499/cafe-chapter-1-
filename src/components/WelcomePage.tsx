
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, ClipboardList } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

const WelcomePage = ({ onStart }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur max-w-md w-full">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coffee className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to</CardTitle>
          <h1 className="text-2xl font-semibold mt-2">CHAPTER 1 CAFE</h1>
          <p className="text-xl text-amber-100 mt-1">Gautam Nagar</p>
        </CardHeader>
        
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <ClipboardList className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Inventory Management System
            </h2>
            <p className="text-gray-600">
              Manage your cafe's inventory efficiently with our digital system
            </p>
          </div>
          
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-6 text-lg"
          >
            Start Inventory Management
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
