import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/global-store";

export default function MetadataViewer() {
  const metadata = useSelector((state: RootState) => state.render.metadata);

  return (
    <div>
      <h3>Model Metadata</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
}
