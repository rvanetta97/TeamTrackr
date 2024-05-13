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
          viewDepartment().then(() => restartPrompt());;
          break;
        case "View all roles":
          viewRole().then(() => restartPrompt());;
          break;
        case "View all employees":
          viewEmployee().then(() => restartPrompt());;
          break;
        case "Add a department":
          addDepartment().then(() => restartPrompt());;;
          break;
        case "Add a role":
          addRole().then(() => restartPrompt());;;
          break;
        case "Add an employee":
          addEmployee().then(() => restartPrompt());;
          break;
        case "Update an employee role":
          updateEmployee().then(() => restartPrompt());;
          break;
        default:
          console.log("Error with request");
          break;
      }
    });
}

function viewDepartment() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM department', (err, res) => {
      if (err) {
        console.error('Error executing query', err);
        reject(err); // Reject the promise if there's an error
      } else {
        console.log('Query result:', res.rows);
        resolve(); // Resolve the promise if the query is successful
      }
    });
  });
};
function viewRole() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM role', (err, res) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        console.log('Query result:', res.rows);
        resolve();
      }
    });
  });
};
function viewEmployee() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM employee', (err, res) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        console.log('Query result:', res.rows);
        resolve();
      }
    });
  });
};

function addDepartment() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
      .then((answers) => {
        pool.query(`INSERT INTO department (name) VALUES ($1)`, [answers.department], (err, results) => {
          if (err) {
            console.error('Error executing query', err);
          } else {
            console.log("Department added successfully!");
            resolve();
          }
        });
      });
  });
};

function addRole() {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM department`, (err, results) => {
      if (err) {
        console.error('Error retrieving roles', err);
        return;
      }
      const departments = results.rows.map(department => ({
        name: department.name,
        value: department.id
      }));
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
        {
          type: "list",
          name: "departmentId",
          message: "Please select a department",
          choices: departments
        },
      ])
        .then((answers) => {
          pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [answers.roleTitle, answers.salary, answers.departmentId], (err, results) => {
            if (err) {
              console.error('Error executing query', err);
            } else {
              console.log("Role added successfully!");
              resolve();
            }
          });
        });
    });
  });
};

function addEmployee() {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM role`, (err, results) => {
      if (err) {
        console.error('Error retrieving roles', err);
        return;
      }
      const roles = results.rows.map(role => ({
        name: role.title,
        value: role.id
      }));
      pool.query(`SELECT * FROM employee`, (err, employeeResults) => {
        if (err) {
          console.error('Error retrieving employees', err);
          reject(err);
          return;
        }
        const managers = employeeResults.rows.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }));

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
            choices: roles
          },
          {
            type: "list",
            name: "manager",
            message: "Who is this employee's manager?",
            choices: managers
          },
        ])
          .then((answers) => {

            pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, answers.roleId, answers.manager], (err, results) => {
              if (err) {
                console.error('Error executing query', err);
              } else {
                console.log("Employee added successfully!");
                resolve();
              }
            });
          });
      });
    });
  });
};
function updateEmployee() {
  return new Promise((resolve, reject) => {
    // Retrieve employees
    pool.query(`SELECT * FROM employee`, (err, employeeResults) => {
      if (err) {
        console.error('Error retrieving employees', err);
        reject(err);
        return;
      }
      const employees = employeeResults.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }));
      
      // Retrieve roles
      pool.query(`SELECT * FROM role`, (err, roleResults) => {
        if (err) {
          console.error('Error retrieving roles', err);
          reject(err);
          return;
        }
        const roles = roleResults.rows.map(role => ({
          name: role.title,
          value: role.id
        }));

        inquirer.prompt([
          {
            type: 'list',
            message: "Which employee do you want to update?",
            name: 'employeeId',
            choices: employees
          },
          {
            type: "list",
            name: "roleId",
            message: "Please select the new role of the employee",
            choices: roles
          },
        ])
        .then((answers) => {
          const { employeeId, roleId } = answers;
          // Update employee's role
          pool.query(
            `UPDATE employee SET role_id = $1 WHERE id = $2`,
            [roleId, employeeId],
            (err, results) => {
              if (err) {
                console.error('Error executing query', err);
                reject(err);
              } else {
                console.log("Employee updated successfully!");
                resolve();
              }
            }
          );
        })
        .catch((error) => {
          console.error('Error inquirer prompt', error);
          reject(error);
        });
      });
    });
  });
}
function restartPrompt() {
  inquirer.prompt([
    {
      type: "confirm",
      name: "restart",
      message: "Do you want to perform another action?",
      default: true
    }
  ]).then((answers) => {
    if (answers.restart) {
      startPrompt(); // Restart the main prompt
    } else {
      console.log("Exiting...");
      pool.end(); // End the connection to the database
    }
  });
}
