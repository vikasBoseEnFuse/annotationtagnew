import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import './layoutannotation.css';


const Layout = ({ children }) => {
    const [show, toggleShow] = useState(true);

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
        /*execute a function when someone moves the magnifier glass over the image:*/
        glass.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("mousemove", moveMagnifier);
        /*and also for touch screens:*/
        glass.addEventListener("touchmove", moveMagnifier);
        img.addEventListener("touchmove", moveMagnifier);
        function moveMagnifier(e) {
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
          glass.style.left = ((x - w)*400)+ "px";
          glass.style.top = ((y - h)*900) + "px";
          /*display what the magnifier glass "sees":*/
          glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
        }
        function getCursorPos(e) {
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
      };
    
    let onChangeImage = () => {
        console.log("hello")
    }
    
    useEffect(() => {
        magnify("mainimage", 3);
    }, []);
    
    return (
        <>
        {!show && <Button onClick={() => toggleShow(true)}>Show</Button>}
        <Toast show={show} onClose={() => toggleShow(false)} style={{width: '2000px'}}>
            <Button style={{marginTop:'5px', marginLeft:'1000px'}} onClick={() => onChangeImage()}>Previous</Button><Button style={{marginTop:'5px', marginLeft:'80px'}} onClick={() => onChangeImage()}>Next</Button>
            {/* <Toast.Header></Toast.Header> */}
            <Toast.Body>
                <table width={'1300px'}>
                    <tbody>
                    <tr>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td width={'30px'} >
                        <div id='one'><img src={process.env.PUBLIC_URL+"/icons/zoom_in_icon.png"} alt=''/></div><br/>
                        <div id='two'><img src={process.env.PUBLIC_URL+"/icons/zoom_out_icon.png"} alt=''/></div><br/>
                        <div id='three'><img src={process.env.PUBLIC_URL+"/icons/copy_icon.png"} alt=''/></div><br/>
                        <div id='four'><img src={process.env.PUBLIC_URL+"/icons/edit_paste_icon.png"} alt=''/></div><br/>
                        <div id='five'><img src={process.env.PUBLIC_URL+"/icons/crop_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/arrow_back_undo_left_navigation_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/arrow_forward_redo_navigation_right_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/design_graphic_rectangle_transform_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/oval_icon.png"} alt=''/></div><br/>
                        <div id='six'><img src={process.env.PUBLIC_URL+"/icons/polygon_thin_icon.png"} alt=''/></div><br/>
                        <div style={{marginBottom: '200px'}} id='seven'><img src={process.env.PUBLIC_URL+"/icons/delete_garbage_icon.png"} alt=''/></div>
                        </td>
                        <td width={'700px'} height={'720px'} style={{border: '1px solid #000'}}><img src={process.env.PUBLIC_URL+"/images/one.jpg"} width={'1100px'} height={'720px'} id='mainimage' alt=''/></td>
                        <td width={'200px'}></td>
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
