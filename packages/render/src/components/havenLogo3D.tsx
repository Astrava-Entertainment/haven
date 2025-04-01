
interface IHavenLogo3DProps {
  wireframe?: boolean;
  onClick: () => void;
}

/**
 * Returns the default Haven logo in 3D
 * TODO: Replace with the actual Haven logo
 * @constructor
 */
export const HavenLogo3D = (props: IHavenLogo3DProps) => {
  const { wireframe, onClick } = props;

  return (
    <mesh onClick={onClick}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial color="skyblue" wireframe={wireframe?? false}/>
    </mesh>
  );
};
