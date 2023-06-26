import React,{useEffect, useState} from 'react'
import './rectangle.css'

const Rectangle = ({isRect,addRectCount}) => {
    const newRect = {
        initX: 0,
        initY: 0,
        width: 0,
        height: 0,
        clickCounter: 0,
        txt: ''
    }
    const rectStyle = {top:'0px',
    bottom:'0px',
    left:'0px',
    right:'0px',
    position:'absolute'}
    const [rect, setRect] = useState([newRect])
    const [txt, setTxt] = useState('')
    const addRect = () => {
        setRect([...rect, newRect])
    }

    const clickRectHandle = (event) => {
        if (rect[rect.length - 1].clickCounter == 0 && isRect) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, clickCounter: item.clickCounter + 1, initX: event.screenX - 230, initY: event.screenY - 130 }
                }
                else {
                    return item
                }
            })
            setRect(newArr)
            return
        }
        if (rect[rect.length - 1].clickCounter <= 2) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, clickCounter: item.clickCounter + 1 }
                } else {
                    return item
                }
            })
            setRect(newArr)
        }
    }

    const mouseMoveRectHandle = (event) => {
        if (rect[rect.length - 1].clickCounter == 1 && isRect) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, width: event.screenX - (item.initX + 230), height: event.screenY - (item.initY + 130) }
                }
                else {
                    return item
                }
            })
            setRect(newArr)
        }
    }

    const submitHandle = () => {
        if (rect[rect.length - 1].clickCounter == 3) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, txt: txt, clickCounter: item.clickCounter + 1 }
                } else {
                    return item
                }
            })
            setRect(newArr)
        }
    }
    useEffect(()=>{
        addRect()
    },[addRectCount])
    return (
        <div style={rectStyle} onClick={(e) => { clickRectHandle(e) }} onMouseMove={(e) => { mouseMoveRectHandle(e) }}>
            {/* rectangle */}
            {rect.map((item, index) => {
                return (<div key={index} className={`rectangle ${item.width == 0 && item.height == 0 ? 'hide' : ''}`}
                    style={{ width: item.width, height: item.height, left: item.initX + 'px', top: item.initY + 'px', position: 'absolute' }} >

                    {item.clickCounter == 3 ? <div className='child1'>
                        Input Description
                        <input type='text' onChange={(e) => { setTxt(e.target.value) }} />
                        <button onClick={() => submitHandle()} >Submit</button>
                    </div> : null}
                    {item.clickCounter == 4 ? <div className='child2'>{item.txt}</div> : null}

                </div>)
            })}
        </div>
    )
}

export default Rectangle