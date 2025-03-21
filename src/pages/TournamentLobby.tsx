import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, MessageSquare, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Chat from "@/components/Chat";
import { useAuth } from '@/context/AuthContext';
import { tournamentApi } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TournamentLobby = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentId) {
        toast.error('Tournament ID is missing');
        navigate('/tournament');
        return;
      }

      try {
        setLoading(true);
        const data = await tournamentApi.getById(tournamentId);
        setTournament(data);
        
        // Check if current user is the creator
        if (user && data.createdBy && data.createdBy._id === user.id) {
          setIsCreator(true);
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
        toast.error('Failed to load tournament details');
        navigate('/tournament');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
    
    // Set up polling to refresh tournament data
    const intervalId = setInterval(fetchTournament, 10000);
    
    return () => clearInterval(intervalId);
  }, [tournamentId, user, navigate]);

  const handleStartTournament = async () => {
    if (!token || !tournamentId) return;
    
    try {
      const response = await tournamentApi.start(tournamentId, token);
      toast.success('Tournament started!');
      // Update local tournament state
      setTournament(response.tournament);
    } catch (error) {
      console.error("Error starting tournament:", error);
      toast.error('Failed to start tournament');
    }
  };

  const handleCopyInviteCode = () => {
    if (tournament && tournament.accessCode) {
      navigator.clipboard.writeText(tournament.accessCode);
      toast.success('Access code copied to clipboard!');
    }
  };

  const handleLeaveTournament = async () => {
    if (!token || !tournamentId) return;
    
    try {
      await tournamentApi.leave(tournamentId, token);
      toast.success('You left the tournament');
      navigate('/tournament');
    } catch (error) {
      console.error("Error leaving tournament:", error);
      toast.error('Failed to leave tournament');
    }
  };

  const handleDeleteTournament = async () => {
    if (!token || !tournamentId || !isCreator) return;
    
    try {
      await tournamentApi.delete(tournamentId, token);
      toast.success('Tournament deleted successfully');
      navigate('/tournament');
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error('Failed to delete tournament');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary mx-auto"></div>
            <p className="mt-4">Loading tournament details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <Card className="w-[80%] max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Tournament Not Found</CardTitle>
              <CardDescription>The tournament you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/tournament')} className="w-full">Back to Tournaments</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
              <Trophy className="mr-2 h-6 w-6" /> {tournament.name}
            </h1>
            <div className="flex gap-2">
              {tournament.isPrivate && (
                <Button 
                  variant="outline" 
                  onClick={handleCopyInviteCode}
                  className="flex items-center gap-2"
                >
                  <span>Code: {tournament.accessCode}</span>
                </Button>
              )}
              {tournament.status === 'waiting' && (
                isCreator ? (
                  <Button 
                    onClick={() => setShowLeaveDialog(true)}
                    variant="outline"
                    className="text-red-500 hover:bg-red-50"
                  >
                    Delete Tournament
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowLeaveDialog(true)}
                    variant="outline"
                  >
                    Leave Tournament
                  </Button>
                )
              )}
            </div>
          </div>
          
          <Card className="quiz-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tournament Lobby</CardTitle>
                  <CardDescription>
                    {tournament.status === 'waiting' 
                      ? 'Waiting for players to join...' 
                      : tournament.status === 'active'
                      ? 'Tournament is in progress!'
                      : 'Tournament has ended'}
                  </CardDescription>
                </div>
                <Badge className={tournament.status === 'waiting' ? 'bg-amber-500' : tournament.status === 'active' ? 'bg-green-500' : 'bg-blue-500'}>
                  {tournament.status === 'waiting' ? 'Waiting' : tournament.status === 'active' ? 'Active' : 'Finished'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> 
                    Players ({tournament.players?.length || 0}/{tournament.maxPlayers})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {tournament.players?.map((player, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.user?.avatar || '/placeholder.svg'} alt={player.user?.username} />
                          <AvatarFallback>{player.user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{player.user?.username}</p>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">
                              {player.status === 'ready' ? (
                                <span className="flex items-center text-green-500">
                                  <Check className="h-3 w-3 mr-1" /> Ready
                                </span>
                              ) : (
                                <span className="flex items-center text-amber-500">
                                  <Clock className="h-3 w-3 mr-1" /> Waiting
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isCreator && tournament.status === 'waiting' && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={handleStartTournament}
                      className="bg-quiz-primary hover:bg-quiz-secondary"
                      disabled={tournament.players?.length < tournament.minPlayers}
                    >
                      {tournament.players?.length < tournament.minPlayers 
                        ? `Need ${tournament.minPlayers} Players to Start` 
                        : 'Start Tournament'}
                    </Button>
                  </div>
                )}
                
                {tournament.category && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-1">Category</h3>
                    <p>{tournament.category}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
              <Chat roomId={tournamentId} username={user?.username || 'Guest'} />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Leave/Delete Tournament Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              {isCreator ? "Delete Tournament?" : "Leave Tournament?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCreator 
                ? "This will permanently delete the tournament. This action cannot be undone."
                : "Are you sure you want to leave this tournament? You can rejoin later if it's still available."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={isCreator ? handleDeleteTournament : handleLeaveTournament}
              className={isCreator ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isCreator ? "Delete Tournament" : "Leave Tournament"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TournamentLobby;
