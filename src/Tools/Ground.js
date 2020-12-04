import { usePlane } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import ParallaxMapMaterial from './parallaxMap';

export function Ground({ minLayers, maxLayers, parallaxFactor, mode, scale }) {
  const [map, bumpMap] = useTexture(['/textures/floor3.jpg', '/textures/floorbump.jpg']);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.offset.set(0, 0);
  map.repeat.set(1500, 1500);
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  return (
    <mesh onClick={()=> console.log("gournd")} ref={ref} receiveShadow ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <ParallaxMapMaterial map={map} bumpMap={bumpMap} mode={mode} parallaxScale={parallaxFactor} parallaxMinLayers={minLayers} parallaxMaxLayers={maxLayers} />
    </mesh>
  );
}
