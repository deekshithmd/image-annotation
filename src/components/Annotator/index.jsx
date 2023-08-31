import { useEffect, useRef, useState } from "react";
import { Images } from "../../config";
import "./annotator.css";

export default function Annotator() {
  // States
  const [index, setIndex] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [dimension, setDimension] = useState({ height: 0, width: 0 });
  // Refs
  const canvasRef = useRef();
  const canvasOffset = useRef();
  const offsetX = useRef();
  const offsetY = useRef();
  const contextRef = useRef();

  useEffect(() => {
    // Storing canvas data
    canvasOffset.current = canvasRef?.current?.getBoundingClientRect();
    offsetX.current = canvasOffset?.current?.left;
    offsetY.current = canvasOffset?.current?.top;
  }, []);

  useEffect(() => {
    // Updating canvas
    handleCanvasUpdate();

    // Cleanup to reset the canvas
    return () => {
      contextRef.current.reset();
    };
  }, [index]);

  const handleCanvasUpdate = () => {
    // Clearing the canvas to remove unsaved changes
    let r = contextRef?.current?.reset();

    // Creating context and drawing the boxes
    contextRef.current = canvasRef?.current?.getContext("2d");
    const result = Images[index]?.annotations?.forEach((item) => {
      contextRef.current.strokeStyle = "red";
      contextRef.current.strokeWidth = "2px";
      contextRef.current.strokeRect(
        item?.x,
        item?.y,
        item?.width,
        item?.height
      );
    });
  };

  // function to navigate to next
  const handleNext = () => {
    if (index < Images?.length - 2) {
      setIndex((prev) => prev + 1);
    } else {
      setIndex(0);
    }
  };

  // function to navigate to back
  const handleBack = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    } else {
      setIndex(Images?.length - 1);
    }
  };

  // function to handle mouse click
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMouseDown(true);
    // setStart({ x: 0, y: 0 });
    // setDimension({ height: 0, width: 0 });
    setStart({
      x: e.clientX - offsetX.current,
      y: e.clientY - offsetY.current
    });
  };

  // function to handle mouse release
  const handleMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Images[index].annotations.push({
    //   x: start?.x,
    //   y: start?.y,
    //   width: dimension.width,
    //   height: dimension.height
    // });
    setIsMouseDown(false);

    // If changes not saved in 5s changes will be removed
    setTimeout(() => handleCanvasUpdate(), 5000);
  };

  // function to handle mouse move
  const handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMouseDown) {
      return;
    }

    // get the current mouse position
    const mouseX = e.clientX - offsetX.current;
    const mouseY = e.clientY - offsetY.current;
    contextRef.current.clearRect(
      // This is to show other boxes while drawing new box
      // start?.x + 2,
      // start?.y + 2,
      // mouseX - start?.x + 2,
      // mouseY - start?.y + 2
      // This is to not show other boxes while drawing new box
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Store the height and width to the state for future reference
    setDimension({ height: mouseY - start?.y, width: mouseX - start?.x });

    contextRef.current.strokeStyle = "red";
    contextRef.current.strokeWidth = "2px";
    // drawing box from clicked position to current mouse position
    contextRef.current.strokeRect(
      start?.x,
      start?.y,
      dimension.width,
      dimension.height
    );
  };

  // function to handle when mouse move out
  const handleMouseOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMouseDown(false);
  };

  // function to save the changes
  const handleSave = () => {
    Images[index].annotations.push({
      x: start?.x,
      y: start?.y,
      width: dimension.width,
      height: dimension.height
    });
    handleCanvasUpdate();
  };

  // function to download the json data
  const handleSubmit = () => {
    const id = Images[index]?.id;
    const annotations = Images[index]?.annotations?.map((annotation) => {
      // return statement to return x1,y1,x2,y2 points
      // const x1 = annotation?.y + annotation?.height;
      // const y1 = annotation?.y;
      // const x2 = annotation?.x + annotation?.width;
      // const y2 = annotation?.y + annotation?.height;

      // return {
      //   x1,
      //   y1,
      //   x2,
      //   y2
      // };

      // Return statement to return the coordinates of the point
      return {
        x1:
          "(" +
          annotation?.x +
          "," +
          (annotation?.y + annotation?.height) +
          ")",
        y1: "(" + annotation?.x + "," + annotation?.y + ")",
        x2:
          "(" + (annotation?.x + annotation?.width) + "," + annotation?.y + ")",
        y2:
          "(" +
          (annotation?.x + annotation?.width) +
          "," +
          (annotation?.y + annotation?.height) +
          ")"
      };
    });

    const jsonData = {
      [id]: annotations
    };
    // Creating json string
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(jsonData)
    )}`;

    // Creating anchor tag and assign download attribute
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  return (
    <div className="container">
      <div className="canvas-container">
        <button className="navigation" onClick={() => handleBack()}>
          Back
        </button>

        <canvas
          ref={canvasRef}
          className="myCanvas"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${Images[index]?.image})`,
            backgroundRepeat: "no-repeat"
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        />
        <button className="navigation" onClick={() => handleNext()}>
          Next
        </button>
      </div>
      <button className="action-btn" onClick={() => handleSave()}>
        Save
      </button>
      <button className="action-btn" onClick={() => handleSubmit()}>
        Submit
      </button>
    </div>
  );
}
