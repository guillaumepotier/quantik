import React from 'react';

import './Piece.css';

function Piece({ type, color, allowed, onPieceClick }) {
  return (
    <div className={`Piece Piece--${!allowed ? 'notAllowed' : 'allowed'} Piece--${color} Piece--${type}`} onClick={onPieceClick}>
    </div>
  );
}

export default Piece;
