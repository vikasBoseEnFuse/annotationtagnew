import React, { useMemo, useRef, useState, useEffect, useImperativeHandle } from "react";
import PolygonAnnotation from "../components/polygon/PolygonAnnotation";
import { Stage, Layer, Image } from "react-konva";
import Button from "../components/polygon/Button";

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: 0,
  backgroundColor: "aliceblue",
};
const columnStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 0,
  backgroundColor: "aliceblue",
};
const Canvas = React.forwardRef((props, ref) => {
  const [image, setImage] = useState();
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [redoPoints, setRedoPoints] = useState([]);
  const { videoSource, imgBrightness } = props;
  const videoElement = useMemo(() => {
    const element = new window.Image();
    element.width = 1260;
    element.height = 650;
    element.src = videoSource;
    element.style = imgBrightness;
    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSource]); //it may come from redux so it may be dependency that's why I left it as dependecny...
  //const {videoElement} = props;
  useEffect(() => {
    const onload = function () {
      setSize({
        width: videoElement.width,
        height: videoElement.height,
      });
      setImage(videoElement);
      imageRef.current = videoElement;
    };
    videoElement.addEventListener("load", onload);
    return () => {
      videoElement.removeEventListener("load", onload);
    };
  }, [videoElement]);
  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };
  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);
  const undo = () => {
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      setPoints(points.slice(0, -1));
      setRedoPoints([...redoPoints, lastPoint]); // Add the undone point to the redo history
      setPosition(lastPoint);
    }
  };

  const redo = () => {
    if (redoPoints.length > 0) {
      const lastRedoPoint = redoPoints[redoPoints.length - 1];
      setRedoPoints(redoPoints.slice(0, -1));
      setPoints([...points, lastRedoPoint]); // Add the redone point back to the points array
      setPosition(lastRedoPoint);
    }
  };

  const reset = () => {
    setPoints([]);
    setRedoPoints([]);
    setPolyComplete(false);
    setPosition(null);
  };
  useImperativeHandle(ref, () => ({
    undo: undo,
    redo: redo
  }));
  const handleGroupDragEnd = (e) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };
  console.log(imgBrightness)
  return (
    <div style={wrapperStyle}>
      <div style={columnStyle}>
        <Stage
          width={size.width || 650}
          height={size.height || 302}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            <Image
              ref={imageRef}
              image={image}
              x={0}
              y={0}
              width={size.width}
              height={size.height}
            />
            <PolygonAnnotation
              points={points}
              flattenedPoints={flattenedPoints}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              isFinished={isPolyComplete}
            />
          </Layer>
        </Stage>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="dn">
            {/* <Button name="Undo" onClick={undo} /> */}
            <Button name="Reset" onClick={reset} />
            {/* <Button name="Redo " onClick={redo} /> */}
          </div>
        </div>
      </div>
      {/* <div
        ref={dataRef}
        style={{
          width: 375,
          height: 302,
          boxShadow: ".5px .5px 5px .4em rgba(0,0,0,.1)",
          marginTop: 20,
        }}
      >
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(points)}</pre>
      </div> */}
    </div>
  );
});

export default Canvas;