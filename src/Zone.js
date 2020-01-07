import React from 'react';

function Zone({ children, name }) {
  return (
    <div className={`Zone Zone--${name}`}>
      {children}
    </div>
  );
}

export default Zone;
