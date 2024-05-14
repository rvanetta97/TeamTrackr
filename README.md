# TeamTrackr

Walkthrough video https://drive.google.com/file/d/11p38dH0u7DQvmMUkYGfsK0pJ09RQFuKb/view?usp=sharing

#Employee Tracker
This Node.js application allows users to manage departments, roles, and employees of a company. It provides functionalities to view existing data, add new entries, and update employee roles.

#Installation
Clone the repository:

1. bash
2. Copy code
3. git clone https://github.com/your-username/employee-tracker.git
4. Install dependencies:
    - bash
    - Copy code
    - npm install

#Set up the PostgreSQL database:

Make sure you have PostgreSQL installed on your system.
1. Create a new database named employee_tracker.
2. Execute the SQL scripts in the database/ directory to set up the schema and initial data.
3. Start the application:
    - bash
    - Copy code
    - npm start

#Usage
Upon starting the application, you will be prompted with a list of actions to choose from:

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role

Selecting any of these actions will prompt you with further instructions or input based on the selected action.

#Dependencies

1. inquirer: For interactive command-line user interface.
2. pg: PostgreSQL client for Node.js.
3. express: Web framework for Node.js to handle HTTP requests.

#License

This project is licensed under the MIT License - see the LICENSE file for details.

