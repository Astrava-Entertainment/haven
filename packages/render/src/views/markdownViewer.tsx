import {RefObject, useEffect, useRef, useState} from "react";
import { EditorView, basicSetup } from "codemirror";
import { markdown as cmMarkdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRenderSelector } from "@haven/render/shared";
import { EditorWith } from "../constants";

function initializeMarkdownEditor(
  url: string,
  editorRef: RefObject<HTMLDivElement | null>,
  editorView: EditorView | null,
  setEditorView: (view: EditorView) => void,
  setMarkdownText: (text: string) => void
) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      setMarkdownText(text);

      const state = EditorState.create({
        doc: text,
        extensions: [
          basicSetup,
          cmMarkdown(),
          oneDark,
          keymap.of([...defaultKeymap]),
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              setMarkdownText(v.state.doc.toString());
            }
          }),
          EditorView.clickAddsSelectionRange.of(e => e.altKey)
        ],
      });

      if (editorView) editorView.destroy();

      if (editorRef?.current) {
        editorRef.current.innerHTML = "";
        const view = new EditorView({
          state,
          parent: editorRef.current,
        });
        setEditorView(view);
      }
    });
}

function useEditorResizeHandler(isDragging: React.RefObject<boolean>, containerRef: React.RefObject<HTMLDivElement | null>, setEditorWidth: (value: (((prevState: number) => number) | number)) => void) {
  function onMouseMove(e: MouseEvent) {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newWidth = e.clientX - containerRect.left;

    if (newWidth < 300) newWidth = 300;
    if (newWidth > containerRect.width - 300) {
      newWidth = containerRect.width - 300;
    }

    setEditorWidth(newWidth);
  }

  function onMouseUp() {
    isDragging.current = false;
    document.body.style.cursor = "default";
  }


  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

export default function MarkdownViewer() {
  const fileData = useRenderSelector((state) => state.file.currentFile);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [markdownText, setMarkdownText] = useState("");
  const [editorWidth, setEditorWidth] = useState(EditorWith);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!editorRef.current || !fileData?.url) return;

    initializeMarkdownEditor(fileData.url, editorRef, editorView, setEditorView, setMarkdownText);

    return () => {
      if (editorView) editorView.destroy();
    };
  }, [fileData]);

  useEffect(() => {
    return useEditorResizeHandler(isDragging, containerRef, setEditorWidth);
  }, []);

  function onMouseDownDivider() {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  }

  return (
    <div className="flex flex-col max-w-[1600px] mx-auto h-screen max-h-[700px]">
      <div
        ref={containerRef}
        className="flex flex-1 gap-x-2 overflow-hidden select-none"
        style={{ userSelect: isDragging.current ? "none" : "auto" }}
      >
        <div
          ref={editorRef}
          className="cursor-text min-w-[300px] h-full border border-neutral-700 rounded overflow-auto shadow-inner bg-neutral-900"
          style={{ width: editorWidth, overflow: "auto", whiteSpace: "true" }}
        />

        <div
          onMouseDown={onMouseDownDivider}
          className="w-1 cursor-col-resize bg-neutral-700 hover:bg-green-600 transition-colors"
          style={{ userSelect: "none" }}
        />

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
