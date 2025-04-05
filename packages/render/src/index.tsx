import App from "./App";
import { RenderProvider } from "./store/provider";

export default function RenderApp() {
  return (
    <RenderProvider>
      <App />
    </RenderProvider>
  );
}
