import {
  addDoc,
  collection,
  doc,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import { ChangeEvent, MouseEvent, useState } from "react";
import { firebaseDB } from "../../utils/firebaseConfig";
import { EmployeeProps, ManagerProps } from "../../utils/types";

interface CompanyFormProps {
  onCloseCompanyDetailsModal: () => void;
  companyId?: string;
  companyData?: DocumentData;
}

const AddCompanyForm = (props: CompanyFormProps) => {
  const { onCloseCompanyDetailsModal, companyData, companyId } = props;

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: companyData?.companyName || "",
    email: companyData?.email || "",
    phoneNumber: companyData?.phoneNumber || "",
    domain: companyData?.domain || "",
  });

  const [detailsErrorMessage, setDetailsErrorMessage] = useState({
    companyName: false,
    email: false,
    phoneNumber: false,
    domain: false,
    isFormInComplete: false,
  });

  const [managerList, setManagerList] = useState(
    companyData?.managerList || [
      {
        id: 0,
        manager: "",
        employeeList: [
          {
            id: 0,
            name: "",
          },
        ],
      },
    ]
  );

  const onPressAddManager = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setManagerList([
      ...managerList,
      {
        id: managerList.length,
        manager: "",
        employeeList: [
          {
            id: 0,
            name: "",
          },
        ],
      },
    ]);
  };

  const onPressAddEmployee = (
    e: MouseEvent<HTMLButtonElement>,
    managerId: number
  ) => {
    e.preventDefault();

    setManagerList(
      managerList.map((manager: ManagerProps) => {
        if (manager.id === managerId) {
          return {
            ...manager,
            employeeList: [
              ...manager.employeeList,
              {
                id: manager.employeeList.length,
                name: "",
              },
            ],
          };
        }
        return manager;
      })
    );
  };

  const updateCompanyDetails = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const companyNameRegex = /^[A-Z][A-Za-z0-9]*$/;
    const phoneNumberRegex = /^\d{0,10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    switch (e.target.name) {
      case "companyName":
        if (companyNameRegex.test(e.target.value) || e.target.value === "") {
          setDetailsErrorMessage({
            ...detailsErrorMessage,
            companyName: false,
          });

          setCompanyDetails({
            ...companyDetails,
            companyName: e.target.value,
          });
        } else {
          setDetailsErrorMessage({ ...detailsErrorMessage, companyName: true });
        }
        break;

      case "phoneNumber":
        if (phoneNumberRegex.test(e.target.value)) {
          setDetailsErrorMessage({
            ...detailsErrorMessage,
            phoneNumber: false,
          });

          setCompanyDetails({
            ...companyDetails,
            phoneNumber: e.target.value,
          });
        } else {
          setDetailsErrorMessage({ ...detailsErrorMessage, phoneNumber: true });
        }
        break;

      case "email":
        setCompanyDetails({
          ...companyDetails,
          email: e.target.value,
        });

        if (emailRegex.test(e.target.value)) {
          setDetailsErrorMessage({
            ...detailsErrorMessage,
            email: false,
          });
        } else {
          setDetailsErrorMessage({ ...detailsErrorMessage, email: true });
        }
        break;

      default:
        setCompanyDetails({
          ...companyDetails,
          [e.target.name]: e.target.value,
        });
        break;
    }
  };

  const updateManagerName = (
    e: ChangeEvent<HTMLInputElement>,
    managerId: number
  ) => {
    setManagerList(
      managerList.map((manager: ManagerProps) => {
        if (manager.id === managerId) {
          return {
            ...manager,
            manager: e.target.value,
          };
        }
        return manager;
      })
    );
  };

  const updateEmployeeName = (
    e: ChangeEvent<HTMLInputElement>,
    managerId: number,
    employeeId: number
  ) => {
    setManagerList(
      managerList.map((manager: ManagerProps) => {
        if (manager.id === managerId) {
          const updatedEmployeeList = manager.employeeList.map(
            (employee: EmployeeProps) => {
              if (employee.id === employeeId) {
                return {
                  ...employee,
                  name: e.target.value,
                };
              }
              return employee;
            }
          );
          return {
            ...manager,
            employeeList: updatedEmployeeList,
          };
        }
        return manager;
      })
    );
  };

  const saveCompanyDetailsHandler = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    managerList.forEach((manager: ManagerProps) => {
      if (!manager.manager) {
        return setDetailsErrorMessage({
          ...detailsErrorMessage,
          isFormInComplete: true,
        });
      }

      manager.employeeList.forEach((employee: EmployeeProps) => {
        if (!employee.name) {
          return setDetailsErrorMessage({
            ...detailsErrorMessage,
            isFormInComplete: true,
          });
        }
      });
    });

    setDetailsErrorMessage({
      ...detailsErrorMessage,
      isFormInComplete: false,
    });

    try {
      setIsButtonLoading(true);

      if (companyId) {
        await setDoc(doc(firebaseDB, "companyData", companyId), {
          ...companyDetails,
          managerList,
        });
      } else {
        await addDoc(collection(firebaseDB, "companyData"), {
          ...companyDetails,
          managerList,
        });
      }
    } catch (error) {
      console.log("Error while adding company:", error);
    } finally {
      setIsButtonLoading(false);
      onCloseCompanyDetailsModal();
    }
  };

  return (
    <form action="" className="add__company__form">
      <label htmlFor="companyName">Name of the Company</label>
      <input
        id="companyName"
        name="companyName"
        type="text"
        value={companyDetails?.companyName}
        onChange={updateCompanyDetails}
      />

      {detailsErrorMessage?.companyName ? (
        <ul className="form__details__error__container">
          <li>First letter should be capital</li>
          <li>No special character</li>
        </ul>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        name="email"
        value={companyDetails?.email}
        onChange={updateCompanyDetails}
      />
      {detailsErrorMessage?.email ? (
        <ul className="form__details__error__container">
          <li>Invalid email address</li>
        </ul>
      ) : null}

      <label htmlFor="phoneNumber">Contact details</label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        value={companyDetails?.phoneNumber}
        type="text"
        onChange={updateCompanyDetails}
      />

      {detailsErrorMessage?.phoneNumber ? (
        <ul className="form__details__error__container">
          <li>Only numbers allowed</li>
          <li>Maximum allowed length is 10</li>
        </ul>
      ) : null}

      <label htmlFor="domain">Domain</label>
      <select
        id="domain"
        name="domain"
        onChange={updateCompanyDetails}
        value={companyDetails?.domain}
      >
        <option value="">Select an Option</option>
        <option value="gaming">Gaming</option>
        <option value="automobile">Automobile</option>
        <option value="photography">Photography</option>
      </select>

      <button onClick={onPressAddManager}>Add Manager</button>

      {managerList.map((manager: ManagerProps) => {
        return (
          <div key={manager?.id} className="manager__input_container">
            <label htmlFor="manager">Manager {manager?.id + 1}</label>
            <input
              id="manager"
              type="text"
              onChange={(e) => updateManagerName(e, manager?.id)}
              value={manager?.manager}
            />

            <div className="employee__list__container">
              {manager?.employeeList?.map((employee: EmployeeProps) => {
                return (
                  <div key={employee?.id} className="employee__input_container">
                    <label htmlFor="employee">
                      Employee {employee?.id + 1}
                    </label>
                    <input
                      id="employee"
                      type="text"
                      onChange={(e) =>
                        updateEmployeeName(e, manager?.id, employee?.id)
                      }
                      value={employee?.name}
                    />
                  </div>
                );
              })}
            </div>

            <button onClick={(e) => onPressAddEmployee(e, manager?.id)}>
              Add Employee
            </button>
          </div>
        );
      })}

      {detailsErrorMessage?.isFormInComplete ? (
        <div className="form__details__error__container">
          <p>Please fill all details</p>
        </div>
      ) : null}

      <div className="modal__footer">
        <button onClick={onCloseCompanyDetailsModal}>Cancel</button>
        <button onClick={saveCompanyDetailsHandler} disabled={isButtonLoading}>
          Save
        </button>
      </div>
    </form>
  );
};
export default AddCompanyForm;
