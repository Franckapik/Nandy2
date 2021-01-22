import React from 'react';
import { useTexture } from '@react-three/drei';
import useEmpty from '../hooks/useEmpty';
import useSound from '../hooks/useSound';
import useStore from '../store';

export const Frame = (props) => {
  const changeTarget = useStore((state) => state.changeTarget);
  const playFlute = useSound('/flute.mp3');
  const texture = useTexture('/tag1.png');
  const tagPos = useEmpty('origin3Frame');
  const scale = 0.015;
  const args = [texture.image.width * scale, texture.image.height * scale];
  console.log(args);

  return (
    <mesh
      position={tagPos}
      onClick={(e) => {
        changeTarget(e.eventObject);
        playFlute.play();
      }}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial transparent map={texture} />
    </mesh>
  );
};
