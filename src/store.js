import create from 'zustand'

const useStore = create((set) => ({
    force: 0,
    rotation : 0,
    position: [0,0,0],
    velocity: [0,0,0],
    content: "msg",
    message: [],
    idea: [],
    info : "En avant Guimgamp",
    crates : [],
    popid : 0,
    popOpen : false,
    cameraTarget: {},
    targetIA: [25,0,25],
    IAManager: null,
    cameraControlsEnabled: true,
    videoPos : [0,0,0],
    vehicleObj : null,
    characterPos : [0,0,0],
    entitymanager : [],
    portal : 0,
    bulleOpacity : {opacity : 0.8},
    visible : false,
    isModalOpen : true,
    nbFlowers : 0,
    isControlsOpen : false,
    inc: () => set((state) => ({ count: state.count + 1 })),
    addFlower: () => set((state) => ({ nbFlowers: state.nbFlowers + 1 })),
    changeContent: (newContent) => set(() => ({content: newContent})),
    changeVehiclePos: (newPos) => set(() => ({portal: newPos})),
    changeForce: (newForce) => set(() => ({force: newForce})),
    changeRotation: (newRotation) => set(() => ({rotation: newRotation})),
    changeTarget: (newPosition) => set(() => ({cameraTarget: newPosition})),
    saveVehicle: (newObj) => set(() => ({vehicleObj: newObj})),
    changeVelocity: (newVelocity) => set(() => ({velocity: newVelocity})),
    changeId: (newId) => set(() => ({popid: newId})),
    addMsg: (newMsg) => set((state) => ({message: [...state.message, newMsg]})),
    addIdea: (newIdea) => set((state) => ({idea: [...state.idea, newIdea]})),
    changeInfo: (newInfo) => set(() => ({info: newInfo})),
    toggleModal: () => set((state) => ({isModalOpen: !state.isModalOpen})),
    toggleControls: () => set((state) => ({isControlsOpen: !state.isControlsOpen})),
    addCrate: (newCrate) => set((state) => ({crates: [...state.crates, newCrate]})),
    setVideoPos: (newPos) => set(() => ({videoPos: newPos })),
    setOpacity: (newFactor) => set(() => ({bulleOpacity: {opacity : newFactor }})),
    toggleVisible: () => set(state => ({visible : !state.visible}) ),
  }))

  window.store = useStore;

export default useStore;