import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown,
  Gamepad2, 
  BookOpen, 
  Target,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  activeTab: 'play' | 'puzzles' | 'lessons';
  onTabChange: (tab: 'play' | 'puzzles' | 'lessons') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'play' as const,
      label: 'Play',
      icon: Gamepad2,
      description: 'Play against AI'
    },
    {
      id: 'puzzles' as const,
      label: 'Puzzles',
      icon: Target,
      description: 'Solve tactics'
    },
    {
      id: 'lessons' as const,
      label: 'Lessons',
      icon: BookOpen,
      description: 'Learn chess'
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 glass-strong border-b border-glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Pedro Chess
                </h1>
                <p className="text-xs text-muted-foreground">Master the game</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "glass"}
                    onClick={() => onTabChange(item.id)}
                    className="flex items-center gap-2 px-4 py-2 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Version Badge */}
            <Badge variant="secondary" className="glass">
              v1.0
            </Badge>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50 glass-strong border-b border-glass-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Pedro Chess
              </h1>
            </div>

            {/* Menu Toggle */}
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 space-y-2 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "glass"}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start gap-3 h-12"
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};