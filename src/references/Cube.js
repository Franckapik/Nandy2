import { useBox } from '@react-three/cannon';
import React from 'react';
import useStore from '../store';

export function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, position: props.position, rotation: [0.4, 0.2, 0.5], ...props }));
  const setOpacity = useStore((state) => state.setOpacity);


  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref} onClick={() => {setOpacity(0)}}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  );
}
