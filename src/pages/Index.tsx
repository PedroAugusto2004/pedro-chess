import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SimpleChessBoard } from '@/components/SimpleChessBoard';
import { SimplePuzzleBoard } from '@/components/SimplePuzzleBoard';
import { LessonsSection } from '@/components/LessonsSection';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'play' | 'puzzles' | 'lessons'>('play');

  const renderContent = () => {
    switch (activeTab) {
      case 'play':
        return <SimpleChessBoard />;
      case 'puzzles':
        return <SimplePuzzleBoard />;
      case 'lessons':
        return <LessonsSection />;
      default:
        return <SimpleChessBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
