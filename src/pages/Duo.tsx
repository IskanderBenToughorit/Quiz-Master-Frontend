import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Chat from "@/components/Chat";
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Users, ChevronRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  availableCategories, 
  QuizCategory, 
  fetchTriviaQuestions, 
  QuizQuestion 
} from '@/services/triviaService';

const Duo = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, ended
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [opponent, setOpponent] = useState({
    name: 'Alex Smith',
    avatar: '/placeholder.svg',
    score: 0,
    answers: []
  });
  const [gameId, setGameId] = useState('duo-game-123');
  const [username, setUsername] = useState(user?.username || 'Player1');
  const [showCreatePrivateDialog, setShowCreatePrivateDialog] = useState(false);
  const [privateGameCode, setPrivateGameCode] = useState('');
  const [showJoinPrivateDialog, setShowJoinPrivateDialog] = useState(false);
  const [privateGameInput, setPrivateGameInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>("General Knowledge");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleAnswer(null);
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (isSearching && searchProgress < 100) {
      const timer = setTimeout(() => {
        setSearchProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15) + 5;
          return Math.min(newProgress, 100);
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (isSearching && searchProgress >= 100) {
      toast.success('Opponent found!');
      setIsSearching(false);
      setSearchProgress(0);
      loadQuestions();
    }
  }, [isSearching, searchProgress]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedQuestions = await fetchTriviaQuestions(selectedCategory);
      setQuestions(fetchedQuestions);
      startGame();
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      toast.error('Failed to load questions');
      setGameState('waiting');
    } finally {
      setIsLoading(false);
    }
  };

  const startSearching = () => {
    setIsSearching(true);
    setSearchProgress(0);
    toast(`Searching for an opponent in ${selectedCategory}...`, {
      duration: 2000,
    });
  };

  const cancelSearching = () => {
    setIsSearching(false);
    setSearchProgress(0);
    toast('Search cancelled', {
      duration: 2000,
    });
  };

  const createPrivateGame = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPrivateGameCode(code);
    setShowCreatePrivateDialog(true);
  };

  const startPrivateGame = () => {
    setShowCreatePrivateDialog(false);
    loadQuestions();
  };

  const joinPrivateGame = () => {
    if (!privateGameInput) {
      toast.error('Please enter a game code');
      return;
    }
    
    setShowJoinPrivateDialog(false);
    loadQuestions();
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
  };

  const handleAnswer = (selectedOption: number | null) => {
    if (!questions.length) return;
    
    const currentQuestionData = questions[currentQuestion];
    
    if (selectedOption !== null) {
      const selectedAnswerText = currentQuestionData.options[selectedOption];
      const isCorrect = selectedAnswerText === currentQuestionData.correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        toast.success('Correct!');
      } else {
        toast.error(`Incorrect! The correct answer was ${currentQuestionData.correctAnswer}.`);
      }
    } else {
      toast.error(`Time's up! The correct answer was ${currentQuestionData.correctAnswer}.`);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setGameState('ended');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto p-4 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-quiz-primary">Duo Mode</h1>
        
        {gameState === 'waiting' && (
          <Tabs defaultValue="quick-match" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="quick-match">Quick Match</TabsTrigger>
              <TabsTrigger value="private-match">Private Match</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick-match">
              <Card className="w-full mx-auto">
                <CardHeader>
                  <CardTitle>Quick Match</CardTitle>
                  <CardDescription>Find an opponent to play against instantly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Select Category:</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((category) => (
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
                  
                  {isSearching ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="Your Avatar" />
                          <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "P1"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg font-semibold">You</h2>
                          <p className="text-gray-500">Ready to play</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={searchProgress} className="h-2" />
                        <p className="text-sm text-gray-500 mt-2">Finding an opponent in {selectedCategory}... {searchProgress}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="h-16 w-16 mx-auto mb-4 text-quiz-primary" />
                      <h3 className="text-xl font-semibold mb-2">Ready to challenge someone?</h3>
                      <p className="text-gray-500 mb-4">Click "Find Match" to be paired with another player in your selected category.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  {isSearching ? (
                    <Button variant="outline" onClick={cancelSearching}>Cancel</Button>
                  ) : (
                    <Button className="bg-quiz-primary hover:bg-quiz-secondary" onClick={startSearching}>
                      Find Match
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="private-match">
              <Card className="w-full mx-auto">
                <CardHeader>
                  <CardTitle>Private Match</CardTitle>
                  <CardDescription>Play with a friend using a private game code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Select Category:</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((category) => (
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
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Lock className="mr-2 h-4 w-4" /> Create Game
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center py-4">
                        <p className="mb-4">Generate a code and share it with your friend</p>
                      </CardContent>
                      <CardFooter className="pt-0 justify-center">
                        <Button className="bg-quiz-primary" onClick={createPrivateGame}>
                          Create Private Game
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Join Game
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center py-4">
                        <p className="mb-4">Enter a code to join your friend's game</p>
                      </CardContent>
                      <CardFooter className="pt-0 justify-center">
                        <Button onClick={() => setShowJoinPrivateDialog(true)}>
                          Join Private Game
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {isLoading && (
          <div className="w-full flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-quiz-primary mb-4" />
              <p className="text-lg">Loading questions for {selectedCategory}...</p>
            </div>
          </div>
        )}
        
        {error && (
          <Card className="w-[80%] mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setGameState('waiting')}>
                Back to Lobby
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {gameState === 'playing' && questions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestion + 1}/{questions.length}</CardTitle>
                  <CardDescription>Time left: {timeLeft}s</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium">Category: {selectedCategory}</div>
                  </div>
                  <p className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</p>
                  <div className="space-y-2">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button key={index} variant="outline" className="w-full" onClick={() => handleAnswer(index)}>
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              {/* Player stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="Your Avatar" />
                      <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "P1"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">{user?.username || "You"}</h2>
                      <p className="text-gray-500">Score: {score}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Chat roomId={gameId} username={user?.username || username} />
            </div>
          </div>
        )}
        
        {gameState === 'ended' && (
          <Card className="w-[80%] mx-auto">
            <CardHeader>
              <CardTitle>Game Over!</CardTitle>
              <CardDescription>Your final score: {score}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Thanks for playing in {selectedCategory}!</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setGameState('waiting')}>
                Back to Lobby
              </Button>
              <Button onClick={() => setGameState('waiting')} className="bg-quiz-primary">
                Play Again
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      {/* Create Private Game Dialog */}
      <Dialog open={showCreatePrivateDialog} onOpenChange={setShowCreatePrivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Private Game Created</DialogTitle>
            <DialogDescription>
              Share this code with your friend to join the game
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 text-center rounded-md">
              <span className="text-2xl font-bold tracking-widest">{privateGameCode}</span>
            </div>
            <p className="text-sm text-center mt-2">
              Your friend needs to enter this code to join your game
            </p>
            <p className="text-sm text-center mt-2 font-medium">
              Category: {selectedCategory}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              navigator.clipboard.writeText(privateGameCode);
              toast.success('Code copied to clipboard!');
            }} variant="outline">
              Copy Code
            </Button>
            <Button onClick={startPrivateGame} className="bg-quiz-primary">
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Private Game Dialog */}
      <Dialog open={showJoinPrivateDialog} onOpenChange={setShowJoinPrivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Private Game</DialogTitle>
            <DialogDescription>
              Enter the code provided by your friend
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter game code"
              value={privateGameInput}
              onChange={(e) => setPrivateGameInput(e.target.value.toUpperCase())}
              className="text-center text-lg tracking-widest font-bold"
              maxLength={6}
            />
            <p className="text-sm text-center mt-4">
              You will join a game in the <span className="font-medium">{selectedCategory}</span> category
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinPrivateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={joinPrivateGame} className="bg-quiz-primary">
              Join Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Duo;
