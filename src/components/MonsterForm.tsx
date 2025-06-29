import { useState } from 'react';
import { FaFistRaised, FaShieldAlt, FaBolt, FaHeart, FaImage  } from 'react-icons/fa';
import type { Monster } from '../types/monster';

interface MonsterFormProps {
  onSubmit: (monster: Omit<Monster, 'id' | 'maxHp'>) => void;
  onCancel: () => void;
}

const CustomButton = ({
  children,
  onClick,
  type = 'button',
  className = '',
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';

  const variantClasses = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  };

  return (
    <button type={type} className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const CustomInput = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
}: {
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}) => {
  const numberInputClasses =
    type === 'number'
      ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]'
      : '';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${numberInputClasses} ${className}`}
    />
  );
};


const CustomLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
};

export const MonsterForm = ({ onSubmit, onCancel }: MonsterFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    attack: 50,
    defense: 40,
    speed: 30,
    hp: 100,
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.imageUrl) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ['attack', 'defense', 'speed', 'hp'].includes(field)
        ? Math.max(1, parseInt(value) || 1)
        : value,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">🐲 Criar Novo Monstro</h3>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <CustomLabel>Nome do Monstro</CustomLabel>
            <CustomInput
              placeholder="Digite o nome do monstro"
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomLabel>
                <FaFistRaised className="inline mr-1 text-green-500" /> Ataque
              </CustomLabel>
              <CustomInput
                type="number"
                value={formData.attack}
                onChange={(value) => updateField('attack', value)}
                required
              />
            </div>
            <div className="space-y-2">
              <CustomLabel>
                <FaShieldAlt className="inline mr-1 text-blue-500" /> Defesa
              </CustomLabel>
              <CustomInput
                type="number"
                value={formData.defense}
                onChange={(value) => updateField('defense', value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomLabel>
                <FaBolt className="inline mr-1 text-yellow-500" /> Velocidade
              </CustomLabel>
              <CustomInput
                type="number"
                value={formData.speed}
                onChange={(value) => updateField('speed', value)}
                required
              />
            </div>
            <div className="space-y-2">
              <CustomLabel>
                <FaHeart className="inline mr-1 text-red-500" /> HP
              </CustomLabel>
              <CustomInput
                type="number"
                value={formData.hp}
                onChange={(value) => updateField('hp', value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <CustomLabel>
              <FaImage className="inline mr-1 text-purple-500" /> URL da Imagem
            </CustomLabel>
            <CustomInput
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.imageUrl}
              onChange={(value) => updateField('imageUrl', value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <CustomButton type="submit" className="flex-1">
              Criar Monstro
            </CustomButton>
            <CustomButton type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
