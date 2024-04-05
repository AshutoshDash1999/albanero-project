import { collection, getFirestore } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../utils/firebaseConfig";
import { ManagerProps } from "../utils/types";
import DeleteCompany from "./DeleteCompany";
import EditCompany from "./EditCompany";

const CompanyTable = () => {
  const [companyData, companyDataLoading] = useCollection(
    collection(getFirestore(firebaseApp), "companyData"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <div>
      {!companyDataLoading ? (
        <table>
          <thead>
            <tr>
              <th>Name of the company</th>
              <th>Email Address</th>
              <th>Contact Details</th>
              <th>Domain</th>
              <th>Head Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companyData &&
              companyData.docs.map((doc) => {
                const managerCount = doc?.data()?.managerList?.length;
                const employeeCount = doc
                  ?.data()
                  ?.managerList?.map(
                    (manager: ManagerProps) => manager?.employeeList.length
                  )
                  .reduce(
                    (prevCount: number, currentCount: number) =>
                      prevCount + currentCount,
                    0
                  );
                return (
                  <tr key={doc.id}>
                    <td>{doc?.data()?.companyName}</td>
                    <td>{doc?.data()?.email}</td>
                    <td>{doc?.data()?.phoneNumber}</td>
                    <td>{doc?.data()?.domain}</td>
                    <td>{managerCount + employeeCount}</td>
                    <td className="action__cell">
                      <EditCompany
                        companyData={doc?.data()}
                        companyId={doc.id}
                      />
                      <DeleteCompany companyId={doc.id} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default CompanyTable;
