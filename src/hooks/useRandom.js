import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import { Vector3 } from 'three';

export const useRandom = (url, name, maxNumber) => {
  const { nodes } = useGLTF(url, '/draco/');
  const [randomPos, setPos] = useState([]);
  const _position = new Vector3();
  const random = [];

  useEffect(() => {
    const sampler = new MeshSurfaceSampler(nodes[name]);
    sampler.build();

    for (let i = 0; i < maxNumber; i++) {
      let pos = [];
      sampler.sample(_position);
      random.push(_position);
      _position.toArray(pos);
      setPos(oldArray => [...oldArray, pos]);
    }

  }, []);

  return [randomPos, nodes[name].position];
};
