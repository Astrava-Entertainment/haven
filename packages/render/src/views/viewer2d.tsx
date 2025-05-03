import { useEffect, useState, useRef } from "react";
import { useRenderSelector } from "../store/hooks";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import {
  maxConstraints,
  maxOverflow,
  minConstraints,
} from "../constants/viewer2d";

function Viewer2d() {
  const fileData = useRenderSelector((state) => state.file.data);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dimension, setDimension] = useState({ w: 100, h: 100 });
  const [zoom, setZoom] = useState(1);

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
          w: img.naturalWidth / 2,
          h: img.naturalHeight / 2,
        });
      };
      img.src = fileData.url;
    }
  }, [fileData]);

  const handleMouseDown = (e: React.MouseEvent) => {
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
    resizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Zoom handling (Ctrl + scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prevZoom) => {
          const newZoom = Math.min(
            Math.max(prevZoom - e.deltaY * 0.001, 0.1),
            3
          );
          return newZoom;
        });
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Recenter if image goes out more than (maxOverflow)
  useEffect(() => {
    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;

    const imgW = dimension.w * zoom;
    const imgH = dimension.h * zoom;

    const overX =
      position.x + imgW < 0
        ? 1
        : position.x > canvasW
        ? 1
        : Math.max(
            0,
            Math.min(
              (Math.abs(Math.min(0, position.x)) +
                Math.max(0, position.x + imgW - canvasW)) /
                imgW,
              1
            )
          );

    const overY =
      position.y + imgH < 0
        ? 1
        : position.y > canvasH
        ? 1
        : Math.max(
            0,
            Math.min(
              (Math.abs(Math.min(0, position.y)) +
                Math.max(0, position.y + imgH - canvasH)) /
                imgH,
              1
            )
          );

    const overflow = Math.max(overX, overY);

    if (overflow >= maxOverflow) {
      const centerX = canvasW / 2 - imgW / 2;
      const centerY = canvasH / 2 - imgH / 2;
      const animation = requestAnimationFrame(() => {
        setPosition((prev) => ({
          x: prev.x + (centerX - prev.x) * 0.1,
          y: prev.y + (centerY - prev.y) * 0.1,
        }));
      });

      return () => cancelAnimationFrame(animation);
    }
  }, [position, dimension, zoom]);

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
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: resizing.current ? "nwse-resize" : "grab",
        }}
      >
        <ResizableBox
          width={dimension.w * zoom}
          height={dimension.h * zoom}
          minConstraints={[minConstraints[0] * zoom, minConstraints[1] * zoom]}
          maxConstraints={[maxConstraints[0] * zoom, maxConstraints[1] * zoom]}
          resizeHandles={["se"]}
          onResizeStart={() => (resizing.current = true)}
          onResizeStop={(e, data) => {
            resizing.current = false;
            setDimension({
              w: data.size.width / zoom,
              h: data.size.height / zoom,
            });
          }}
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
