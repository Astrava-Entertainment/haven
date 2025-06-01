import '@astrava/design-system/dist/tailwind.css'

// Simple component to show metadata
import { useRenderSelector } from "../store/hooks";

export default function MetadataViewer({ className = "" }: { className?: string }) {
  const metadata = useRenderSelector((state) => state.metadata);

  return (
    metadata.data ? (
      <div className={`flex flex-col ${className}`}>
        <h3 className="text-lg font-semibold mb-2">Model Metadata</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto">
          {JSON.stringify(metadata.data, null, 2)}
        </pre>
      </div>
    ) : null
  );
}
