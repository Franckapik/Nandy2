import { useGLTF } from '@react-three/drei'
import React from 'react'
import { ObjMesh } from './ObjMesh'

export const Model = ({ url, mass,updateMass, collision, matcaps }) => {
  const { nodes, materials } = useGLTF(url, '/draco/')
  const first = Object.keys(nodes)
  const noCast = ['LightLampadaire', 'LightPano1', 'LightPano2']
  let castShadow = true

  return Object.entries(nodes).map(([name, obj]) => {
    if (obj.type === 'Group' && obj.name !== first[0]) {
      return null
    } else if (obj.type === 'Mesh') {
      if (obj.parent.name === first[0]) {
        if (noCast.indexOf(obj.name) !== -1) {
          castShadow = false
        }
        return <ObjMesh updateMass={updateMass} collision={collision} mat={obj.material} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} castShadow={castShadow} />
      }
    } else {
      //do nothing
    }
    return null
  })
}
