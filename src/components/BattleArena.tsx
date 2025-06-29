
import { useState } from 'react';
import type { Monster, BattleResult, BattleRound } from '../types/monster';
import { simulateBattle } from '../utils/battleSystem';
import { MonsterCard } from './MonsterCard';
import { GiCrossedSwords } from "react-icons/gi";
import { PiBoxingGloveFill,PiTrophyFill   } from "react-icons/pi";
import {  FaBolt } from 'react-icons/fa';

interface BattleArenaProps {
  monster1: Monster;
  monster2: Monster;
  onBattleEnd: () => void;
}

const CustomBadge = ({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variantClasses = {
    default: "border-transparent bg-gray-900 text-white hover:bg-gray-800",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    secondary: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const CustomButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'default'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white hover:bg-gray-50"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 py-4"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const BattleArena = ({ monster1, monster2, onBattleEnd }: BattleArenaProps) => {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fighter1, setFighter1] = useState<Monster>(monster1);
  const [fighter2, setFighter2] = useState<Monster>(monster2);

  const startBattle = () => {
    const result = simulateBattle(monster1, monster2);
    setBattleResult(result);
    setCurrentRound(0);
    
    setFighter1({ ...monster1, hp: monster1.maxHp });
    setFighter2({ ...monster2, hp: monster2.maxHp });
    
    animateRounds(result.rounds);
  };

  const animateRounds = async (rounds: BattleRound[]) => {
    setIsAnimating(true);
    
    for (let i = 0; i < rounds.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const round = rounds[i];
      setCurrentRound(i + 1);
      
      if (round.defender.id === monster1.id) {
        setFighter1(prev => ({ ...prev, hp: round.defenderHpAfter }));
      } else {
        setFighter2(prev => ({ ...prev, hp: round.defenderHpAfter }));
      }
      
      const defenderElement = document.getElementById(`monster-${round.defender.id}`);
      if (defenderElement) {
        defenderElement.classList.add('animate-battle-shake');
        setTimeout(() => {
          defenderElement.classList.remove('animate-battle-shake');
        }, 500);
      }
    }
    
    setIsAnimating(false);
  };

  const getRoundDescription = (round: BattleRound) => {
    return `${round.attacker.name} atacou ${round.defender.name} causando ${round.damage} de dano!`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm mb-6">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-center text-2xl">
            <GiCrossedSwords className="inline mr-1 text-red-600" /> Arena de Batalha <GiCrossedSwords className="inline ms-1 text-red-600" /> 
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div id={`monster-${fighter1.id}`} className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2">Lutador 1</h3>
          <MonsterCard 
            monster={fighter1} 
            showHp={battleResult !== null}
            className="w-full max-w-sm"
          />
        </div>
        
        <div className="flex flex-col items-center justify-center">
          {!battleResult ? (
            <CustomButton 
              onClick={startBattle}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <PiBoxingGloveFill className="inline mr-1 text-red-600" /> INICIAR BATALHA!
            </CustomButton>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4 text-6xl">
                <FaBolt className="text-yellow-400" />
              </div>
              <CustomBadge variant="outline" className="text-lg px-4 py-2">
                Round {currentRound}/{battleResult.totalRounds}
              </CustomBadge>
              {!isAnimating && battleResult.winner && (
                <div className="mt-4">
                  <div className="text-2xl font-bold text-green-600 mb-2 flex items-center gap-2">
                    <PiTrophyFill className="text-yellow-600" />
                    VENCEDOR!
                  </div>
                  <div className="text-xl font-semibold">
                    {battleResult.winner.name}
                  </div>
                  <CustomButton 
                    onClick={onBattleEnd}
                    className="mt-4"
                    variant="outline"
                  >
                    Nova Batalha
                  </CustomButton>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div id={`monster-${fighter2.id}`} className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2">Lutador 2</h3>
          <MonsterCard 
            monster={fighter2} 
            showHp={battleResult !== null}
            className="w-full max-w-sm"
          />
        </div>
      </div>

      {battleResult && battleResult.rounds.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">📜 Log da Batalha</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="overflow-auto h-64">
              <div className="space-y-2">
                {battleResult.rounds.slice(0, currentRound).map((round, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      index === currentRound - 1 && isAnimating
                        ? 'bg-yellow-100 border border-yellow-300 animate-pulse'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Round {round.round}</span>
                      <CustomBadge variant="outline">
                        {round.damage} dano
                      </CustomBadge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {getRoundDescription(round)}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {round.defender.name}: {round.defenderHpAfter} HP restante
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
