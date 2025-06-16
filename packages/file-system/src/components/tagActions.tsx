import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface Props {
  x: number;
  y: number;
  tag: string;
  furniture: string;
  onRename: (newName: string) => void;
  onChangeColor: (newColor: string) => void;
  onClose: () => void;
  ignoredPopRef: React.RefObject<HTMLDivElement>;
}

// TODO: Move to constants
const predefinedColors = [
  "#FF5733", "#FFC300", "#28B463",
  "#3498DB", "#8E44AD", "#E91E63",
  "#FFFFFF", "#000000", "#F39C12"
];

export const TagActions: React.FC<Props> = ({
  x,
  y,
  tag,
  onRename,
  onChangeColor,
  onClose,
  ignoredPopRef
}) => {
  const [editing, setEditing] = useState<"name" | "color" | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setEditing(null);
  }, [tag]);

  const handleConfirm = () => {
    if (editing === "name") {
      onRename(inputValue.trim());
      onClose();
    }
  };

  const popup = (
    <div
      ref={ignoredPopRef}
      className="absolute z-50 bg-neutral-800 border border-neutral-600 rounded shadow-md text-white w-56"
      style={{ top: y, left: x }}
    >
      {editing === null ? (
        <div className="flex flex-col">
          <button
            className="w-full text-left px-4 py-2 hover:bg-neutral-700"
            onClick={() => {
              setEditing("name");
              setInputValue(tag);
            }}
          >
            ✏️ Cambiar nombre
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-neutral-700"
            onClick={() => {
              setEditing("color");
            }}
          >
            🎨 Cambiar color
          </button>
          <button
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-neutral-700"
            onClick={onClose}
          >
            ❌ Cancelar
          </button>
        </div>
      ) : editing === "name" ? (
        <div className="p-4 space-y-2">
          <label className="text-sm block">Nuevo nombre del tag:</label>
          <input
            className="w-full bg-neutral-700 text-white px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nombre"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="px-3 py-1 bg-neutral-600 rounded hover:bg-neutral-500 text-sm"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm"
              onClick={handleConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          <label className="text-sm block mb-2">Selecciona un color:</label>
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChangeColor(color);
                  onClose();
                }}
              />
            ))}
          </div>
          <div className="pt-4 flex justify-end">
            <button
              className="px-3 py-1 bg-neutral-600 rounded hover:bg-neutral-500 text-sm"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(popup, document.body);
};
