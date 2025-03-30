import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {
  Mesh,
  CylinderGeometry,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"; // Import the correct type for Orbit Reference

interface ViewportProps {
  position: [number, number, number]; // Camera position
  size: [string, string]; // Viewport size
  orbitControlsRef: React.RefObject<OrbitControlsImpl | null>; // Orbit Reference
}

const Viewport: React.FC<ViewportProps> = ({
  position,
  size,
  orbitControlsRef,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: size[0], // Adjusted to received size
        height: size[1], // Adjusted to received size
        pointerEvents: "none", // Does not interact with the scene
        border: "1px solid #fff", // Added a border for visibility
      }}
    >
      <Canvas>
        <CameraAndAxes
          position={position}
          orbitControlsRef={orbitControlsRef}
        />
      </Canvas>
    </div>
  );
};

const CameraAndAxes: React.FC<{
  position: [number, number, number];
  orbitControlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ position, orbitControlsRef }) => {
  const { scene } = useThree(); // Get the secondary camera scene
  const axesRef = useRef<any>(null);

  // Add custom axes to the scene when the component mounts
  useEffect(() => {
    if (!axesRef.current) {
      // Material for axes with different colors for positive and negative sides
      const materialXPositive = new MeshBasicMaterial({ color: "#00aaff" }); // Light blue for positive X
      const materialXNegative = new MeshBasicMaterial({ color: "#0077cc" }); // Dark blue for negative X
      const materialYPositive = new MeshBasicMaterial({ color: "#00ff48" }); // Soft green for positive Y
      const materialYNegative = new MeshBasicMaterial({ color: "#009933" }); // Dark green for negative Y
      const materialZPositive = new MeshBasicMaterial({ color: "#ff3c00" }); // Coral for positive Z
      const materialZNegative = new MeshBasicMaterial({ color: "#cc2b00" }); // Dark red for negative Z

      // Create geometry for cylinders (axes)
      const radius = 0.1; // Cylinder radius (thickness)
      const segments = 32; // Number of segments for smoothness

      // Create cylinders for each axis
      const geometryX = new CylinderGeometry(radius, radius, 2, segments);
      const geometryY = new CylinderGeometry(radius, radius, 2, segments);
      const geometryZ = new CylinderGeometry(radius, radius, 2, segments);

      // Create Mesh objects for X, Y, Z axes
      const cylinderXPositive = new Mesh(geometryX, materialXPositive);
      const cylinderXNegative = new Mesh(geometryX, materialXNegative);
      const cylinderYPositive = new Mesh(geometryY, materialYPositive);
      const cylinderYNegative = new Mesh(geometryY, materialYNegative);
      const cylinderZPositive = new Mesh(geometryZ, materialZPositive);
      const cylinderZNegative = new Mesh(geometryZ, materialZNegative);

      // Align cylinders along their respective axes
      cylinderXPositive.rotation.z = Math.PI / 2; // Align X-axis cylinder to positive X
      cylinderXNegative.rotation.z = Math.PI / 2; // Align X-axis cylinder to negative X
      cylinderYPositive.rotation.y = Math.PI / 2; // Align Y-axis cylinder to positive Y
      cylinderYNegative.rotation.y = Math.PI / 2; // Align Y-axis cylinder to negative Y
      cylinderZPositive.rotation.x = Math.PI / 2; // Align Z-axis cylinder to positive Z
      cylinderZNegative.rotation.x = Math.PI / 2; // Align Z-axis cylinder to negative Z

      // Position the cylinders
      cylinderXPositive.position.set(1, 0, 0);
      cylinderXNegative.position.set(-1, 0, 0);
      cylinderYPositive.position.set(0, 1, 0);
      cylinderYNegative.position.set(0, -1, 0);
      cylinderZPositive.position.set(0, 0, 1);
      cylinderZNegative.position.set(0, 0, -1);

      // Add cylinders to the scene
      scene.add(cylinderXPositive);
      scene.add(cylinderXNegative);
      scene.add(cylinderYPositive);
      scene.add(cylinderYNegative);
      scene.add(cylinderZPositive);
      scene.add(cylinderZNegative);

      // Create spheres at the ends of the axes with matching colors
      const sphereRadius = 0.2;
      const sphereGeometry = new SphereGeometry(sphereRadius, 32, 32);

      // Spheres at axis ends with corresponding colors
      const sphereXPositive = new Mesh(sphereGeometry, materialXPositive);
      const sphereXNegative = new Mesh(sphereGeometry, materialXNegative);
      const sphereYPositive = new Mesh(sphereGeometry, materialYPositive);
      const sphereYNegative = new Mesh(sphereGeometry, materialYNegative);
      const sphereZPositive = new Mesh(sphereGeometry, materialZPositive);
      const sphereZNegative = new Mesh(sphereGeometry, materialZNegative);

      // Position spheres
      sphereXPositive.position.set(2, 0, 0);
      sphereXNegative.position.set(-2, 0, 0);
      sphereYPositive.position.set(0, 2, 0);
      sphereYNegative.position.set(0, -2, 0);
      sphereZPositive.position.set(0, 0, 2);
      sphereZNegative.position.set(0, 0, -2);

      // Add spheres to the scene
      scene.add(sphereXPositive);
      scene.add(sphereXNegative);
      scene.add(sphereYPositive);
      scene.add(sphereYNegative);
      scene.add(sphereZPositive);
      scene.add(sphereZNegative);

      // Store references
      axesRef.current = [
        cylinderXPositive,
        cylinderXNegative,
        cylinderYPositive,
        cylinderYNegative,
        cylinderZPositive,
        cylinderZNegative,
        sphereXPositive,
        sphereXNegative,
        sphereYPositive,
        sphereYNegative,
        sphereZPositive,
        sphereZNegative,
      ];
    }

    return () => {
      if (axesRef.current) {
        // Cleanup on unmount
        axesRef.current.forEach((obj: any) => scene.remove(obj));
      }
    };
  }, [scene]);

  return (
    <>
      {/* Secondary camera */}
      <PerspectiveCamera
        makeDefault={false} // Do not make this the default camera
        position={position}
        fov={75}
        near={0.1}
        far={1000}
      />
      {/* Light inside the viewport */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* Orbit controls for viewport navigation */}
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
};

export default Viewport;
