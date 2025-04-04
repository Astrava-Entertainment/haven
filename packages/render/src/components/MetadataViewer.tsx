import { useSelector } from "react-redux";
import { RootState } from "../../../core/src/store/globalStore";

export default function MetadataViewer({ className }: any) {
  const metadata = useSelector((state: RootState) => state.render.metadata);

  return (
    <div className={className}>
      <h3>Model Metadata</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
}
