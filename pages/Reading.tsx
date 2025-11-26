import React, { useState } from 'react';
import { SPREAD_CONFIG, SpreadType, Reading, DrawnCard } from '../types';
import { useApp } from '../App';
import { drawCards } from '../services/tarotService';
import { interpretReading } from '../services/geminiService';
import Card from '../components/Card';
import { X } from 'lucide-react';

const ReadingPage: React.FC = () => {
  const { user, deductCredit, addReading } = useApp();
  const [step, setStep] = useState<'select' | 'question' | 'shuffling' | 'revealing' | 'result'>('select');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1); // -1 means none
  
  // State for Card Zoom Modal
  const [zoomedCard, setZoomedCard] = useState<DrawnCard | null>(null);

  // Helper to clean text (double check even if prompt says no markdown)
  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[\*#]/g, '') // Remove asterisks and hashes
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .trim();
  };

  // Step 1: Select Spread
  const handleSpreadSelect = (type: SpreadType) => {
    setSelectedSpread(type);
    setStep('question');
  };

  // Step 2: Submit Question & Start Draw
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpread) return;
    
    const cost = SPREAD_CONFIG[selectedSpread].cost;
    if (user.credits < cost) {
      alert("Not enough credits!");
      return;
    }

    if (deductCredit(cost)) {
      setStep('shuffling');
      // Simulate shuffle delay
      setTimeout(() => {
        const config = SPREAD_CONFIG[selectedSpread];
        const cards = drawCards(config.positions.length, config.positions);
        setDrawnCards(cards);
        setStep('revealing');
      }, 2000);
    }
  };

  // Step 3: Reveal Cards Logic
  const handleRevealCard = (index: number) => {
    // If card is already revealed, open zoom modal to show details
    if (index <= revealIndex) {
      setZoomedCard(drawnCards[index]);
      return;
    }

    // Logic for revealing the next card in sequence
    if (index === revealIndex + 1) {
      setRevealIndex(index);
      
      // Check if this was the last card
      if (index === drawnCards.length - 1) {
        // Add a delay before showing "Consulting Mara" to let user see the card
        setTimeout(() => {
           generateInterpretation();
        }, 1500); // 1.5s delay
      }
    }
  };

  const generateInterpretation = async () => {
    setLoadingAI(true);
    const rawResult = await interpretReading(selectedSpread!, question, drawnCards);
    const cleanResult = cleanText(rawResult);
    
    setInterpretation(cleanResult);
    setLoadingAI(false);
    setStep('result');

    // Save to History
    const newReading: Reading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      spreadType: selectedSpread!,
      question: question,
      cards: drawnCards,
      interpretation: cleanResult
    };
    addReading(newReading);
  };

  // --- RENDERERS ---

  if (step === 'select') {
    return (
      <div className="p-6 pt-12 pb-24">
        <h2 className="text-2xl font-serif text-white mb-6 text-center">Choose a Spread</h2>
        <div className="space-y-4">
          {(Object.keys(SPREAD_CONFIG) as SpreadType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleSpreadSelect(type)}
              disabled={user.credits < SPREAD_CONFIG[type].cost}
              className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden
                ${user.credits < SPREAD_CONFIG[type].cost 
                  ? 'opacity-50 border-slate-700 bg-slate-900' 
                  : 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 hover:border-purple-400'}`}
            >
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg text-white">{SPREAD_CONFIG[type].name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{SPREAD_CONFIG[type].positions.length} Cards</p>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-bold text-fuchsia-400">{SPREAD_CONFIG[type].cost}</span>
                  <span className="text-[10px] uppercase text-slate-500">Credits</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'question') {
    return (
      <div className="p-6 pt-12 h-full flex flex-col">
        <button onClick={() => setStep('select')} className="text-slate-400 text-sm mb-6 hover:text-white self-start">
          &larr; Back
        </button>
        <h2 className="text-2xl font-serif text-white mb-2">Focus your Energy</h2>
        <p className="text-slate-400 text-sm mb-8">What question do you seek to answer?</p>
        
        <form onSubmit={handleQuestionSubmit} className="flex-1 flex flex-col">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What should I focus on in my career right now?"
            className="w-full h-40 bg-slate-900/50 border border-purple-500/30 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 resize-none mb-6"
            required
          />
          <button 
            type="submit"
            disabled={!question.trim()}
            className="w-full py-4 bg-gradient-to-r from-fuchsia-700 to-purple-800 rounded-full font-serif text-white font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Begin Reading
          </button>
        </form>
      </div>
    );
  }

  if (step === 'shuffling') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6">
        <div className="relative w-32 h-48">
           <div className="absolute inset-0 bg-fuchsia-500 rounded-xl animate-ping opacity-20"></div>
           <div className="w-32 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/20 flex items-center justify-center animate-bounce">
             <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        </div>
        <p className="mt-8 text-fuchsia-200 font-serif animate-pulse">Shuffling the Deck...</p>
        <p className="text-slate-500 text-xs mt-2">Focus on your question.</p>
      </div>
    );
  }

  if (step === 'revealing') {
    return (
      <div className="p-6 pt-12 pb-24 flex flex-col items-center min-h-screen relative">
        <h2 className="text-xl font-serif text-white mb-8">Reveal Your Cards</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {drawnCards.map((drawn, idx) => (
            <div key={idx} className={`${idx > revealIndex + 1 ? 'opacity-50 grayscale' : 'opacity-100'} transition-all duration-500`}>
              <Card
                card={drawn.card}
                isReversed={drawn.isReversed}
                isRevealed={idx <= revealIndex}
                onClick={() => handleRevealCard(idx)}
                size="sm"
                label={idx <= revealIndex ? drawn.position : `Tap to reveal`}
              />
            </div>
          ))}
        </div>
        
        {/* Loading Overlay */}
        {loadingAI && (
           <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-in fade-in duration-700">
             <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 border-4 border-fuchsia-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin"></div>
             </div>
             <h3 className="text-2xl font-serif text-white mb-2">Consulting Mara</h3>
             <p className="text-slate-400 text-sm">Interpreting the symbols and their connections...</p>
           </div>
        )}

        {/* Zoom Modal for Revealed Cards */}
        {zoomedCard && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setZoomedCard(null)}>
              <div className="relative max-w-sm w-full bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setZoomedCard(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
                <div className="mt-4">
                  <Card card={zoomedCard.card} isRevealed={true} size="lg" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-serif text-gold-400">{zoomedCard.card.name}</h3>
                  <p className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest mt-1 mb-2">{zoomedCard.position}</p>
                  <p className="text-slate-300 text-sm italic">"{zoomedCard.card.description}"</p>
                </div>
              </div>
           </div>
        )}
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="p-6 pt-8 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="mb-8 border-b border-white/10 pb-4">
          <span className="text-[10px] uppercase text-fuchsia-400 tracking-widest block mb-1">{SPREAD_CONFIG[selectedSpread!].name}</span>
          <h2 className="text-xl font-serif text-white italic">"{question}"</h2>
        </div>

        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">The Spread</h3>
           <p className="text-xs text-slate-500 mb-2 italic">Tap a card to view details.</p>
           <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
              {drawnCards.map((drawn, idx) => (
                <div key={idx} className="snap-center shrink-0 flex flex-col items-center cursor-pointer" onClick={() => setZoomedCard(drawn)}>
                  <Card card={drawn.card} isReversed={drawn.isReversed} isRevealed={true} size="sm" />
                  <span className="text-[10px] text-fuchsia-300 mt-2 uppercase font-bold">{drawn.position}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-serif text-gold-400 mb-4 flex items-center gap-2">
             <span className="text-2xl">✨</span> Interpretation
          </h3>
          <div className="prose prose-invert prose-sm prose-p:text-slate-300 prose-headings:text-fuchsia-200">
             <div className="whitespace-pre-wrap font-light leading-relaxed">
               {interpretation}
             </div>
          </div>
        </div>
        
        <button 
          onClick={() => { setStep('select'); setQuestion(''); setDrawnCards([]); setRevealIndex(-1); }}
          className="mt-8 w-full py-4 border border-white/20 rounded-full text-slate-300 hover:bg-white/5 transition-colors uppercase text-xs tracking-widest"
        >
          New Reading
        </button>

         {/* Reusing Zoom Modal for Result Screen */}
         {zoomedCard && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setZoomedCard(null)}>
              <div className="relative max-w-sm w-full bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setZoomedCard(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
                <div className="mt-4">
                  <Card card={zoomedCard.card} isRevealed={true} size="lg" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-serif text-gold-400">{zoomedCard.card.name}</h3>
                  <p className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest mt-1 mb-2">{zoomedCard.position}</p>
                  <p className="text-slate-300 text-sm italic">"{zoomedCard.card.description}"</p>
                </div>
              </div>
           </div>
        )}
      </div>
    );
  }

  return null;
};

export default ReadingPage;