import { motion } from 'framer-motion';
import { Book, Shield, Zap, Globe, Award, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-quiz-accent/30 to-transparent" />
          
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Quiz Master</h1>
              <p className="text-xl text-quiz-text/80 mb-8">
                Discover the story behind the ultimate quiz experience and how we're 
                revolutionizing the way people test their knowledge.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* About Content */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2>Our Mission</h2>
              <p>
                Quiz Master was founded with a simple mission: to make learning fun and 
                competitive. We believe that the best way to learn is through engagement 
                and friendly competition, which is why we've created a platform that 
                turns knowledge into an exciting experience.
              </p>
              
              <h2>How It Works</h2>
              <p>
                Our platform offers multiple ways to play and test your knowledge:
              </p>
              <ul>
                <li><strong>Solo Mode:</strong> Challenge yourself with quizzes on various topics at your own pace.</li>
                <li><strong>Duo Mode:</strong> Go head-to-head with a friend or random opponent to see who knows more.</li>
                <li><strong>Tournament Mode:</strong> Compete with multiple players in structured tournaments.</li>
              </ul>
              
              <h2>Our Diverse Question Library</h2>
              <p>
                We've curated thousands of questions across dozens of categories, including:
              </p>
              <ul>
                <li>History & Geography</li>
                <li>Science & Technology</li>
                <li>Arts & Literature</li>
                <li>Sports & Entertainment</li>
                <li>General Knowledge</li>
                <li>And many more!</li>
              </ul>
              
              <h2>Why Choose Quiz Master?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <Zap className="h-6 w-6 text-quiz-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mt-0">Real-time Competition</h3>
                    <p className="mt-2">
                      Experience the thrill of competing in real-time against friends and players worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <Globe className="h-6 w-6 text-quiz-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mt-0">Global Community</h3>
                    <p className="mt-2">
                      Join thousands of quiz enthusiasts from around the world who share your passion for knowledge.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <Shield className="h-6 w-6 text-quiz-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mt-0">Fair Play</h3>
                    <p className="mt-2">
                      Our sophisticated systems ensure fair matches and prevent cheating.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <Award className="h-6 w-6 text-quiz-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mt-0">Achievements & Rewards</h3>
                    <p className="mt-2">
                      Earn badges, climb leaderboards, and gain recognition for your knowledge prowess.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-quiz-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Meet Our Team</h2>
              <p className="text-quiz-text/70 mt-4 max-w-2xl mx-auto">
                The passionate people behind Quiz Master
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Alex Johnson",
                  role: "Founder & CEO",
                  bio: "Trivia enthusiast with a background in educational technology.",
                  avatar: "/placeholder.svg"
                },
                {
                  name: "Sarah Chen",
                  role: "Head of Content",
                  bio: "Former quiz show writer with a passion for challenging questions.",
                  avatar: "/placeholder.svg"
                },
                {
                  name: "Miguel Rodriguez",
                  role: "Lead Developer",
                  bio: "Tech wizard who brings our quiz experience to life.",
                  avatar: "/placeholder.svg"
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-quiz-primary font-medium">{member.role}</p>
                  <p className="text-quiz-text/70 mt-2">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Fun?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Create your account today and start challenging your knowledge in our quizzes!
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <a href="/register" className="bg-white text-quiz-primary hover:bg-white/90 px-8 py-3 rounded-md font-medium inline-block">
                Start Playing Now
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 bg-quiz-text text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">Quiz Master</span>
            </div>
            <div className="flex gap-6">
              <a href="/terms" className="text-white/70 hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy</a>
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

export default About;