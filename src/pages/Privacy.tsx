import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

const Privacy = () => {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
              
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 prose prose-slate max-w-none">
                <p className="lead">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                
                <p>
                  At Quiz Master, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
                
                <h2>1. Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>
                  We may collect personal information that you voluntarily provide when registering for an account, including:
                </p>
                <ul>
                  <li>Username</li>
                  <li>Email address</li>
                  <li>Password (stored in encrypted form)</li>
                  <li>Profile picture (optional)</li>
                </ul>
                
                <h3>Usage Information</h3>
                <p>
                  We automatically collect certain information about your device and how you interact with Quiz Master, including:
                </p>
                <ul>
                  <li>IP address</li>
                  <li>Device type and operating system</li>
                  <li>Browser type</li>
                  <li>Time spent on the service</li>
                  <li>Pages visited</li>
                  <li>Quiz performance and statistics</li>
                </ul>
                
                <h2>2. How We Use Your Information</h2>
                <p>We may use the information we collect to:</p>
                <ul>
                  <li>Create and manage your account</li>
                  <li>Provide and maintain our service</li>
                  <li>Personalize your experience</li>
                  <li>Process transactions</li>
                  <li>Send you service-related notices and updates</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Monitor usage patterns and improve our service</li>
                  <li>Protect against malicious, deceptive, or fraudulent activity</li>
                </ul>
                
                <h2>3. Sharing Your Information</h2>
                <p>
                  We may share your information in the following situations:
                </p>
                <ul>
                  <li><strong>With other users:</strong> Your username, profile picture, and game statistics may be visible to other users.</li>
                  <li><strong>With service providers:</strong> We may share information with third-party vendors who provide services on our behalf.</li>
                  <li><strong>For legal purposes:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
                  <li><strong>Business transfers:</strong> If Quiz Master is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                </ul>
                
                <h2>4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                </p>
                
                <h2>5. Your Choices</h2>
                <p>
                  You can review and update your account information by logging into your account settings. You may also request that we delete your account, though we may retain certain information as required by law or for legitimate business purposes.
                </p>
                
                <h2>6. Children's Privacy</h2>
                <p>
                  Quiz Master is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
                
                <h2>7. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                
                <h2>8. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy, please contact us at privacy@quizmaster.com.
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

export default Privacy;
