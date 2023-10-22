import example1 from '../images/example1.mp4';
import React, { useState, useRef } from 'react';

export default function S4() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div>
            <video ref={videoRef} controls>
                <source src={example1} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <button onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
}
