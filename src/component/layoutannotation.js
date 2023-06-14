import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import Annotation from "react-image-annotation";
import {
  RectangleSelector,
  OvalSelector,
} from "react-image-annotation/lib/selectors";
import "./layoutannotation.css";

const Layout = ({ children }) => {
  const [show, toggleShow] = useState(true);
  const [scale, setScale] = useState(1);

  const zoomIn = () => {
    console.log("Zoom Inn");
    argShow = false;
    setScale(scale + 0.1);
  };

  const defaultScale = 1.0;

  const zoomOut = () => {
    console.log("Zoom Out");
    argShow = false;

    const newScale = scale - 0.1;

    if (newScale <= defaultScale) {
      setScale(defaultScale);
    } else {
      setScale(newScale);
    }
  };

  const onChangeImage = (direction) => {
    // Implement logic to change the image based on the direction (previous or next)
    console.log("Image changed:", direction);
  };

  useEffect(() => {
    console.log("Annotations");
  }, []);
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
    glass.style.backgroundSize =
      img.width * zoom + "px " + img.height * zoom + "px";
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
      if (x > img.width - w / zoom) {
        x = img.width - w / zoom;
      }
      if (x < w / zoom) {
        x = w / zoom;
      }
      if (y > img.height - h / zoom) {
        y = img.height - h / zoom;
      }
      if (y < h / zoom) {
        y = h / zoom;
      }
      /*set the position of the magnifier glass:*/
      glass.style.left = x - w + "px";
      glass.style.top = y - h + "px";
      /*display what the magnifier glass "sees":*/
      glass.style.backgroundPosition =
        "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
    };
    let getCursorPos = (e) => {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    };

    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
  };

  let openMagnifyGlass = (arg) => {
    console.log("Vikas=", arg);
    if (arg === true) {
      magnify("mainimage", 2);
    }
  };

  useEffect(() => {
    console.log("Annotations");
  }, []);

  return (
    <>
      <>
        {!show && <Button onClick={() => toggleShow(true)}>Show</Button>}
        <Toast
          className="toast"
          show={show}
          onClose={() => toggleShow(false)}
          style={{ width: "100%" }}
        >
          <Button
            className="button"
            style={{ marginTop: "5px", marginLeft: "calc(50% - 100px)" }}
            onClick={() => onChangeImage("previous")}
          >
            Previous
          </Button>
          <Button
            className="button"
            style={{ marginTop: "5px", marginLeft: "20px" }}
            onClick={() => onChangeImage("next")}
          >
            Next
          </Button>

          <Toast.Body className="toast-body">
            {/* Rest of the code */}
            {/* <div className='img-magnifier-container'>
            <img
              src={process.env.PUBLIC_URL + "/images/six.jpg"}
              width={1000 * scale} // Apply the scale to the width
              height={720 * scale} // Apply the scale to the height
              id='mainimage'
              alt=''
            /> 
          </div> */}
            {/* Rest of the code */}
          </Toast.Body>
        </Toast>
      </>

      <Toast.Body className="toast-body">
        <table
          style={{ width: "100%", maxWidth: "1100px" }}
          className="responsive"
        >
          <tbody>
            <tr>
              {/* <td colSpan={2}></td> */}
              <td></td>
            </tr>
            <tr>
              <td width={"30px"}>
                <div id="seven" onClick={() => openMagnifyGlass(argShow)}>
                  <img
                    src={
                      process.env.PUBLIC_URL + "/icons/magnifier_glass_icon.png"
                    }
                    alt=""
                  />
                </div>
                <br />
                <div id="one" onClick={() => zoomIn()}>
                  <img
                    src={process.env.PUBLIC_URL + "/icons/zoom_in_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="two" onClick={() => zoomOut()}>
                  <img
                    src={process.env.PUBLIC_URL + "/icons/zoom_out_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="three">
                  <img
                    src={process.env.PUBLIC_URL + "/icons/copy_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="four">
                  <img
                    src={process.env.PUBLIC_URL + "/icons/edit_paste_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="five">
                  <img
                    src={process.env.PUBLIC_URL + "/icons/crop_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="six">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/icons/arrow_back_undo_left_navigation_icon.png"
                    }
                    alt=""
                  />
                </div>
                <br />
                <div id="six">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/icons/arrow_forward_redo_navigation_right_icon.png"
                    }
                    alt=""
                  />
                </div>
                <br />
                <div id="six">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/icons/design_graphic_rectangle_transform_icon.png"
                    }
                    alt=""
                  />
                </div>
                <br />
                <div id="six">
                  <img
                    src={process.env.PUBLIC_URL + "/icons/oval_icon.png"}
                    alt=""
                  />
                </div>
                <br />
                <div id="six">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/icons/polygon_thin_icon.png"
                    }
                    alt=""
                  />
                </div>
                <br />
                <div style={{ marginBottom: "200px" }} id="seven">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/icons/delete_garbage_icon.png"
                    }
                    alt=""
                  />
                </div>
              </td>

              <td style={{ border: "1px solid #000" }}>
                <div
                  className="img-magnifier-container"
                  style={{
                    position: "relative",
                    width: "1000px",
                    height: "720px",
                    overflow: "hidden",
                  }}
                >
                  <img
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
                </div>
              </td>

              <td width={"200px"}>
                <div class="panel-group" style={{ marginBottom: "300px" }}>
                  <div class="panel panel-default">
                    <div class="panel-body">Annotations</div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-body">Panel Content</div>
                  </div>
                </div>
                <div class="panel-group" style={{ marginBottom: "300px" }}>
                  <div class="panel panel-default">
                    <div class="panel-body">Tags</div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-body">Panel Content</div>
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
      {/* </Toast> */}
    </>
  );
};

export default Layout;
