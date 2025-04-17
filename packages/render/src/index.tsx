import App from "./app.tsx";
import { RenderProvider } from "./store/provider";

export default function RenderApp() {
  return (
    <RenderProvider>
      <App />
    </RenderProvider>
  );
}
