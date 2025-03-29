import { useSelector } from "react-redux";
import { RootState } from "../../core/src/store/core-store";
import InputFile from "./components/InputFIle";

function App() {
  const fileState = useSelector((state: RootState) => state.render);
  console.log(fileState);

  return (
    <div>
      <InputFile />
    </div>
  );
}

export default App;
