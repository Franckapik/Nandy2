import React, { useEffect, useState } from 'react';
import { NavMesh, NavMeshLoader, Vector3 } from 'yuka';



export const useNavLoader =(url) => {
    const [nav, setNav] = useState(new NavMesh());
    const [rtarget, setTarget] = useState(new Vector3(5,5,5))


    const loader = new NavMeshLoader();

    useEffect(() => {
      async function fetchData() {
        const newNav = await loader.load(url);
        setNav(newNav);
        return newNav;  
      }
      fetchData().then(r => {
        setInterval(()=> {
          const random = r.getRandomRegion().centroid;
          setTarget(random);
        }, 5000)
      })

    }, [url]); //loader var deleted to not sync every frame

    return [nav, rtarget];
  }

