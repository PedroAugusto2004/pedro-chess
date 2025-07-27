import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      app_name: "Pedro Chess",
      app_subtitle: "Master the game",
      play: "Play",
      puzzles: "Puzzles",
      lessons: "Lessons",
      play_description: "Play against AI",
      puzzles_description: "Solve tactics",
      lessons_description: "Learn chess",
      
      // Game
      white_to_move: "White to move",
      black_to_move: "Black to move",
      check: "Check!",
      checkmate: "Checkmate!",
      draw: "Draw!",
      game_over: "Game Over!",
      wins_by_checkmate: "{{winner}} wins by checkmate!",
      game_is_draw: "The game is a draw!",
      new_game: "New Game",
      board_reset: "The board has been reset. Good luck!",
      ai_thinking: "AI Thinking...",
      you: "You",
      pedro_ai: "Pedro AI",
      ai_difficulty: "AI Difficulty",
      
      // Difficulties
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
      
      // Chess Board
      pedro_chess_board: "Pedro Chess Board",
      click_instruction: "Click a piece to select, then click destination",
      
      // Puzzles
      chess_puzzles: "Chess Puzzles",
      improve_tactical_skills: "Improve your tactical skills with carefully curated puzzles",
      puzzle_of: "Puzzle {{current}} of {{total}}",
      solved: "Solved",
      puzzle_solved: "Puzzle Solved! 🎉",
      great_job_solved: "Great job! You solved \"{{name}}\".",
      correct_move: "Correct Move!",
      keep_going: "Keep going to complete the puzzle.",
      not_quite_right: "Not quite right",
      try_again_hint: "Try again or use a hint.",
      solve_puzzle: "Solve the Puzzle",
      click_select_move: "Click to select and move pieces",
      progress: "Progress",
      solution: "Solution:",
      show_hint: "Show Hint",
      hide_hint: "Hide Hint",
      reset_puzzle: "Reset Puzzle",
      previous: "Previous",
      next: "Next",
      
      // Lessons
      chess_lessons: "Chess Lessons",
      master_step_by_step: "Master chess step by step with structured lessons from basics to advanced concepts",
      of_completed: "{{completed}} of {{total}} Completed",
      progress_percent: "{{percent}}% Progress",
      back_to_lessons: "← Back to Lessons",
      mark_complete: "Mark Complete",
      theory: "Theory",
      examples: "Examples",
      exercises: "Exercises",
      complete: "Complete",
      
      // Categories
      basics: "Basics",
      tactics: "Tactics",
      strategy: "Strategy",
      endgame: "Endgame",
      
      // Theme
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      
      // Language
      language: "Language",
      english: "English",
      portuguese: "Português",
      spanish: "Español",
      
      // Puzzle themes
      checkmate_in_1: "Checkmate in 1",
      fork: "Fork",
      pin: "Pin",
      sacrifice: "Sacrifice",
      
      // Lesson titles
      how_pieces_move: "How Chess Pieces Move",
      check_checkmate_stalemate: "Check, Checkmate, and Stalemate",
      pins_and_skewers: "Pins and Skewers",
      forks_double_attacks: "Forks and Double Attacks",
      opening_principles: "Opening Principles",
      pawn_structure_basics: "Pawn Structure Basics",
      basic_king_pawn_endings: "Basic King and Pawn Endings",
      rook_endgames: "Rook Endgames"
    }
  },
  pt: {
    translation: {
      // Navigation
      app_name: "Pedro Chess",
      app_subtitle: "Domine o jogo",
      play: "Jogar",
      puzzles: "Quebra-cabeças",
      lessons: "Lições",
      play_description: "Jogue contra IA",
      puzzles_description: "Resolva táticas",
      lessons_description: "Aprenda xadrez",
      
      // Game
      white_to_move: "Brancas jogam",
      black_to_move: "Pretas jogam",
      check: "Xeque!",
      checkmate: "Xeque-mate!",
      draw: "Empate!",
      game_over: "Fim de Jogo!",
      wins_by_checkmate: "{{winner}} vence por xeque-mate!",
      game_is_draw: "O jogo terminou em empate!",
      new_game: "Novo Jogo",
      board_reset: "O tabuleiro foi reiniciado. Boa sorte!",
      ai_thinking: "IA Pensando...",
      you: "Você",
      pedro_ai: "Pedro IA",
      ai_difficulty: "Dificuldade da IA",
      
      // Difficulties
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
      expert: "Especialista",
      
      // Chess Board
      pedro_chess_board: "Tabuleiro Pedro Chess",
      click_instruction: "Clique em uma peça para selecioná-la, depois clique no destino",
      
      // Puzzles
      chess_puzzles: "Quebra-cabeças de Xadrez",
      improve_tactical_skills: "Melhore suas habilidades táticas com quebra-cabeças cuidadosamente selecionados",
      puzzle_of: "Quebra-cabeça {{current}} de {{total}}",
      solved: "Resolvidos",
      puzzle_solved: "Quebra-cabeça Resolvido! 🎉",
      great_job_solved: "Ótimo trabalho! Você resolveu \"{{name}}\".",
      correct_move: "Movimento Correto!",
      keep_going: "Continue para completar o quebra-cabeça.",
      not_quite_right: "Não exatamente",
      try_again_hint: "Tente novamente ou use uma dica.",
      solve_puzzle: "Resolva o Quebra-cabeça",
      click_select_move: "Clique para selecionar e mover peças",
      progress: "Progresso",
      solution: "Solução:",
      show_hint: "Mostrar Dica",
      hide_hint: "Esconder Dica",
      reset_puzzle: "Reiniciar Quebra-cabeça",
      previous: "Anterior",
      next: "Próximo",
      
      // Lessons
      chess_lessons: "Lições de Xadrez",
      master_step_by_step: "Domine o xadrez passo a passo com lições estruturadas do básico aos conceitos avançados",
      of_completed: "{{completed}} de {{total}} Concluídas",
      progress_percent: "{{percent}}% de Progresso",
      back_to_lessons: "← Voltar às Lições",
      mark_complete: "Marcar como Concluída",
      theory: "Teoria",
      examples: "Exemplos",
      exercises: "Exercícios",
      complete: "Concluída",
      
      // Categories
      basics: "Básico",
      tactics: "Táticas",
      strategy: "Estratégia",
      endgame: "Final de Jogo",
      
      // Theme
      theme: "Tema",
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
      
      // Language
      language: "Idioma",
      english: "English",
      portuguese: "Português",
      spanish: "Español",
      
      // Puzzle themes
      checkmate_in_1: "Mate em 1",
      fork: "Garfo",
      pin: "Pregadura",
      sacrifice: "Sacrifício",
      
      // Lesson titles
      how_pieces_move: "Como as Peças de Xadrez se Movem",
      check_checkmate_stalemate: "Xeque, Xeque-mate e Afogamento",
      pins_and_skewers: "Pregaduras e Espetos",
      forks_double_attacks: "Garfos e Ataques Duplos",
      opening_principles: "Princípios da Abertura",
      pawn_structure_basics: "Básicos da Estrutura de Peões",
      basic_king_pawn_endings: "Finais Básicos de Rei e Peão",
      rook_endgames: "Finais de Torre"
    }
  },
  es: {
    translation: {
      // Navigation
      app_name: "Pedro Chess",
      app_subtitle: "Domina el juego",
      play: "Jugar",
      puzzles: "Puzzles",
      lessons: "Lecciones",
      play_description: "Jugar contra IA",
      puzzles_description: "Resolver tácticas",
      lessons_description: "Aprender ajedrez",
      
      // Game
      white_to_move: "Juegan blancas",
      black_to_move: "Juegan negras",
      check: "¡Jaque!",
      checkmate: "¡Jaque mate!",
      draw: "¡Empate!",
      game_over: "¡Fin del Juego!",
      wins_by_checkmate: "¡{{winner}} gana por jaque mate!",
      game_is_draw: "¡El juego terminó en empate!",
      new_game: "Nuevo Juego",
      board_reset: "El tablero ha sido reiniciado. ¡Buena suerte!",
      ai_thinking: "IA Pensando...",
      you: "Tú",
      pedro_ai: "Pedro IA",
      ai_difficulty: "Dificultad de la IA",
      
      // Difficulties
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      expert: "Experto",
      
      // Chess Board
      pedro_chess_board: "Tablero Pedro Chess",
      click_instruction: "Haz clic en una pieza para seleccionarla, luego haz clic en el destino",
      
      // Puzzles
      chess_puzzles: "Puzzles de Ajedrez",
      improve_tactical_skills: "Mejora tus habilidades tácticas con puzzles cuidadosamente seleccionados",
      puzzle_of: "Puzzle {{current}} de {{total}}",
      solved: "Resueltos",
      puzzle_solved: "¡Puzzle Resuelto! 🎉",
      great_job_solved: "¡Buen trabajo! Resolviste \"{{name}}\".",
      correct_move: "¡Movimiento Correcto!",
      keep_going: "Continúa para completar el puzzle.",
      not_quite_right: "No exactamente",
      try_again_hint: "Inténtalo de nuevo o usa una pista.",
      solve_puzzle: "Resuelve el Puzzle",
      click_select_move: "Haz clic para seleccionar y mover piezas",
      progress: "Progreso",
      solution: "Solución:",
      show_hint: "Mostrar Pista",
      hide_hint: "Ocultar Pista",
      reset_puzzle: "Reiniciar Puzzle",
      previous: "Anterior",
      next: "Siguiente",
      
      // Lessons
      chess_lessons: "Lecciones de Ajedrez",
      master_step_by_step: "Domina el ajedrez paso a paso con lecciones estructuradas desde lo básico hasta conceptos avanzados",
      of_completed: "{{completed}} de {{total}} Completadas",
      progress_percent: "{{percent}}% de Progreso",
      back_to_lessons: "← Volver a Lecciones",
      mark_complete: "Marcar como Completada",
      theory: "Teoría",
      examples: "Ejemplos",
      exercises: "Ejercicios",
      complete: "Completada",
      
      // Categories
      basics: "Básicos",
      tactics: "Tácticas",
      strategy: "Estrategia",
      endgame: "Final de Partida",
      
      // Theme
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      
      // Language
      language: "Idioma",
      english: "English",
      portuguese: "Português",
      spanish: "Español",
      
      // Puzzle themes
      checkmate_in_1: "Mate en 1",
      fork: "Tenedor",
      pin: "Clavada",
      sacrifice: "Sacrificio",
      
      // Lesson titles
      how_pieces_move: "Cómo se Mueven las Piezas de Ajedrez",
      check_checkmate_stalemate: "Jaque, Jaque Mate y Ahogado",
      pins_and_skewers: "Clavadas y Enfiladas",
      forks_double_attacks: "Tenedores y Ataques Dobles",
      opening_principles: "Principios de Apertura",
      pawn_structure_basics: "Básicos de Estructura de Peones",
      basic_king_pawn_endings: "Finales Básicos de Rey y Peón",
      rook_endgames: "Finales de Torre"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;