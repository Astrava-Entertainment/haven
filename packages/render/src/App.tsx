import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/render-store";

function App() {
  const uploadState = useSelector((state: RootState) => state.uploads);
  console.log(uploadState);

  return <div>Hello World!</div>;
}

export default App;
