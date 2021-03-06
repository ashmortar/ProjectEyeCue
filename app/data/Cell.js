export default class Cell {
  constructor(name) {
    this.name = name;
    this.value = 5;
    this.imageKey = 0;
    this.imageDecorKey = 0;
    this.imageFogKey = 0;
    this.humanEdges = [];
    this.monsterEdges = [];
    this.searched = false;
    this.parent = null;
    this.isHighlighted = false;
    this.isRevealed = false;
    this.isSemiRevealed = false;
    this.hasHuman = false;
    this.hasMonster = false;
    this.hasCache = false;
    this.hasBlessedCache = false;
    this.hasDesecratedCache = false;
    this.wasPounced = false;
    this.wasEchoed = false;
  }
}
