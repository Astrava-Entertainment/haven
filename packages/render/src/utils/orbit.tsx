import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { setRotation } from "../store/slices/gizmoSlice";
import {HavenVector3} from "@haven/core/shared";
import type {AppDispatch} from '@haven/render/store';

export function recordRotationChange(
  controlsRef: React.RefObject<OrbitControlsImpl>,
  dispatch: AppDispatch
) {
  const currRotation = controlsRef.current.object.rotation;
  const newRotation = new HavenVector3(
    Number(currRotation.x.toFixed(2)),
    Number(currRotation.y.toFixed(2)),
    Number(currRotation.z.toFixed(2))
  );
  dispatch(setRotation(newRotation.toJSON()));
}
