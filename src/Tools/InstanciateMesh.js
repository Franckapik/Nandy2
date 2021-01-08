import { useGLTF } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

export const InstanciateMesh = ({ arrayOfPositions, meshUrl, nameMesh, maxNumber }) => {
  const tempObject = new THREE.Object3D();
  const gltf = useGLTF(meshUrl);
  const geometry = gltf.nodes[nameMesh].geometry;

  const ref = useRef();

  useFrame((state) => {
    if (arrayOfPositions.length) {
      arrayOfPositions.map((a, i) => {
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
    <instancedMesh ref={ref} args={args} rotation={[0, 0, 0]}>
      <meshNormalMaterial attach="material" />
    </instancedMesh>
  );
};
