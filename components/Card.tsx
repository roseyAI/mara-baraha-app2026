import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';
import { CARD_BACK_IMAGE } from '../constants';

interface CardProps {
  card?: TarotCard;
  isReversed?: boolean; // Kept in interface for compatibility, but ignored visually
  isRevealed: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  isReversed = false, 
  isRevealed, 
  onClick,
  size = 'md',
  label
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Reset error state if card changes
  useEffect(() => {
    setImgError(false);
  }, [card?.id]);

  // Updated sizes for a taller, more traditional Tarot aspect ratio (~0.57)
  const sizeClasses = {
    sm: 'w-16 h-28',      // 64px x 112px
    md: 'w-32 h-56',      // 128px x 224px
    lg: 'w-48 h-80',      // 192px x 320px
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-xs font-serif text-slate-400 uppercase tracking-widest shadow-black drop-shadow-md">{label}</span>}
      <div 
        className={`relative perspective-1000 cursor-pointer group ${sizeClasses[size]}`}
        onClick={onClick}
      >
        <div 
          className={`w-full h-full relative transform-style-3d transition-transform duration-1000 ease-in-out ${isRevealed ? 'rotate-y-180' : ''}`}
        >
          {/* Card Back */}
          <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl overflow-hidden border border-white/10 bg-slate-900">
             {/* If we have a custom card back image */}
             <div className="absolute inset-0 bg-slate-900">
                <img 
                  src={CARD_BACK_IMAGE} 
                  alt="Card Back" 
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    // Fallback purely generative back if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
             </div>
             
             {/* Decorative fallback overlay if image fails or just to add depth */}
             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 pointer-events-none"></div>
          </div>

          {/* Card Front */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-xl overflow-hidden bg-white border-4 border-white">
            <div className={`w-full h-full relative bg-white flex items-center justify-center`}>
              
              {card?.image && !imgError ? (
                <>
                  {/* Image Layer */}
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={() => {
                      console.log("Failed to load image:", card.image);
                      setImgError(true);
                    }}
                  />
                  
                  {/* Slight paper texture overlay */}
                  <div className="absolute inset-0 bg-amber-50/10 mix-blend-multiply pointer-events-none"></div>
                </>
              ) : (
                /* Fallback CSS Design if no image or error loading */
                <div className="w-full h-full flex flex-col p-2 bg-gradient-to-b from-slate-900 via-mystic-800 to-slate-900">
                   <div className="flex-1 border-2 border-double border-gold-500/30 rounded flex flex-col items-center justify-between p-2 relative overflow-hidden">
                    <div className="text-[10px] text-gold-500 font-serif uppercase tracking-widest w-full text-center border-b border-gold-500/10 pb-1">
                      {card ? (card.arcana === 'Major' ? 'Major' : card.suit) : ''}
                    </div>
                    
                    <div className="text-center z-10 my-2 flex-1 flex flex-col items-center justify-center">
                      {/* Suit Icon Placeholder */}
                      <div className="text-4xl opacity-20 text-fuchsia-300 mb-2">
                        {card?.suit === 'Cups' && '🏆'}
                        {card?.suit === 'Wands' && '🌿'}
                        {card?.suit === 'Swords' && '⚔️'}
                        {card?.suit === 'Pentacles' && '🪙'}
                        {card?.arcana === 'Major' && '✨'}
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 font-serif leading-tight px-1">
                        {card?.name}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;