import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { HavenVector3 } from "../common";
import { setRotation } from "../store/slices/gizmoSlice";

export function recordRotationChange(
  controlsRef: React.MutableRefObject<OrbitControlsImpl>,
  dispatch
) {
  const currRotation = controlsRef.current.object.rotation;
  const newRotation = new HavenVector3(
    Number(currRotation.x.toFixed(2)),
    Number(currRotation.y.toFixed(2)),
    Number(currRotation.z.toFixed(2))
  );
  dispatch(setRotation(newRotation.toJSON()));
}
