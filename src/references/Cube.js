import { useBox } from '@react-three/cannon';
import React from 'react';
import { Controls, useControl } from 'react-three-gui';

export function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, position: props.position, rotation: [0.4, 0.2, 0.5], ...props }));
  const positionX = useControl('Position X', { type: 'number', value : -65, min : -66, max : 0 });
  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}
