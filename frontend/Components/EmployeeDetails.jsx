import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Table } from "react-bootstrap";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate(); // Use navigate to handle routing

  useEffect(() => {
    const fetchEmployee = async () => {
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

      const response = await fetch("http://localhost:9000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const data = await response.json();
      const employeeData = data.data.getEmployee;
      setEmployee({
        ...employeeData,
        retirementCountdown: calculateRetirementCountdown(employeeData),
      });
    };

    fetchEmployee(  );
  }, [id]);

  if (!employee) {
    return null;
  }

  const {
    firstname,
    lastname,
    age,
    dateOfJoining,
    title,
    department,
    employeeType,
    currentStatus,
    retirementCountdown,
  } = employee;

  function calculateRetirementCountdown(employee) {
    const retirementAge = 65;
    const currentAge = employee.age;
    const yearsToRetirement = retirementAge - currentAge;
    const retirementDate = getRetirementDate(employee);
    const today = new Date();
    const retirementCountdown = retirementDate - today;
    const days = Math.floor(retirementCountdown / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
  
    return {
      years,
      months,
      days: days % 30,
    };
  }
  
  function getRetirementDate(employee) {
    const retirementAge = 65;
    const dateOfJoining = new Date(employee.dateOfJoining);
    const currentAge = employee.age;
  
    const retirementYear = dateOfJoining.getFullYear() + (retirementAge - currentAge);
    const retirementDate = new Date(dateOfJoining);
    retirementDate.setFullYear(retirementYear);
  
    return retirementDate;
  }
  

  return (
    <Modal show onHide={() => navigate(-1)} className="employee-details-popup">
      <Modal.Body className="employee-details-content">
        <Modal.Title>Employee Details</Modal.Title>
        <Table striped bordered hover className="employee-details-table">
          <tbody>
            <tr>
              <td><strong>First Name</strong></td>
              <td>{firstname}</td>
            </tr>
            <tr>
              <td><strong>Last Name</strong></td>
              <td>{lastname}</td>
            </tr>
            <tr>
              <td><strong>Age</strong></td>
              <td>{age}</td>
            </tr>
            <tr>
              <td><strong>Joining Date</strong></td>
              <td>{new Date(dateOfJoining).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Title</strong></td>
              <td>{title}</td>
            </tr>
            <tr>
              <td><strong>Department</strong></td>
              <td>{department}</td>
            </tr>
            <tr>
              <td><strong>Type</strong></td>
              <td>{employeeType}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td>{currentStatus}</td>
            </tr>
            {retirementCountdown && (
              <tr>
                <td><strong>Retirement Countdown</strong></td>
                <td>
                  {retirementCountdown.years} years, {retirementCountdown.months} months, {retirementCountdown.days} days
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

