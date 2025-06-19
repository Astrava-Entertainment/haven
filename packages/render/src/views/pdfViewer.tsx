import { useEffect, useState } from "react";
import { useRenderSelector } from "@haven/render/common";

function PdfViewer() {
  const fileData = useRenderSelector((state) => state.file.currentFile);
  const [pdf, setPdf] = useState("");

  useEffect(() => {
    if (fileData?.url) {
      setPdf(fileData.url);
    }
  }, [fileData]);

  if (!pdf) {
    return <p>No PDF to display.</p>;
  }

  return (
    <div className="w-full h-[80vh] p-4">
      <iframe
        src={pdf}
        title="PDF Viewer"
        className="w-full h-full border rounded shadow"
      />
    </div>
  );
}

export default PdfViewer;
