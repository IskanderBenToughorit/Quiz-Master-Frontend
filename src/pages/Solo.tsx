import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { QuizCategory, QuizQuestion, useTriviaQuestions } from '@/services/TriviaService';
import { userApi } from "@/lib/api"; 
import { useAuth } from "@/context/AuthContext"; 
// Updated categories to match requirements
const categories: QuizCategory[] = [
  "General Knowledge", 
  "Science", 
  "Geography", 
  "History", 
  "Sport & Leisure", 
  "Art & Literature"
];

const Solo = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>("General Knowledge");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const { user, token } = useAuth();
  // Fetch questions using React Query
  const { data: quizQuestions, isLoading, error } = useTriviaQuestions(selectedCategory);
  
  

  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (gameStarted && !isAnswered && !gameOver) {
      timerId = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            handleTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameStarted, isAnswered, gameOver]);

  const handleTimeout = () => {
    // If answer wasn't selected in time
    toast.error("Time's up!");
    setIsAnswered(true);
    
    // Auto proceed to next question after a delay
    setTimeout(() => {
      goToNextQuestion();
    }, 2000);
  };

  const startGame = () => {
    if (!quizQuestions || quizQuestions.length === 0) {
      toast.error("No questions available. Please try another category.");
      return;
    }
    
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered || !quizQuestions) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (option === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      toast.success("Correct answer!");
    } else {
      toast.error(`Wrong answer! The correct answer is ${currentQuestion.correctAnswer}`);
    }
    
    // Proceed to next question after a delay
    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const updateStatistics = async () => {
    if (!user || !token || !quizQuestions) return;
  
    const payload = {
      userId: user.id,
      mode: 'solo',
      category: selectedCategory,
      totalQuestions: quizQuestions.length,
      correctAnswers: score,
      win: score >= quizQuestions.length * 0.8
    };
  
    try {
      console.log("🔐 Token envoyé :", token);

      const response = await fetch('http://localhost:5000/api/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- ici
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update statistics');
      }
  
      console.log("✅ Statistiques mises à jour avec succès !");
    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour des statistiques :", error);
      throw new Error("Failed to update statistics");
    }
  };
  const goToNextQuestion = async () => {
    if (!quizQuestions) return;
  
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(15);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      await updateStatistics(); // 👈 ici !
      sessionStorage.setItem("refreshStats", "true");
      setGameOver(true);
    }
  };
  



  // Show loading state
  if (isLoading && !gameStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8 px-4 mx-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading questions...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error && !gameStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8 px-4 mx-auto flex items-center justify-center">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-4">Error Loading Questions</h2>
              <p className="text-center mb-6">
                We couldn't load questions at this time. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-quiz-primary hover:bg-quiz-secondary"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = quizQuestions?.[currentQuestionIndex];
  const progress = quizQuestions ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8 px-4 mx-auto">
        {!gameStarted && !gameOver ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="quiz-card">
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold text-center mb-6">Solo Quiz Mode</h1>
                <p className="text-center text-quiz-text/70 mb-8">
                  Test your knowledge with our solo quiz challenge. Choose a category and answer questions to earn points.
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Select Category:</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className={
                            selectedCategory === category 
                              ? "bg-quiz-primary hover:bg-quiz-secondary" 
                              : ""
                          }
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-quiz-primary/10 rounded-lg p-4 flex items-start">
                    <Info className="w-5 h-5 text-quiz-primary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-quiz-text">How to Play</h3>
                      <ul className="text-sm text-quiz-text/70 mt-1 space-y-1 list-disc list-inside">
                        <li>You'll have 15 seconds to answer each question</li>
                        <li>Correct answers earn you 1 point</li>
                        <li>No points for incorrect or timed-out answers</li>
                        <li>Complete all questions to see your final score</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startGame} 
                    className="w-full py-6 text-lg bg-quiz-primary hover:bg-quiz-secondary"
                    disabled={isLoading || !quizQuestions || quizQuestions.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Loading...
                      </>
                    ) : (
                      'Start Quiz'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : gameOver ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="quiz-card">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-quiz-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-quiz-primary" />
                </div>
                
                <h1 className="text-2xl font-bold text-center mb-2">Quiz Completed!</h1>
                <p className="text-center text-quiz-text/70 mb-6">
                  You've completed the quiz. Here's how you did:
                </p>
                
                <div className="w-full bg-quiz-primary/10 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-quiz-text/70">Score:</span>
                    <span className="font-bold text-xl">{score} / {quizQuestions?.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-quiz-text/70">Percentage:</span>
                    <span className="font-bold text-xl">
                      {quizQuestions ? Math.round((score / quizQuestions.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-quiz-text/70">Category:</span>
                    <span className="font-medium">{selectedCategory}</span>
                  </div>
                </div>
                
                <div className="flex gap-4 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setGameStarted(false);
                      setGameOver(false);
                    }}
                    className="flex-1"
                  >
                    Change Settings
                  </Button>
                  <Button 
                    onClick={startGame} 
                    className="flex-1 bg-quiz-primary hover:bg-quiz-secondary"
                  >
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          currentQuestion && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-quiz-text/70">
                    Question {currentQuestionIndex + 1} of {quizQuestions?.length}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <span>Score: {score}</span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-medium">Category: {selectedCategory}</div>
                <div className="flex items-center gap-2 bg-quiz-primary/10 text-quiz-primary px-3 py-1 rounded-full">
                  <Timer className="w-4 h-4" />
                  <span className="font-medium">{timeLeft}s</span>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="quiz-card mb-6">
                    <CardContent className="pt-6">
                      <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h2>
                      
                      <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => {
                          const isCorrect = option === currentQuestion.correctAnswer;
                          const isSelected = option === selectedOption;
                          
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              className={`justify-start text-left h-auto py-4 px-6 border-2 ${
                                isAnswered && isSelected
                                  ? isCorrect
                                    ? "border-quiz-correct bg-quiz-correct/10"
                                    : "border-quiz-incorrect bg-quiz-incorrect/10"
                                  : isAnswered && isCorrect
                                  ? "border-quiz-correct bg-quiz-correct/10"
                                  : ""
                              }`}
                              onClick={() => handleOptionSelect(option)}
                              disabled={isAnswered}
                            >
                              <div className="flex items-center w-full">
                                <span className="flex-1">{option}</span>
                                {isAnswered && isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-quiz-correct ml-2" />
                                )}
                                {isAnswered && isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-quiz-incorrect ml-2" />
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          )
        )}
      </main>
    </div>
  );
};

// Trophy icon component for the results screen
const Trophy = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14a2 2 0 0 0 4 0v-4h-4v4Z" />
    <path d="M18 9a6 6 0 0 1-12 0" />
    <path d="M12 12v6" />
    <path d="M12 18c-1.525 0-3.057.344-4 1-1.06-.741-2.394-1-4-1" />
  </svg>
);

export default Solo;