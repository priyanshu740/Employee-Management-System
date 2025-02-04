const { gql } = require("apollo-server-express");
const { GraphQLScalarType, Kind } = require("graphql");
const { ObjectId } = require("mongodb");

// Custom GraphQL Date Scalar
const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "Custom date scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// GraphQL Type Definitions
const typeDefs = gql`
  scalar GraphQLDate

  type Employee {
    _id: ID!
    firstname: String!
    lastname: String!
    age: Int!
    dateOfJoining: GraphQLDate!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Int!
  }

  input EmployeeInput {
    firstname: String!
    lastname: String!
    age: Int!
    dateOfJoining: GraphQLDate!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Int!
  }

  input EmployeeUpdateInput {
    title: String
    department: String
    currentStatus: Int
  }

  type Query {
    list: [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    createEmployee(input: EmployeeInput!): Employee
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee
    deleteEmployee(id: ID!): Employee
  }
`;

module.exports = { typeDefs, GraphQLDate };
