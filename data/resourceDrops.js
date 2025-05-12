import Resource from '../classes/Resource.js';

export function getRandomResource() {
    const types = [
      {
        type: "Plant",
        color: "#4CAF50",
        baseHp: 30,
        rewards: { "Plant": 3 }
      },
      {
        type: "Timber",
        color: "#8B4513",
        baseHp: 50,
        rewards: { "Timber": 2 }
      },
      {
        type: "Stone",
        color: "#999",
        baseHp: 60,
        rewards: { "Stone": 1 }
      },
    ];
  
    const choice = types[Math.floor(Math.random() * types.length)];
    const size = 15 + Math.random() * 20;
    const hp = choice.baseHp + Math.random() * 40;
  
    return new (require('../classes/Resource.js').default)(
      Math.random() * 300 + 20,
      Math.random() * 400 + 20,
      size,
      hp,
      choice.type,
      choice.color,
      choice.rewards
    );
  }
  