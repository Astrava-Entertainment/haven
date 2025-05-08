import { FileExplorerProvider } from "./store/provider";
import App from "./app.tsx";

export default function FileSystem() {
  return (
    <FileExplorerProvider>
      <App />
    </FileExplorerProvider>
  );
}
