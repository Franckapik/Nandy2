import { useGLTF } from '@react-three/drei'
import React from 'react'
import { Vector3 } from 'three'
import { ObjMesh } from './ObjMesh'

export const Model = ({ url, mass,updateMass, collision, matcaps }) => {
  const { nodes } = useGLTF(url, '/draco/')
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
        let objWorldPos = new Vector3()
        obj.getWorldPosition(objWorldPos)
        console.log(obj.name);
        return <ObjMesh updateMass={updateMass} collision={collision} mat={obj.material} mass={mass} display={true} key={name} {...obj} position={objWorldPos} castShadow={castShadow} />
      }
    } else {
      //do nothing
    }
    return null
  })
}
