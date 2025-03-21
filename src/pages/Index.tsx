import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Users, 
  Trophy, 
  MessageCircle, 
  BarChart3, 
  Award, 
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartPlaying = () => {
    if (isAuthenticated) {
      navigate('/solo');
    } else {
      navigate('/register');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-quiz-accent/30 to-transparent" />
        
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Challenge Your Knowledge with <span className="text-gradient">Quiz Master</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-xl text-quiz-text/80 mb-8 max-w-2xl">
                Join thousands of players in the ultimate quiz competition. Play solo, 
                challenge a friend, or join tournaments to test your knowledge and climb the leaderboards.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-quiz-primary hover:bg-quiz-secondary text-white font-medium px-8"
                onClick={handleStartPlaying}
              >
                Start Playing
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg" className="font-medium">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-quiz-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Game Modes</h2>
            <p className="text-quiz-text/70 max-w-2xl mx-auto">
              Multiple ways to challenge yourself and others
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solo Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full quiz-card">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-quiz-primary/10 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-quiz-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Solo Mode</h3>
                  <p className="text-quiz-text/70 mb-6">
                    Test your knowledge at your own pace with various quiz categories.
                  </p>
                  <Button 
                    className="bg-quiz-primary hover:bg-quiz-secondary w-full mt-auto"
                    onClick={() => isAuthenticated ? navigate('/solo') : navigate('/login')}
                  >
                    Play Solo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Duo Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full quiz-card">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-quiz-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-quiz-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Duo Mode</h3>
                  <p className="text-quiz-text/70 mb-6">
                    Challenge a friend in a head-to-head battle of knowledge and speed.
                  </p>
                  <Button 
                    className="bg-quiz-primary hover:bg-quiz-secondary w-full mt-auto"
                    onClick={() => isAuthenticated ? navigate('/duo') : navigate('/login')}
                  >
                    Play Duo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Tournament Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full quiz-card">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-quiz-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-quiz-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Tournament Mode</h3>
                  <p className="text-quiz-text/70 mb-6">
                    Compete with 4-10 players in public or private tournaments.
                  </p>
                  <Button 
                    className="bg-quiz-primary hover:bg-quiz-secondary w-full mt-auto"
                    onClick={() => isAuthenticated ? navigate('/tournament') : navigate('/login')}
                  >
                    Join Tournament
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-quiz-text/70 max-w-2xl mx-auto">
              Everything you need for the ultimate quiz experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-quiz-primary/10 flex-shrink-0 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-quiz-text/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of players and challenge yourself with our diverse quiz categories.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-quiz-primary hover:bg-white/90 font-medium px-8"
            onClick={() => navigate(isAuthenticated ? '/solo' : '/register')}
          >
            {isAuthenticated ? 'Start Playing' : 'Create an Account'}
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-quiz-text text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">Quiz Master</span>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy</Link>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-4 md:mt-0 text-white/70">
              © {new Date().getFullYear()} Quiz Master. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Diverse Quiz Categories",
    description: "From history to pop culture, science to sports - we've got it all.",
    icon: <Brain className="h-6 w-6 text-quiz-primary" />
  },
  {
    title: "Real-time Multiplayer",
    description: "Compete with friends and strangers in real-time quiz battles.",
    icon: <Users className="h-6 w-6 text-quiz-primary" />
  },
  {
    title: "Live Chat",
    description: "Communicate with other players during multiplayer games.",
    icon: <MessageCircle className="h-6 w-6 text-quiz-primary" />
  },
  {
    title: "Detailed Statistics",
    description: "Track your progress and see how you stack up against others.",
    icon: <BarChart3 className="h-6 w-6 text-quiz-primary" />
  },
  {
    title: "Custom Tournaments",
    description: "Create private tournaments and invite your friends to compete.",
    icon: <Trophy className="h-6 w-6 text-quiz-primary" />
  },
  {
    title: "Achievements & Rewards",
    description: "Earn badges and rewards as you improve your quiz skills.",
    icon: <Award className="h-6 w-6 text-quiz-primary" />
  }
];

export default Index;