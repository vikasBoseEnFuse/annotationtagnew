import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import Annotation from 'react-image-annotation'
import {
    RectangleSelector,
    OvalSelector
  } from 'react-image-annotation/lib/selectors'
import './layoutannotation.css';
import mocks from '../../mocks';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

var classname = 'container';
let cropper;

const Layout = ({ children }) => {
    const [show, toggleShow] = useState(true);
    const [type, setType] = useState(RectangleSelector.TYPE);
    const [annotations, setAnnotations] = useState({});
    const [annotation, setAnnotation] = useState({});
    const [imgageId, setimgageId] = useState('');
    //const [cn, classname ] = useState('container')
    let argShow = true;

    let magnify = (imgID, zoom) => {
        var img, glass, w, h, bw;
        img = document.getElementById(imgID);
        /*create magnifier glass:*/
        glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
        /*insert magnifier glass:*/
        img.parentElement.insertBefore(glass, img);
        /*set background properties for the magnifier glass:*/
        glass.style.backgroundImage = "url('" + img.src + "')";
        glass.style.backgroundRepeat = "no-repeat";
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
        bw = 3;
        w = glass.offsetWidth / 2;
        h = glass.offsetHeight / 2;
        
        let moveMagnifier = (e) => {
          var pos, x, y;
          /*prevent any other actions that may occur when moving over the image*/
          e.preventDefault();
          /*get the cursor's x and y positions:*/
          pos = getCursorPos(e);
          x = pos.x;
          y = pos.y;
          /*prevent the magnifier glass from being positioned outside the image:*/
          if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
          if (x < w / zoom) {x = w / zoom;}
          if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
          if (y < h / zoom) {y = h / zoom;}
          /*set the position of the magnifier glass:*/
          glass.style.left = ((x - w))+ "px";
          glass.style.top = ((y - h)) + "px";
          /*display what the magnifier glass "sees":*/
          glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
        }
        let getCursorPos = (e) => {
          var a, x = 0, y = 0;
          e = e || window.event;
          /*get the x and y positions of the image:*/
          a = img.getBoundingClientRect();
          /*calculate the cursor's x and y coordinates, relative to the image:*/
          x = e.pageX - a.left;
          y = e.pageY - a.top;
          /*consider any page scrolling:*/
          x = x - window.pageXOffset;
          y = y - window.pageYOffset;
          return {x : x, y : y};
        }

        /*execute a function when someone moves the magnifier glass over the image:*/
        glass.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("mousemove", moveMagnifier);
        /*and also for touch screens:*/
        glass.addEventListener("touchmove", moveMagnifier);
        img.addEventListener("touchmove", moveMagnifier);
      };
    
    let onChangeImage = () => {
        console.log("hello")
    }

    let zoomIn = () => {
        console.log("Vikas Bose");
        argShow = false;        
    }

    let onChangeType = (e) => {

    }
    let croppable = false;    
    let cropping = () => {
        const image = document.getElementById('mainimage');
        cropper = new Cropper(image, {
            aspectRatio: 16 / 9,
            viewMode: 2,
            autoCrop: false,
            background: false,
            ready() {
                this.cropper.move(1, -1);
                croppable = true;
            }
        });
        cropper.crop();
    }

    let openMagnifyGlass = (arg) => {
        const image = document.getElementById('mainimage');
        if(arg===true) {
             classname = 'img-magnifier-container';
             magnify("mainimage", 2);
            cropper = new Cropper(image);
            cropper.clear();
        }
     }

    let onChangeVal = (annotation) => {
        this.setState({ annotation })
    }

    let onSubmit = (annotation) => {
        /* const { geometry, data } = annotation
    
        this.setState({
          annotation: {},
          annotations: this.state.annotations.concat({
            geometry,
            data: {
              ...data,
              id: Math.random()
            }
          })
        });
       //axios.post('http://localhost:6075/api/tag/insert', {g: geometry, d: {...data, id: Math.floor(Math.random() * 100), imgname:(this.state.imgageId==='')?'one.jpg':this.state.imgageId}}) 
        axios.post('http://localhost:6075/api/tag/insert', {g: geometry, d: {...data, id: Math.floor(Math.random() * 100), imgname:'one.jpg'}})
          .then((res) => {
             console.log(res);
          }).catch(error => {
            console.log(error);
          }); */
      }
    
    useEffect(() => {
        console.log('Annotations');       
    }, []);
    
    return (
        <>
        {!show && <Button onClick={() => toggleShow(true)}>Show</Button>}
        <Toast className="toast" show={show} onClose={() => toggleShow(false)} style={{width: '100%'}}>
            <Button className="button" style={{marginTop:'5px', marginLeft:'calc(50% - 100px)'}} onClick={() => onChangeImage()}>Previous</Button><Button className="button" style={{marginTop:'5px', marginLeft:'20px'}} onClick={() => onChangeImage()}>Next</Button>
            {/* <Toast.Header></Toast.Header> */}
            <Toast.Body className="toast-body">
                <table style={{width: '100%', maxWidth: '1100px'}} className="responsive">
                    <tbody>
                    <tr>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td width={'30px'} >
                        <div id='seven' onClick={()=> openMagnifyGlass(argShow)}><img src={process.env.PUBLIC_URL+"/icons/magnifier_glass_icon.png"} alt=''/></div><br/>
                        <div id='one' onClick={()=> zoomIn()}><img src={process.env.PUBLIC_URL+"/icons/zoom_in_icon.png"} alt='' id='zoomin'/></div><br/>
                        <div id='two'><img src={process.env.PUBLIC_URL+"/icons/zoom_out_icon.png"} alt=''/></div><br/>
                        <div id='three'><img src={process.env.PUBLIC_URL+"/icons/copy_icon.png"} alt=''/></div><br/>
                        <div id='four'><img src={process.env.PUBLIC_URL+"/icons/edit_paste_icon.png"} alt=''/></div><br/>
                        <div id='five' className="dropright">
                            {/* <img src={process.env.PUBLIC_URL+"/icons/crop_icon.png"} alt='' className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/> */}
                            <input type="image" src={process.env.PUBLIC_URL+"/icons/crop_icon.png"} alt="Submit" width="20" height="20" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dLabel"></input>
                            <div className="dropdown-menu" aria-labelledby="dLabel">
                                <a href='#' onClick={()=>cropping()}>crop</a>
                                <a>store</a>
                            </div>
                        </div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/arrow_back_undo_left_navigation_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/arrow_forward_redo_navigation_right_icon.png"} alt=''/></div><br/>
                        <div id='six' onClick={()=>onChangeType()}><img src={process.env.PUBLIC_URL+"/icons/design_graphic_rectangle_transform_icon.png"} alt={RectangleSelector.TYPE}/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/oval_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/polygon_thin_icon.png"} alt=''/></div><br/>
                        <div style={{marginBottom: '200px'}} id='seven'><img src={process.env.PUBLIC_URL+"/icons/delete_garbage_icon.png"} alt=''/></div>
                        </td>
                        <td style={{border: '1px solid #000'}}>
                            {/* <div className='img-magnifier-container container'> */}

                            <Annotation
                                src={process.env.PUBLIC_URL+`/images/six.jpg`}
                                alt='Two pebbles anthropomorphized holding hands'

                                annotations={annotations}

                                type={type}
                                value={annotation}
                                onChange={() => onChangeVal()}
                                onSubmit={() => onSubmit()}
                                id='mainimage'
                            />


                            <div className={classname}>
                                <img src={process.env.PUBLIC_URL+"/images/six.jpg"} width={'1000px'} height={'720px'} id='mainimage' alt='' />
                            </div>
                        </td>
                        <td width={'200px'}>
                            <div className="panel-group" style={{marginBottom: '300px'}}>
                                <div className="panel panel-default">
                                    <div className="panel-body">Annotations</div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-body">Panel Content</div>
                                </div>
                            </div>
                            <div className="panel-group" style={{marginBottom: '300px'}}>
                                <div className="panel panel-default">
                                    <div className="panel-body">Tags</div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-body">Panel Content</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}></td>
                    </tr>
                    </tbody>
                </table>
                Annotated Folders
                <span role="img" aria-label="tada">
                    🎉
                </span>
          </Toast.Body>
        </Toast>
        </>
    );
};

export default Layout;
