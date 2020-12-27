import { useBox } from '@react-three/cannon';
import React from 'react';

export function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, position: props.position, rotation: [0.4, 0.2, 0.5], ...props }));
  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}
