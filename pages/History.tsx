import React from 'react';
import { useApp } from '../App';
import { Calendar, MessageCircle } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="p-6 pt-12 pb-24 min-h-screen">
      <h1 className="text-2xl font-serif text-white mb-8">Your Journey</h1>
      
      {user.readings.length === 0 ? (
        <div className="text-center text-slate-500 mt-20">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
          <p>No readings recorded yet.</p>
          <p className="text-xs mt-2">Your spiritual path awaits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {user.readings.map((reading) => (
            <div key={reading.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-500/10 px-2 py-1 rounded">
                  {reading.spreadType}
                </span>
                <div className="flex items-center text-[10px] text-slate-500 gap-1">
                   <Calendar size={10} />
                   {new Date(reading.date).toLocaleDateString()}
                </div>
              </div>
              <h3 className="text-white font-serif text-md mb-2 line-clamp-1">"{reading.question}"</h3>
              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {reading.interpretation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
