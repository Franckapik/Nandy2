import { useBox } from '@react-three/cannon';
import React from 'react';
import { useFrame } from 'react-three-fiber';
import { Controls, useControl } from 'react-three-gui';
import { useYuka } from '../hooks/useYuka';
import useStore from '../store';

export function Cube(props) {
/*   const positionX = useControl('Cube Position X', { type: 'number', value : -65, min : -66, max : 0 });
 */  
const [ref] = useYuka({ type: 'Vehicle', name: 'Vehicle', ...props })

  const setOpacity = useStore((state) => state.setOpacity);
  const toggleVisible = useStore(state => state.toggleVisible);
  
  return (
    <mesh name={props.name} receiveShadow castShadow ref={ref} onClick={() => toggleVisible()}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  );
}
