import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Cpu, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface EnhancedChessBoardProps {
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Enhanced chess pieces with better Unicode symbols and styling
const ChessBoardDisplay = ({ 
  position, 
  onSquareClick,
  selectedSquare,
  legalMoves 
}: { 
  position: string;
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  legalMoves: string[];
}) => {
  const game = new Chess(position);
  const board = game.board();
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Enhanced piece symbols with better styling
  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';
    
    // Premium Unicode chess pieces with consistent styling
    const symbols: Record<string, string> = {
      'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
      'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
    };
    
    return symbols[piece.color + piece.type.toUpperCase()] || '';
  };

  const isLightSquare = (file: number, rank: number) => (file + rank) % 2 === 0;

  return (
    <div className="relative">
      {/* Board coordinates - Mobile responsive */}
      <div className="absolute -left-3 sm:-left-4 top-0 h-full flex flex-col justify-around text-xs text-muted-foreground font-medium">
        {ranks.map(rank => (
          <div key={rank} className="h-10 sm:h-12 flex items-center">{rank}</div>
        ))}
      </div>
      <div className="absolute -bottom-3 sm:-bottom-4 left-0 w-full flex justify-around text-xs text-muted-foreground font-medium">
        {files.map(file => (
          <div key={file} className="w-10 sm:w-12 flex justify-center">{file}</div>
        ))}
      </div>
      
      {/* Chess board - Mobile responsive */}
      <div className="grid grid-cols-8 gap-0 w-80 h-80 sm:w-96 sm:h-96 mx-auto border-2 border-glass-border rounded-xl overflow-hidden shadow-glass-lg backdrop-blur-glass">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = file + rank;
            const piece = board[rankIndex][fileIndex];
            const isLight = isLightSquare(fileIndex, rankIndex);
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            
            return (
              <div
                key={square}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl cursor-pointer transition-all duration-200 relative
                  ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
                  ${isSelected ? 'ring-2 ring-primary ring-inset shadow-glass' : ''}
                  ${isLegalMove ? 'bg-chess-move shadow-inner' : ''}
                  hover:brightness-110 hover:scale-105
                  ${piece ? 'hover:shadow-lg' : ''}
                `}
                onClick={() => onSquareClick(square)}
              >
                {/* Legal move indicator */}
                {isLegalMove && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-chess-move border-2 border-primary/50 animate-pulse"></div>
                  </div>
                )}
                
                {/* Chess piece with enhanced styling */}
                {piece && (
                  <div className={`
                    relative transition-transform duration-200 hover:scale-110
                    ${piece.color === 'w' ? 'drop-shadow-md' : 'drop-shadow-md'}
                    ${isSelected ? 'scale-110 animate-pulse' : ''}
                  `}>
                    <span className={`
                      ${piece.color === 'w' 
                        ? 'text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.8),_0_0_8px_rgba(255,255,255,0.3)]' 
                        : 'text-gray-900 [text-shadow:2px_2px_4px_rgba(255,255,255,0.9),_0_0_8px_rgba(0,0,0,0.5)]'
                      }
                      font-bold filter brightness-110
                    `}>
                      {getPieceSymbol(piece)}
                    </span>
                  </div>
                )}
                
                {/* Square highlight for captures */}
                {isLegalMove && piece && (
                  <div className="absolute inset-0 ring-2 ring-red-400 ring-inset rounded-sm animate-pulse opacity-80"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const EnhancedChessBoard = ({ difficulty = 'beginner' }: EnhancedChessBoardProps) => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    updateGameStatus();
  }, [game]);

  const updateGameStatus = () => {
    if (game.isCheckmate()) {
      setGameStatus('checkmate');
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      toast({
        title: t('game_over'),
        description: t('wins_by_checkmate', { winner }),
      });
    } else if (game.isDraw()) {
      setGameStatus('draw');
      toast({
        title: t('game_over'),
        description: t('game_is_draw'),
      });
    } else if (game.inCheck()) {
      setGameStatus('check');
    } else {
      setGameStatus('playing');
    }
    setCurrentPlayer(game.turn() === 'w' ? 'white' : 'black');
  };

  const makeAiMove = () => {
    setIsThinking(true);
    
    setTimeout(() => {
      const moves = game.moves();
      if (moves.length === 0) return;

      let selectedMove;
      
      switch (selectedDifficulty) {
        case 'beginner':
          selectedMove = moves[Math.floor(Math.random() * moves.length)];
          break;
        case 'intermediate':
          const captures = moves.filter(move => move.includes('x'));
          selectedMove = captures.length > 0 && Math.random() > 0.3 
            ? captures[Math.floor(Math.random() * captures.length)]
            : moves[Math.floor(Math.random() * moves.length)];
          break;
        case 'advanced':
          const checks = moves.filter(move => move.includes('+'));
          const goodCaptures = moves.filter(move => move.includes('x') && !move.includes('='));
          
          if (checks.length > 0 && Math.random() > 0.2) {
            selectedMove = checks[Math.floor(Math.random() * checks.length)];
          } else if (goodCaptures.length > 0 && Math.random() > 0.4) {
            selectedMove = goodCaptures[Math.floor(Math.random() * goodCaptures.length)];
          } else {
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
          }
          break;
        case 'expert':
          const priorityMoves = moves.filter(move => 
            move.includes('+') || 
            (move.includes('x') && !move.includes('=')) ||
            move.includes('O-O')
          );
          selectedMove = priorityMoves.length > 0 && Math.random() > 0.1
            ? priorityMoves[Math.floor(Math.random() * priorityMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];
          break;
        default:
          selectedMove = moves[Math.floor(Math.random() * moves.length)];
      }

      try {
        const newGame = new Chess(game.fen());
        newGame.move(selectedMove);
        setGame(newGame);
      } catch (error) {
        console.error('Invalid AI move:', error);
      }
      
      setIsThinking(false);
      setSelectedSquare(null);
      setLegalMoves([]);
    }, 800 + Math.random() * 1200);
  };

  const onSquareClick = (square: string) => {
    if (isThinking || gameStatus !== 'playing' || currentPlayer !== 'white') return;

    try {
      if (selectedSquare) {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from: selectedSquare as any,
          to: square as any,
          promotion: 'q'
        });

        if (move) {
          setGame(newGame);
          setSelectedSquare(null);
          setLegalMoves([]);
          
          if (newGame.turn() === 'b' && !newGame.isGameOver()) {
            setTimeout(makeAiMove, 400);
          }
        } else {
          selectSquare(square);
        }
      } else {
        selectSquare(square);
      }
    } catch (error) {
      selectSquare(square);
    }
  };

  const selectSquare = (square: string) => {
    try {
      const piece = game.get(square as any);
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as any, verbose: true });
        setLegalMoves(moves.map((move: any) => move.to));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } catch (error) {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setCurrentPlayer('white');
    setIsThinking(false);
    setSelectedSquare(null);
    setLegalMoves([]);
    toast({
      title: t('new_game'),
      description: t('board_reset'),
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (gameStatus === 'checkmate') return '👑';
    if (gameStatus === 'check') return '⚠️';
    if (gameStatus === 'draw') return '🤝';
    return currentPlayer === 'white' ? '♔' : '♚';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6">
      {/* Game Info Panel */}
      <Card className="glass-strong p-4 sm:p-6 lg:w-80 border-glass-border order-2 lg:order-1">
        <div className="space-y-6">
          {/* Game Status */}
          <div className="text-center">
            <div className="text-5xl mb-3 animate-bounce">{getStatusIcon()}</div>
            <h3 className="text-lg font-semibold mb-2">
              {gameStatus === 'playing' ? 
                (currentPlayer === 'white' ? t('white_to_move') : t('black_to_move')) : 
               gameStatus === 'check' ? t('check') :
               gameStatus === 'checkmate' ? t('checkmate') : t('draw')}
            </h3>
            {isThinking && (
              <Badge variant="secondary" className="glass animate-pulse">
                <Cpu className="w-4 h-4 mr-1 animate-spin" />
                {t('ai_thinking')}
              </Badge>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">{t('ai_difficulty')}</label>
            <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as typeof selectedDifficulty)}>
              <SelectTrigger className="glass border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-glass-border">
                <SelectItem value="beginner">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('beginner')}`} />
                    {t('beginner')}
                  </div>
                </SelectItem>
                <SelectItem value="intermediate">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('intermediate')}`} />
                    {t('intermediate')}
                  </div>
                </SelectItem>
                <SelectItem value="advanced">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('advanced')}`} />
                    {t('advanced')}
                  </div>
                </SelectItem>
                <SelectItem value="expert">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('expert')}`} />
                    {t('expert')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">{t('you')}</span>
              </div>
              <div className="text-3xl">♔</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="font-medium">{t('pedro_ai')}</span>
              </div>
              <div className="text-3xl">♚</div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <Button onClick={resetGame} variant="glass" className="w-full border-glass-border hover:shadow-glass-lg transition-all duration-300">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('new_game')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Chess Board */}
      <Card className="glass-strong p-4 sm:p-6 lg:p-8 flex-1 border-glass-border order-1 lg:order-2">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            {t('pedro_chess_board')}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{t('click_instruction')}</p>
        </div>
        <div className="flex justify-center">
          <ChessBoardDisplay
            position={game.fen()}
            onSquareClick={onSquareClick}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
          />
        </div>
      </Card>
    </div>
  );
};