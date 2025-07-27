import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Cpu, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleChessBoardProps {
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Simple chess board visualization
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

  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';
    const symbols: Record<string, string> = {
      'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
      'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
    };
    return symbols[piece.color + piece.type.toUpperCase()] || '';
  };

  const isLightSquare = (file: number, rank: number) => (file + rank) % 2 === 0;

  return (
    <div className="grid grid-cols-8 gap-0 w-96 h-96 mx-auto border-2 border-glass-border rounded-lg overflow-hidden shadow-glass-lg">
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
                w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-all
                ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                ${isLegalMove ? 'bg-chess-move' : ''}
                hover:opacity-80
              `}
              onClick={() => onSquareClick(square)}
            >
              {getPieceSymbol(piece)}
            </div>
          );
        })
      )}
    </div>
  );
};

export const SimpleChessBoard = ({ difficulty = 'beginner' }: SimpleChessBoardProps) => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    updateGameStatus();
  }, [game]);

  const updateGameStatus = () => {
    if (game.isCheckmate()) {
      setGameStatus('checkmate');
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      toast({
        title: "Game Over!",
        description: `${winner} wins by checkmate!`,
      });
    } else if (game.isDraw()) {
      setGameStatus('draw');
      toast({
        title: "Game Over!",
        description: "The game is a draw!",
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
    }, 500 + Math.random() * 1500);
  };

  const onSquareClick = (square: string) => {
    if (isThinking || gameStatus !== 'playing' || currentPlayer !== 'white') return;

    try {
      if (selectedSquare) {
        // Try to make a move
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });

        if (move) {
          setGame(newGame);
          setSelectedSquare(null);
          setLegalMoves([]);
          
          // Make AI move after player move
          if (newGame.turn() === 'b' && !newGame.isGameOver()) {
            setTimeout(makeAiMove, 300);
          }
        } else {
          // Invalid move, try selecting new piece
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
      title: "New Game",
      description: "The board has been reset. Good luck!",
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
    if (gameStatus === 'checkmate') return '♔';
    if (gameStatus === 'check') return '⚠️';
    if (gameStatus === 'draw') return '🤝';
    return currentPlayer === 'white' ? '♔' : '♚';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Game Info Panel */}
      <Card className="glass-strong p-6 lg:w-80">
        <div className="space-y-6">
          {/* Game Status */}
          <div className="text-center">
            <div className="text-4xl mb-2">{getStatusIcon()}</div>
            <h3 className="text-lg font-semibold mb-2">
              {gameStatus === 'playing' ? `${currentPlayer === 'white' ? 'White' : 'Black'} to move` : 
               gameStatus === 'check' ? 'Check!' :
               gameStatus === 'checkmate' ? 'Checkmate!' : 'Draw!'}
            </h3>
            {isThinking && (
              <Badge variant="secondary" className="glass">
                <Cpu className="w-4 h-4 mr-1 animate-pulse" />
                AI Thinking...
              </Badge>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">AI Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as typeof selectedDifficulty)}>
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('beginner')}`} />
                    Beginner
                  </div>
                </SelectItem>
                <SelectItem value="intermediate">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('intermediate')}`} />
                    Intermediate
                  </div>
                </SelectItem>
                <SelectItem value="advanced">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('advanced')}`} />
                    Advanced
                  </div>
                </SelectItem>
                <SelectItem value="expert">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor('expert')}`} />
                    Expert
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg glass">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">You</span>
              </div>
              <div className="text-2xl">♔</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg glass">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span className="font-medium">Pedro AI</span>
              </div>
              <div className="text-2xl">♚</div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <Button onClick={resetGame} variant="outline" className="w-full glass">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
        </div>
      </Card>

      {/* Chess Board */}
      <Card className="glass-strong p-6 flex-1">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Pedro Chess Board</h3>
          <p className="text-sm text-muted-foreground">Click a piece to select, then click destination</p>
        </div>
        <ChessBoardDisplay
          position={game.fen()}
          onSquareClick={onSquareClick}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
        />
      </Card>
    </div>
  );
};