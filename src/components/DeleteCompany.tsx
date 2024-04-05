import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import Modal from "react-responsive-modal";
import { firebaseDB } from "../utils/firebaseConfig";

const DeleteCompany = ({ companyId }: { companyId: string }) => {
  const [openDeleteCompanyModal, setOpenDeleteCompanyModal] = useState(false);

  const onOpenDeleteCompanyModal = () => setOpenDeleteCompanyModal(true);
  const onCloseDeleteCompanyModal = () => setOpenDeleteCompanyModal(false);

  const handleDeleteCompany = async () => {
    try {
      await deleteDoc(doc(firebaseDB, "companyData", companyId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      onCloseDeleteCompanyModal();
    }
  };

  return (
    <div>
      <button onClick={onOpenDeleteCompanyModal}>Delete</button>

      <Modal
        open={openDeleteCompanyModal}
        onClose={onCloseDeleteCompanyModal}
        center
      >
        <h3>Are you sure you want to delete this company?</h3>
        <div className="modal__footer">
          <button onClick={onCloseDeleteCompanyModal}>Cancel</button>
          <button onClick={handleDeleteCompany}>Yes, Delete</button>
        </div>
      </Modal>
    </div>
  );
};
export default DeleteCompany;
