import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch } from "./index";
import { RootState } from "./slices/globalStore";


export const useRenderDispatch: () => AppDispatch = useDispatch;
export const useRenderSelector: TypedUseSelectorHook<RootState> = useSelector;
