import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRenderSelector } from "../store/hooks";

function MarkdownViewer() {
  const fileData = useRenderSelector((state) => state.file.data);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (fileData?.url) {
      fetch(fileData.url)
        .then((res) => res.text())
        .then((text) => setMarkdown(text));
    }
  }, [fileData]);

  if (!markdown) {
    return <p>No md to display.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto gap-6">
      <h1 className="text-2xl font-semibold">Markdown Viewer</h1>
      <div className="prose prose-neutral w-full">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownViewer;
