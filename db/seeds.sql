INSERT INTO department(
    name 
)
VALUES 
    ('Legal'), 
    ('IT'),
    ('Sales');

INSERT INTO role (
    title,
    salary,
    department_id
)
VALUES 
    ('Legal Assistant', 54000.00, 1),
    ('Paralegal', 60000.00, 1),
    ('IT Specialist', 60000.00, 2),
    ('Sales Representative', 45000.00, 3);

INSERT INTO employee (
    first_name,
    last_name,
    role_id,
    manager_id
)
VALUES
    ('Rachel', 'Vanetta', 2, NULL),
    ('Emily', 'Adams', 1, 1);
