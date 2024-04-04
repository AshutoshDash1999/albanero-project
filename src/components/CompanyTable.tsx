import DeleteCompany from "./DeleteCompany";
import EditCompany from "./EditCompany";

const CompanyTable = () => {
  return (
    <div>
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
          <tr>
            <td>Badho</td>
            <td>dev@badho.in</td>
            <td>98765</td>
            <td>badho.in</td>
            <td>60</td>
            <td className="action__cell">
              <EditCompany />
              <DeleteCompany />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default CompanyTable;
