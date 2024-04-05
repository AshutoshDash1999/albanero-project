import { useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import AddCompanyForm from "./AddCompanyForm";

const AddCompany = () => {
  const [openAddCompanyModal, setOpenAddCompanyModal] = useState(false);

  const onOpenAddCompanyModal = () => setOpenAddCompanyModal(true);
  const onCloseAddCompanyModal = () => setOpenAddCompanyModal(false);

  return (
    <>
      <div className="add__company__container">
        <button onClick={onOpenAddCompanyModal}>Add a Company</button>
      </div>

      <Modal
        open={openAddCompanyModal}
        onClose={onCloseAddCompanyModal}
        center
        classNames={{
          modal: "addCompanyModal",
        }}
      >
        <AddCompanyForm onCloseAddCompanyModal={onCloseAddCompanyModal} />
      </Modal>
    </>
  );
};
export default AddCompany;
