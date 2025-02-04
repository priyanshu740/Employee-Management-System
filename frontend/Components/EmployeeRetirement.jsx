import React from "react";
import EmployeeTable from "./EmployeeTable.jsx";
import { Container, Button, Form } from "react-bootstrap";

export default class EmployeeRetirement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      showUpcomingRetirement: true,
      employeeTypeFilter: "",
    };

    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.showUpcomingRetirementEmployees = this.showUpcomingRetirementEmployees.bind(this);
    this.showAllEmployees = this.showAllEmployees.bind(this);
    this.handleEmployeeTypeChange = this.handleEmployeeTypeChange.bind(this);
  }

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    // Fetch employee data from API
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
        this.setState({ employees: data.data.list });
      })
      .catch((error) => console.error("Error:", error));
  }

  showUpcomingRetirementEmployees() {
    this.setState({ showUpcomingRetirement: true });
  }

  showAllEmployees() {
    this.setState({ showUpcomingRetirement: false });
  }

  handleEmployeeTypeChange(event) {
    this.setState({ employeeTypeFilter: event.target.value });
  }

  getFilteredEmployees() {
    const { employees, showUpcomingRetirement, employeeTypeFilter } = this.state;

    let filteredEmployees = employees;

    if (showUpcomingRetirement) {
      filteredEmployees = filteredEmployees.filter((employee) =>
        this.isRetirementUpcoming(employee)
      );
    }

    if (employeeTypeFilter) {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.employeeType === employeeTypeFilter
      );
    }

    return filteredEmployees;
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

  render() {
    const displayedEmployees = this.getFilteredEmployees();

    return (
      <Container className="retirement-container directory">
        <Button
          variant="primary"
          onClick={this.showUpcomingRetirementEmployees}
          className="btn2"
        >
          Show Upcoming Retirement
        </Button>
        <Button
          variant="secondary"
          onClick={this.showAllEmployees}
          className="btn2"
        >
          Show All Employees
        </Button>

        {this.state.showUpcomingRetirement && (
          <Form.Group controlId="employeeTypeFilter">
            <Form.Control
              as="select"
              value={this.state.employeeTypeFilter}
              onChange={this.handleEmployeeTypeChange}
              className="select-form"
            >
              <option value="">All Types</option>
              <option value="FullTime">Full Time</option>
              <option value="PartTime">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </Form.Control>
          </Form.Group>
        )}

        <EmployeeTable employees={displayedEmployees} />
      </Container>
    );
  }
}
