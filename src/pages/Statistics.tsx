import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Brain, Timer, Target, Award, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';

// Mock data - in a real application, this would come from your API
const mockCategoryData = [
  { name: 'History', correct: 38, total: 50 },
  { name: 'Science', correct: 42, total: 60 },
  { name: 'Geography', correct: 25, total: 40 },
  { name: 'Entertainment', correct: 30, total: 35 },
  { name: 'Sports', correct: 20, total: 30 },
  { name: 'Art', correct: 15, total: 25 },
];

const mockGameModeData = [
  { name: 'Solo', played: 45, won: 40, percentage: 89 },
  { name: 'Duo', played: 32, won: 20, percentage: 63 },
  { name: 'Tournament', played: 15, won: 8, percentage: 53 },
];

const mockTimeData = [
  { month: 'Jan', questions: 120, correct: 90 },
  { month: 'Feb', questions: 150, correct: 120 },
  { month: 'Mar', questions: 200, correct: 160 },
  { month: 'Apr', questions: 180, correct: 130 },
  { month: 'May', questions: 220, correct: 180 },
  { month: 'Jun', questions: 250, correct: 210 },
];

const mockAchievements = [
  { id: 1, title: 'Quiz Master', description: 'Complete 500 questions', progress: 320, total: 500, icon: <Trophy className="h-5 w-5" /> },
  { id: 2, title: 'Brain Power', description: 'Get 10 perfect scores', progress: 7, total: 10, icon: <Brain className="h-5 w-5" /> },
  { id: 3, title: 'Speed Demon', description: 'Answer 100 questions in under 10 seconds each', progress: 68, total: 100, icon: <Timer className="h-5 w-5" /> },
  { id: 4, title: 'Champion', description: 'Win 25 tournaments', progress: 12, total: 25, icon: <Award className="h-5 w-5" /> },
  { id: 5, title: 'Sharpshooter', description: 'Maintain 80% accuracy for 30 days', progress: 18, total: 30, icon: <Target className="h-5 w-5" /> },
  { id: 6, title: 'Knowledge Streak', description: 'Answer 50 questions correctly in a row', progress: 32, total: 50, icon: <Zap className="h-5 w-5" /> },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Statistics = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("performance");

  // Calculate percentage for each category
  const categoryPerformance = mockCategoryData.map(item => ({
    ...item,
    percentage: Math.round((item.correct / item.total) * 100)
  }));

  // Sort achievements by progress percentage
  const sortedAchievements = [...mockAchievements].sort((a, b) => 
    (b.progress / b.total) - (a.progress / a.total)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-8 bg-quiz-background">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Statistics</h1>
              <p className="text-quiz-text/70">
                Track your performance and progress across different quiz categories and game modes
              </p>
            </header>

            <Tabs defaultValue="performance" className="space-y-8" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">+42 from last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">76.4%</div>
                      <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92</div>
                      <p className="text-xs text-muted-foreground">+8 from last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68.5%</div>
                      <p className="text-xs text-muted-foreground">-1.2% from last month</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle>Category Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="h-80">
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
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle>Game Mode Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockGameModeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="played"
                            >
                              {mockGameModeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`${value} games`, props.payload.name]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Progress Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="questions" name="Total Questions" stroke="#8884d8" />
                          <Line type="monotone" dataKey="correct" name="Correct Answers" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Games</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { mode: 'Solo', category: 'Science', score: '18/20', date: '2 hours ago', result: 'Win' },
                          { mode: 'Duo', category: 'History', score: '14/20', date: 'Yesterday', result: 'Win' },
                          { mode: 'Tournament', category: 'Mixed', score: '25/30', date: '2 days ago', result: 'Win' },
                          { mode: 'Solo', category: 'Entertainment', score: '16/20', date: '3 days ago', result: 'Win' },
                          { mode: 'Duo', category: 'Sports', score: '12/20', date: '5 days ago', result: 'Loss' },
                        ].map((game, index) => (
                          <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-medium text-sm">{game.mode} • {game.category}</p>
                              <p className="text-xs text-gray-500">{game.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">{game.score}</p>
                              <p className={`text-xs ${game.result === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                                {game.result}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Best Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[...categoryPerformance]
                          .sort((a, b) => b.percentage - a.percentage)
                          .slice(0, 5)
                          .map((category, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-sm">{category.percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-quiz-primary h-2 rounded-full" 
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedAchievements.map((achievement) => {
                    const progressPercent = Math.round((achievement.progress / achievement.total) * 100);
                    const isCompleted = achievement.progress >= achievement.total;
                    
                    return (
                      <Card key={achievement.id} className={`overflow-hidden ${isCompleted ? 'border-quiz-primary' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${isCompleted ? 'bg-quiz-primary text-white' : 'bg-gray-100'}`}>
                                {achievement.icon}
                              </div>
                              <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            </div>
                            {isCompleted && (
                              <div className="bg-quiz-primary text-white text-xs rounded-full px-2 py-1">
                                Completed
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                className={`${isCompleted ? 'bg-quiz-primary' : 'bg-quiz-secondary'} h-2 rounded-full`} 
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;