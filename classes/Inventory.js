export default class Inventory {
    constructor(cap = 20) {
      this.cap = cap;
      this.items = {
        "Gold": 0,
        "Plant Cord": 0,
        "Timber": 0,
        "Stone": 0,
        "Relics": 0
      };
    }
  
    add(item, amount) {
      if (!this.items.hasOwnProperty(item)) return;
  
      this.items[item] += amount;
      if (this.items[item] > this.cap) {
        this.items[item] = this.cap;
      }
    }
  
    get(item) {
      return this.items[item] ?? 0;
    }
  
    getAll() {
      return this.items;
    }
  
    getCap() {
      return this.cap;
    }
  }
  