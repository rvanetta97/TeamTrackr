const fs = require("fs");
const inquirer = require("inquirer");
const { Pool } = require('pg')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
      user: 'postgres',
      password: 'SQLuser2024!',
      host: 'localhost',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
  )

  pool.connect();

  const questions = [
    {
        type: "list",
        name: "selection",
        message: "Please choose from the following actions",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role"
        ],
    },
];

