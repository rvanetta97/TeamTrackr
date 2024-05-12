const { error } = require("console");
const fs = require("fs");
const inquirer = require("inquirer");
const { Pool } = require('pg');
const express = require('express');

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
      database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker_db database.`)
  )

 
pool.connect()
.then(() => {
  console.log(`Connected to the employee_tracker_db database.`);
  startPrompt(); // Start the prompt after connecting to the database
})
.catch(err => console.error('Error connecting to database:', err));

function startPrompt() {
inquirer.prompt([
  {
    type: "list",
    name: "choices",
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
])
.then((answers) => {
  // Based on the selection, ask additional questions conditionally
  switch (answers.choices) {
    case "View all departments":
        viewDepartment();
        break;
    case "View all roles":
        viewRole ();
        break;
    case "View all employees":
        viewEmployee ();
        break;
    case "Add a department":
      addDepartment();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add an employee":
      addEmployee();
      break;
    default:
      console.log(err)
      break;
  }
});
}

function viewDepartment () {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Query result:', res.rows);
        }
      });
};
function viewRole () {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Query result:', res.rows);
        }
      });
};
function viewEmployee () {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Query result:', res.rows);
        }
      });
};

function addDepartment() {
inquirer.prompt([
  {
    type: "input",
    name: "department",
    message: "What is the name of the department?",
  },
])
.then((answers) => {
    pool.query(`INSERT INTO department (name) VALUES ($1)`, [answers.department], (err, results)=> {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log("Department added successfully!");
            viewDepartment();
        }
    });
});
};

function addRole() {
inquirer.prompt([
  {
    type: "input",
    name: "roleTitle",
    message: "What is the title of this role?",
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for this role?",
  },
])
.then((answers) => {
    pool.query(`INSERT INTO role (title, salary) VALUES ($1, $2)`, [answers.roleTitle, answers.salary], (err, results)=> {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log("Role added successfully!");
            viewRole();
        }
    });
});
}

function addEmployee() {
   
    pool.query(`SELECT * FROM role`, (err, results) => {
        if (err) {
            console.error('Error retrieving roles', err);
            return;
        }
        const role = results.rows.map(role => ({
            name: role.title,
            value: role.id // Assuming there's an 'id' column in the 'role' table
        }));
    });
inquirer.prompt([
  {
    type: "input",
    name: "firstName",
    message: "What is the first name of the employee?",
  },
  {
    type: "input",
    name: "lastName",
    message: "What is the last name of the employee?",
  },
  {
    type: "list",
    name: "roleId",
    message: "Please select the role of the employee",
    choices: role
  },
  // Add more questions related to employee details
])
.then((answers) => {
  pool.query(`INSERT INTO employee (first_name, last_name, roleId) VALUES ($1, $2)`, [answers.firstName, answers.lastName], (err, results)=> {
    if (err) {
        console.error('Error executing query', err);
    } else {
        console.log("Employee added successfully!");
        viewEmployee();
    }  
    });
});
};

