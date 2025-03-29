import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chat from "@/components/Chat";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, MessageSquare, Clock, Check, X, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import TournamentList from '@/components/TournamentList';
import { useAuth } from '@/context/AuthContext';
import { tournamentApi } from '@/lib/api';
import { QuizCategory, availableCategories } from '@/services/TriviaService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Tournament = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isCreatingTournament, setIsCreatingTournament] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [playerLimit, setPlayerLimit] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isTournamentPrivate, setIsTournamentPrivate] = useState(false);
  const [quizCategory, setQuizCategory] = useState<QuizCategory>("General Knowledge");
  const [activeTab, setActiveTab] = useState("public");

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('You must be logged in to create a tournament');
      navigate('/login');
      return;
    }
    
    if (!tournamentName) {
      toast.error('Please enter a tournament name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Include the selected category in tournament data
      const tournamentData = {
        name: tournamentName,
        description: 'Created via quiz app',
        quizId: '64f589e5c1a4c5d8c2d83e15', // Example quiz ID
        isPrivate,
        minPlayers: 2,
        maxPlayers: playerLimit,
        category: quizCategory
      };
      
      const response = await tournamentApi.create(tournamentData, token);
      
      toast.success('Tournament created successfully!');
      setIsCreatingTournament(false);
      setTournamentName('');
      setPlayerLimit(4);
      setIsPrivate(false);
      
      // Redirect to tournament lobby page
      navigate(`/tournament/${response.tournament._id}`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error('Failed to create tournament. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTournament = (tournamentId, isPrivate = false) => {
    if (!token) {
      toast.error('You must be logged in to join a tournament');
      navigate('/login');
      return;
    }
    
    setSelectedTournamentId(tournamentId);
    setIsTournamentPrivate(isPrivate);
    
    if (isPrivate) {
      setShowJoinDialog(true);
    } else {
      joinTournament(tournamentId, null);
    }
  };
  
  const joinTournament = async (tournamentId, accessCode = null) => {
    try {
      setIsLoading(true);
      
      const response = await tournamentApi.join(tournamentId, accessCode, token);
      
      toast.success('Successfully joined the tournament!');
      setShowJoinDialog(false);
      setPasswordInput('');
      
      // Redirect to tournament lobby
      navigate(`/tournament/${tournamentId}`);
    } catch (error) {
      console.error("Error joining tournament:", error);
      toast.error(error.message || 'Failed to join tournament');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmJoin = () => {
    joinTournament(selectedTournamentId, passwordInput);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-quiz-primary flex items-center">
              <Trophy className="mr-2 h-6 w-6" /> Tournament Mode
            </h1>
            <Button 
              onClick={() => setIsCreatingTournament(!isCreatingTournament)}
              className="bg-quiz-primary hover:bg-quiz-secondary"
            >
              {isCreatingTournament ? 'Cancel' : 'Create Tournament'}
            </Button>
          </div>
          
          {isCreatingTournament ? (
            <Card className="quiz-card border-0">
              <CardHeader>
                <CardTitle>Create New Tournament</CardTitle>
                <CardDescription>Set up your tournament preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="tournamentName" className="text-sm font-medium">
                      Tournament Name
                    </label>
                    <Input
                      id="tournamentName"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder="My Awesome Quiz Tournament"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Quiz Category
                    </label>
                    <Select 
                      value={quizCategory} 
                      onValueChange={(value: QuizCategory) => setQuizCategory(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="playerLimit" className="text-sm font-medium">
                      Player Limit (4-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPlayerLimit(Math.max(4, playerLimit - 1))}
                        disabled={playerLimit <= 4}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{playerLimit}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPlayerLimit(Math.min(10, playerLimit + 1))}
                        disabled={playerLimit >= 10}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium mr-4">Tournament Type:</label>
                    <Button
                      type="button"
                      variant={!isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(false)}
                      className={!isPrivate ? "bg-quiz-primary" : ""}
                    >
                      <Unlock className="mr-2 h-4 w-4" /> Public
                    </Button>
                    <Button
                      type="button"
                      variant={isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(true)}
                      className={isPrivate ? "bg-quiz-primary" : ""}
                    >
                      <Lock className="mr-2 h-4 w-4" /> Private
                    </Button>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreatingTournament(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-quiz-primary hover:bg-quiz-secondary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Tournament"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs 
              defaultValue="public" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="public">Public Tournaments</TabsTrigger>
                <TabsTrigger value="all">All Tournaments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="public">
                <TournamentList onJoinTournament={handleJoinTournament} includePrivate={false} />
              </TabsContent>
              
              <TabsContent value="all">
                <TournamentList onJoinTournament={handleJoinTournament} includePrivate={true} />
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3 mt-4 md:mt-0"
        >
          <Card className="quiz-card border-0 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Tournament Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-160px)]">
              <Chat roomId="tournament-lobby" username={user?.username || 'Guest'} />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Join Private Tournament Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Tournament Password</DialogTitle>
            <DialogDescription>
              This is a private tournament. Please enter the access code to join.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Access code"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="text-center text-lg tracking-widest font-bold"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmJoin} disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Tournament'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tournament;
