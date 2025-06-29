
import type { Monster, BattleRound, BattleResult } from '../types/monster';

export const calculateDamage = (attacker: Monster, defender: Monster): number => {
  const baseDamage = attacker.attack - defender.defense;
  return baseDamage <= 0 ? 1 : baseDamage;
};

export const determineFirstAttacker = (monster1: Monster, monster2: Monster): [Monster, Monster] => {
  if (monster1.speed > monster2.speed) {
    return [monster1, monster2];
  } else if (monster2.speed > monster1.speed) {
    return [monster2, monster1];
  } else {
    return monster1.attack >= monster2.attack ? [monster1, monster2] : [monster2, monster1];
  }
};

export const simulateBattle = (monster1: Monster, monster2: Monster): BattleResult => {
  const fighter1: Monster = { ...monster1, hp: monster1.maxHp };
  const fighter2: Monster = { ...monster2, hp: monster2.maxHp };
  
  const [firstAttacker, firstDefender] = determineFirstAttacker(fighter1, fighter2);
  
  const rounds: BattleRound[] = [];
  let currentAttacker = firstAttacker;
  let currentDefender = firstDefender;
  let roundNumber = 1;

  while (fighter1.hp > 0 && fighter2.hp > 0) {
    const damage = calculateDamage(currentAttacker, currentDefender);
    
    if (currentDefender.id === fighter1.id) {
      fighter1.hp = Math.max(0, fighter1.hp - damage);
    } else {
      fighter2.hp = Math.max(0, fighter2.hp - damage);
    }

    rounds.push({
      round: roundNumber,
      attacker: { ...currentAttacker },
      defender: { ...currentDefender },
      damage,
      attackerHpAfter: currentAttacker.id === fighter1.id ? fighter1.hp : fighter2.hp,
      defenderHpAfter: currentDefender.id === fighter1.id ? fighter1.hp : fighter2.hp,
    });

    [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
    roundNumber++;

    if (roundNumber > 100) {
      break;
    }
  }

  const winner = fighter1.hp > 0 ? fighter1 : fighter2;
  const loser = fighter1.hp <= 0 ? fighter1 : fighter2;

  return {
    winner,
    loser,
    rounds,
    totalRounds: rounds.length,
  };
};


