import { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { markdown as cmMarkdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRenderSelector } from "../store/hooks";

function ViewerMD() {
  const fileData = useRenderSelector((state) => state.file.data);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [markdownText, setMarkdownText] = useState("");

  const [editorWidth, setEditorWidth] = useState(600);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!editorRef.current || !fileData?.url) return;

    fetch(fileData.url)
      .then((res) => res.text())
      .then((text) => {
        setMarkdownText(text);

        const state = EditorState.create({
          doc: text,
          extensions: [
            basicSetup,
            cmMarkdown(),
            oneDark,
            EditorView.updateListener.of((v) => {
              if (v.docChanged) {
                setMarkdownText(v.state.doc.toString());
              }
            }),
          ],
        });

        if (editorView) editorView.destroy();

        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }

        const view = new EditorView({
          state,
          parent: editorRef.current,
        });

        setEditorView(view);
      });

    return () => {
      if (editorView) editorView.destroy();
    };
  }, [fileData]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;

      if (newWidth < 300) newWidth = 300;
      if (newWidth > containerRect.width - 300) newWidth = containerRect.width - 300;
      setEditorWidth(newWidth);
    }
    function onMouseUp() {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onMouseDownDivider() {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  return (
    <div className="flex flex-col p-4 max-w-[1600px] mx-auto h-screen max-h-[900px]">
      <h1 className="text-xl font-semibold text-white mb-4">Markdown Editor</h1>

      <div
        ref={containerRef}
        className="flex flex-1 gap-x-2 overflow-hidden select-none"
        style={{ userSelect: isDragging.current ? "none" : "auto" }}
      >
        {/* Editor */}
        <div
          ref={editorRef}
          className="min-w-[300px] h-full border border-neutral-700 rounded overflow-auto shadow-inner bg-neutral-900"
          style={{ width: editorWidth }}
        />

        {/* Divider draggable */}
        <div
          onMouseDown={onMouseDownDivider}
          className="w-1 cursor-col-resize bg-neutral-700 hover:bg-green-600 transition-colors"
          style={{ userSelect: "none" }}
        />

        {/* Preview */}
        <div
          className="min-w-[300px] h-full overflow-auto border border-neutral-700 rounded bg-neutral-900 p-4 prose prose-invert"
          style={{ flex: 1 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ViewerMD;
