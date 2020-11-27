import React from "react";
import Modal from "react-modal";
import useStore from "../store.js";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflow: 'hidden',
    minWidth: '300px',
    minHeight: '300px',
  },
};
Modal.setAppElement("#root");

export default function ModalBox({ children, title }) {
  const isModalOpen = useStore(state => state.isModalOpen)
  const toggleModal = useStore(state => state.toggleModal)

 /* function openModal() {
  }*/

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    toggleModal()  
  }

  return (
    <div className="modal">
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>{title}</h2>
        <div className="content"> {children}</div>
      </Modal>
    </div>
  );
}
