
import { useState } from 'react';
import type { Monster } from '../types/monster';
import { useMonsters } from '../hooks/useMonsters';
import { MonsterCard } from '../components/MonsterCard';
import { MonsterForm } from '../components/MonsterForm';
import { BattleArena } from '../components/BattleArena';
import { GiCrossedSwords } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";

type View = 'list' | 'form' | 'battle';

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
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive';
  disabled?: boolean;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  
  const variantClasses = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function Index() {
  const { monsters, addMonster, removeMonster } = useMonsters();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);

  const handleMonsterSelect = (monster: Monster) => {
    setSelectedMonsters(prev => {
      const isSelected = prev.some(m => m.id === monster.id);
      if (isSelected) {
        return prev.filter(m => m.id !== monster.id);
      }
      if (prev.length < 2) {
        return [...prev, monster];
      }
      return [prev[1], monster];
    });
  };

  const handleCreateMonster = (monsterData: Omit<Monster, 'id' | 'maxHp'>) => {
    addMonster(monsterData);
    setCurrentView('list');
  };

  const handleStartBattle = () => {
    if (selectedMonsters.length === 2) {
      setCurrentView('battle');
    }
  };

  const handleBattleEnd = () => {
    setSelectedMonsters([]);
    setCurrentView('list');
  };

  const handleRemoveMonster = (monsterId: string) => {
    removeMonster(monsterId);
    setSelectedMonsters(prev => prev.filter(m => m.id !== monsterId));
  };

  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
        <div className="container mx-auto">
          <MonsterForm 
            onSubmit={handleCreateMonster}
            onCancel={() => setCurrentView('list')}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'battle' && selectedMonsters.length === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-6">
        <BattleArena
          monster1={selectedMonsters[0]}
          monster2={selectedMonsters[1]}
          onBattleEnd={handleBattleEnd}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🐲 Batalha de Monstros
          </h1>
          <p className="text-gray-600">
            Crie seus monstros e veja quem é o mais forte!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <CustomButton
            onClick={() => setCurrentView('form')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg flex items-center gap-1"
          >
            <IoMdAdd className="text-purple-600 text-xl" /> Criar Novo Monstro
          </CustomButton>
          
          <div className="flex items-center gap-2">
         <CustomButton
            onClick={handleStartBattle}
            disabled={selectedMonsters.length !== 2}
            variant={selectedMonsters.length === 2 ? 'destructive' : 'outline'}
            className="px-6 py-3 text-lg flex items-center gap-2"
          >
            <GiCrossedSwords className="text-red-400 text-xl" />
            Iniciar Batalha
          </CustomButton>
            <CustomBadge variant="outline" className="text-sm">
              {selectedMonsters.length}/2 selecionados
            </CustomBadge>
          </div>
        </div>

        {selectedMonsters.length > 0 && (
          <div className="mb-8 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 text-center">
              Monstros Selecionados para Batalha:
            </h3>
            <div className="flex justify-center gap-4">
              {selectedMonsters.map((monster, index) => (
                <div key={monster.id} className="text-center">
                  <CustomBadge variant="secondary" className="mb-2">
                    Lutador {index + 1}
                  </CustomBadge>
                  <div className="text-sm font-medium">{monster.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {monsters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐉</div>
            <p className="text-gray-600 text-lg mb-4">
              Nenhum monstro encontrado
            </p>
            <p className="text-gray-500">
              Crie seu primeiro monstro para começar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {monsters.map((monster) => (
              <div key={monster.id} className="relative">
                <MonsterCard
                  monster={monster}
                  isSelected={selectedMonsters.some(m => m.id === monster.id)}
                  onClick={() => handleMonsterSelect(monster)}
                />
                <CustomButton
                  onClick={() => handleRemoveMonster(monster.id)}
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-xs"
                >
                  ✕
                </CustomButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
