
export interface Monster {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  maxHp: number;
  imageUrl: string;
}

export interface BattleRound {
  round: number;
  attacker: Monster;
  defender: Monster;
  damage: number;
  attackerHpAfter: number;
  defenderHpAfter: number;
}

export interface BattleResult {
  winner: Monster;
  loser: Monster;
  rounds: BattleRound[];
  totalRounds: number;
}

export interface BattleState {
  monster1: Monster;
  monster2: Monster;
  currentRound: number;
  rounds: BattleRound[];
  isActive: boolean;
  winner?: Monster;
}
