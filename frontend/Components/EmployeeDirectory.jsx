import React from "react";
import { Container, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import EmployeeDetails from "./EmployeeDetails.jsx";
import EmployeeChange from "./EmployeeChange.jsx";

export default class EmployeeDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      filteredEmployees: [],
      selectedEmployee: null,
      employeeToChange: null,
      showUpcomingRetirement: false,
      employeeTypeFilter: "",
      toast: { show: false, message: "", variant: "" },
    };
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectEmployee = this.handleSelectEmployee.bind(this);
    this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
    this.handleChangeEmployee = this.handleChangeEmployee.bind(this);
    this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);
    this.handleCloseDetails = this.handleCloseDetails.bind(this);
    this.handleCloseChange = this.handleCloseChange.bind(this);
    this.handleEmployeeTypeChange = this.handleEmployeeTypeChange.bind(this);
    this.calculateRetirementCountdown = this.calculateRetirementCountdown.bind(this);
    this.isRetirementUpcoming = this.isRetirementUpcoming.bind(this);
    this.showToast = this.showToast.bind(this);
    this.closeToast = this.closeToast.bind(this);
  }

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    const query = `
      query {
        list {
          _id
          firstname
          lastname
          age
          dateOfJoining
          title
          department
          employeeType
          currentStatus
        }
      }
    `;

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          employees: data.data.list,
          filteredEmployees: data.data.list,
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  // Search Employee based on filter 
  handleSearch(filter) {
    let filteredEmployees = this.state.employees;

    if (filter !== "All Employee") {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.employeeType === filter
      );
    }

    this.setState({ filteredEmployees });
  }

  handleSelectEmployee(id) {
    const query = `
      query getEmployee($id: ID!) {
        getEmployee(id: $id) {
          _id
          firstname
          lastname
          age
          dateOfJoining
          title
          department
          employeeType
          currentStatus
        }
      }
    `;

    const variables = { id };

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    })
      .then((response) => response.json())
      .then((data) => {
        const employee = data.data.getEmployee;
        this.setState({
          selectedEmployee: {
            ...employee,
            retirementCountdown: this.calculateRetirementCountdown(employee),
          },
        });
      })
      .catch((error) =>
        console.error(`Error fetching employee with ID ${id}:`, error)
      );
  }

  // Delete particular employee
  handleDeleteEmployee(id) {

    const employee = this.state.employees.find((emp) => emp._id === id);

    if (employee.currentStatus === 1) {
      alert("CAN’T DELETE EMPLOYEE – STATUS ACTIVE");
      return;
    }

    const query = `
      mutation deleteEmployee($id: ID!) {
        deleteEmployee(id: $id) {
          _id
        }
      }
    `;

    const variables = { id };

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    })
      .then((response) => response.json())
      .then(() => {
        this.fetchEmployees(); 
        this.showToast("Employee deleted successfully!", "danger");
      })
      .catch((error) =>
        console.error(`Error deleting employee with ID ${id}:`, error)
      );
  }

  handleChangeEmployee(id) {
    const employee = this.state.employees.find((emp) => emp._id === id);
    this.setState({ employeeToChange: employee });
  }

  // Update employee
  handleUpdateEmployee(id, updatedEmployee) {
    const query = `
      mutation updateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
        updateEmployee(id: $id, input: $input) {
          _id
          firstname
          lastname
          age
          dateOfJoining
          title
          department
          employeeType
          currentStatus
        }
      }
    `;

    const variables = {
      id,
      input: updatedEmployee,
    };

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    })
      .then((response) => response.json())
      .then(() => {
        this.fetchEmployees(); // Refresh the employee list
        this.setState({ employeeToChange: null });
        this.showToast("Employee updated successfully!", "success");
      })
      .catch((error) =>
        console.error(`Error updating employee with ID ${id}:`, error)
      );
  }

  handleCloseDetails() {
    this.setState({ selectedEmployee: null });
  }

  handleCloseChange() {
    this.setState({ employeeToChange: null });
  }

  handleEmployeeTypeChange(event) {
    this.setState({ employeeTypeFilter: event.target.value });
  }

  calculateRetirementCountdown(employee) {
    const retirementAge = 65;
    const currentAge = employee.age;
    const yearsToRetirement = retirementAge - currentAge;
    return yearsToRetirement > 0 ? yearsToRetirement : 0;
  }

  isRetirementUpcoming(employee) {
    const retirementDate = this.getRetirementDate(employee);
    const today = new Date();
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(today.getMonth() + 6);

    return retirementDate <= sixMonthsLater;
  }

  getRetirementDate(employee) {
    const retirementAge = 65;
    const dateOfJoining = new Date(employee.dateOfJoining);
    const currentAge = employee.age;

    const retirementYear = dateOfJoining.getFullYear() + (retirementAge - currentAge);
    const retirementDate = new Date(dateOfJoining);
    retirementDate.setFullYear(retirementYear);

    return retirementDate;
  }

  showToast(message, variant) {
    this.setState({ toast: { show: true, message, variant } });
  }

  closeToast() {
    this.setState({ toast: { show: false, message: "", variant: "" } });
  }

  render() {
    const {
      employees,
      filteredEmployees,
      selectedEmployee,
      employeeToChange,
      showUpcomingRetirement,
      employeeTypeFilter,
      toast,
    } = this.state;

    const displayedEmployees = showUpcomingRetirement
      ? filteredEmployees.filter(this.isRetirementUpcoming)
      : filteredEmployees;

    return (
      <Container className="directory">
        <Row>
          <Col>
            <EmployeeSearch onSearch={this.handleSearch} />
          </Col>
          <Col>
            <EmployeeTable
              employees={displayedEmployees}
              onSelectEmployee={this.handleSelectEmployee}
              onDeleteEmployee={this.handleDeleteEmployee}
              onChangeEmployee={this.handleChangeEmployee}
              onEmployeeTypeChange={this.handleEmployeeTypeChange}
              employeeTypeFilter={employeeTypeFilter}
            />
          </Col>
        </Row>
        {selectedEmployee && (
          <EmployeeDetails employee={selectedEmployee} onClose={this.handleCloseDetails} />
        )}
        {employeeToChange && (
          <EmployeeChange
            employee={employeeToChange}
            onUpdate={this.handleUpdateEmployee}
            onClose={this.handleCloseChange}
          />
        )}
        {toast.show && (
          <ToastContainer position="bottom-end" className="p-3">
            <Toast
              onClose={this.closeToast}
              show={toast.show}
              delay={3000}
              autohide
              className={`toast ${toast.variant}`}
              style={{
                position: 'absolute',
                bottom: '1%',
                right: '0.5%',
                width: '150px',
              }}
            >
              <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </Container>
    );
  }
}
