const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


// Connect to database taken from sql lessions
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      password: 'MyNewPass',
      database: 'employeeTracker_db'
    },
    console.log(`Connected to the employeeTracker_db database.`)
  );


db.connect ((err) => {
    if (err){
        console.log(err)
    }else{
        console.log(`   
        ╔═══╗-----╔╗--------------╔═╗╔═╗----------------
        ║╔══╝-----║║--------------║║╚╝║║----------------
        ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
        ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
        ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
        ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
        -------║║------╔═╝║---------------------╔═╝║----
        -------╚╝------╚══╝---------------------╚══╝----`
        )
        viewOptions();
    }
})


const viewOptions = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'tableOptions',
            message: 'Query options: ',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit'],
        },
    ]).then(function({ tableOptions }){
        switch(tableOptions){
            case 'view all departments':
                viewAllDep();
                break
            case 'view all roles':
                viewAllRole();
                break
            case 'view all employees':
                viewAllEmployee();
                break
            case "add a department":
                addDepartment()
                break
            case "add a role":
                getExistingDepartments();
                break
            case "add an employee":
                getExistingRoles();
                break
            case "update an employee role":
                getExistingEmployees()
                break
            case "quit":
                db.end()
                break
        }
    })
};

const viewAllDep = () => {
   const departmentQuery = 'SELECT * FROM department;'
   db.query(departmentQuery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            console.table(res);
            viewOptions()
        }
   })

}


// think i need to add a join in here
const viewAllRole = () => {
    const roleQuery = 'SELECT role.id, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id'
    db.query(roleQuery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            console.table(res);
            viewOptions()
        }
    })
 }

 //think i need to add a join in here
 const viewAllEmployee = () => {
    const employeeQuery = 'SELECT employee.id, employee.first_name, employee.last_name, role.title AS Title, role.salary AS salary, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id'
    db.query(employeeQuery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            console.table(res);
            viewOptions()
        }
    })
 }


const addDepartment = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter department name: ',
        },
    ])
    .then(newDepartment =>{
        db.query('INSERT INTO department (name) VALUES (?)', [newDepartment.departmentName], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res);
                viewOptions()
            }
        })
    })
};

const getExistingDepartments = () => {
    const departmentQuery = 'SELECT department.id, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id'

    db.query(departmentQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const departments  = res.map(({ id, name }) => ({
               value: id, name: `${name}`
            }))
            console.table(res)
            addRole(departments)
        }

    })

}

const addRole = (departments) =>{
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'title',
            message: 'Enter role: ',
        },

        {
            type: 'input',
            name: 'salary',
            message: 'Enter employee salary: ',
        },

        {
            type: 'list',
            name: 'department',
            message: 'Choose employee department by id: ',
            choices: departments
        },
    ])
    .then(newRole =>{
        db.query('INSERT INTO role SET ?', {title: newRole.title, salary: newRole.salary,  department_id: newRole.department}, (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res);
                viewOptions()
            }
        })

    })
};

const getExistingRoles = () => {
    const rolequery  = 'SELECT id, title, salary FROM role'

    db.query(rolequery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            const roles = res.map(({ id, title, salary }) => ({
                value: id, title: `${title}`, salary: `${salary}`
            }))
            console.table(res)
            addEmployee(roles)
        }
    })

}

const addEmployee = (roles) =>{
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter employee first name: ',
        },

        {
            type: 'input',
            name: 'lastName',
            message: 'Enter employee last name: ',
        },

        {
            type: 'list',
            name: 'role',
            message: 'Choose a role by role id: ',
            choices: roles,
        },

        {
            type: 'input',
            name: 'manager',
            message: 'Enter employee manager: ',
        },
    ])
    .then(newEmployee =>{
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.manager], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res);
                viewOptions()
            }
        })

    })
    
}

const getExistingEmployees = () => {
    const employeeQuery = 'SELECT * FROM employee JOIN role ON employee.role_id = role.id'

    db.query(employeeQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const employees  = res.map(({ id, first_name, last_name}) => ({
                value: id, first_name: `${first_name}`, last_name: `${last_name}`
            }))
            console.table(res)
            getEmployeeRoles(employees)
        }
    })
}

const getEmployeeRoles = (employees) => {
    const rolequery  = 'SELECT id, title, salary FROM role'

    db.query(rolequery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            const roles = res.map(({ id, title, salary }) => ({
                value: id, title: `${title}`, salary: `${salary}`
            }))
            console.table(res)
            updateEmployeeRole(employees, roles)
        }
    })
}

const updateEmployeeRole = (employees, roles) => {
    return inquirer.prompt ([
        {
            type: "list",
            message: "Which employee do you want to update? ",
            name: "employeeUpdate",
            choices: employees,
        },
        {
            type: "list",
            message: "What is their new role?",
            name: "roleUpdate",
            choices: roles,
        },
    ])
    .then(newRoleUpdate => {
        db.query('UPDATE employee SET role_id = ? WHERE first_name = ?', [newRoleUpdate.roleUpdate, newRoleUpdate.employeeUpdate], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res)
                viewOptions()
            }
        })
    }) 
}


