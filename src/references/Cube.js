import { useBox } from '@react-three/cannon';
import React from 'react';
import { useFrame } from 'react-three-fiber';
import { Controls, useControl } from 'react-three-gui';

export function Cube(props) {
  const positionX = useControl('Cube Position X', { type: 'number', value : -65, min : -66, max : 0 });
  const [ref] = useBox(() => ({ mass: 1, position: [-65,3,71], rotation: [0.4, 0.2, 0.5], ...props }));

  useFrame(()=> {
    ref.current.position.x = positionX
  })

  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}
