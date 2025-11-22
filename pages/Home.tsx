import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Star, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import { useApp } from '../App';
import { drawCards } from '../services/tarotService';
import { DrawnCard, SpreadType } from '../types';

const Home: React.FC = () => {
  const { user, updateDailyDraw } = useApp();
  const [dailyCard, setDailyCard] = useState<DrawnCard | null>(null);
  const [revealed, setRevealed] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const hasDrawnToday = user.lastDailyDraw === today;

  useEffect(() => {
    if (hasDrawnToday) {
      // In a real app, we'd store the actual card drawn today in history to retrieve it here.
      // For this demo, if they have drawn, we show a placeholder message or re-draw (simplified).
      // Let's just let them see the card they drew if it was in session state, but for persistent refresh, 
      // we will just show "Come back tomorrow".
    }
  }, [hasDrawnToday]);

  const handleDailyDraw = () => {
    if (hasDrawnToday) return;
    const cards = drawCards(1, ['Daily Insight']);
    setDailyCard(cards[0]);
    setTimeout(() => setRevealed(true), 100);
    updateDailyDraw();
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
      <section className="flex flex-col items-center gap-6 min-h-[300px]">
        <div className="relative w-full flex justify-center">
          <div className="absolute inset-0 bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none"></div>
          
          {!hasDrawnToday && !dailyCard ? (
            <div className="text-center space-y-4 animate-float">
              <Card isRevealed={false} onClick={handleDailyDraw} size="lg" label="Tap to Reveal" />
              <h2 className="text-xl font-serif text-slate-200 mt-4">Your Daily Card</h2>
              <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
                Focus on your intention for the day and tap the card to reveal your guidance.
              </p>
            </div>
          ) : hasDrawnToday && !dailyCard ? (
             <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                <Moon className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
                <h2 className="text-xl font-serif text-slate-200">Daily Insight Received</h2>
                <p className="text-slate-400 text-sm mt-2">
                  The stars have spoken for today. Return tomorrow for new guidance.
                </p>
             </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
              <Card 
                card={dailyCard!.card} 
                isReversed={dailyCard!.isReversed} 
                isRevealed={revealed} 
                size="lg"
                label="Daily Insight"
              />
              <div className="text-center max-w-xs bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-bold text-gold-400 font-serif">{dailyCard!.card.name}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                   {dailyCard!.isReversed ? dailyCard!.card.meaningReversed : dailyCard!.card.meaningUpright}
                </p>
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
