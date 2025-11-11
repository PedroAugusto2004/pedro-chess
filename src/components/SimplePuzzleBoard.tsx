import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Chess } from 'chess.js';
import { CheckCircle, XCircle, Lightbulb, SkipForward, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Puzzle {
  id: string;
  name: string;
  fen: string;
  solution: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  theme: string;
  rating: number;
}

const PUZZLES: Puzzle[] = [
  {
    id: '1',
    name: 'Back Rank Mate',
    fen: '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1',
    solution: ['Re8#'],
    description: 'Find the checkmate in one move using the back rank weakness.',
    difficulty: 'beginner',
    theme: 'Checkmate in 1',
    rating: 800
  },
  {
    id: '2',
    name: 'Fork Tactic',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['Ng5', 'd6'],
    description: 'Attack two pieces at once with a knight fork.',
    difficulty: 'beginner',
    theme: 'Fork',
    rating: 900
  },
  {
    id: '3',
    name: 'Pin and Win',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 2 5',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    description: 'Use a pin to win material with a discovered attack.',
    difficulty: 'intermediate',
    theme: 'Pin',
    rating: 1200
  },
  {
    id: '4',
    name: 'Sacrifice for Mate',
    fen: '2rq1rk1/ppp2ppp/2np4/2b1p3/2B1P3/3P1N2/PPP1QPPP/R1B2RK1 w - - 0 9',
    solution: ['Qh5', 'h6', 'Qxh6', 'gxh6', 'Bxf7#'],
    description: 'Sacrifice your queen to deliver checkmate.',
    difficulty: 'advanced',
    theme: 'Sacrifice',
    rating: 1600
  },
  {
    id: '5',
    name: 'Endgame Precision',
    fen: '8/8/8/8/8/3k4/3P4/3K4 w - - 0 1',
    solution: ['Kd2', 'Kd4', 'd3', 'Kd5', 'd4', 'Kd6', 'd5'],
    description: 'Promote your pawn in this king and pawn endgame.',
    difficulty: 'expert',
    theme: 'Endgame',
    rating: 1800
  }
];

// Simple chess board for puzzles
const PuzzleBoardDisplay = ({ 
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
    <div className="grid grid-cols-8 gap-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto border-2 border-glass-border rounded-lg overflow-hidden shadow-glass-lg">
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
                w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center text-lg sm:text-xl lg:text-2xl cursor-pointer transition-all
                ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                ${isLegalMove ? 'bg-chess-move' : ''}
                hover:opacity-80
              `}
              onClick={() => onSquareClick(square)}
            >
              {piece && (
                <span className={`
                  ${piece.color === 'w' 
                    ? 'text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.8),_0_0_8px_rgba(255,255,255,0.3)]' 
                    : 'text-gray-900 [text-shadow:2px_2px_4px_rgba(255,255,255,0.9),_0_0_8px_rgba(0,0,0,0.5)]'
                  }
                  font-bold filter brightness-110
                `}>
                  {getPieceSymbol(piece)}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export const SimplePuzzleBoard = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [puzzleStatus, setPuzzleStatus] = useState<'solving' | 'correct' | 'incorrect' | 'completed'>('solving');
  const [showHint, setShowHint] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const { toast } = useToast();

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

  useEffect(() => {
    resetPuzzle();
  }, [currentPuzzleIndex]);

  const resetPuzzle = () => {
    const newGame = new Chess(currentPuzzle.fen);
    setGame(newGame);
    setSolutionIndex(0);
    setPuzzleStatus('solving');
    setShowHint(false);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const onSquareClick = (square: string) => {
    if (puzzleStatus === 'completed') return;

    try {
      if (selectedSquare) {
        // Try to make a move
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from: selectedSquare as any,
          to: square as any,
          promotion: 'q'
        });

        if (move) {
          const moveString = move.san;
          const expectedMove = currentPuzzle.solution[solutionIndex];

          if (moveString === expectedMove) {
            // Correct move
            setGame(newGame);
            setSolutionIndex(prev => prev + 1);
            setSelectedSquare(null);
            setLegalMoves([]);

            if (solutionIndex + 1 >= currentPuzzle.solution.length) {
              // Puzzle completed
              setPuzzleStatus('completed');
              setSolvedPuzzles(prev => new Set([...prev, currentPuzzle.id]));
              toast({
                title: "Puzzle Solved! 🎉",
                description: `Great job! You solved "${currentPuzzle.name}".`,
              });
            } else {
              setPuzzleStatus('correct');
              toast({
                title: "Correct Move!",
                description: "Keep going to complete the puzzle.",
              });
              setTimeout(() => setPuzzleStatus('solving'), 1000);
            }
          } else {
            // Incorrect move
            setPuzzleStatus('incorrect');
            toast({
              title: "Not quite right",
              description: "Try again or use a hint.",
              variant: "destructive",
            });
            // Undo the move
            setGame(new Chess(game.fen()));
            setSelectedSquare(null);
            setLegalMoves([]);
            setTimeout(() => setPuzzleStatus('solving'), 1500);
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
      if (piece) {
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

  const nextPuzzle = () => {
    if (currentPuzzleIndex < PUZZLES.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    }
  };

  const previousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(prev => prev - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (puzzleStatus) {
      case 'correct': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'incorrect': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed': return <Star className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const progress = (solutionIndex / currentPuzzle.solution.length) * 100;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Chess Puzzles</h2>
        <p className="text-muted-foreground">
          Improve your tactical skills with carefully curated puzzles
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="glass">
            Puzzle {currentPuzzleIndex + 1} of {PUZZLES.length}
          </Badge>
          <Badge variant="secondary" className="glass">
            {solvedPuzzles.size} Solved
          </Badge>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Puzzle Info */}
        <Card className="glass-strong p-4 sm:p-6 lg:w-80 order-2 lg:order-1">
          <div className="space-y-6">
            {/* Puzzle Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentPuzzle.name}</h3>
                {getStatusIcon()}
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getDifficultyColor(currentPuzzle.difficulty)}`} />
                <span className="capitalize font-medium">{currentPuzzle.difficulty}</span>
                <Badge variant="outline" className="ml-auto">
                  {currentPuzzle.rating}
                </Badge>
              </div>

              <Badge variant="secondary" className="glass">
                {currentPuzzle.theme}
              </Badge>

              <p className="text-sm text-muted-foreground">
                {currentPuzzle.description}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{solutionIndex}/{currentPuzzle.solution.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Solution Moves */}
            <div className="space-y-2">
              <h4 className="font-medium">Solution:</h4>
              <div className="flex flex-wrap gap-1">
                {currentPuzzle.solution.map((move, index) => (
                  <Badge
                    key={index}
                    variant={index < solutionIndex ? "default" : index === solutionIndex ? "secondary" : "outline"}
                    className={index < solutionIndex ? "bg-green-500" : ""}
                  >
                    {index + 1}. {showHint || index < solutionIndex ? move : '?'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                className="w-full glass"
                disabled={puzzleStatus === 'completed'}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              
              <Button
                onClick={resetPuzzle}
                variant="outline"
                className="w-full glass"
              >
                Reset Puzzle
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={previousPuzzle}
                  variant="outline"
                  className="flex-1 glass"
                  disabled={currentPuzzleIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextPuzzle}
                  variant="outline"
                  className="flex-1 glass"
                  disabled={currentPuzzleIndex === PUZZLES.length - 1}
                >
                  <SkipForward className="w-4 h-4 mr-1" />
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Chess Board */}
        <Card className="glass-strong p-4 sm:p-6 flex-1 order-1 lg:order-2">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Solve the Puzzle</h3>
            <p className="text-sm text-muted-foreground">Click to select and move pieces</p>
          </div>
          <PuzzleBoardDisplay
            position={game.fen()}
            onSquareClick={onSquareClick}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
          />
        </Card>
      </div>
    </div>
  );
};