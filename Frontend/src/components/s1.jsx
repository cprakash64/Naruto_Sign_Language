<<<<<<< HEAD


export default function S1() {
    return (
        <div className="py-11 mt-20 mb-10">
            <h1 className=" mt-6 font-bold max-w-xl py-3 px-6 leading-snug rounded-2xl text-5xl text-indigo-900">
                Revolutionizing Video Calls for
                People with
                Sensory difficulties
            </h1>
        </div>
    )

}
=======
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
>>>>>>> origin/Final
