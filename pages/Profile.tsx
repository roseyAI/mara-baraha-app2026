import React from 'react';
import { useApp } from '../App';
import { User, CreditCard, Settings, LogOut, Zap } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, resetCredits } = useApp();

  return (
    <div className="p-6 pt-12 pb-24">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 p-[2px] shadow-xl shadow-purple-900/50">
           <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              <User size={32} className="text-slate-300" />
           </div>
        </div>
        <h2 className="mt-4 text-xl font-serif text-white">Mystic Seeker</h2>
        <p className="text-slate-400 text-xs">Member since 2025</p>
      </div>

      <div className="space-y-6">
        {/* Credits Card */}
        <div className="bg-gradient-to-r from-purple-900/50 to-slate-900 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
           <div className="relative z-10">
             <span className="text-slate-400 text-xs uppercase tracking-wider">Spirit Credits</span>
             <div className="flex items-baseline gap-2 mt-1">
               <span className="text-3xl font-bold text-white">{user.credits}</span>
               <span className="text-sm text-slate-500">available</span>
             </div>
             <button 
                onClick={resetCredits} // Demo feature
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-fuchsia-600 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:bg-fuchsia-500 transition-colors"
             >
               <Zap size={14} /> Get More (Demo)
             </button>
           </div>
           <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
             <CreditCard size={120} />
           </div>
        </div>

        {/* Menu */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5">
             <Settings size={18} className="text-slate-400" />
             <span className="text-slate-200 text-sm">App Settings</span>
          </button>
           <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5">
             <div className="w-[18px] h-[18px] rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-400">?</div>
             <span className="text-slate-200 text-sm">Help & Guide</span>
          </button>
           <button className="w-full flex items-center gap-4 p-4 hover:bg-red-900/20 transition-colors text-left">
             <LogOut size={18} className="text-red-400" />
             <span className="text-red-400 text-sm">Reset Data</span>
          </button>
        </div>
        
        <div className="text-center mt-8">
           <p className="text-[10px] text-slate-600">Mara Baraha v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
