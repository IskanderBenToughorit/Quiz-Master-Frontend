import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Statistics = () => {
  const { isAuthenticated, user, token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user || !token) return;

      try {
        const data = await userApi.getProfile(user.id);
        setUserStats(data.stats || {});
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast({
          title: "Error",
          description: "Unable to fetch statistics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user, token]);

  const gameModeData = [
    {
      name: "Solo",
      played: userStats?.totalGames || 0,
      wins: userStats?.wins || 0,
      percentage: userStats?.totalGames
        ? Math.round((userStats.wins / userStats.totalGames) * 100)
        : 0,
    },
    {
      name: "Duo",
      played: 0,
      wins: 0,
      percentage: 0,
    },
    {
      name: "Tournament",
      played: 0,
      wins: 0,
      percentage: 0,
    },
  ];

  const mockCategoryData = [
    { name: "History", correct: 38, total: 50 },
    { name: "Science", correct: 42, total: 60 },
    { name: "Geography", correct: 25, total: 40 },
    { name: "Entertainment", correct: 30, total: 35 },
    { name: "Sports", correct: 20, total: 30 },
    { name: "Art", correct: 15, total: 25 },
  ];

  const categoryPerformance = mockCategoryData.map(item => ({
    ...item,
    percentage: Math.round((item.correct / item.total) * 100),
  }));

  const accuracy = userStats?.totalQuestions
    ? ((userStats.correctAnswers / userStats.totalQuestions) * 100).toFixed(1)
    : "0.0";

  const winRate = userStats?.totalGames
    ? ((userStats.wins / userStats.totalGames) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-8 bg-quiz-background">
        <div className="container px-4 mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold mb-2">Your Statistics</h1>
            <p className="text-quiz-text/70">
              Track your performance and progress across categories and game modes
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats?.totalQuestions || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{accuracy}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats?.totalGames || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{winRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="percentage" name="Accuracy" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Game Mode Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gameModeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          dataKey="played"
                        >
                          {gameModeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} games`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Statistics;
