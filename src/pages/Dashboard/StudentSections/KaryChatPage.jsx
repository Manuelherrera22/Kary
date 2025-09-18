import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, User, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const KaryChatPage = () => {
  const { t, language } = useLanguage(); 
  const { user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const dateLocale = language === 'es' ? es : undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (authLoading || !user) {
        setIsLoadingHistory(true);
        return;
      }
      setIsLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('studentDashboard.karyChat.errorFetchingHistory'),
          variant: 'destructive',
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchChatHistory();
  }, [user, authLoading, t, toast]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSending(true);
    const userMessagePayload = {
      user_id: user.id, 
      message: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    try {
      const { data: insertedUserMessage, error: userMessageError } = await supabase
        .from('ai_conversations')
        .insert(userMessagePayload)
        .select()
        .single();

      if (userMessageError) throw userMessageError;
      
      setMessages(prev => [...prev, insertedUserMessage]);
      setNewMessage('');

      const karyResponsePayload = {
        user_id: user.id,
        message: `${t('studentDashboard.karyChat.karyResponsePrefix')} "${insertedUserMessage.message}". ${t('studentDashboard.karyChat.karyResponseSuffix')}`,
        sender: 'kary',
        timestamp: new Date().toISOString(),
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: insertedKaryMessage, error: karyMessageError } = await supabase
        .from('ai_conversations')
        .insert(karyResponsePayload)
        .select()
        .single();
      
      if (karyMessageError) throw karyMessageError;
      setMessages(prev => [...prev, insertedKaryMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.karyChat.errorSendingMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (authLoading && isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    >
      <header className="p-4 bg-slate-800/50 backdrop-blur-md shadow-lg border-b border-slate-700/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
            {t('studentDashboard.karyChat.pageTitle', 'Kary AI Chat')}
          </h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 container mx-auto">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            <p className="ml-2">{t('common.loadingText')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={48} className="text-slate-500 mb-4" />
            <p className="text-slate-400">{t('studentDashboard.karyChat.noMessages')}</p>
            <p className="text-sm text-slate-500">{t('studentDashboard.karyChat.startConversation')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-sky-500 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                  <div className="flex items-center mb-1">
                    {msg.sender === 'user' ? (
                      <User size={16} className="mr-2 text-sky-200" />
                    ) : (
                      <Sparkles size={16} className="mr-2 text-purple-400" />
                    )}
                    <span className="font-semibold text-sm">
                      {msg.sender === 'user' ? (userProfile?.full_name || t('studentDashboard.karyChat.you')) : 'Kary AI'}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-sky-200/80 text-right' : 'text-slate-400/80 text-left'}`}>
                    {format(new Date(msg.timestamp), 'Pp', { locale: dateLocale })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50">
        <form onSubmit={handleSendMessage} className="container mx-auto flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('studentDashboard.karyChat.typeMessagePlaceholder')}
            className="flex-grow bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500"
            disabled={isSending || isLoadingHistory}
          />
          <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white" disabled={isSending || isLoadingHistory || !newMessage.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
            <span className="ml-2 hidden sm:inline">{t('studentDashboard.karyChat.sendButton')}</span>
          </Button>
        </form>
      </footer>
    </motion.div>
  );
};

export default KaryChatPage;