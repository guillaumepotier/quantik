import React from 'react';

import './Piece.css';

function Piece({ type, color, onPieceClick }) {
  return (
    <div className={`Piece Piece--${color} Piece--${type}`} onClick={onPieceClick}>
    </div>
  );
}

export default Piece;
