import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Star, ChevronRight, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import { useApp } from '../App';
import { drawCards } from '../services/tarotService';
import { interpretReading } from '../services/geminiService';
import { DrawnCard, SpreadType } from '../types';

const Home: React.FC = () => {
  const { user, saveDailyReading } = useApp();
  const [dailyCard, setDailyCard] = useState<DrawnCard | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aiReading, setAiReading] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  // Check if we already have a reading for today in the user state
  const existingReading = user.dailyReading && user.dailyReading.date === today ? user.dailyReading : null;

  useEffect(() => {
    if (existingReading) {
      setDailyCard(existingReading.card);
      setAiReading(existingReading.interpretation);
      setRevealed(true);
    }
  }, [existingReading]);

  const handleDailyDraw = async () => {
    if (existingReading) return;
    
    // 1. Draw the card
    const cards = drawCards(1, ['Daily Insight']);
    const drawn = cards[0];
    setDailyCard(drawn);
    
    // 2. Reveal animation
    setTimeout(() => setRevealed(true), 100);
    
    // 3. Fetch AI Reading
    setLoading(true);
    const interpretation = await interpretReading(
      SpreadType.OneCard, 
      "What is my guidance for today?", 
      [drawn],
      true // Indicates this is a short daily draw
    );
    
    setAiReading(interpretation);
    setLoading(false);

    // 4. Save to persistent state
    saveDailyReading({
      date: today,
      card: drawn,
      interpretation: interpretation
    });
  };

  return (
    <div className="p-6 flex flex-col gap-8 pt-12">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-200">
          Mara Baraha
        </h1>
        <p className="text-slate-400 text-xs tracking-widest uppercase">Mystical Tarot Guidance</p>
      </header>

      {/* Daily Card Section */}
      <section className="flex flex-col items-center gap-6 min-h-[400px]">
        <div className="relative w-full flex justify-center">
          <div className="absolute inset-0 bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none"></div>
          
          {!dailyCard ? (
            <div className="text-center space-y-4 animate-float">
              <Card isRevealed={false} onClick={handleDailyDraw} size="lg" label="Tap to Reveal" />
              <h2 className="text-xl font-serif text-slate-200 mt-4">Your Daily Card</h2>
              <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
                Focus on your intention for the day and tap the card to reveal your guidance.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700 w-full">
              <Card 
                card={dailyCard.card} 
                isReversed={false}
                isRevealed={revealed} 
                size="lg"
                label="Daily Insight"
              />
              
              {/* Reading Display */}
              <div className="w-full max-w-sm">
                 {loading ? (
                   <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                      <Sparkles className="animate-spin text-fuchsia-400 mb-2" size={24} />
                      <p className="text-xs text-fuchsia-200 uppercase tracking-widest animate-pulse">Connecting to Spirit...</p>
                   </div>
                 ) : (
                   <div className="bg-gradient-to-b from-slate-900/80 to-purple-900/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
                      <h3 className="text-lg font-bold text-gold-400 font-serif text-center mb-3">
                        {dailyCard.card.name}
                      </h3>
                      <div className="prose prose-invert prose-sm text-center">
                        <p className="text-slate-200 text-sm leading-relaxed font-light italic">
                          "{aiReading}"
                        </p>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 gap-4">
        <Link to="/read" className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 p-6 border border-white/10 shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold font-serif text-white mb-1">New Reading</h3>
            <p className="text-indigo-200 text-sm mb-4">Seek answers from the cards.</p>
            <div className="flex items-center text-xs font-bold text-gold-400 uppercase tracking-widest">
              Start Now <ChevronRight size={14} className="ml-1" />
            </div>
          </div>
        </Link>
      </section>
      
      {/* Stats / Credits */}
      <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-full border border-white/5">
        <span className="text-xs text-slate-400 uppercase tracking-wider">Available Credits</span>
        <span className="font-serif text-fuchsia-300 font-bold">{user.credits}</span>
      </div>
    </div>
  );
};

export default Home;