// components/CameraFeed.jsx
import React, { useRef, useEffect } from 'react';

function CameraFeed() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing the camera:', err);
        });
    }
  }, []);

  return (<video 
  ref={videoRef} 
  autoPlay 
  style={{ width: '100vw', height: '80vh', objectFit: 'cover' }}
/>);
}

export default CameraFeed;

