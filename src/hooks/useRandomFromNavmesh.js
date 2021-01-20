import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { NavMeshLoader } from 'yuka'

export const useRandomFromNavmesh = (url, name, nbPositions) => {
  const [arrayOfPositions, setArrayOfPositions] = useState([[0,0,0], [0,5,0], [10,0,0]])
  
  const { nodes } = useGLTF(url)
  const globalVec = new Vector3()
  const globalPosition = []
  nodes[name].getWorldPosition(globalVec)
  globalVec.toArray(globalPosition)




  useEffect(() => {
    const loader = new NavMeshLoader()

    async function fetchData() {
      const newNav = await loader.load(url) 
      let newArrayOfPositions = []
      Array(nbPositions)
        .fill()
        .map((a, i) => {
          let position = []
          newNav.getRandomRegion().centroid.toArray(position) //todo : add a condition to not push existing position
          newArrayOfPositions.push(position)
          return null
        })
      setArrayOfPositions(newArrayOfPositions)
    }
    fetchData()
  }, [nbPositions, url]) //loader var deleted to not sync every frame

  return [arrayOfPositions, globalPosition]
}
