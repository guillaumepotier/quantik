class Player {
  constructor (color) {
    this.color = color;
    this.pieces = [
      'square', 'square',
      'triangle', 'triangle',
      'circle', 'circle',
      'cross', 'cross'
    ];
    this.lastPlay = false;
  }
}

export default Player;
