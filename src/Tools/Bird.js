import { useGLTF } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { AnimationMixer } from 'three';

export const Bird = ({ url }, props) => {
  const { nodes, materials, animations } = useGLTF(url);
  const actions = useRef();
  const ref = useRef();
  const [mixer] = useState(() => new AnimationMixer());
  useFrame((state, delta) => {
    ref.current.position.z += 0.1;
    mixer.update(delta);
  });
  useEffect(() => {
    actions.current = {
      Marche: mixer.clipAction(animations[0], ref.current).play()
    };
    return () => animations.forEach((clip) => mixer.uncacheClip(clip));
  }, []);

  return (
    <group ref={ref} {...props} dispose={null}>
      {Object.entries(nodes).map((obj, name) => {
        if (obj[1].type === 'Bone') {
          return <primitive key={name} object={obj[1]} />;
        }
        if (obj[1].type === 'SkinnedMesh') {
          return (
            <skinnedMesh
              key={name}
              material={obj[1].material}
              geometry={obj[1].geometry}
              skeleton={obj[1].skeleton} />
          );
        }
      })}
    </group>
  );
};
