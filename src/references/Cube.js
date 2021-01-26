import React from 'react';
import { useYuka } from '../hooks/useYuka';
import useStore from '../store';
import { useAnim } from '../hooks/useAnim';

export function Cube(props) {

  const [ref, play] = useAnim({
    max : 1,
    axis : 'y',
    direction: 1,
    speed : 0.05,
    initial : true
  })

  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref} {...props} onClick={() => play()}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  );
}
