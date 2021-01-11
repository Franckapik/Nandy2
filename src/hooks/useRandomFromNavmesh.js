import { useGLTF } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { NavMesh, NavMeshLoader, Vector3 } from 'yuka'

export const useRandomFromNavmesh = (url, name, nbPositions) => {
  const [arrayOfPositions, setArrayOfPositions] = useState([[0,0,0], [0,5,0], [10,0,0]])
  
  const { nodes } = useGLTF(url)
  const globalPosition = []
  nodes[name].getWorldPosition().toArray(globalPosition)

  async function fetchData() {
    const newNav = await loader.load(url) 
    let newArrayOfPositions = []
    Array(nbPositions)
      .fill()
      .map((a, i) => {
        let position = []
        newNav.getRandomRegion().centroid.toArray(position) //todo : add a condition to not push existing position
        newArrayOfPositions.push(position)
      })
    setArrayOfPositions(newArrayOfPositions)
  }

  const loader = new NavMeshLoader()

  useEffect(() => {
    fetchData()
  }, [url]) //loader var deleted to not sync every frame

  return [arrayOfPositions, globalPosition]
}
