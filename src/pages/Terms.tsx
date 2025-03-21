import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-quiz-accent/30 to-transparent" />
          
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Terms of Service</h1>
              
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 prose prose-slate max-w-none">
                <p className="lead">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Quiz Master, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, you should not use Quiz Master.
                </p>
                
                <h2>2. Description of Service</h2>
                <p>
                  Quiz Master provides an online platform for users to test their knowledge through various quiz formats including solo challenges, duo competitions, and multiplayer tournaments. Our service includes all aspects of the Quiz Master platform including but not limited to the website, mobile applications, and related services.
                </p>
                
                <h2>3. User Accounts</h2>
                <p>
                  To access certain features of Quiz Master, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                
                <h2>4. User Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul>
                  <li>Use Quiz Master for any illegal purpose or in violation of any laws</li>
                  <li>Violate the intellectual property rights of others</li>
                  <li>Attempt to gain unauthorized access to other user accounts or computer systems</li>
                  <li>Interfere with the proper functioning of the service</li>
                  <li>Engage in cheating or unfair practices in competitions</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Use the service to distribute spam, malware, or other harmful content</li>
                </ul>
                
                <h2>5. Content</h2>
                <p>
                  Quiz Master contains questions, answers, and other content that is owned by us or licensed to us. This content is protected by intellectual property laws and you may not use, reproduce, or distribute it without our permission.
                </p>
                
                <h2>6. Privacy</h2>
                <p>
                  Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your personal information.
                </p>
                
                <h2>7. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your account and access to Quiz Master at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                </p>
                
                <h2>8. Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time. We will provide notice of any material changes through the service or by other means. Your continued use of Quiz Master after such modifications constitutes your acceptance of the modified Terms.
                </p>
                
                <h2>9. Limitation of Liability</h2>
                <p>
                  Quiz Master is provided "as is" without warranties of any kind. In no event shall Quiz Master be liable for any damages whatsoever, including but not limited to direct, indirect, special, incidental, or consequential damages arising out of or in connection with the use or inability to use our service.
                </p>
                
                <h2>10. Contact</h2>
                <p>
                  If you have any questions about these Terms, please contact us at support@quizmaster.com.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
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

export default Terms;