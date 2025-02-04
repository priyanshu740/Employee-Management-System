import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function EmployeeCreateWrapper() {
  const navigate = useNavigate();
  const params = useParams();

  return <EmployeeCreate navigate={navigate} params={params} />;
}

class EmployeeCreate extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = document.forms["employee-form"];
    const newEmployee = {
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      age: parseInt(form.age.value),
      dateOfJoining: form.joining.value,
      title: form.title.value,
      department: form.department.value,
      employeeType: form.type.value,
      currentStatus: 1,
    };

    const query = `
        mutation CreateEmployee($input: EmployeeInput!) {
          createEmployee(input: $input) {
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

    const variables = { input: newEmployee };

    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Employee created:", data.data.createEmployee);
        this.props.navigate("/");
        form.reset();
      })
      .catch((error) => console.error("Error:", error));
  }

  render() {
    return (
      <div className="form-container">
        <Form onSubmit={this.handleSubmit} id="employee-form">
          <Form.Group className="form-group" controlId="firstname">
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              type="text"
              className="input-form"
              name="firstname"
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="lastname">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              type="text"
              className="input-form"
              name="lastname"
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="age">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="number"
              className="input-form"
              name="age"
              min="20"
              max="70"
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="joining">
            <Form.Label>Joining Date:</Form.Label>
            <Form.Control
              type="date"
              className="input-form"
              name="joining"
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="title">
            <Form.Label>Title:</Form.Label>
            <Form.Control as="select" name="title" className="select-form">
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="VP">VP</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="form-group" controlId="department">
            <Form.Label>Department:</Form.Label>
            <Form.Control
              as="select"
              name="department"
              className="select-form"
            >
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="form-group" controlId="type">
            <Form.Label>Type:</Form.Label>
            <Form.Control as="select" name="type" className="select-form">
              <option value="FullTime">Full Time</option>
              <option value="PartTime">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </Form.Control>
          </Form.Group>

          <Button type="submit" className="btn btn-submit" id="btnSubmit">
            Add Employee
          </Button>
        </Form>
      </div>
    );
  }
}
