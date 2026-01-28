import React, { useState, useEffect, useRef } from 'react';
import './DollsAnimation.css';
import api from './api';
import audioFile from '../assets/audio.mp3';

// Import all the flower images
import flower1 from '../assets/joy1.gif';  // First bouquet
import flower2 from '../assets/joy2.gif';  // Second bouquet
import flower3 from '../assets/joy3.gif';  // Third bouquet
import flower4 from '../assets/joy4.jpeg'; // Special bouquet
// import blushEffect from '../assets/blush-effect.gif'; // You might want to add a blush effect image

const AfterYes = () => {
    return (
        <div className='container blush-container'>
            <div className="flower-showcase">
                <img
                    className='flower-gif main-flower'
                    src={flower4}
                    alt="Special bouquet for Joy"
                    style={{ width: "250px" }}
                />
                <div className="blush-overlay"></div>
            </div>
            <h1 className="blush-text">Yay! Joy said YES! 💖</h1>
            <p className="romantic-message">Every flower here blooms just for you, my love</p>

            <div className="flower-gallery">
                <img src={flower1} alt="Bouquet 1" className="gallery-flower" />
                <img src={flower2} alt="Bouquet 2" className="gallery-flower" />
                <img src={flower3} alt="Bouquet 3" className="gallery-flower" />
            </div>

            <div className="heart-rain">💖🌸🌹💐🌺🌷💖</div>
        </div>
    )
}

const DollsAnimation = () => {
    const ndio = { content: "Joy has agreed to be my Valentine! 🌸💖" }
    const hapana = { content: "Joy is being shy... but we know she'll say yes! 😊" }
    const [agreed, setAgreed] = useState(false)
    const [blushLevel, setBlushLevel] = useState(0)
    const [currentFlower, setCurrentFlower] = useState(flower1)
    const [showHearts, setShowHearts] = useState(false)

    const [text, setText] = useState('No');
    const [textIndex, setTextIndex] = useState(0);
    const texts = [
        'No',
        'Are you sure?',
        'Think again!',
        'I made these flowers for you',
        'Pretty please?',
        'My heart beats for you',
        'Say yes, Joy! 💖',
    ];

    const [yesSize, setYesSize] = useState({
        width: 100,
        height: 50,
        fontSize: 20,
        backgroundColor: 'linear-gradient(135deg, #ff6b9d, #ff3366)',
        boxShadow: '0 4px 15px rgba(255, 51, 102, 0.3)'
    });

    const [noSize, setNoSize] = useState({
        width: 80,
        height: 40,
        fontSize: 18,
        backgroundColor: 'rgba(255, 107, 107, 0.8)',
        padding: '10px 16px',
        whiteSpace: 'nowrap',
        lineHeight: '1.2',
        transition: 'all 0.3s ease'
    });

    const [isFirstNoClick, setIsFirstNoClick] = useState(true);
    const [maxNoSize, setMaxNoSize] = useState({ width: 80, height: 40 });

    const audioRef = useRef(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const containerRef = useRef(null);

    // Blush effect whenever Joy interacts
    const triggerBlush = () => {
        setBlushLevel(prev => Math.min(prev + 1, 10));
        setShowHearts(true);

        // Cycle through flowers on each interaction
        const flowers = [flower1, flower2, flower3, flower4];
        const nextFlower = flowers[(flowers.indexOf(currentFlower) + 1) % flowers.length];
        setCurrentFlower(nextFlower);

        setTimeout(() => setShowHearts(false), 2000);
    };

    const playAudio = () => {
        if (audioRef.current && !isAudioPlaying) {
            audioRef.current.currentTime = 0;
            audioRef.current.play()
                .then(() => {
                    setIsAudioPlaying(true);
                })
                .catch(error => {
                    console.log("Audio play failed:", error);
                });
        }
    };

    useEffect(() => {
        const audioElement = audioRef.current;
        const handleAudioEnded = () => setIsAudioPlaying(false);
        const handleAudioError = () => setIsAudioPlaying(false);

        if (audioElement) {
            audioElement.addEventListener('ended', handleAudioEnded);
            audioElement.addEventListener('error', handleAudioError);
            return () => {
                audioElement.removeEventListener('ended', handleAudioEnded);
                audioElement.removeEventListener('error', handleAudioError);
            };
        }
    }, []);

    const handleNO = () => {
        playAudio();
        triggerBlush();
        rejecting();

        if (isFirstNoClick) {
            setMaxNoSize({
                width: Math.max(yesSize.width * 0.9, 80),
                height: Math.max(yesSize.height * 0.9, 40)
            });
            setIsFirstNoClick(false);
        }

        setYesSize(prev => {
            const newWidth = prev.width * 1.8;
            const newHeight = prev.height * 1.8;
            const fontSize = Math.min(24, Math.max(18, Math.min(newWidth / 3, newHeight / 1.5)));

            return {
                ...prev,
                width: newWidth,
                height: newHeight,
                fontSize: fontSize,
                padding: `${Math.min(newHeight * 0.15, 12)}px ${Math.min(newWidth * 0.15, 20)}px`,
                backgroundColor: 'linear-gradient(135deg, #ff6b9d, #ff3366)',
                boxShadow: `0 6px 20px rgba(255, 51, 102, ${0.3 + blushLevel * 0.1})`
            };
        });

        setMaxNoSize(prev => ({
            width: Math.min(prev.width, yesSize.width * 0.9),
            height: Math.max(25, prev.height * 0.85)
        }));

        const nextIndex = (textIndex + 1) % texts.length;
        const nextText = texts[nextIndex];

        const calculateButtonDimensions = (text, maxWidth, maxHeight, shouldShrinkHeight = false) => {
            const words = text.split(' ');
            const avgCharWidth = 8;
            const textWidth = text.length * avgCharWidth;
            const minPadding = 20;

            let newWidth = textWidth + minPadding;
            newWidth = Math.max(newWidth, 60);
            newWidth = Math.min(newWidth, maxWidth);

            const shouldWrap = textWidth > newWidth * 0.7 || words.length > 1;

            let newHeight = maxHeight;
            if (shouldShrinkHeight) {
                newHeight = Math.max(25, maxHeight * 0.85);
            }

            let fontSize = Math.min(16, Math.max(12, newWidth / (text.length * 0.6)));

            return {
                width: newWidth,
                height: newHeight,
                fontSize: fontSize,
                whiteSpace: shouldWrap ? 'normal' : 'nowrap',
                lineHeight: shouldWrap ? '1.1' : 'normal',
                padding: shouldWrap ? '6px 10px' : '8px 12px'
            };
        };

        const newDimensions = calculateButtonDimensions(
            nextText,
            maxNoSize.width,
            maxNoSize.height,
            true
        );

        setNoSize(prev => ({
            ...prev,
            ...newDimensions,
            backgroundColor: `rgba(255, ${100 - blushLevel * 10}, ${100 - blushLevel * 10}, 0.8)`,
            transition: 'all 0.3s ease'
        }));

        setText(nextText);
        setTextIndex(nextIndex);
    };

    const sending = async () => {
        try {
            const sent = await api.post('post/', ndio)
            console.log(sent)
        } catch (error) {
            console.log('failed to send the response');
        }
    }

    const rejecting = async () => {
        try {
            const sent = await api.post('post/', hapana)
            console.log(sent)
        } catch (error) {
            console.log('failed to send the response');
        }
    }

    const handleYes = (e) => {
        triggerBlush();
        setBlushLevel(10);
        setTimeout(() => {
            setAgreed(true);
            sending();
        }, 1500);
    };

    const baseButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontFamily: '"Dancing Script", cursive, "Segoe UI", sans-serif'
    };

    if (agreed) {
        return <AfterYes />
    }

    return (
        <div
            className='container joy-container'
            ref={containerRef}
            style={{
                background: blushLevel > 0
                    ? `radial-gradient(circle at 50% 50%, rgba(255,182,193,${blushLevel * 0.1}), rgba(255,240,245,0.95))`
                    : 'linear-gradient(135deg, #fff0f5, #ffe4e9)'
            }}
        >
            <audio
                ref={audioRef}
                src={audioFile}
                preload="auto"
                loop={false}
            />

            <div className="flower-display">
                <img
                    className='flower-main'
                    src={currentFlower}
                    alt="Flowers for Joy"
                    style={{
                        width: "220px",
                        filter: blushLevel > 0 ? `hue-rotate(${blushLevel * 5}deg)` : 'none',
                        transition: 'all 0.5s ease'
                    }}
                />
                {showHearts && (
                    <div className="heart-burst">
                        {[...Array(15)].map((_, i) => (
                            <span
                                key={i}
                                className="heart"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${1 + Math.random() * 2}s`
                                }}
                            >
                                {['💖', '🌸', '🌹', '💐', '🌺'][i % 5]}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="blush-indicator" style={{ opacity: blushLevel * 0.1 }}>
                <div className="blush-circle left"></div>
                <div className="blush-circle right"></div>
            </div>

            <h1 className="question">Joy, will you be my Valentine? 💌</h1>
            <p className="subtext">Every flower whispers your name...</p>

            <div className='buttons'>
                <button
                    style={{
                        ...baseButtonStyle,
                        width: `${yesSize.width}px`,
                        height: `${yesSize.height}px`,
                        fontSize: `${yesSize.fontSize}px`,
                        background: yesSize.backgroundColor,
                        padding: yesSize.padding || '12px 24px',
                        boxShadow: yesSize.boxShadow,
                        transform: `scale(${1 + blushLevel * 0.02})`
                    }}
                    className='yes-button joy-yes'
                    onClick={handleYes}
                    onMouseEnter={triggerBlush}
                >
                    Yes 💖
                </button>
                <button
                    style={{
                        ...baseButtonStyle,
                        width: `${noSize.width}px`,
                        height: `${noSize.height}px`,
                        fontSize: `${noSize.fontSize}px`,
                        backgroundColor: noSize.backgroundColor,
                        padding: noSize.padding || '10px 20px',
                        whiteSpace: noSize.whiteSpace || 'nowrap',
                        lineHeight: noSize.lineHeight || '1.2',
                        opacity: 1 - (blushLevel * 0.05)
                    }}
                    className='no-button joy-no'
                    onClick={handleNO}
                >
                    {text}
                </button>
            </div>

            <div className="flower-petals">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="petal"
                        style={{
                            animationDelay: `${i * 0.5}s`,
                            background: blushLevel > 0
                                ? `rgba(255, ${182 - blushLevel * 10}, 193, 0.7)`
                                : 'rgba(255, 182, 193, 0.4)'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default DollsAnimation;