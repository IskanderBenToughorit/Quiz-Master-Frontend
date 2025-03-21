import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Users, Lock, Unlock, Clock } from "lucide-react";
import { tournamentApi } from '@/lib/api';

interface TournamentListProps {
  onJoinTournament?: (tournamentId: string, isPrivate: boolean) => void;
  includePrivate?: boolean;
}

const TournamentList = ({ onJoinTournament, includePrivate = false }: TournamentListProps) => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        // Pass includePrivate parameter to get private tournaments as well
        const data = await tournamentApi.getAll(includePrivate);
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        toast({
          title: "Error",
          description: "Failed to load tournaments. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [toast, includePrivate]);

  const handleJoin = (tournamentId, isPrivate) => {
    if (onJoinTournament) {
      onJoinTournament(tournamentId, isPrivate);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-7 bg-gray-200 rounded-md w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3 mt-2"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-200 rounded-md w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <Card className="quiz-card border-0">
        <CardHeader>
          <CardTitle>No Active Tournaments</CardTitle>
          <CardDescription>
            There are no tournaments available right now. Why not create one?
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <Card key={tournament._id} className="quiz-card border-0 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-quiz-primary" />
                  {tournament.name}
                </CardTitle>
                <CardDescription>
                  Created by {tournament.createdBy?.username || 'Unknown'}
                </CardDescription>
              </div>
              <Badge className={tournament.isPrivate ? 'bg-amber-500' : 'bg-green-500'}>
                {tournament.isPrivate ? (
                  <span className="flex items-center">
                    <Lock className="mr-1 h-3 w-3" /> Private
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Unlock className="mr-1 h-3 w-3" /> Public
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {tournament.players?.length || 0}/{tournament.maxPlayers} Players
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {new Date(tournament.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {tournament.category || 'General Knowledge'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              onClick={() => handleJoin(tournament._id, tournament.isPrivate)}
              className="bg-quiz-primary hover:bg-quiz-secondary"
              size="sm"
            >
              Join Tournament
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TournamentList;
