import { useRenderSelector } from "../store/hooks";

export default function MetadataViewer({ className }: any) {
  const metadata = useRenderSelector((state) => state.metadata);

  return (
    <div className={className}>
      <h3>Model Metadata</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
}
