import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import React from 'react';
import { Vector3 } from 'yuka';
import useBounds from '../hooks/useBounds';

const Trash = ({ url, ...props }) => {
  const name = 'Poubelle';
  const { nodes } = useGLTF('/onclick1.gltf', '/draco/');
  const position = [];
  let ObjWorldPos = new Vector3()
  nodes['Poubelle'].getWorldPosition(ObjWorldPos)
  ObjWorldPos.toArray(position);

  const bound = useBounds(nodes['Poubelle']);

  const [poubelleRef] = useBox(() => ({
    mass: 0,
    position: position,
    rotation: [Math.PI / 4, 0, 0],
    args: bound
  }));

  return <mesh ref={poubelleRef} material={nodes[name].material} geometry={nodes[name].geometry} {...props} />;
};
