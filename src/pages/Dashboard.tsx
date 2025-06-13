import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import LoginButton from '../components/LoginButton';
import GlowingLogoImage from '../components/GlowingLogoImage';
import { callAIAgentWithRetry } from '@/lib/api/aiAgentAPI';
import { toast } from '@/components/ui/use-toast';
import {
  Brain,
  Activity,
  Microscope,
  Send,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Search,
  Stethoscope,
  Heart,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
  MessageSquare,
  BarChart3,
  Globe,
  Settings,
  Bell,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const suggestions = [
    'What are the screening guidelines for breast cancer?',
    'How to manage grade 3 neutropenia?',
    'Latest treatment protocols for lung cancer',
    'Palliative care options for advanced disease',
    'Dosage adjustments for renal impairment',
    'Managing chemotherapy-induced nausea'
  ];

  const recentActivities = [
    { action: 'NCCN Guidelines Updated', time: '2 min ago', type: 'info', icon: <FileText className="w-4 h-4" /> },
    { action: 'AI Query: Lung Cancer Staging', time: '15 min ago', type: 'success', icon: <Brain className="w-4 h-4" /> },
    { action: 'Treatment Protocol Modified', time: '1 hour ago', type: 'warning', icon: <Activity className="w-4 h-4" /> },
    { action: 'Patient Case Analysis Complete', time: '2 hours ago', type: 'info', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const typewriterEffect = (text: string) => {
    setIsTyping(true);
    let i = 0;
    setAiResponse('');
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setAiResponse(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 30);
  };

  const handleAIQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a question for MWONCOVISTA AI.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAiResponse(null);
    const currentQuery = query;

    try {
      const response = await callAIAgentWithRetry({
        module: 'OPD',
        intent: 'evaluation',
        prompt: currentQuery,
        mockMode: false
      });

      typewriterEffect(response.content);

      toast({
        title: "AI Response Generated",
        description: "MWONCOVISTA AI has analyzed your query successfully.",
      });

    } catch (error: any) {
      console.error("AI Query Error:", error);
      
      let errorTitle = "AI Agent Error";
      let errorDescription = "Something went wrong. Please try again.";
      
      if (error?.message?.includes('rate limit')) {
        errorTitle = "Rate Limit Exceeded";
        errorDescription = "Too many requests. Please wait a moment and try again.";
      } else if (error?.message?.includes('timeout')) {
        errorTitle = "Request Timeout";
        errorDescription = "The AI service is taking too long to respond. Please try again.";
      } else if (error?.message?.includes('API key')) {
        errorTitle = "Configuration Error";
        errorDescription = "AI service is not properly configured. Contact administrator.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
      
      setAiResponse("I apologize, but I'm experiencing technical difficulties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIQuery();
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Unable to capture voice input. Please try again.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      toast({
        title: "Voice Recognition Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative mb-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${25 + i * 5}px 0px`
                }}
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
          <motion.div
            className="text-white text-xl font-semibold mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            MWONCOVISTA
          </motion.div>
          <div className="text-white/80 text-sm">Loading Medical AI Platform...</div>
        </motion.div>
      </div>
    );
  }

  // Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          className="text-center bg-white/10 backdrop-blur-lg p-10 rounded-xl max-w-md w-full shadow-2xl border border-white/20 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Stethoscope className="w-16 h-16 text-cyan-400 mx-auto" />
          </motion.div>
          <h2 className="text-white text-3xl font-bold mb-4">Welcome to MWONCOVISTA</h2>
          <p className="text-white/70 mb-8 leading-relaxed">Your intelligent companion for clinical decision support and medical research.</p>
          <LoginButton className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105" />
        </motion.div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-6 space-y-6">        
        {/* Welcome Section */}
        <motion.div 
          className="bg-gradient-to-br from-slate-900/50 via-purple-900/40 to-indigo-900/50 backdrop-blur-xl rounded-2xl py-6 px-6 border border-white/20 shadow-xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            {/* Small Logo on the Left */}
            <div className="max-w-[100px]">
              <GlowingLogoImage />
            </div>

            {/* Heading on the Right */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome, Dr. {user?.name?.split(' ')[0] || 'Doctor'}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Your AI-powered clinical companion is ready to assist with evidence-based insights and decision support.
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Console */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">MWONCOVISTA AI Assistant</h2>
              <p className="text-white/60 text-sm">Ask questions about oncology protocols, guidelines, and clinical decisions</p>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="mb-6">
            <p className="text-sm text-white/70 mb-3 font-medium">Quick Start Suggestions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="text-left text-xs px-4 py-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                    <span>{suggestion}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              placeholder="Ask about staging protocols, treatment guidelines, drug interactions, or any clinical questions..."
              className="w-full p-4 pr-32 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            
            {/* Input Controls */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <motion.button
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? <VolumeX className="w-4 h-4" /> : <Microscope className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                onClick={handleAIQuery}
                disabled={loading || !query.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ask AI</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              className="bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">MWONCOVISTA AI Response</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-green-400 font-medium">Analysis Complete</div>
                    {isTyping && (
                      <motion.div
                        className="flex space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 bg-cyan-400 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity, 
                              delay: i * 0.1 
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="prose prose-invert max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed text-sm">
                  {aiResponse}
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Evidence-based clinical guidance • Always verify with current protocols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{activity.action}</div>
                    <div className="text-white/60 text-xs">{activity.time}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Insights */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Insights</h3>
            </div>
            
            <div className="space-y-4">
              <motion.div
                className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Treatment Optimization</span>
                </div>
                <p className="text-white/80 text-xs">Consider ECOG performance status for dose adjustments in elderly patients</p>
              </motion.div>
              
              <motion.div
                className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium text-sm">Latest Clinical Trends</span>
                </div>
                <p className="text-white/80 text-xs">95% of recent queries focused on immunotherapy combinations</p>
              </motion.div>
              
              <motion.div
                className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-medium text-sm">Critical Safety</span>
                </div>
                <p className="text-white/80 text-xs">New NCCN guidelines available for lung cancer staging</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-white/40 text-xs mb-4">
            MWONCOVISTA AI • Powered by Advanced Medical Intelligence
          </div>
          <motion.div
            className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"
            animate={{ scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
