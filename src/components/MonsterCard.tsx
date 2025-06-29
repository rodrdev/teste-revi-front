import { FaHeart, FaShieldAlt, FaBolt, FaFistRaised } from 'react-icons/fa';
import type { Monster } from '../types/monster';

interface MonsterCardProps {
  monster: Monster;
  isSelected?: boolean;
  onClick?: () => void;
  showHp?: boolean;
  className?: string;
}

const CustomBadge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  className?: string;
}) => {
  const baseClasses =
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variantClasses = {
    default: 'border-transparent bg-gray-900 text-white hover:bg-gray-800',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
    secondary: 'border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const CustomProgress = ({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
};

export const MonsterCard = ({
  monster,
  isSelected = false,
  onClick,
  showHp = false,
  className = '',
}: MonsterCardProps) => {
  const hpPercentage = showHp ? (monster.hp / monster.maxHp) * 100 : 100;

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:scale-105 transform
        rounded-lg border border-gray-200 bg-white shadow-sm
        ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={monster.imageUrl}
          alt={monster.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {showHp && (
          <div className="absolute top-2 left-2 right-2">
            <div className="bg-black/70 rounded-lg p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-xs font-semibold">HP</span>
                <span className="text-white text-xs">
                  {monster.hp}/{monster.maxHp}
                </span>
              </div>
              <CustomProgress value={hpPercentage} className="h-2" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-3 text-center text-gray-800">
          {monster.name}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <CustomBadge variant="destructive" className="w-full">
              <FaFistRaised className='text-green-500'/> {monster.attack}
            </CustomBadge>
            <span className="text-xs text-gray-500 mt-1 block">Ataque</span>
          </div>

          <div className="text-center">
            <CustomBadge variant="secondary" className="w-full">
              <FaShieldAlt className='text-blue-500' /> {monster.defense}
            </CustomBadge>
            <span className="text-xs text-gray-500 mt-1 block">Defesa</span>
          </div>

          <div className="text-center">
            <CustomBadge variant="outline" className="w-full">
              <FaBolt className='text-yellow-500' /> {monster.speed}
            </CustomBadge>
            <span className="text-xs text-gray-500 mt-1 block">Velocidade</span>
          </div>

          <div className="text-center">
            <CustomBadge variant="default" className="w-full">
              <FaHeart className='text-red-500' /> {monster.maxHp}
            </CustomBadge>
            <span className="text-xs text-gray-500 mt-1 block">Vida</span>
          </div>
        </div>
      </div>
    </div>
  );
};
