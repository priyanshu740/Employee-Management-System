import React from "react";
import { Form, Button, Container } from "react-bootstrap";

export default class EmployeeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "All Employee",
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  handleSearch() {
    this.props.onSearch(this.state.filter);
  }

  render() {
    return (
      <Container className="search-container">
        <Form.Group controlId="filter">
          <Form.Control
            as="select"
            value={this.state.filter}
            className="select-form"
            onChange={this.handleFilterChange}
          >
            <option value="All Employee">All Employees</option>
            <option value="FullTime">Full-Time Employees</option>
            <option value="PartTime">Part-Time Employees</option>
            <option value="Contract">Contract Employees</option>
            <option value="Seasonal">Seasonal Employees</option>
          </Form.Control>
        </Form.Group>
        <Button
          variant="primary"
          id="btnSearch"
          onClick={this.handleSearch}
          className="m-3 filterBtn"
        >
          Filter
        </Button>
      </Container>
    );
  }
}
