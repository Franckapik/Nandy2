import { useBox } from '@react-three/cannon';
import React from 'react';

export function Cube(props) {
  const size = props.args;
  const [ref] = useBox(() => ({ args: size, mass: 1, position: props.position, ...props }));
  return (
    <mesh receiveShadow castShadow ref={ref} >
      <boxBufferGeometry args={size} attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}
