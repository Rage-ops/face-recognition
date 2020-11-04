import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceBoxes }) => {
    return (
        <div>
            {   
                imageUrl ?<p>Number of faces detected : {faceBoxes.length}</p>:<p></p>
            }
            <div className='center ma'>
                <div className='absolute mt-2'>
                    <img src={ imageUrl } alt="" style={{width: "500px"}} height='auto' id='input-image'/>
                    {faceBoxes.map(box => {
                        return <div key={box.id} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                    })}
                </div>
            </div>
        </div>
    )
}
export default FaceRecognition;  