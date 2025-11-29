import React, { useState, useEffect, useRef } from 'react';
import { getFitnessAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey! I'm Faisal, your personal AI coach. I can build you a custom workout plan, check your form cues, or explain nutrition. What's your goal today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await getFitnessAdvice(userMsg.text, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto">
      <div className="bg-brand-card border border-slate-800 p-4 rounded-t-2xl flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-brand-neon flex items-center justify-center text-slate-900 shadow-inner">
           <Bot size={24} />
        </div>
        <div>
            <h2 className="text-white font-bold text-lg">Coach Faisal (AI)</h2>
            <p className="text-slate-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950 border-x border-slate-800 p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-brand-neon text-slate-900 rounded-tr-none'
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Sparkles className="animate-spin text-brand-neon" size={16} />
              <span className="text-slate-400 text-sm">Coach is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-900 border border-slate-800 border-t-0 p-4 rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workouts, diet, or form..."
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white focus:border-brand-neon focus:ring-1 focus:ring-brand-neon outline-none transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-neon text-slate-900 rounded-lg hover:bg-brand-neonHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;