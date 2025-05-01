import { useEffect, useState, useRef } from "react";
import { useRenderSelector } from "../store/hooks";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

function Viewer2d() {
  const fileData = useRenderSelector((state) => state.file.data);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dimension, setDimension] = useState({ w: 100, h: 100 });

  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (fileData?.url) {
      setImage(fileData.url);
      setName(fileData.name);
      setPosition({ x: 100, y: 100 });

      const img = new Image();
      img.onload = () => {
        setDimension({
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      };
      img.src = fileData.url;
    }
  }, [fileData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Si estamos redimensionando, no activar drag
    if (resizing.current) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current && !resizing.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    resizing.current = false; // por si acaso
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!image) return <p>No image to display.</p>;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#2b2b2b",
        backgroundImage: `
        linear-gradient(0deg, #444 1px, transparent 1px),
        linear-gradient(90deg, #444 1px, transparent 1px)
      `,
        backgroundSize: "20px 20px", // grid size
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "grab",
        }}
      >
        <ResizableBox
          width={dimension.w / 2}
          height={dimension.h / 2}
          minConstraints={[100, 100]}
          maxConstraints={[1000, 800]}
          resizeHandles={["se"]}
          onResizeStart={() => (resizing.current = true)}
          onResizeStop={() => (resizing.current = false)}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
        </ResizableBox>
      </div>
    </div>
  );
}

export default Viewer2d;
