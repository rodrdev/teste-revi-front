
import { useState, useEffect } from 'react';
import type { Monster } from '../types/monster';

const STORAGE_KEY = 'battle-monsters';

const defaultMonsters: Monster[] = [
  {
    id: '1',
    name: 'Bulbasaur',
    attack: 85,
    defense: 60,
    speed: 70,
    hp: 120,
    maxHp: 120,
    imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png'
  },
  {
    id: '2',
    name: 'Charmander',
    attack: 90,
    defense: 50,
    speed: 95,
    hp: 100,
    maxHp: 100,
    imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png'
  },
  {
    id: '3',
    name: 'Squirtle ',
    attack: 60,
    defense: 90,
    speed: 40,
    hp: 150,
    maxHp: 150,
    imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png'
  }
];

export const useMonsters = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedMonsters = JSON.parse(saved);
        setMonsters(parsedMonsters);
      } catch (error) {
        console.error('Error loading monsters from localStorage:', error);
        setMonsters(defaultMonsters);
      }
    } else {
      setMonsters(defaultMonsters);
    }
  }, []);

  const saveMonsters = (newMonsters: Monster[]) => {
    setMonsters(newMonsters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMonsters));
  };

  const addMonster = (monster: Omit<Monster, 'id' | 'maxHp'>) => {
    const newMonster: Monster = {
      ...monster,
      id: Date.now().toString(),
      maxHp: monster.hp,
    };
    saveMonsters([...monsters, newMonster]);
  };

const updateMonster = (id: string, updatedMonster: Partial<Monster>) => {
  const newMonsters: Monster[] = monsters.map((monster: Monster) =>
    monster.id === id ? { ...monster, ...updatedMonster } as Monster : monster
  );
  saveMonsters(newMonsters);
};
  const removeMonster = (id: string) => {
    const newMonsters = monsters.filter((monster: { id: string; }) => monster.id !== id);
    saveMonsters(newMonsters);
  };

  return {
    monsters,
    addMonster,
    updateMonster,
    removeMonster,
  };
};
