import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceBoxes }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img src={ imageUrl } alt="" style={{width: "500px"}} height='auto' id='input-image'/>
                {faceBoxes.map(box => {
                    return <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                })}
            </div>
        </div>
    )
}
export default FaceRecognition;  