import React, { useState, useEffect } from 'react';
import './DollsAnimation.css';
import dolldone from '../assets/dolls.gif';
import dollwait from '../assets/lpg.gif';
import api from './api';
const Afteryes = ()=>{
    return(
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
    const ndio = {content:"the person you sent the link to has agreed to your request"}
    const [agreed, setagreed] = useState(false)
    
    const [text, setText] = useState('No');
    const [textIndex, setTextIndex] = useState(0);
    const texts = [
        'No',
        'dont do that sweetie',
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
        padding: '5px 10px'
    });

    // Calculate optimal font size based on button dimensions and text
    const calculateFontSize = (width, height, text) => {
        const words = text.split(' ');
        const longestWord = Math.max(...words.map(word => word.length));
        const lineHeight = 1.2;

        // Base calculation on button dimensions
        const widthBasedSize = (width / longestWord) * 0.8;
        const heightBasedSize = (height / words.length) / lineHeight;

        // Take the smaller of the two to ensure text fits
        let fontSize = Math.min(widthBasedSize, heightBasedSize);

        // Apply constraints
        fontSize = Math.max(10, Math.min(24, fontSize));

        return Math.floor(fontSize);
    };

    // Calculate if text should wrap
    const shouldWrapText = (width, text) => {
        const avgCharWidth = 8; // Approximate width of a character in pixels
        const textWidth = text.length * avgCharWidth;
        return textWidth > width * 0.8; // Wrap if text exceeds 80% of button width
    };

    const handleNO = () => {
        // Increase Yes button size
        setYesSize(prev => {
            const newWidth = prev.width * 1.5;
            const newHeight = prev.height * 1.5;
            return {
                ...prev,
                width: newWidth,
                height: newHeight,
                fontSize: calculateFontSize(newWidth, newHeight, 'Yes'),
                padding: `${Math.min(newHeight * 0.1, 15)}px ${Math.min(newWidth * 0.15, 20)}px`
            };
        });

        // Decrease No button size but keep minimum
        setNoSize(prev => {
            const newWidth = Math.max(prev.width * 1.1, 60); // Increased minimum width
            const newHeight = Math.max(prev.height * 0.1, 35); // Increased minimum height
            const nextTextIndex = (textIndex + 1) % texts.length;
            const newText = texts[nextTextIndex];
            const wrapText = shouldWrapText(newWidth, newText);

            return {
                ...prev,
                width: newWidth,
                height: wrapText ? newHeight * 1.1 : newHeight, // Increase height if wrapping needed
                fontSize: calculateFontSize(newWidth, newHeight, newText),
                padding: `${Math.min(newHeight * 0.1, 8)}px ${Math.min(newWidth * 0.1, 12)}px`,
                whiteSpace: wrapText ? 'normal' : 'nowrap'
            };
        });

        // Cycle through texts
        const nextIndex = (textIndex + 1) % texts.length;
        setTextIndex(nextIndex);
        setText(texts[nextIndex]);
    };
    const sending = async()=>{
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

    // Base button style
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
        textOverflow: 'ellipsis'
    };
    if (agreed){
        return(
            <Afteryes />
        )
    }
    return (
        
        <div className='container'>
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
                        minHeight: `${noSize.height}px`,
                        fontSize: `${noSize.fontSize}px`,
                        backgroundColor: noSize.backgroundColor,
                        padding: noSize.padding || '8px 16px',
                        whiteSpace: noSize.whiteSpace || 'nowrap',
                        lineHeight: '1.2'
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