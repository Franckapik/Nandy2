
const useSound = (url) => {
        const listener = new Audio(url)
        listener.currentTime = 0
      
    return listener
}

export default useSound

