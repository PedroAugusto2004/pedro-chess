import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { EnhancedChessBoard } from '@/components/EnhancedChessBoard';
import { SimplePuzzleBoard } from '@/components/SimplePuzzleBoard';
import { LessonsSection } from '@/components/LessonsSection';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'play' | 'puzzles' | 'lessons'>('play');
  const { i18n } = useTranslation();

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('pedro-chess-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const renderContent = () => {
    switch (activeTab) {
      case 'play':
        return <EnhancedChessBoard />;
      case 'puzzles':
        return <SimplePuzzleBoard />;
      case 'lessons':
        return <LessonsSection />;
      default:
        return <EnhancedChessBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
