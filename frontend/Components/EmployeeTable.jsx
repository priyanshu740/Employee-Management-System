import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

export default function EmployeeTable(props) {
  const navigate = useNavigate();
  const isUpcomingRetirementRoute = window.location.href.includes("#/upcomingRetirement");

  const handleViewClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div>
      <Table striped bordered hover className="employee-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Joining Date</th>
            <th>Title</th>
            <th>Department</th>
            <th>Type</th>
            <th>Status</th>
            <th>Upcoming Retirement</th>
            {!isUpcomingRetirementRoute && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {props.employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.firstname}</td>
              <td>{employee.lastname}</td>
              <td>{employee.age}</td>
              <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
              <td>{employee.title}</td>
              <td>{employee.department}</td>
              <td>{employee.employeeType}</td>
              <td>{employee.currentStatus === 1 ? "Active" : "Inactive"}</td>
              <td>{isRetirementUpcoming(employee) ? "Yes" : "No"}</td>
              {!isUpcomingRetirementRoute && (
                <td>
                  <Button
                    onClick={() => handleViewClick(employee._id)}
                    variant="primary"
                    className="btn-action btn-view"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => props.onDeleteEmployee(employee._id)}
                    variant="danger"
                    className="btn-action btn-delete"
                    disabled={isUpcomingRetirementRoute}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => props.onChangeEmployee(employee._id)}
                    variant="warning"
                    className="btn-action btn-change"
                    disabled={isUpcomingRetirementRoute}
                  >
                    Change
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

// Function to get the retirement date
function getRetirementDate(employee) {
  const retirementAge = 65;
  const dateOfJoining = new Date(employee.dateOfJoining);
  const currentAge = employee.age;

  const retirementYear = dateOfJoining.getFullYear() + (retirementAge - currentAge);
  const retirementDate = new Date(dateOfJoining);
  retirementDate.setFullYear(retirementYear);

  return retirementDate;
}

// Function to check if retirement is upcoming within 6 months
function isRetirementUpcoming(employee) {
  const retirementDate = getRetirementDate(employee);
  const today = new Date();
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);

  return retirementDate <= sixMonthsLater;
}
