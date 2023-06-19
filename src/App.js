import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [isRect, setIsRect] = useState(false);
  const [isPolygon, setIsPolygone] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [documentSec, setDocumentSec] = useState(false);
  const [imageSec, setImageSec] = useState(false);
  const [videoSec, setVideoSec] = useState(false);
  const [audioSec, setAudioSec] = useState(false);
  const initDrawer = () => {
    setDocumentSec(false);
    setImageSec(false);
    setVideoSec(false);
    setAudioSec(false);
  }
  const initFun = () => {
    setIsCrop(false);
    setIsPolygone(false);
    setIsRect(false);
  }
  return (
    <div id='super_wrapper'>
      <div id='upper_sec'></div>
      <div id='main_wrapper'>
        <div className='side_panal'>
          <div className='icon_wrapper'>
            <div className='icon-container'><i className="icon bi bi-zoom-in"></i></div>
            <div className='icon-container'><i className="icon bi bi-zoom-out"></i></div>
            <div className={`icon-container ${isCrop ? 'icon-bg' : ''}`}
              onClick={() => { initFun(); setIsCrop(!isCrop) }}
            ><i className="icon bi bi-crop"></i></div>
            <div className={`icon-container ${isRect ? 'icon-bg' : ''}`}
              onClick={() => { initFun(); setIsRect(!isRect) }}
            ><i className="icon bi bi-square"></i></div>
            <div className={`icon-container ${isPolygon ? 'icon-bg' : ''}`}
              onClick={() => { initFun(); setIsPolygone(!isPolygon) }}
            ><img id='pol_icon' src='images/polygon.png' alt='polygone' /></div>
          </div>
          <div id='sub_panal'>
          </div>
        </div>
        <section id='img_sec' className=''>
          {/* image */}
          <img id='main_img' src='images/ten.jpg' />
        </section>
        <div id='right_sub_panal'>
          <div className='right_icon_wrapper' onClick={() => { initDrawer(); setDocumentSec(true) }}><i className="bi bi-file-earmark-text"></i></div>
          <div className='right_icon_wrapper' onClick={() => { initDrawer(); setImageSec(true) }}><i className="bi bi-card-image"></i></div>
          <div className='right_icon_wrapper' onClick={() => { initDrawer(); setVideoSec(true) }}><i className="bi bi-youtube"></i></div>
          <div className='right_icon_wrapper' onClick={() => { initDrawer(); setAudioSec(true) }}><i className="bi bi-music-note-beamed"></i></div>
          <div className='right_icon_wrapper'><i className="bi bi-plus-lg"></i></div>
        </div>
        {documentSec ? <div className='right_drawer'>
          <div className='drawer_header'>
            <label>Document tag</label> <i onClick={() => { setDocumentSec(!documentSec) }} className="bi bi-x-square"></i>
          </div>
        </div> : null}
        {imageSec ? <div className='right_drawer'>
          <div className='drawer_header'>
            <label>Image tag</label> <i onClick={() => { setImageSec(!imageSec) }} className="bi bi-x-square"></i>
          </div>
        </div> : null}
        {videoSec ? <div className='right_drawer'>
          <div className='drawer_header'>
            <label>Video tag</label> <i onClick={() => { setVideoSec(!videoSec) }} className="bi bi-x-square"></i>
          </div>
        </div> : null}
        {audioSec ? <div className='right_drawer'>
          <div className='drawer_header'>
            <label>Audio tag</label> <i onClick={() => { setAudioSec(!audioSec) }} className="bi bi-x-square"></i>
          </div>
        </div> : null}
      </div>
    </div>
  )
}

export default App;