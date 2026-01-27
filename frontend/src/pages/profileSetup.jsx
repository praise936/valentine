import React, { useState, useEffect, useRef } from 'react';
import './DollsAnimation.css';
import dolldone from '../assets/dolls.gif';
import dollwait from '../assets/lpg.gif';
import api from './api';
import audioFile from '../assets/audio.mp3';

const Afteryes = () => {
    return (
        <div className='container'>
            <img
                className='gif'
                src={dolldone}
                alt="Dolls kissing"
                style={{ width: "200px" }}
            />
            <h1>okay yay!!</h1>
        </div>
    )
}

const DollsAnimation = () => {
    const ndio = { content: "the person you sent the link to has agreed to your request" }
    const [agreed, setagreed] = useState(false)

    const [text, setText] = useState('No');
    const [textIndex, setTextIndex] = useState(0);
    const texts = [
        'No',
        'have heart',
        'but why?',
        'i  will cry',
        'surely',
        'but i love you',
        'be kind',
    ];

    const [yesSize, setYesSize] = useState({
        width: 80,
        height: 40,
        fontSize: 18,
        backgroundColor: 'rgb(18, 203, 18)'
    });

    const [noSize, setNoSize] = useState({
        width: 80,
        height: 40,
        fontSize: 18,
        backgroundColor: 'red',
        padding: '10px 16px',
        whiteSpace: 'nowrap',
        lineHeight: '1.2',
        transition: 'all 0.3s ease'
    });

    // Track if this is the first "No" click
    const [isFirstNoClick, setIsFirstNoClick] = useState(true);
    // Store the initial Yes button size to use as maximum for No button
    const [maxNoSize, setMaxNoSize] = useState({ width: 80, height: 40 });

    const audioRef = useRef(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // Function to calculate button dimensions for a given text
    const calculateButtonDimensions = (text, maxWidth, maxHeight, shouldShrinkHeight = false) => {
        const words = text.split(' ');
        const longestWordLength = Math.max(...words.map(word => word.length));

        // Calculate approximate width needed for text
        const avgCharWidth = 8;
        const textWidth = text.length * avgCharWidth;
        const minPadding = 20;

        // Calculate new width based on text length
        let newWidth = textWidth + minPadding;
        newWidth = Math.max(newWidth, 60); // Minimum width
        newWidth = Math.min(newWidth, maxWidth); // Never exceed maxWidth

        // Calculate if text should wrap
        const shouldWrap = textWidth > newWidth * 0.7 || words.length > 1;

        // Calculate height - always shrink if shouldShrinkHeight is true
        let newHeight = maxHeight;
        if (shouldShrinkHeight) {
            // Continuously shrink height
            newHeight = Math.max(25, maxHeight * 0.85); // Shrink to 85% of maxHeight, minimum 25px
        } else if (shouldWrap) {
            // For wrapped text, adjust height
            const lines = words.length > 1 ? Math.min(words.length, 3) : Math.ceil(text.length / 10);
            newHeight = 30 + (lines - 1) * 15;
            newHeight = Math.max(25, Math.min(newHeight, maxHeight));
        } else {
            // For single line, maintain reasonable height
            newHeight = Math.max(30, Math.min(40, maxHeight));
        }

        // Calculate font size
        const calculateFontSize = (width, height, text) => {
            const charsPerLine = shouldWrap ? Math.ceil(text.length / Math.ceil(text.length / 10)) : text.length;
            const widthBasedSize = (width / charsPerLine) * 0.8;
            const heightBasedSize = (height / (shouldWrap ? 1.5 : 1)) / 1.2;

            let fontSize = Math.min(widthBasedSize, heightBasedSize);
            fontSize = Math.max(10, Math.min(16, fontSize)); // Reduced max font size
            return Math.floor(fontSize);
        };

        const newFontSize = calculateFontSize(newWidth, newHeight, text);

        return {
            width: newWidth,
            height: newHeight,
            fontSize: newFontSize,
            whiteSpace: shouldWrap ? 'normal' : 'nowrap',
            lineHeight: shouldWrap ? '1.1' : 'normal',
            padding: shouldWrap ? '6px 10px' : '8px 12px'
        };
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
        // Play audio
        playAudio();

        // Store the current Yes size as max for No button on first click
        if (isFirstNoClick) {
            setMaxNoSize({
                width: Math.max(yesSize.width * 0.9, 80), // 90% of Yes button width or 80px min
                height: Math.max(yesSize.height * 0.9, 40) // 90% of Yes button height or 40px min
            });
            setIsFirstNoClick(false);
        }

        // Increase Yes button size
        setYesSize(prev => {
            const newWidth = prev.width * 1.9; // Reduced growth rate
            const newHeight = prev.height * 1.9; // Reduced growth rate

            // Recalculate font size for Yes button
            const fontSize = Math.min(22, Math.max(16, Math.min(newWidth / 3, newHeight / 1.5)));

            return {
                ...prev,
                width: newWidth,
                height: newHeight,
                fontSize: fontSize,
                padding: `${Math.min(newHeight * 0.15, 12)}px ${Math.min(newWidth * 0.15, 20)}px`
            };
        });

        // Update maxNoSize to ensure it's always less than Yes button size
        setMaxNoSize(prev => ({
            width: Math.min(prev.width, yesSize.width * 0.9), // Max 90% of Yes width
            height: Math.max(20, prev.height * 0.85) // Shrink height by 15% each time, minimum 20px
        }));

        // Calculate next text
        const nextIndex = (textIndex + 1) % texts.length;
        const nextText = texts[nextIndex];

        // Calculate dimensions for No button
        const newDimensions = calculateButtonDimensions(
            nextText,
            maxNoSize.width,
            maxNoSize.height,
            true // Always shrink height
        );

        // Update No button with all properties at once
        setNoSize(prev => ({
            ...prev,
            ...newDimensions,
            backgroundColor: 'red',
            transition: 'all 0.3s ease'
        }));

        // Update text and index
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

    const handleYes = (e) => {
        setagreed(true)
        sending()
    };

    const baseButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    if (agreed) {
        return <Afteryes />
    }

    return (
        <div className='container'>
            <audio
                ref={audioRef}
                src={audioFile}
                preload="auto"
                loop={false}
            />

            <img
                className='gif'
                src={dollwait}
                alt="Dolls kissing"
                style={{ width: "200px" }}
            />
            <h1>Will you be my Valentine?</h1>
            <div className='buttons'>
                <button
                    style={{
                        ...baseButtonStyle,
                        width: `${yesSize.width}px`,
                        height: `${yesSize.height}px`,
                        fontSize: `${yesSize.fontSize}px`,
                        backgroundColor: yesSize.backgroundColor,
                        padding: yesSize.padding || '8px 16px'
                    }}
                    className='yes'
                    onClick={handleYes}
                >
                    Yes
                </button>
                <button
                    style={{
                        ...baseButtonStyle,
                        width: `${noSize.width}px`,
                        height: `${noSize.height}px`,
                        fontSize: `${noSize.fontSize}px`,
                        backgroundColor: noSize.backgroundColor,
                        padding: noSize.padding || '8px 16px',
                        whiteSpace: noSize.whiteSpace || 'nowrap',
                        lineHeight: noSize.lineHeight || '1.2'
                    }}
                    className='no'
                    onClick={handleNO}
                >
                    {text}
                </button>
            </div>
        </div>
    );
};

export default DollsAnimation;