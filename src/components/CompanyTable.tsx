import { collection, getFirestore } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp } from "../utils/firebaseConfig";
import DeleteCompany from "./DeleteCompany";
import EditCompany from "./EditCompany";

const CompanyTable = () => {
  const [companyData, companyDataLoading, companyDataError] = useCollection(
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
                const { companyName, domain, email, phoneNumber } = doc?.data();
                const managerCount = doc?.data()?.managerList?.length;
                const employeeCount = doc
                  ?.data()
                  ?.managerList?.map((manager) => manager?.employeeList.length)
                  .reduce(
                    (prevCount: number, currentCount: number) =>
                      prevCount + currentCount,
                    0
                  );
                return (
                  <tr key={doc.id}>
                    <td>{companyName}</td>
                    <td>{email}</td>
                    <td>{phoneNumber}</td>
                    <td>{domain}</td>
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
