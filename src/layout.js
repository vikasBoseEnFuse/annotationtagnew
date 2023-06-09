import React, { useState, useCallback, useRef, useEffect } from 'react';
import Annotation from 'react-image-annotation';
import { RectangleSelector } from 'react-image-annotation/lib/selectors';
//import Cropper from "react-cropper";
//import Cropper from 'react-easy-crop';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop} from 'react-image-crop';
import Magnifier from "react-magnifier";
import ReactPolygonDrawer from 'react-polygon-drawer';
import Canvas from './components/polygon/canvas';
import canvasPreview from '../src/components/cropping/canvasPreview';
//import Demo from './cropping';

import "cropperjs/dist/cropper.css";
import 'react-image-crop/dist/ReactCrop.css';
import "../src/components/cropping/cropping.css";
import './components/layout/layout.css';


const defaultSrc = `${process.env.PUBLIC_URL}/images/six.jpg`;
const Layout = () => {
//const [crop, setCrop] = useState({ x: 0, y: 0 })
const [zoom, setZoom] = useState(1)
const [cropSec, setCropSec] = useState(false)
const [annotationSec, setAnnotationSec] = useState(false)
const [magnifierSec, setMegnifierSec] = useState(false)
const [polygonSec, setPolygonSec] = useState(false);
const [annotations, setAnnotations] = useState([])
const [annotation, setAnnotation] = useState({})
const [crop, setCrop] = useState();
const [completedCrop, setCompletedCrop] = useState({ width:0, height:0})
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

const onChange = (annotation)=> {
    setAnnotation(annotation)
}

const onSubmit = (annotation)=> {
    const { geometry, data } = annotation
    setAnnotations(annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random()
        }
    }))
}

const onDownloadCropClick = ()=> {
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
      console.log("Vikas=",blobUrlRef);
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

const onChangeType = (arg)=> {
    console.log(arg);
    if(arg === 'crop') {
        setMegnifierSec(false);
        setAnnotationSec(false);
        setCropSec(true);
    } else if(arg === 'rect') {
        setCropSec(false);
        setMegnifierSec(false);
        setAnnotationSec(true);
    } else if(arg === 'magnifier') {
        setCropSec(false);
        setAnnotationSec(false);
        setMegnifierSec(true);
    } else if(arg === 'cls') {
        setCropSec(false);
        setMegnifierSec(false);
        setAnnotationSec(false);
    } else if(arg === 'polygon') {
        setPolygonSec(true);
    }
}
    return (
        <>
            <div className="polaroid">                
                <div className="menu">
                    <ul>
                        <li>
                            <img src={process.env.PUBLIC_URL + "/icons/magnifier_glass_icon.png"} alt="magnifierIcon" width={'20px'} onClick={() => onChangeType('magnifier')} />
                        </li>
                        <li>
                            <img src={process.env.PUBLIC_URL + "/icons/crop_icon.png"} alt='cropIcon' onClick={() => onChangeType('crop')} />
                            <ul>
                                <li><img src={process.env.PUBLIC_URL + "/icons/download_multimedia_file_icon.png"} alt="magnifierIcon" width={'20px'} onClick={() => onDownloadCropClick()} /></li>
                            </ul>
                        </li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/design_graphic_rectangle_transform_icon.png"} alt='rectangleIcon' onClick={() => onChangeType('rect')}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/polygon_thin_icon.png"} alt='polygonIcon' onClick={() => onChangeType('polygon')}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/delete_garbage_icon.png"} alt='deleteIcon' onClick={() => onChangeType('delete')}/></li>
                        <li><button onClick={() => onChangeType('cls')}>close</button></li>
                    </ul>
                </div>
                <div className="main">
                {cropSec && 
                    <>
                        <ReactCrop 
                            crop={crop} 
                            onChange={c => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}>
                            <img src={defaultSrc} style={{width: '100%', height: '740px'}}/>
                        </ReactCrop>
                    </> 
                }
                {annotationSec && 
                    <>
                        <Annotation 
                            src={defaultSrc}
                            annotations={annotations}
                            value={annotation}
                            type={RectangleSelector.TYPE}
                            onChange={onChange}
                            onSubmit={onSubmit}
                            style={{width: '100%', height: '740px'}}
                        />
                    </>
                }
                {magnifierSec && 
                    <>
                        <Magnifier 
                            src={defaultSrc} 
                            width={'100%'}
                            height={'740px'}
                            zoomFactor={1.5}
                            mgWidth={200}
                            mgHeight={200} />;
                    </>
                }
                {polygonSec && 
                    <>
                        {/* <img src={defaultSrc} style={{width: '100%', height: '740px'}}></img>
                        <ReactPolygonDrawer 
                            width={400} 
                            height={400} 
                        /> */}
                        <Canvas />
                    </>
                }
                </div> 
                <div className="sidebar"></div>      
            </div>
            <canvas 
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: '80px',
                height: '80px',
              }}
            />
        </>
    )
}

export default Layout;
