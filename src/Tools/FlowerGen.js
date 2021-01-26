import { useGLTF } from '@react-three/drei';
import React, { useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3 } from 'three';
import { useAnim } from '../hooks/useAnim';
import useStore from '../store';

const Flower = (props) => {
  const [ref, play] = useAnim({
    max : 1,
    axis : 'y',
    direction: 1,
    speed : 0.05,
    initial : true
  })

  return (
<mesh ref={ref} {...props} />
  )
}

export const FlowerGen = (props) => {
  const [count, setCount] = useState([]);
  const [randomTime, setTime] = useState(5);
  const { nodes } = useGLTF('./traversant1.gltf', '/draco/'); // no .glb
  const name = 'Herb1';

  function setFlowerPos(min, max) {
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    let distance = (Math.random() * (max - min) + min).toFixed(2) * plusOrMinus;
    return distance;
  }
  const min = 1;
  const max = 3;
  const offset = new Vector3();
  const flowerPos = new Vector3();

  let elapsed = 0;
  useFrame((_, delta) => {
    const vehicle = useStore.getState().vehicleObj;
    if (vehicle) {
      if (elapsed >= randomTime) {
        const pos = [];
        setTime(Math.random() * (max - min) + min);
        offset.set(setFlowerPos(2, 5), 0, setFlowerPos(2, 5));
        vehicle.position.setY(0);
        flowerPos.copy(vehicle.position).add(offset).toArray(pos);
        setCount((oldArr) => [...oldArr, pos]);
        elapsed = 0;
      } else {
        elapsed += delta;
      }
    }
  });



  return count.map(
    (a, i) => <Flower material={nodes[name].material} geometry={nodes[name].geometry} position={a} />);

};
