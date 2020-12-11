import { useGLTF } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { useNavLoader } from '../hooks/useNavLoader';
import * as THREE from 'three';

export const NavMeshRandom = ({ urlnav, urlGltf, max }) => {
  const [arrayRegions, setArrayRegions] = useState([]);
  const [navMesh, random] = useNavLoader(urlnav, 1000);
  const tempObject = new THREE.Object3D();
  const gltf = useGLTF(urlGltf);
  const geometry = gltf.nodes.Pilar.geometry;

  useEffect(() => {
    console.log(navMesh);
    const arrayOfPosition = navMesh.regions.map(x => [x.centroid.x, x.centroid.y, x.centroid.z]);
    setArrayRegions(arrayOfPosition);
  }, [navMesh]);
  const ref = useRef();

  useFrame((state) => {
    if (arrayRegions.length) {
      arrayRegions.map((a, i) => {
        const id = i++;
        tempObject.position.set(...a);
        tempObject.updateMatrix();
        ref.current.setMatrixAt(i, tempObject.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  const args = React.useMemo(() => [geometry, null, max], [geometry]);

  return (
    <instancedMesh ref={ref} args={args} rotation={[0, 0, 0]}>
      <meshNormalMaterial attach="material" />
    </instancedMesh>
  );
};
