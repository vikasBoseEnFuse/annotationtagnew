import React, { useState, useCallback, useRef, useEffect } from 'react';
import Annotation from 'react-image-annotation';
import { RectangleSelector } from 'react-image-annotation/lib/selectors';
import ReactCrop from 'react-image-crop';
import Magnifier from "react-magnifier";
//import ReactPolygonDrawer from 'react-polygon-drawer';
import Canvas from "./containers/Canvas";
import useUndo from "use-undo";

import "cropperjs/dist/cropper.css";
import 'react-image-crop/dist/ReactCrop.css';
//import "../src/components/cropping/cropping.css";
import './components/layout/layout.css';


const defaultSrc = `${process.env.PUBLIC_URL}/images/six.jpg`;
const Layout = () => {
const [cropSec, setCropSec] = useState(false)
const [annotationSec, setAnnotationSec] = useState(false)
const [magnifierSec, setMegnifierSec] = useState(false)
const [polygonSec, setPolygonSec] = useState(false);
const [isPolygon,setIsPolygone] = useState(false);
const [annotations, setAnnotations] = useState([]);
const [annotation, setAnnotation] = useState({});
const [upImg, setUpImg] = useState();
const imgRef = useRef(null);
const defaultScale = 1.0;
const previewCanvasRef = useRef(null);
let [crop, setCrop] = useState({ unit: 'px', width: 0, aspect: 1, height: 0, x: 0, y: 0 });
const [completedCrop, setCompletedCrop] = useState(null);
const [brightness, setBrightness] = useState(100);

const [
    countState,
    {
      set: setCount,
      reset: resetCount,
      undo: undoCount,
      redo: redoCount,
      canUndo,
      canRedo
    }
  ] = useUndo({width:crop.width, height:crop.height, unit:crop.unit, x:crop.x, y:crop.y, aspect:1});

const [zoom, setZoom] = useState(1);
const [scale, setScale] = useState(1);

const { present: presentCount } = countState;
 
//console.log(crop, presentCount);

// on selecting file we set load the image on to cropper
const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
    }
};

const onLoad = useCallback((img) => {
    imgRef.current = img;
}, []);

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

const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
};

const zoomOut = () => {
    const newScale = scale - 0.1;

    if (newScale <= defaultScale) {
      setScale(defaultScale);
    } else {
      setScale(newScale);
    }
};
  const handleBrightnessChange = event => {
    setBrightness(event.target.value);
  };

/**
 * Cropping start
 */
function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropPreview.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
  }
  
function setCanvasImage(image, canvas, crop) {
    if (!crop || !canvas || !image) {
      return;
    }
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    const pixelRatio = window.devicePixelRatio;
  
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
  
    // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    setCount({width:crop.width - 10, height:crop.height -10, unit:crop.unit, x:crop.x - 10, y:crop.y - 10, aspect:1})
  }
/**
 * End
 */  


useEffect(() => {
    setCanvasImage(imgRef.current, previewCanvasRef.current, completedCrop);
  }, [completedCrop]);

const onChangeType = (arg)=> {
    console.log(arg);
    if(arg === 'crop') {
        setMegnifierSec(false);
        setAnnotationSec(false);
        setPolygonSec(false);
        setCropSec(true);
    } else if(arg === 'rect') {
        setCropSec(false);
        setMegnifierSec(false);
        setPolygonSec(false);
        setAnnotationSec(true);
    } else if(arg === 'magnifier') {
        setCropSec(false);
        setAnnotationSec(false);
        setPolygonSec(false);
        setMegnifierSec(true);
    } else if(arg === 'cls') {
        setCropSec(false);
        setMegnifierSec(false);
        setAnnotationSec(false);
        setPolygonSec(false);
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
                            <img src={process.env.PUBLIC_URL + "/icons/crop_icon.png"} alt='cropIcon' onClick={() =>{ onChangeType('crop');}} />
                        </li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/design_graphic_rectangle_transform_icon.png"} alt='rectangleIcon' onClick={() => onChangeType('rect')}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/polygon_thin_icon.png"} alt='polygonIcon' onClick={() =>{ onChangeType('polygon'); setIsPolygone(!isPolygon)}}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/arrow_back_undo_left_navigation_icon.png"} alt='undoIcon' onClick={() =>{ undoCount()}} disabled={!canUndo}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/arrow_forward_redo_navigation_right_icon.png"} alt='redoIcon' onClick={() =>{ setIsPolygone(!isPolygon)}}/></li>
                        <li><img src={process.env.PUBLIC_URL + "/icons/delete_garbage_icon.png"} alt='deleteIcon' onClick={() => onChangeType('delete')}/></li>
                        <li onClick={() => zoomIn()}><img src={process.env.PUBLIC_URL + '/icons/zoom_in_icon.png'} alt="zoomin"/></li>
                        <li onClick={() => zoomOut()}><img src={process.env.PUBLIC_URL + '/icons/zoom_out_icon.png'} alt="zoomout"/></li>
                        
                      <li><button onClick={() => onChangeType('cls')}>close</button></li>
                    </ul>
                </div>
                <div className="main">
                {cropSec && 
                    <>
                        <div>
                            <input type='file' accept='image/*' onChange={onSelectFile} />
                        </div>
                        <ReactCrop
                            src={upImg}
                            onImageLoaded={onLoad}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        />
                        <div>
                            {/* Canvas to display cropped image */}
                            <canvas
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                /* width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0), */
                                width: 60,
                                height: 60,
                            }}
                            />
                        </div>
                        <button type='button' disabled={!completedCrop?.width || !completedCrop?.height} onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}>
                            Download
                        </button>
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
                            style={{width: '100%', height: '740px',
                            objectFit: "cover",
                            transform: `scale(${scale})`,
                            transformOrigin: "top left",
                            filter: `brightness(${brightness}%)`}}
                            />
                            <input
                        type="range"
                        id="brightnessRange"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={handleBrightnessChange}

                            
                    
                            
                        />
                    </>
                }
                {magnifierSec && 
                    <>
                        <Magnifier 
                        src={process.env.PUBLIC_URL + "/images/six.jpg"}
                        style={{
                          mgwidth: "200%",
                          mgheight: "200%",
                          objectFit: "cover",
                          transform: `scale(${scale})`,
                          transformOrigin: "top left",
                          filter: `brightness(${brightness}%)`,
                        }}
                        id="mainimage"
                        alt=""
                      />
                      <input
                        type="range"
                        id="brightnessRange"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={handleBrightnessChange}
                            
                            />
                            
                    </>
                }
                {polygonSec && 
                    <>
                        {/* <img src={defaultSrc} style={{width: '100%', height: '740px'}} alt='ploygonimg'></img>
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
        </>
    )
}

export default Layout;
