import { useBox } from '@react-three/cannon';
import { useGLTF, useHelper } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { BoxBufferGeometry, BoxHelper, Mesh, MeshBasicMaterial } from 'three';


export const Remorque = React.forwardRef((props, ref) => {
  const boxSize = [15, 5, 5];
  const {nodes, materials} = useGLTF('remorque.gltf')
  console.log(nodes.Remorque.geometry.boundingBox);

  const helperRef = useRef();

  useBox(() => ({ mass: 1, position: [-58, 2, 77], args: boxSize, ...props }), true, ref);
  console.log(ref);
  
  useFrame(()=> {
    helperRef.current.position.copy(ref.current.position)
    helperRef.current.rotation.copy(ref.current.rotation)
  })
  
  return (
    <>
  <mesh ref={ref} geometry={nodes.Remorque.geometry} />
  <mesh ref={helperRef}>
  <boxBufferGeometry attach="geometry" args={boxSize} />
  <lineBasicMaterial attach="material" color="orange" />
</mesh>
</>
  );
});

export const Remorque2 = React.forwardRef((props, ref) => {
  const boxSize = [3, 1, 3];

  useBox(() => ({ mass: 1, position: [-58, 2, 77], args: boxSize, ...props }), true, ref);

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={boxSize} />
      <meshLambertMaterial attach="material" color="orange" />
    </mesh>
  );
});