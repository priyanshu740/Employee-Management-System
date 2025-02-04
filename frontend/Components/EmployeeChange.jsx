import React, { Component } from "react";
import { Form, Button, Modal } from "react-bootstrap";

export default class EmployeeChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.employee.title || "",
      department: props.employee.department || "",
      currentStatus: props.employee.currentStatus || "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { title, department, currentStatus } = this.state;
    const { employee, onUpdate } = this.props;

    const updatedEmployee = {
      title,
      department,
      currentStatus: parseInt(currentStatus, 10),
    };

    onUpdate(employee._id, updatedEmployee); // Pass both id and updatedEmployee
  }

  render() {
    const { title, department, currentStatus } = this.state;
    const { onClose } = this.props;

    return (
      <Modal className="employee-details-popup" show onHide={onClose}>
        <Modal.Body className="employee-details-content">
          <Modal.Title className="title">Change Employee Details</Modal.Title>
          <Form onSubmit={this.handleSubmit} className="change-form">
            <Form.Group controlId="title" className="topBox">
              <Form.Label className="topBox">Title:</Form.Label>
              <Form.Control
                as="select"
                name="title"
                value={title}
                onChange={this.handleChange}
                className="select-form"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="department" className="topBox">
              <Form.Label className="topBox" >Department:</Form.Label>
              <Form.Control
                as="select"
                name="department"
                value={department}
                onChange={this.handleChange}
                className="select-form"
              >
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="currentStatus" className="topBox">
              <Form.Label >Current Status:</Form.Label>
              <Form.Control
                as="select"
                name="currentStatus"
                value={currentStatus}
                onChange={this.handleChange}
                className="select-form"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-submit">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={onClose} className="btn-submit">
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
