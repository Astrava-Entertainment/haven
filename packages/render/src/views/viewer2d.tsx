import { useRenderSelector } from "../store/hooks";
import MetadataViewer from "../components/metadataViewer";

function Viewer2d() {
  const fileData = useRenderSelector((state) => state.file.data);

  if (!fileData?.url) {
    return <p>No image to display.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <h1 className="text-2xl font-semibold">2D Viewer</h1>
      <div className="max-w-full max-h-[80vh] overflow-auto rounded-2xl shadow-md border bg-white p-4">
        <img
          src={fileData.url}
          alt={fileData.name}
          className="object-contain max-w-full max-h-[70vh]"
        />
      </div>
    </div>
  );
}

export default Viewer2d;
