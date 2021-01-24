import { useEffect, useState } from 'react'
import { NavMeshLoader } from 'yuka'

const useNavmesh = (url) => {
  const [navMesh, setNavmesh] = useState(0)
  
  useEffect(() => {
    console.log("oui");
    const loader = new NavMeshLoader()
    async function fetchData() {
      const newNav = await loader.load(url) 
      setNavmesh(newNav)
    }
    fetchData()
  }, [url]) //loader var deleted to not sync every frame

  return navMesh
}

export default useNavmesh
