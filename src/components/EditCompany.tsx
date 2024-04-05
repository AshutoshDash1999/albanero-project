import { useState } from "react";
import Modal from "react-responsive-modal";
import { CompanyDataProps } from "../utils/types";
import AddCompanyForm from "./AddCompany/AddCompanyForm";

const EditCompany = ({
  companyData,
  companyId,
}: {
  companyData: CompanyDataProps;
  companyId: string;
}) => {
  const [openEditCompanyModal, setOpenEditCompanyModal] = useState(false);

  const onOpenEditCompanyModal = () => setOpenEditCompanyModal(true);
  const onCloseEditCompanyModal = () => setOpenEditCompanyModal(false);
  return (
    <div>
      <button onClick={onOpenEditCompanyModal}>Edit</button>

      <Modal
        open={openEditCompanyModal}
        onClose={onCloseEditCompanyModal}
        center
      >
        <AddCompanyForm
          onCloseCompanyDetailsModal={onCloseEditCompanyModal}
          companyData={companyData}
          companyId={companyId}
        />
      </Modal>
    </div>
  );
};
export default EditCompany;
