import { RenderProvider } from "./store/provider";
import App from "./app.tsx";

export default function RenderApp() {
  return (
    <RenderProvider>
      <App />
    </RenderProvider>
  );
}
