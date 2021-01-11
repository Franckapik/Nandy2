import { useGLTF } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

export const InstanciateMesh = ({ arrayOfPositions, meshUrl, nameMesh, maxNumber, position }) => {
  const tempObject = new THREE.Object3D();
  const gltf = useGLTF(meshUrl);
  const geometry = gltf.nodes[nameMesh].geometry;
  const mat = gltf.nodes[nameMesh].material;
  const ref = useRef();
  console.log(gltf);

  useFrame((state) => {
    if (arrayOfPositions.length) {
      arrayOfPositions[0].map((a, i) => {
        const id = i++;
        tempObject.position.set(...a);
        tempObject.updateMatrix();
        ref.current.setMatrixAt(i, tempObject.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  const args = React.useMemo(() => [geometry, null, maxNumber], [geometry]);

  return (
    <instancedMesh position={position} ref={ref} args={args} rotation={[0, 0, 0]} material={mat} >
    </instancedMesh>
  );
};
