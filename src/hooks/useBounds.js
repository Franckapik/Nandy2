const useBounds = (obj) => {
  obj.geometry.computeBoundingBox()
  const b = obj.geometry.boundingBox.max
  return [b.x * 2, b.y * 2, b.z * 2]
}

export default useBounds
