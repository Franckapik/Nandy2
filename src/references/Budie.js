import { useGLTF } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useYuka } from '../hooks/useYuka'


export default function Budie(props) {
  const [ref] = useYuka({ type: 'Vehicle', name: 'Vehicle', position : props.position })
  const { nodes, materials, animations } = useGLTF('./budie.gltf')
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    console.log(nodes);
    actions.current = {
      Marche: mixer.clipAction(animations[0], ref.current).play()
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  /*   useEffect(() => {
    actions.current.Marche.play()
    return null
  }, []) */

  return (
    <group ref={ref} {...props} dispose={null}>
      <primitive object={nodes.Body} />
      <primitive object={nodes.HancheL} />
      <primitive object={nodes.HancheR} />
      <skinnedMesh
        onClick={() => {
          actions.current.Marche.play()
          console.log('Marche!')
        }}
        material={materials.beige}
        geometry={nodes.BudieMesh.geometry}
        skeleton={nodes.BudieMesh.skeleton}
      />
    </group>
  )
}
