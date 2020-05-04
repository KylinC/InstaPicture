import React from 'react'
import PropTypes from 'prop-types'
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';

const ImageList = ({photoImages}) => {
    return (
        <PhotoProvider>
            {photoImages.map((item, index) => (
                <PhotoConsumer key={index} src={item} intro={item}>
                    <img src={item} alt="" onClick={console.log("aa")} />
                </PhotoConsumer>
            ))}
        </PhotoProvider>
    );
}

FileList.propTypes={
    photoImages: PropTypes.array
}

export default ImageList