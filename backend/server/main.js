const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { MongoClient, ObjectId } = require("mongodb");
const { typeDefs, GraphQLDate } = require("./Schema");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const DATABASE = process.env.DATABASE;
const app = express();

let db;

async function connectDB() {
  try {
    console.log(DATABASE);
    const client = new MongoClient(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to database!");
    db = client.db();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

const resolvers = {
  GraphQLDate,
  Query: {
    list: async () => {
      try {
        const employees = await db.collection("employee").find().toArray();
        return employees;
      } catch (error) {
        console.error("Error fetching employee list:", error);
        return [];
      }
    },
    getEmployee: async (_, { id }) => {
      try {
        const employee = await db
          .collection("employee")
          .findOne({ _id: new ObjectId(id) });
        return employee;
      } catch (error) {
        console.error(`Error fetching employee with ID ${id}:`, error);
        throw error;
      }
    },
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      try {
        const result = await db.collection("employee").insertOne(input);
        const insertedEmployee = await db
          .collection("employee")
          .findOne({ _id: result.insertedId });
        return insertedEmployee;
      } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
      }
    },
    updateEmployee: async (_, { id, input }) => {
      try {
        console.log(`Updating employee with ID: ${id}, Input:`, input);

        const updateObject = {};
        if (input.title !== undefined) updateObject.title = input.title;
        if (input.department !== undefined)
          updateObject.department = input.department;
        if (input.currentStatus !== undefined)
          updateObject.currentStatus = input.currentStatus;

        console.log(`Update Object:`, updateObject);

        const objectId = new ObjectId(id);
        console.log(`ObjectId for update:`, objectId);

        const updateResult = await db
          .collection("employee")
          .updateOne({ _id: objectId }, { $set: updateObject });

        if (updateResult.matchedCount === 0) {
          console.error(`No employee found with ID ${id}`);
          return null;
        }

        const updatedEmployee = await db
          .collection("employee")
          .findOne({ _id: objectId });

        console.log(`Updated Employee:`, updatedEmployee);

        return updatedEmployee;
      } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        throw error;
      }
    },
    deleteEmployee: async (_, { id }) => {
      try {
        const objectId = new ObjectId(id);
        const employeeToDelete = await db
          .collection("employee")
          .findOne({ _id: objectId });

        if (!employeeToDelete) {
          console.error(`No employee found with ID ${id}`);
          return null;
        }

        await db.collection("employee").deleteOne({ _id: objectId });

        return employeeToDelete;
      } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        throw error;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });
  connectDB();
});

app.listen(PORT, () => {
  console.log(`App started on http://localhost:${PORT}`);
});
