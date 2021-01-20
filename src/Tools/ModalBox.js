import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',            
  }
};

Modal.setAppElement('#root')

export default function ModalBox({startup}){
  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(startup);
/*   function openModal() {
    setIsOpen(true);
  } */

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = 'black';
  }

  function closeModal(){
    setIsOpen(false);
  }

    return (
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref={_subtitle => (subtitle = _subtitle)}>Bienvenue sur Nature and You</h2>
          <div>Texte de presentation  + Image à inserer</div>
          <hr></hr>
          <form>
            <input />
            <button>Envoyer</button>
          </form>
          <hr></hr>
          <button onClick={closeModal}>Fermer l'intro</button>
        </Modal>
    );
}