import React from 'react'
import styled from 'styled-components';
import { ObjectDetector } from './index';

const Detector = () => {
    const AppContainer = styled.div`
        width: 100%;
        height: 100%;
        background-color: #1c2127;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        `;

    return (
        <AppContainer>
            <ObjectDetector />
        </AppContainer>
    )
}

export default Detector