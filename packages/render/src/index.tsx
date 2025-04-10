import App from "./App";
import { RenderProvider } from "./store/provider";

export default function RenderApp() {
  return (
    <>
      {/* RENDER 1 */}
      <RenderProvider>
        <App />
      </RenderProvider>
      {/* RENDER 2 */}
      <RenderProvider>
        <App />
      </RenderProvider>
    </>
  );
}
