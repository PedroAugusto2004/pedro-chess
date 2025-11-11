import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Crown, 
  Castle, 
  Sword, 
  Target, 
  ChevronRight,
  CheckCircle,
  Lock,
  Play
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  category: 'basics' | 'tactics' | 'strategy' | 'endgame';
  prerequisites?: string[];
  content: {
    theory: string[];
    examples: string[];
    exercises: string[];
  };
  completed?: boolean;
}

const LESSONS: Lesson[] = [
  // Basics
  {
    id: 'basics-1',
    title: 'How Chess Pieces Move',
    description: 'Learn the basic movement patterns of all chess pieces.',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'basics',
    content: {
      theory: [
        'The pawn moves forward one square, or two on its first move.',
        'The rook moves horizontally and vertically any number of squares.',
        'The bishop moves diagonally any number of squares.',
        'The queen combines rook and bishop movements.',
        'The king moves one square in any direction.',
        'The knight moves in an L-shape: two squares in one direction, then one perpendicular.'
      ],
      examples: [
        'Watch how each piece captures differently',
        'Special moves: castling, en passant, promotion',
        'Piece values: Queen=9, Rook=5, Bishop/Knight=3, Pawn=1'
      ],
      exercises: [
        'Practice moving each piece type',
        'Identify valid moves for pieces in different positions',
        'Calculate total piece values in given positions'
      ]
    }
  },
  {
    id: 'basics-2',
    title: 'Check, Checkmate, and Stalemate',
    description: 'Understand the three ways a chess game can end.',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'basics',
    prerequisites: ['basics-1'],
    content: {
      theory: [
        'Check: The king is under attack and must move to safety.',
        'Checkmate: The king is under attack with no legal moves.',
        'Stalemate: No legal moves available, but the king is not in check.',
        'Three ways to escape check: move the king, block, or capture the attacking piece.',
        'The game ends immediately when checkmate is achieved.'
      ],
      examples: [
        'Basic back-rank mate patterns',
        'Stalemate tricks to avoid losing positions',
        'Common checkmate patterns with queen and rook'
      ],
      exercises: [
        'Identify check, checkmate, and stalemate positions',
        'Find all ways to escape from check',
        'Practice delivering checkmate in one move'
      ]
    }
  },
  
  // Tactics
  {
    id: 'tactics-1',
    title: 'Pins and Skewers',
    description: 'Master these fundamental tactical motifs.',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'tactics',
    prerequisites: ['basics-1', 'basics-2'],
    content: {
      theory: [
        'A pin prevents a piece from moving because it would expose a more valuable piece.',
        'A skewer forces a valuable piece to move, exposing a less valuable piece behind it.',
        'Absolute pins involve the king and cannot be broken.',
        'Relative pins can be broken but at a cost.',
        'Use long-range pieces (bishops, rooks, queens) to create pins and skewers.'
      ],
      examples: [
        'Bishop pinning a knight to the king',
        'Rook skewering king and queen',
        'Creating pins with discovered attacks'
      ],
      exercises: [
        'Spot pin opportunities in various positions',
        'Execute skewer tactics to win material',
        'Defend against pins and skewers'
      ]
    }
  },
  {
    id: 'tactics-2',
    title: 'Forks and Double Attacks',
    description: 'Learn to attack multiple targets simultaneously.',
    difficulty: 'intermediate',
    duration: '18 min',
    category: 'tactics',
    prerequisites: ['basics-1', 'basics-2'],
    content: {
      theory: [
        'A fork attacks two or more pieces simultaneously.',
        'Knights are excellent forking pieces due to their unique movement.',
        'Double attacks can involve checks for extra forcing power.',
        'Look for loose pieces (undefended pieces) as fork targets.',
        'Pawn forks are common and powerful in the opening and middlegame.'
      ],
      examples: [
        'Knight fork attacking king and queen',
        'Pawn fork winning a piece',
        'Queen fork with check forcing material gain'
      ],
      exercises: [
        'Find knight fork opportunities',
        'Execute pawn forks in pawn endings',
        'Create double attack combinations'
      ]
    }
  },

  // Strategy
  {
    id: 'strategy-1',
    title: 'Opening Principles',
    description: 'Fundamental principles for the opening phase.',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'strategy',
    prerequisites: ['basics-1', 'basics-2'],
    content: {
      theory: [
        'Control the center with pawns and pieces.',
        'Develop knights before bishops.',
        'Castle early to ensure king safety.',
        'Don\'t move the same piece twice in the opening.',
        'Don\'t bring your queen out too early.',
        'Connect your rooks by completing development.'
      ],
      examples: [
        'Italian Game: rapid development and center control',
        'Common opening mistakes and how to punish them',
        'Piece coordination in the opening'
      ],
      exercises: [
        'Practice applying opening principles in games',
        'Identify opening principle violations',
        'Analyze famous opening games'
      ]
    }
  },
  {
    id: 'strategy-2',
    title: 'Pawn Structure Basics',
    description: 'Understanding pawn formations and their strategic implications.',
    difficulty: 'advanced',
    duration: '30 min',
    category: 'strategy',
    prerequisites: ['strategy-1'],
    content: {
      theory: [
        'Pawn chains provide structure and control key squares.',
        'Isolated pawns are weak but can provide piece activity.',
        'Doubled pawns are generally bad but can control important squares.',
        'Passed pawns become more valuable in the endgame.',
        'Pawn breaks are crucial for creating counterplay.'
      ],
      examples: [
        'French Defense pawn structure',
        'Caro-Kann pawn formation benefits',
        'King\'s Indian Attack setup'
      ],
      exercises: [
        'Evaluate pawn structures in master games',
        'Find optimal pawn breaks',
        'Convert pawn structure advantages'
      ]
    }
  },

  // Endgame
  {
    id: 'endgame-1',
    title: 'Basic King and Pawn Endings',
    description: 'Master the fundamental endgame knowledge.',
    difficulty: 'intermediate',
    duration: '22 min',
    category: 'endgame',
    prerequisites: ['basics-1', 'basics-2'],
    content: {
      theory: [
        'The opposition: controlling key squares with your king.',
        'King and pawn vs. king: winning and drawing positions.',
        'The square of the pawn determines if the king can catch it.',
        'Triangulation: losing a tempo to improve your position.',
        'Breakthrough combinations in pawn endings.'
      ],
      examples: [
        'Basic king and pawn vs. king positions',
        'Opposition in practice',
        'Multi-pawn endings and pawn races'
      ],
      exercises: [
        'Calculate king and pawn endings',
        'Practice achieving opposition',
        'Solve complex pawn endgame studies'
      ]
    }
  },
  {
    id: 'endgame-2',
    title: 'Rook Endgames',
    description: 'Navigate the most common endgame type.',
    difficulty: 'advanced',
    duration: '35 min',
    category: 'endgame',
    prerequisites: ['endgame-1'],
    content: {
      theory: [
        'Rook and pawn vs. rook: Lucena and Philidor positions.',
        'The importance of rook activity and king position.',
        'Cut off the opposing king with your rook.',
        'Building a bridge in rook and pawn endings.',
        'Rook on the 7th rank advantages.'
      ],
      examples: [
        'Classic Lucena position win',
        'Philidor position defensive setup',
        'Rook and two pawns vs. rook winning technique'
      ],
      exercises: [
        'Practice Lucena position technique',
        'Master Philidor defensive method',
        'Solve practical rook endgame positions'
      ]
    }
  }
];

const categoryIcons = {
  basics: BookOpen,
  tactics: Sword,
  strategy: Target,
  endgame: Crown
};

const difficultyColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-orange-500',
  expert: 'bg-red-500'
};

export const LessonsSection = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(['basics-1']));
  const [activeTab, setActiveTab] = useState('theory');

  const isLessonUnlocked = (lesson: Lesson) => {
    if (!lesson.prerequisites) return true;
    return lesson.prerequisites.every(prereq => completedLessons.has(prereq));
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const getCategoryLessons = (category: string) => {
    return LESSONS.filter(lesson => lesson.category === category);
  };

  const getProgressForCategory = (category: string) => {
    const categoryLessons = getCategoryLessons(category);
    const completed = categoryLessons.filter(lesson => completedLessons.has(lesson.id)).length;
    return (completed / categoryLessons.length) * 100;
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const unlocked = isLessonUnlocked(lesson);
    const completed = completedLessons.has(lesson.id);
    
    return (
      <Card 
        className={`glass p-4 cursor-pointer transition-all duration-200 ${
          unlocked ? 'hover:shadow-glass-lg' : 'opacity-50'
        } ${selectedLesson?.id === lesson.id ? 'ring-2 ring-primary' : ''}`}
        onClick={() => unlocked && setSelectedLesson(lesson)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{lesson.title}</h3>
              {completed && <CheckCircle className="w-4 h-4 text-green-500" />}
              {!unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <div className={`w-2 h-2 rounded-full mr-1 ${difficultyColors[lesson.difficulty]}`} />
                {lesson.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-xs">{lesson.duration}</Badge>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-2" />
        </div>
      </Card>
    );
  };

  const CategorySection = ({ category }: { category: keyof typeof categoryIcons }) => {
    const Icon = categoryIcons[category];
    const lessons = getCategoryLessons(category);
    const progress = getProgressForCategory(category);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
          </div>
          <Badge variant="secondary" className="glass">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid gap-3">
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    );
  };

  if (selectedLesson) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedLesson(null)}
            className="glass"
          >
            ← Back to Lessons
          </Button>
          {!completedLessons.has(selectedLesson.id) && (
            <Button 
              onClick={() => completeLesson(selectedLesson.id)}
              className="glass-strong"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}
        </div>

        <Card className="glass-strong p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{selectedLesson.title}</h1>
              <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <div className={`w-2 h-2 rounded-full mr-1 ${difficultyColors[selectedLesson.difficulty]}`} />
                  {selectedLesson.difficulty}
                </Badge>
                <Badge variant="secondary">{selectedLesson.duration}</Badge>
                <Badge variant="secondary" className="capitalize">{selectedLesson.category}</Badge>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theory" className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Theory</h3>
                <div className="space-y-3">
                  {selectedLesson.content.theory.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Examples</h3>
                <div className="space-y-3">
                  {selectedLesson.content.examples.map((example, index) => (
                    <Card key={index} className="glass p-4">
                      <div className="flex items-start gap-3">
                        <Play className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm">{example}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="exercises" className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Exercises</h3>
                <div className="space-y-3">
                  {selectedLesson.content.exercises.map((exercise, index) => (
                    <Card key={index} className="glass p-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm">{exercise}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Chess Lessons</h2>
        <p className="text-muted-foreground">
          Master chess step by step with structured lessons from basics to advanced concepts
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="glass">
            {completedLessons.size} of {LESSONS.length} Completed
          </Badge>
          <Badge variant="secondary" className="glass">
            {Math.round((completedLessons.size / LESSONS.length) * 100)}% Progress
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(categoryIcons).map(category => (
          <CategorySection key={category} category={category as keyof typeof categoryIcons} />
        ))}
      </div>
    </div>
  );
};