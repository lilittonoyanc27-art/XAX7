import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  User, 
  Brain, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sword,
  Shield,
  Crown,
  Cpu,
  Lightbulb,
  Navigation,
  ShieldCheck
} from 'lucide-react';

// --- Types ---
interface Question {
  id: number;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
  explanationAm: string;
}

// --- Data: 50 Diverse Spanish-Armenian Vocabulary Questions ---
const QUESTIONS: Question[] = [
  { id: 1, text: 'Ինչպե՞ս կլինի իսպաներեն «Հաց»:', options: ['Pan', 'Leche', 'Agua'], correct: 'Pan', explanation: '"Pan" es pan.', explanationAm: '«Pan» նշանակում է հաց:' },
  { id: 2, text: 'Ինչպե՞ս կլինի իսպաներեն «Ջուր»:', options: ['Vino', 'Agua', 'Jugo'], correct: 'Agua', explanation: '"Agua" es agua.', explanationAm: '«Agua» նշանակում է ջուր:' },
  { id: 3, text: 'Ինչպե՞ս կլինի իսպաներեն «Բարև»:', options: ['Adiós', 'Hola', 'Gracias'], correct: 'Hola', explanation: '"Hola" es hola.', explanationAm: '«Hola» նշանակում է բարև:' },
  { id: 4, text: 'Ինչպե՞ս կլինի իսպաներեն «Շնորհակալություն»:', options: ['De nada', 'Por favor', 'Gracias'], correct: 'Gracias', explanation: '"Gracias" es gracias.', explanationAm: '«Gracias» նշանակում է շնորհակալություն:' },
  { id: 5, text: 'Ինչպե՞ս կլինի իսպաներեն «Գիրք»:', options: ['Libro', 'Mesa', 'Silla'], correct: 'Libro', explanation: '"Libro" es libro.', explanationAm: '«Libro» նշանակում է գիրք:' },
  { id: 6, text: 'Ինչպե՞ս կլինի իսպաներեն «Տուն»:', options: ['Escuela', 'Casa', 'Calle'], correct: 'Casa', explanation: '"Casa" es casa.', explanationAm: '«Casa» նշանակում է տուն:' },
  { id: 7, text: 'Ինչպե՞ս կլինի իսպաներեն «Կատու»:', options: ['Perro', 'Gato', 'Pájaro'], correct: 'Gato', explanation: '"Gato" es gato.', explanationAm: '«Gato» նշանակում է կատու:' },
  { id: 8, text: 'Ինչպե՞ս կլինի իսպաներեն «Շուն»:', options: ['Gato', 'Perro', 'Caballo'], correct: 'Perro', explanation: '"Perro" es perro.', explanationAm: '«Perro» նշանակում է շուն:' },
  { id: 9, text: 'Ինչպե՞ս կլինի իսպաներեն «Խնձոր»:', options: ['Naranja', 'Manzana', 'Plátano'], correct: 'Manzana', explanation: '"Manzana" es manzana.', explanationAm: '«Manzana» նշանակում է խնձոր:' },
  { id: 10, text: 'Ինչպե՞ս կլինի իսպաներեն «Արև»:', options: ['Luna', 'Sol', 'Estrella'], correct: 'Sol', explanation: '"Sol" es sol.', explanationAm: '«Sol» նշանակում է արև:' },
  { id: 11, text: 'Ինչպե՞ս կլինի իսպաներեն «Լուսին»:', options: ['Sol', 'Luna', 'Cielo'], correct: 'Luna', explanation: '"Luna" es luna.', explanationAm: '«Luna» նշանակում է լուսին:' },
  { id: 12, text: 'Ինչպե՞ս կլինի իսպաներեն «Դպրոց»:', options: ['Hospital', 'Escuela', 'Tienda'], correct: 'Escuela', explanation: '"Escuela" es escuela.', explanationAm: '«Escuela» նշանակում է դպրոց:' },
  { id: 13, text: 'Ինչպե՞ս կլինի իսպաներեն «Ընկեր»:', options: ['Enemigo', 'Amigo', 'Hermano'], correct: 'Amigo', explanation: '"Amigo" es amigo.', explanationAm: '«Amigo» նշանակում է ընկեր:' },
  { id: 14, text: 'Ինչպե՞ս կլինի իսպաներեն «Կարմիր»:', options: ['Azul', 'Rojo', 'Verde'], correct: 'Rojo', explanation: '"Rojo" es rojo.', explanationAm: '«Rojo» նշանակում է կարմիր:' },
  { id: 15, text: 'Ինչպե՞ս կլինի իսպաներեն «Կապույտ»:', options: ['Rojo', 'Azul', 'Amarillo'], correct: 'Azul', explanation: '"Azul" es azul.', explanationAm: '«Azul» նշանակում է կապույտ:' },
  { id: 16, text: 'Ինչպե՞ս կլինի իսպաներեն «Կանաչ»:', options: ['Verde', 'Blanco', 'Negro'], correct: 'Verde', explanation: '"Verde" es verde.', explanationAm: '«Verde» նշանակում է կանաչ:' },
  { id: 17, text: 'Ինչպե՞ս կլինի իսպաներեն «Սպիտակ»:', options: ['Negro', 'Blanco', 'Gris'], correct: 'Blanco', explanation: '"Blanco" es blanco.', explanationAm: '«Blanco» նշանակում է սպիտակ:' },
  { id: 18, text: 'Ինչպե՞ս կլինի իսպաներեն «Սև»:', options: ['Blanco', 'Negro', 'Marrón'], correct: 'Negro', explanation: '"Negro" es negro.', explanationAm: '«Negro» նշանակում է սև:' },
  { id: 19, text: 'Ինչպե՞ս կլինի իսպաներեն «Մայր»:', options: ['Padre', 'Madre', 'Hija'], correct: 'Madre', explanation: '"Madre" es madre.', explanationAm: '«Madre» նշանակում է մայր:' },
  { id: 20, text: 'Ինչպե՞ս կլինի իսպաներեն «Հայր»:', options: ['Madre', 'Padre', 'Hijo'], correct: 'Padre', explanation: '"Padre" es padre.', explanationAm: '«Padre» նշանակում է հայր:' },
  { id: 21, text: 'Ինչպե՞ս կլինի իսպաներեն «Աղջիկ»:', options: ['Niño', 'Niña', 'Mujer'], correct: 'Niña', explanation: '"Niña" es niña.', explanationAm: '«Niña» նշանակում է աղջիկ:' },
  { id: 22, text: 'Ինչպե՞ս կլինի իսպաներեն «Տղա»:', options: ['Niña', 'Niño', 'Hombre'], correct: 'Niño', explanation: '"Niño" es niño.', explanationAm: '«Niño» նշանակում է տղա:' },
  { id: 23, text: 'Ինչպե՞ս կլինի իսպաներեն «Ժամանակ»:', options: ['Lugar', 'Tiempo', 'Mundo'], correct: 'Tiempo', explanation: '"Tiempo" es tiempo.', explanationAm: '«Tiempo» նշանակում է ժամանակ:' },
  { id: 24, text: 'Ինչպե՞ս կլինի իսպաներեն «Այո»:', options: ['No', 'Sí', 'Tal vez'], correct: 'Sí', explanation: '"Sí" es sí.', explanationAm: '«Sí» նշանակում է այո:' },
  { id: 25, text: 'Ինչպե՞ս կլինի իսպաներեն «Ոչ»:', options: ['Sí', 'No', 'Nunca'], correct: 'No', explanation: '"No" es no.', explanationAm: '«No» նշանակում է ոչ:' },
  { id: 26, text: 'Ինչպե՞ս կլինի իսպաներեն «Մեծ»:', options: ['Pequeño', 'Grande', 'Alto'], correct: 'Grande', explanation: '"Grande" es grande.', explanationAm: '«Grande» նշանակում է մեծ:' },
  { id: 27, text: 'Ինչպե՞ս կլինի իսպաներեն «Փոքր»:', options: ['Grande', 'Pequeño', 'Bajo'], correct: 'Pequeño', explanation: '"Pequeño" es pequeño.', explanationAm: '«Pequeño» նշանակում է փոքր:' },
  { id: 28, text: 'Ինչպե՞ս կլինի իսպաներեն «Այսօր»:', options: ['Mañana', 'Hoy', 'Ayer'], correct: 'Hoy', explanation: '"Hoy" es hoy.', explanationAm: '«Hoy» նշանակում է այսօր:' },
  { id: 29, text: 'Ինչպե՞ս կլինի իսպաներեն «Վաղը»:', options: ['Hoy', 'Mañana', 'Tarde'], correct: 'Mañana', explanation: '"Mañana" es mañana.', explanationAm: '«Mañana» նշանակում է վաղը:' },
  { id: 30, text: 'Ինչպե՞ս կլինի իսպաներեն «Երեկ»:', options: ['Hoy', 'Ayer', 'Noche'], correct: 'Ayer', explanation: '"Ayer" es ayer.', explanationAm: '«Ayer» նշանակում է երեկ:' },
  { id: 31, text: 'Ինչպե՞ս կլինի իսպաներեն «Սեր»:', options: ['Odio', 'Amor', 'Paz'], correct: 'Amor', explanation: '"Amor" es amor.', explanationAm: '«Amor» նշանակում է սեր:' },
  { id: 32, text: 'Ինչպե՞ս կլինի իսպաներեն «Աշխատանք»:', options: ['Juego', 'Trabajo', 'Descanso'], correct: 'Trabajo', explanation: '"Trabajo" es trabajo.', explanationAm: '«Trabajo» նշանակում է աշխատանք:' },
  { id: 33, text: 'Ինչպե՞ս կլինի իսպաներեն «Քաղաք»:', options: ['Campo', 'Ciudad', 'Pueblo'], correct: 'Ciudad', explanation: '"Ciudad" es ciudad.', explanationAm: '«Ciudad» նշանակում է քաղաք:' },
  { id: 34, text: 'Ինչպե՞ս կլինի իսպաներեն «Ճանապարհ»:', options: ['Puerta', 'Camino', 'Ventana'], correct: 'Camino', explanation: '"Camino" es camino.', explanationAm: '«Camino» նշանակում է ճանապարհ:' },
  { id: 35, text: 'Ինչպե՞ս կլինի իսպաներեն «Դուռ»:', options: ['Ventana', 'Puerta', 'Pared'], correct: 'Puerta', explanation: '"Puerta" es puerta.', explanationAm: '«Puerta» նշանակում է դուռ:' },
  { id: 36, text: 'Ինչպե՞ս կլինի իսպաներեն «Պատուհան»:', options: ['Puerta', 'Ventana', 'Techo'], correct: 'Ventana', explanation: '"Ventana" es ventana.', explanationAm: '«Ventana» նշանակում է պատուհան:' },
  { id: 37, text: 'Ինչպե՞ս կլինի իսպաներեն «Սեղան»:', options: ['Silla', 'Mesa', 'Cama'], correct: 'Mesa', explanation: '"Mesa" es mesa.', explanationAm: '«Mesa» նշանակում է սեղան:' },
  { id: 38, text: 'Ինչպե՞ս կլինի իսպաներեն «Աթոռ»:', options: ['Mesa', 'Silla', 'Sofá'], correct: 'Silla', explanation: '"Silla" es silla.', explanationAm: '«Silla» նշանակում է աթոռ:' },
  { id: 39, text: 'Ինչպե՞ս կլինի իսպաներեն «Քնել»:', options: ['Comer', 'Dormir', 'Beber'], correct: 'Dormir', explanation: '"Dormir" es dormir.', explanationAm: '«Dormir» նշանակում է քնել:' },
  { id: 40, text: 'Ինչպե՞ս կլինի իսպաներեն «Ուտել»:', options: ['Beber', 'Comer', 'Caminar'], correct: 'Comer', explanation: '"Comer" es comer.', explanationAm: '«Comer» նշանակում է ուտել:' },
  { id: 41, text: 'Ինչպե՞ս կլինի իսպաներեն «Խմել»:', options: ['Comer', 'Beber', 'Correr'], correct: 'Beber', explanation: '"Beber" es beber.', explanationAm: '«Beber» նշանակում է խմել:' },
  { id: 42, text: 'Ինչպե՞ս կլինի իսպաներեն «Գնալ»:', options: ['Venir', 'Ir', 'Estar'], correct: 'Ir', explanation: '"Ir" es ir.', explanationAm: '«Ir» նշանակում է գնալ:' },
  { id: 43, text: 'Ինչպե՞ս կլինի իսպաներեն «Գալ»:', options: ['Ir', 'Venir', 'Salir'], correct: 'Venir', explanation: '"Venir" es venir.', explanationAm: '«Venir» նշանակում է գալ:' },
  { id: 44, text: 'Ինչպե՞ս կլինի իսպաներեն «Երջանիկ»:', options: ['Triste', 'Feliz', 'Enojado'], correct: 'Feliz', explanation: '"Feliz" es feliz.', explanationAm: '«Feliz» նշանակում է երջանիկ:' },
  { id: 45, text: 'Ինչպե՞ս կլինի իսպաներեն «Տխուր»:', options: ['Feliz', 'Triste', 'Cansado'], correct: 'Triste', explanation: '"Triste" es triste.', explanationAm: '«Triste» նշանակում է տխուր:' },
  { id: 46, text: 'Ինչպե՞ս կլինի իսպաներեն «Շատ»:', options: ['Poco', 'Mucho', 'Nada'], correct: 'Mucho', explanation: '"Mucho" es mucho.', explanationAm: '«Mucho» նշանակում է շատ:' },
  { id: 47, text: 'Ինչպե՞ս կլինի իսպաներեն «Քիչ»:', options: ['Mucho', 'Poco', 'Todo'], correct: 'Poco', explanation: '"Poco" es poco.', explanationAm: '«Poco» նշանակում է քիչ:' },
  { id: 48, text: 'Ինչպե՞ս կլինի իսպաներեն «Ամեն ինչ»:', options: ['Nada', 'Todo', 'Algo'], correct: 'Todo', explanation: '"Todo" es todo.', explanationAm: '«Todo» նշանակում է ամեն ինչ:' },
  { id: 49, text: 'Ինչպե՞ս կլինի իսպաներեն «Ոչինչ»:', options: ['Todo', 'Nada', 'Casi'], correct: 'Nada', explanation: '"Nada" es nada.', explanationAm: '«Nada» նշանակում է ոչինչ:' },
  { id: 50, text: 'Ինչպե՞ս կլինի իսպաներեն «Լավ»:', options: ['Mal', 'Bien', 'Regular'], correct: 'Bien', explanation: '"Bien" es bien.', explanationAm: '«Bien» նշանակում է լավ:' }
];

// --- Piece Icons ---
const PieceIcon = ({ type, color }: { type: string, color: string }) => {
  const isWhite = color === 'w';
  const iconClass = isWhite ? 'text-orange-600 fill-orange-100' : 'text-slate-800 fill-slate-400';
  
  switch (type) {
    case 'k': return <Crown className={`w-8 h-8 ${iconClass}`} />;
    case 'q': return <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}><Crown className={`w-8 h-8 ${iconClass} opacity-80`} /></motion.div>;
    case 'r': return <Shield className={`w-7 h-7 ${iconClass}`} />;
    case 'b': return <Navigation className={`w-7 h-7 ${iconClass}`} />;
    case 'n': return <Sword className={`w-7 h-7 ${iconClass}`} />;
    case 'p': return <div className={`w-4 h-4 rounded-full ${isWhite ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-800 shadow-[0_0_10px_rgba(30,41,59,0.5)]'}`} />;
    default: return null;
  }
};

export default function ChessGrammarGame() {
  const [game, setGame] = useState(new Chess());
  const [moveCredit, setMoveCredit] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; messageAm: string } | null>(null);
  const [moveStatus, setMoveStatus] = useState<string>('Պատասխանիր հարցին, որպեսզի քայլ կատարես:');

  const isGameOver = game.isGameOver();
  const currentQuestion = QUESTIONS[currentQuestionIndex % QUESTIONS.length];

  // --- Computer Logic ---
  const makeComputerMove = useCallback(() => {
    if (game.isGameOver() || game.turn() !== 'b') return;

    setTimeout(() => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());
        const moves = gameCopy.moves();
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          gameCopy.move(randomMove);
          
          if (gameCopy.isGameOver()) {
            setMoveStatus('Խաղն ավարտվեց!');
          } else {
            setMoveStatus('Մրցակիցը կատարեց իր քայլը: Հաջորդ հարցը...');
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback(null);
            setSelectedOption(null);
          }
        }
        return gameCopy;
      });
    }, 1000);
  }, [game]);

  // --- User Logic ---
  const handleCellClick = (square: string) => {
    if (isGameOver || game.turn() !== 'w') return;
    
    if (!moveCredit) {
      setMoveStatus('Սխալ! Նախ պետք է ճիշտ պատասխանել հարցին:');
      return;
    }

    // If no square is selected, try to select a piece
    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        setMoveStatus('Ընտրիր թիրախային վանդակը:');
      }
      return;
    }

    // If a square is already selected, try to move
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: selectedSquare,
        to: square,
        promotion: 'q',
      });

      if (move) {
        setGame(gameCopy);
        setMoveCredit(false);
        setSelectedSquare(null);
        setMoveStatus('Քայլը կատարված է: Մրցակիցը մտածում է...');
        
        if (!gameCopy.isGameOver()) {
          makeComputerMove();
        } else {
          setMoveStatus('Խաղն ավարտվեց!');
        }
      } else {
        // If move is invalid, maybe try to select a different piece
        const piece = game.get(square as any);
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
        } else {
          setSelectedSquare(null);
          setMoveStatus('Անթույլատրելի քայլ: Փորձիր նորից:');
        }
      }
    } catch (e) {
      setSelectedSquare(null);
    }
  };

  const handleOptionClick = (option: string) => {
    if (feedback?.isCorrect || isGameOver || game.turn() !== 'w') return;
    
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correct;
    
    setFeedback({
      isCorrect,
      message: currentQuestion.explanation,
      messageAm: currentQuestion.explanationAm
    });

    if (isCorrect) {
      setMoveCredit(true);
      setMoveStatus('Ճիշտ է! Այժմ ընտրիր քո ֆիգուրը և կատարիր քայլդ:');
    } else {
      setMoveCredit(false);
      setMoveStatus('Սխալ պատասխան: Համակարգիչը կատարում է քայլը քո փոխարեն...');
      
      // Automatic random move for white if answer is wrong
      setTimeout(() => {
        setGame((prevGame) => {
          const gameCopy = new Chess(prevGame.fen());
          const moves = gameCopy.moves();
          if (moves.length > 0 && gameCopy.turn() === 'w') {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            gameCopy.move(randomMove);
            
            if (!gameCopy.isGameOver()) {
              setTimeout(() => {
                setGame((g) => {
                  const gCopy = new Chess(g.fen());
                  const bMoves = gCopy.moves();
                  if (bMoves.length > 0 && gCopy.turn() === 'b') {
                    const bMove = bMoves[Math.floor(Math.random() * bMoves.length)];
                    gCopy.move(bMove);
                    setMoveStatus('Մրցակիցը կատարեց իր քայլը: Հաջորդ հարցը...');
                    setCurrentQuestionIndex(prev => prev + 1);
                    setFeedback(null);
                    setSelectedOption(null);
                  }
                  return gCopy;
                });
              }, 1000);
            } else {
              setMoveStatus('Խաղն ավարտվեց!');
            }
          }
          return gameCopy;
        });
      }, 1500);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveCredit(false);
    setSelectedSquare(null);
    setCurrentQuestionIndex(0);
    setFeedback(null);
    setSelectedOption(null);
    setMoveStatus('Պատասխանիր հարցին, որպեսզի քայլ կատարես:');
  };

  // --- Board Rendering ---
  const board = useMemo(() => {
    const rows = [];
    const boardState = game.board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = String.fromCharCode(97 + j) + (8 - i);
        const piece = boardState[i][j];
        const isDark = (i + j) % 2 === 1;
        const isSelected = selectedSquare === square;
        
        // Check if it's a valid move target if a square is selected
        let isPossibleMove = false;
        if (selectedSquare) {
          const moves = game.moves({ square: selectedSquare as any, verbose: true });
          isPossibleMove = moves.some(m => m.to === square);
        }

        rows.push(
          <div 
            key={square}
            onClick={() => handleCellClick(square)}
            className={`
              relative flex items-center justify-center transition-all cursor-pointer aspect-square
              ${isDark ? 'bg-orange-100/50' : 'bg-white'}
              ${isSelected ? 'bg-emerald-200/60 ring-2 ring-emerald-500 z-10' : ''}
              ${isPossibleMove ? 'ring-2 ring-inset ring-orange-400 bg-orange-200/40' : ''}
              hover:bg-orange-50
            `}
          >
            <AnimatePresence>
              {piece && (
                <motion.div
                  layoutId={`piece-${piece.type}-${piece.color}-${square}`}
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="z-20 drop-shadow-md"
                >
                  <PieceIcon type={piece.type} color={piece.color} />
                </motion.div>
              )}
            </AnimatePresence>
            {isPossibleMove && !piece && (
              <div className="w-3 h-3 bg-orange-400/30 rounded-full" />
            )}
            <div className="absolute inset-0 border-[0.5px] border-orange-50/30 pointer-events-none" />
            {(i === 7) && <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold text-slate-300 uppercase">{String.fromCharCode(97 + j)}</span>}
            {(j === 0) && <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-slate-300 uppercase">{8 - i}</span>}
          </div>
        );
      }
    }
    return rows;
  }, [game, selectedSquare, moveCredit]);

  return (
    <div className="min-h-screen bg-[#fff7ed] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Header Section */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-orange-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
              <Sword className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">
                Շախմատային Բառապաշար
              </h1>
              <p className="text-orange-600 font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Սովորիր իսպաներեն և հաղթիր շախմատում
              </p>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <RefreshCw className="w-5 h-5" />
            Նոր Խաղ
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-12 grid lg:grid-cols-12 gap-8">
          
          {/* Chessboard Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`p-4 bg-white rounded-[2.5rem] shadow-2xl border-4 overflow-hidden aspect-square max-w-[600px] mx-auto relative transition-all duration-500 ${moveCredit ? 'border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.3)]' : 'border-orange-200'}`}>
              {isGameOver && (
                <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center text-white p-8 text-center rounded-[2rem]">
                  <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                  <h2 className="text-4xl font-black mb-2 uppercase tracking-widest">Խաղն Ավարտվեց</h2>
                  <p className="text-xl font-medium opacity-90 mb-8">
                    {game.isCheckmate() ? (game.turn() === 'w' ? 'Մրցակիցը հաղթեց!' : 'Դու հաղթեցիր!') : 'Ոչ-ոքի!'}
                  </p>
                  <button 
                    onClick={resetGame}
                    className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-50 transition-all"
                  >
                    Կրկին Փորձել
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-slate-800 rounded-xl overflow-hidden shadow-inner">
                {board}
              </div>
            </div>
            
            {/* Status Bar */}
            <div className={`p-4 rounded-2xl border-2 text-center font-bold text-sm uppercase tracking-wider transition-all ${moveCredit ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100' : 'bg-white border-orange-100 text-slate-400'}`}>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  {moveCredit ? <ShieldCheck className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                  {moveStatus}
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${game.turn() === 'w' ? 'bg-white border border-slate-300' : 'bg-slate-800'}`} />
                  <span className="text-[10px]">{game.turn() === 'w' ? 'Քո հերթն է' : 'Մրցակցի հերթն է'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Lightbulb className="w-24 h-24" />
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-black uppercase">
                  Հարց {currentQuestionIndex + 1}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={feedback?.isCorrect || isGameOver || game.turn() !== 'w'}
                    className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between group ${
                      selectedOption === option
                        ? option === currentQuestion.correct
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-white border-slate-100 hover:border-orange-300 text-slate-700 hover:bg-orange-50'
                    } ${feedback?.isCorrect && option !== currentQuestion.correct ? 'opacity-50' : ''}`}
                  >
                    {option}
                    {selectedOption === option && (
                      option === currentQuestion.correct 
                        ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        : <AlertCircle className="w-6 h-6 text-rose-500" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`mt-8 p-6 rounded-2xl border-2 ${
                      feedback.isCorrect 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedback.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                      )}
                      <div>
                        <p className="font-black text-lg mb-1">
                          {feedback.isCorrect ? 'Ճիշտ է!' : 'Սխալ է:'}
                        </p>
                        <p className="text-sm opacity-90 font-medium leading-relaxed">
                          {feedback.messageAm}
                        </p>
                        <p className="text-xs mt-2 italic opacity-70">
                          {feedback.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Players Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-3xl border-2 border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Դու (Սպիտակ)</p>
                  <p className="font-bold text-slate-900">Խաղացող</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-3xl border-2 border-orange-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Մրցակից (Սև)</p>
                  <p className="font-bold text-slate-900">Համակարգիչ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
