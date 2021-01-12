import React, { useRef } from 'react'
import { Model } from './Model'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
import { InstanciateMesh } from './InstanciateMesh'
import { useGLTF } from '@react-three/drei'
import { Bubble } from './Bubble'
import { Cube } from '../references/Cube'
import useStore from '../store'
import { EffectComposer, Outline } from "react-postprocessing"
import { useBox } from '@react-three/cannon'
import useBounds from '../hooks/useBounds'


const Single = ({ url, name, ...props }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const position = []
  nodes[name].getWorldPosition().toArray(position)
  const ref = useRef()
  return( 
    <EffectComposer>
    <Outline 
    edgeStrength={0.3} // the edge strength
    pulseSpeed={0.3} // a pulse speed. A value of zero disables the pulse effect
    blur={true}
    selection={[ref]} />
    <mesh ref={ref} material={nodes[name].material} geometry={nodes[name].geometry} position={position} {...props} />
  </EffectComposer>
)}

const Trash = ({ url, ...props }) => {
  const name = 'Poubelle'
  const { nodes } = useGLTF('/onclick1.gltf', '/draco/')
  const position = []
  nodes['Poubelle'].getWorldPosition().toArray(position)

  const bound = useBounds(nodes['Poubelle'])

  const [poubelleRef] = useBox(() => ({ 
    mass: 0,
    position : position,
    rotation : [Math.PI/4,0,0],
    args: bound
  }));


  return <mesh ref={poubelleRef} material={nodes[name].material} geometry={nodes[name].geometry} {...props}  />
}

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 30)
  const toggleVisible = useStore((state) => state.toggleVisible)
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <InstanciateMesh position={navPosition} arrayOfPositions={[randomPositions]} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
      <Bubble position={[-65, 2, 50]} scale={30} Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}>
          <Single url={'/onclick1.gltf'} name="Fleur" onClick={() => toggleVisible()} position={[8, 0, 3]} />
      </Bubble>
      <Trash />

{/*       <Single url={'/navmesh.glb'} name="NavMesh" position={navPosition} /> */}
    </>
  )
}
