export interface EmployeeProps {
  id: number;
  name: string;
}

export interface ManagerProps {
  id: number;
  manager: string;
  employeeList: EmployeeProps[];
}

export interface CompanyDataProps {
  companyName: string;
  email: string;
  phoneNumber: string;
  domain: string;
  managerList?: ManagerProps[];
}
