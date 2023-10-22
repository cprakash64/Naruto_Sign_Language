import example1 from '../images/example1.mp4';
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';

export default function S4() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);


    
    const [words, setWords] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/get-words')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);  // This should print your words
            })
            .catch(error => {
                console.log("There was a problem with the fetch operation:", error.message);
            });
    }, []);

    const videoConstraints = {
        width: 1280, // Width of the video
        height: 720, // Height of the video
        facingMode: 'user', // Use the front-facing camera
    };


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
        <div className='my-10'>
            <p className="text-center text-4xl font-bold my-2 text-indigo-900">
                EchoSign is easy to use and accessible to all.
            </p>

            <div className="grid grid-cols-2 mt-8">

                <div className="flex justify-center items-center mx-4">
                    <p className="text-xl text-center font-lightbold px-4">
                        <span className="font-bold">Step 1:</span>

                        <br />
                        Launch EchoSign
                    </p>

                    <p className="text-xl text-center font-lightbold  px-6">
                        <span className="font-bold">Step 2:</span>

                        <br />
                        Wait for Camera
                        <br />
                        to Show up
                    </p>


                    <p className="text-xl text-center font-lightbold px-4">
                        <span className="font-bold">Step 3:</span>

                        <br />
                        Begin Translating
                    </p>


                </div>

                <div>
                    <video ref={videoRef} controls>
                        <source src={example1} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <button onClick={togglePlay}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>

                </div>
            </div>

            <div className="bg-white p-3 rounded-2xl m-4">

                <p className="text-center text-4xl font-bold mt-6 text-indigo-900">
                    Participate in Video Calls without Any Barriers Today!
                </p>
                <div className={`flex flex-col items-center justify-center ${isCameraOn ? "min-h-screen" : ""}`}> {/* Conditionally apply min-h-screen */}
                    {isCameraOn ? <Webcam videoConstraints={videoConstraints} /> : null}
                </div>
                <div className="flex items-center justify-center my-4">
                    <button 
                        onClick={() => setIsCameraOn(!isCameraOn)} 
                        className="flex items-center justify-center font-bold p-4 text-white bg-indigo-900 rounded-xl text-2xl"
                    >
                        {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    </button>
                </div>
                <ul>
                    {words.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
            </div>


        </div>
    );
}
