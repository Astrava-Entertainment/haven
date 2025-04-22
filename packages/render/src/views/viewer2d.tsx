import { useEffect, useState } from "react";
import { useRenderSelector } from "../store/hooks";

function Viewer2d() {
  const fileData = useRenderSelector((state) => state.file.data);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (fileData?.url) {
      setImage(fileData.url);
      setName(fileData.name);
    }
  }, [fileData]);

  if (!image) {
    return <p>No image to display.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <h1 className="text-2xl font-semibold">2D Viewer</h1>
      <div className="max-w-full max-h-[80vh] overflow-auto rounded-2xl shadow-md border bg-white p-4">
        <img
          src={image}
          alt={name}
          className="object-contain max-w-full max-h-[70vh]"
        />
      </div>
    </div>
  );
}

export default Viewer2d;
