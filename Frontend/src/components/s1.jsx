import React from 'react';

function S1({ showCamera, setShowCamera }) {
  return (
    <button onClick={() => setShowCamera(!showCamera)}
    className="font-bold p-4 text-white bg-indigo-900 rounded-xl"
    >
      {showCamera ? 'Hide Camera' : 'Show Camera'}
    </button>
  );
}

export default S1;
