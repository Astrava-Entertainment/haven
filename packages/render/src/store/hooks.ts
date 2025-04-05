import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch } from "./index";
import type { RootState } from "../../../core/src/store/slices/globalStore";

export const useRenderDispatch: () => AppDispatch = useDispatch;
export const useRenderSelector: TypedUseSelectorHook<RootState> = useSelector;
