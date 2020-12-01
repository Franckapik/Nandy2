import React, { useRef } from "react";
import { useFrame } from 'react-three-fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three'


const Helper = React.forwardRef(({bound}, ref) => {
  return (
      <mesh ref={ref} visible={true}>
        <boxBufferGeometry attach="geometry" args={bound} />
        <lineBasicMaterial attach="material" color="orange" />
      </mesh>
  );
});


export const ObjMesh = ({ position, bound, display, mass, ...props }) => {

  const v = position;

  const [cube] = useBox(() => ({
    mass: mass,
    args: bound,
    position: [v.x, v.y, v.z],
  }), true);



  const helperRef = useRef();

  useFrame(() => {
    helperRef.current.position.copy(cube.current.position);
    helperRef.current.rotation.copy(cube.current.rotation);
  });

  return (
    <>
      <mesh ref={cube} material={props.material} geometry={props.geometry} onClick={() => console.log(cube)} />
      <Helper ref={helperRef} bound={bound} />
    </>
  );
};
export const GroupMesh = ({ position, children, mass, bound, ...props }) => {

  const v = position;

  const [cube] = useBox(() => ({
    mass: mass,
    args: bound,
    position: [v.x, v.y, v.z],
  }), true);

  const helperRef = useRef();

  useFrame(() => {
    helperRef.current.position.copy(cube.current.position);
    helperRef.current.rotation.copy(cube.current.rotation);
  });

  return (
    <group ref={cube}>
      {Object.entries(children).map(
        ([name, obj]) => {
          return (
            <>
              <mesh key={name} material={obj.material} geometry={obj.geometry} />
              <mesh ref={helperRef}>
                <boxBufferGeometry attach="geometry" args={bound} />
                <lineBasicMaterial attach="material" color="blue" />
              </mesh>
            </>
          );
        }
      )}
    </group>

  );

};
