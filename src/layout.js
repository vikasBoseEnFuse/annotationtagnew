import React, { useState, useCallback, useRef, useEffect } from 'react';
import Annotation from 'react-image-annotation';
import { RectangleSelector } from 'react-image-annotation/lib/selectors';
import ReactCrop from 'react-image-crop';
import Magnifier from 'react-magnifier';
import ReactPolygonDrawer from 'react-polygon-drawer';
import canvasPreview from '../src/components/cropping/canvasPreview';

import 'cropperjs/dist/cropper.css';
import 'react-image-crop/dist/ReactCrop.css';
import '../src/components/cropping/cropping.css';
import './components/layout/layout.css';

const defaultSrc = `${process.env.PUBLIC_URL}/images/six.jpg`;

const Layout = () => {
  const [zoom, setZoom] = useState(1);
  const [cropSec, setCropSec] = useState(false);
  const [annotationSec, setAnnotationSec] = useState(false);
  const [magnifierSec, setMagnifierSec] = useState(false);
  const [polygonSec, setPolygonSec] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState({ width: 0, height: 0 });
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef('');
  const cropperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const defaultScale = 1.0;

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

  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper.getCroppedCanvas().toDataURL());
  }, []);

  const onChange = useCallback((annotation) => {
    setAnnotation(annotation);
  }, []);

  const onSubmit = useCallback((annotation) => {
    const { geometry, data } = annotation;
    setAnnotations((prevAnnotations) =>
      prevAnnotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      })
    );
  }, []);

  const onDownloadCropClick = useCallback(() => {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      console.log('Vikas=', blobUrlRef);
      blobUrlRef.current = URL.createObjectURL(blob);
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    });
  }, []);

  useEffect(() => {
    console.log('Annotations', annotations);
  }, [annotations]);

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate]);

  const onChangeType = (arg) => {
    if (arg === 'crop') {
      setMagnifierSec(false);
      setAnnotationSec(false);
      setCropSec(true);
    } else if (arg === 'rect') {
      setCropSec(false);
      setMagnifierSec(false);
      setAnnotationSec(true);
    } else if (arg === 'magnifier') {
      setCropSec(false);
      setAnnotationSec(false);
      setMagnifierSec(true);
    } else if (arg === 'cls') {
      setCropSec(false);
      setMagnifierSec(false);
      setAnnotationSec(false);
    } else if (arg === 'polygon') {
      setPolygonSec(true);
    }
  };

  return (
    <>
      <div className="polaroid">
        <div className="menu">
          <ul>
            <li>
              <img
                src={process.env.PUBLIC_URL + '/icons/magnifier_glass_icon.png'}
                alt="magnifierIcon"
                width={'20px'}
                onClick={() => onChangeType('magnifier')}
              />
            </li>
            <li>
              <img
                src={process.env.PUBLIC_URL + '/icons/crop_icon.png'}
                alt="cropIcon"
                onClick={() => onChangeType('crop')}
              />
              <ul>
                <li>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/icons/download_multimedia_file_icon.png'
                    }
                    alt="magnifierIcon"
                    width={'20px'}
                    onClick={() => onDownloadCropClick()}
                  />
                </li>
              </ul>
            </li>
            <li>
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/icons/design_graphic_rectangle_transform_icon.png'
                }
                alt="rectangleIcon"
                onClick={() => onChangeType('rect')}
              />
            </li>
            <li>
              <img
                src={
                  process.env.PUBLIC_URL + '/icons/polygon_thin_icon.png'
                }
                alt="polygonIcon"
                onClick={() => onChangeType('polygon')}
              />
            </li>
            <li>
              <img
                src={process.env.PUBLIC_URL + '/icons/delete_garbage_icon.png'}
                alt="deleteIcon"
                onClick={() => onChangeType('delete')}
              />
            </li>
            <li onClick={zoomIn}>
              <img
                src={process.env.PUBLIC_URL + '/icons/zoom_in_icon.png'}
                alt=""
              />
            </li>
            <li onClick={zoomOut}>
              <img
                src={process.env.PUBLIC_URL + '/icons/zoom_out_icon.png'}
                alt=""
              />
            </li>
            <li>
              <button onClick={() => onChangeType('cls')}>close</button>
            </li>
          </ul>
        </div>
        <div className="main">
          {cropSec && (
            <>
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
              >
                <img src={defaultSrc} style={{ width: '100%', height: '740px' }} />
              </ReactCrop>
            </>
          )}
          {annotationSec && (
            <>
              <Annotation
                src={defaultSrc}
                annotations={annotations}
                value={annotation}
                type={RectangleSelector.TYPE}
                onChange={onChange}
                onSubmit={onSubmit}
              />
            </>
          )}
          {magnifierSec && (
            <>
              <Magnifier
                
                src={process.env.PUBLIC_URL + "/images/six.jpg"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                id="mainimage"
                alt=""
              />
            </>
          )}
          {polygonSec && (
            <>
              <ReactPolygonDrawer
                src={defaultSrc}
                onComplete={(polygon) => console.log('Polygon points:', polygon)}
              />
            </>
          )}
        </div>
      </div>
      <canvas
        ref={previewCanvasRef}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      <a
        ref={hiddenAnchorRef}
        href={blobUrlRef.current}
        download="crop.png"
        style={{ display: 'none' }}
      >
        Download
      </a>
    </>
  );
};

export default Layout;
