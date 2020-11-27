import React from "react";
import { useBox } from '@react-three/cannon';

export const ObjMesh = ({ position, bound, display, mass, ...props }) => {

  const v = position;

  const [cube] = useBox(() => ({
    mass: mass,
    args: bound,
    position: [v.x, v.y, v.z],
  }));

  return (
    <mesh key={props.name} ref={cube} geometry={props.geometry} onClick={() => console.log(props.name)}>
      <meshMatcapMaterial
        attach="material"
        matcap={props.mat[props.material.name]} />
    </mesh>
  );
};
export const GroupMesh = ({ position, children, mass, ...props }) => {

  const v = position;

  const [cube] = useBox(() => ({
    mass: mass,
    args: [1, 1, 1],
    position: [v.x, v.y, v.z],
  }));

  return (
    <group ref={cube}>
      {Object.entries(children).map(
        ([name, obj]) => {
          return (
            <mesh key={name} geometry={obj.geometry}>
              <meshMatcapMaterial
                attach="material"
                matcap={props.mat[obj.material.name]} />
            </mesh>
          );
        }
      )}
    </group>
  );

};
