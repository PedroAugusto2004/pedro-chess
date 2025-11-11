import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/theme-provider';
import { useTranslation } from 'react-i18next';
import { 
  Crown,
  Gamepad2, 
  BookOpen, 
  Target,
  Menu,
  X,
  Monitor,
  Moon,
  Sun,
  Languages,
  Settings
} from 'lucide-react';

interface NavigationProps {
  activeTab: 'play' | 'puzzles' | 'lessons';
  onTabChange: (tab: 'play' | 'puzzles' | 'lessons') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const navItems = [
    {
      id: 'play' as const,
      label: t('play'),
      icon: Gamepad2,
      description: t('play_description')
    },
    {
      id: 'puzzles' as const,
      label: t('puzzles'),
      icon: Target,
      description: t('puzzles_description')
    },
    {
      id: 'lessons' as const,
      label: t('lessons'),
      icon: BookOpen,
      description: t('lessons_description')
    }
  ];

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'pt', name: t('portuguese'), flag: '🇧🇷' },
    { code: 'es', name: t('spanish'), flag: '🇪🇸' }
  ];

  const themes = [
    { value: 'light', label: t('light'), icon: Sun },
    { value: 'dark', label: t('dark'), icon: Moon },
    { value: 'system', label: t('system'), icon: Monitor }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('pedro-chess-language', lng);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 glass-strong border-b border-glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Crown className="w-8 h-8 text-primary animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 text-primary-light animate-ping opacity-20">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                  {t('app_name')}
                </h1>
                <p className="text-xs text-muted-foreground">{t('app_subtitle')}</p>
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
                    className={`
                      flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:scale-105
                      ${isActive ? 'shadow-glass-lg' : ''}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="icon" className="relative">
                    <Languages className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong border-glass-border">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-2 ${
                        i18n.language === lang.code ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="icon" className="relative">
                    {theme === 'light' && <Sun className="w-4 h-4" />}
                    {theme === 'dark' && <Moon className="w-4 h-4" />}
                    {theme === 'system' && <Monitor className="w-4 h-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong border-glass-border">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <DropdownMenuItem
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as any)}
                        className={`flex items-center gap-2 ${
                          theme === themeOption.value ? 'bg-primary/10' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{themeOption.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                {t('app_name')}
              </h1>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Selector Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="sm">
                    <Languages className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong border-glass-border">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-2 ${
                        i18n.language === lang.code ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Selector Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="sm">
                    {theme === 'light' && <Sun className="w-4 h-4" />}
                    {theme === 'dark' && <Moon className="w-4 h-4" />}
                    {theme === 'system' && <Monitor className="w-4 h-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong border-glass-border">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <DropdownMenuItem
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as any)}
                        className={`flex items-center gap-2 ${
                          theme === themeOption.value ? 'bg-primary/10' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{themeOption.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu Toggle */}
              <Button
                variant="glass"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 space-y-2 pb-4 animate-in slide-in-from-top-2 duration-200">
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