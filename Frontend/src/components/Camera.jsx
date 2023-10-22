// Camera.js
import React from 'react';
import Webcam from 'react-webcam';

const Camera = ({ isActive }) => {
  if (!isActive) return null;
  return <Webcam />;
};

export default Camera;