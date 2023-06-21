import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import Canvas from 'containers/Canvas';
import Rectangle from 'component/Rectangle';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop
} from 'react-image-crop';
import canvasPreview from 'component/cropping/canvasPreview';
import 'react-image-crop/dist/ReactCrop.css';
import Detector from 'component/objectDetector/Detector';

const Layout = () => {
  const [isRect, setIsRect] = useState(false);
  const [addRect, setAddRect] = useState(1);
  const [isPolygon, setIsPolygone] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [isDetector,setIsDetector] = useState(false);
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
    setIsDetector(false);
  }

  const cropStyle = {
    width: '80vw', 
    height: '500px',
   }
  
  // const [annotations, setAnnotations] = useState([])
  const [annotation, setAnnotation] = useState({})
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState({ width: 0, height: 0 })
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const hiddenAnchorRef = useRef(null)
  const blobUrlRef = useRef('')
  const cropperRef = useRef(null);
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper.getCroppedCanvas().toDataURL());
  };

  const onChange = (annotation) => {
    setAnnotation(annotation)
  }

  // const onSubmit = (annotation)=> {
  //     const { geometry, data } = annotation
  //     setAnnotations(annotations.concat({
  //         geometry,
  //         data: {
  //           ...data,
  //           id: Math.random()
  //         }
  //     }))
  // }

  const onDownloadCropClick = () => {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      console.log("Vikas=", blobUrlRef);
      blobUrlRef.current = URL.createObjectURL(blob)
      hiddenAnchorRef.current.href = blobUrlRef.current
      hiddenAnchorRef.current.click()
    })
  }

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate,
      )
    }
  })

  
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
            <div className={`icon-container ${isDetector ? 'icon-bg' : ''}`} 
             onClick={() => { initFun(); setIsDetector(!isDetector) }}><i className="bi bi-eye-fill"></i></div>
          </div>
          <div id='sub_panal'>
            {isRect ? <label onClick={() => { setAddRect(addRect + 1) }}>Add Rectangle</label> : null}
            {isPolygon ? <label>Polygon</label> : null}
            {isCrop ? <label>Crop</label> : null}
          </div>
        </div>
        <section id='img_sec' className=''>
          {/* image */}
          <img id='main_img' className={`${isCrop||isDetector?'remove':''}`} src='images/ten.jpg' />
          {/* polygon */}
          {isPolygon ? <Canvas /> : null}
          {/* Rectangle */}
          {isRect ? <Rectangle isRect={isRect} addRectCount={addRect} /> : null}
          {/* Crop */}
          {isCrop &&
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}>
                <img src={process.env.PUBLIC_URL + "/images/ten.jpg"} style={cropStyle} />
              </ReactCrop>
          }
          {/* Obj-detector */}
          {isDetector?<Detector/>:null}
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

export default Layout;