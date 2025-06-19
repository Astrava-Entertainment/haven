<<<<<<< HEAD
import  '@haven/design-system/tailwind.css'
import { useRenderSelector } from "@haven/render/common";
=======
import '@haven/design-system/tailwind.css';
import { useRenderSelector } from '@haven/render/common';
>>>>>>> 2137f33dbf6b705c4300675b4df5e2f5b86d4bbb

/**
 * Simple component to show metadata for the 3D file.
 */
export function MetadataViewer({ className = '' }: { className?: string }) {
  const metadata = useRenderSelector((state) => state.metadata);

  return (metadata.data
    ? (
        <div className={`flex flex-col ${className}`}>
          <h3 className="text-lg font-semibold mb-2">Model Metadata</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {JSON.stringify(metadata.data, null, 2)}
          </pre>
        </div>
      )
    : null
  );
}
