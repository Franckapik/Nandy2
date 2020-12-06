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
      fetchData()
    }, [url]); //loader var deleted to not sync every frame


      useEffect(()=> {
        if(nav.regions.length) {
          setInterval(()=> {
            const random = nav.getRandomRegion().centroid;
            setTarget(random);
          }, 5000)
        }
      }, [nav.regions])

    return [nav, rtarget];
  }

