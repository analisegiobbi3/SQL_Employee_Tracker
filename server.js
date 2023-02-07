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

//startup of application and connecting to database
//you will need to seed your data before starting using the following commands
//mysql -u root -p < db/schema.sql
//mysql -u root -p < db/seeds.sql
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

//diplays a list of options for the database
const viewOptions = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'tableOptions',
            message: 'Query options: ',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'remove an existing employee', "remove an existing department", "remove an existing role", 'quit'],
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
            case "remove an existing employee":
                getExistingEmployeesForDelete()
                break
            case "remove an existing department":
                getExistingDepartmentsForDelete()
                break
            case "remove an existing role":
                getExistingRolesForDelete()
                break
            case "quit":
                db.end()
                break
        }
    })
};

//queries for all departments and displays in the terminal
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


//queries for all roles joined with departmenst and displays in the terminal
const viewAllRole = () => {
    const roleQuery = 'SELECT role.id, role.title AS Title, department.name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id'
    db.query(roleQuery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            console.table(res);
            viewOptions()
        }
    })
 }

 //queries for all empolyees and joins that data with the role and department data
 const viewAllEmployee = () => {
    const employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`
    db.query(employeeQuery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            console.table(res);
            viewOptions()
        }
    })
 }


 //allow user to add a department to their database
const addDepartment = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter department name: ',
        },
    ])
    .then(newDepartment =>{
        db.query('INSERT INTO department SET ?', {name : newDepartment.departmentName}, (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.log (`Updated database with new department, ${newDepartment.departmentName}`)
                viewOptions()
            }
        })
    })
};

//grabs existing departments to be used for another action
const getExistingDepartments = () => {
    const departmentQuery = 'SELECT * FROM department'

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

//using existing departments this function allows you to add a role to a department
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
            message: 'Choose employee department: ',
            choices: departments
        },
    ])
    .then(newRole =>{
        db.query('INSERT INTO role SET ?', {title: newRole.title, salary: newRole.salary,  department_id: newRole.department}, (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.log(`Added new role, ${newRole.title}, to the database`)
            
                viewOptions()
            }
        })

    })
};

//grabs existing roles for another function
const getExistingRoles = () => {
    const rolequery  = 'SELECT * FROM role'

    db.query(rolequery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const roles  = res.map(({ id, title, salary }) => ({
               value: id, name: `${title}`, salary: `${salary}`
            }))
            console.table(res)
            addEmployee(roles)
        }

    })
}

//allows you to add an employee to and existing role
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
            message: 'Choose a role: ',
            choices: roles,
        },

        {
            type: 'input',
            name: 'manager',
            message: 'Enter employee manager id: ',
        },
    ])
    .then(newEmployee =>{
        db.query('INSERT INTO employee SET ?', {first_name: newEmployee.firstName, last_name: newEmployee.lastName, role_id: newEmployee.role, manager_id: newEmployee.manager}, (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res);
                viewOptions()
            }
        })

    })
    
}

//grabs existing employees for another function
const getExistingEmployees = () => {
    const employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`

    db.query(employeeQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const employees  = res.map(({ id, first_name, last_name}) => ({
                value: id, name: `${first_name} ${last_name}`
            }))
            console.table(res)
            getEmployeeRoles(employees)
        }
    })
}

//grabs existing roles for another function 
const getEmployeeRoles = (employees) => {
    const rolequery  = 'SELECT * FROM role'

    db.query(rolequery, (err, res) =>{
        if (err){
            console.log(err)
        }else{
            const roles = res.map(({ id, title, salary }) => ({
                value: id, name: `${title}`, salary: `${salary}`
            }))
            console.table(res)
            updateEmployeeRole(employees, roles)
        }
    })
}

//allows you to update an employee with a new role
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
        console.log(newRoleUpdate)
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleUpdate.roleUpdate, newRoleUpdate.employeeUpdate], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res)
                viewOptions()
            }
        })
    }) 
}

//the following functions allow you to delete an employee, role, and department 
const getExistingEmployeesForDelete = () => {
    const employeeQuery = 'SELECT * FROM employee JOIN role ON employee.role_id = role.id'

    db.query(employeeQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const employees  = res.map(({ id, first_name, last_name}) => ({
                value: id, name: `${first_name} ${last_name}`
            }))
            console.table(res)
            deleteEmployee(employees)
        }
    })
}

const deleteEmployee = (employees) => {
    return inquirer.prompt ([
        {
            type: "list",
            message: "Which employee do you want to remove? ",
            name: "employeeUpdate",
            choices: employees,
        },
    ]).then(deleteEmployee => {
        console.log(deleteEmployee)
        db.query('DELETE FROM employee WHERE id = ?', [deleteEmployee.employeeUpdate], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res)
                viewOptions()
            }
        })
    })
}

const getExistingDepartmentsForDelete = () => {
    const employeeQuery = 'SELECT * FROM department'

    db.query(employeeQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const departments  = res.map(({ id, name}) => ({
                value: id, name: `${name}`
            }))
            console.table(res)
            deleteDepartment(departments)
        }
    })
}

const deleteDepartment = (employees) => {
    return inquirer.prompt ([
        {
            type: "list",
            message: "Which Department do you want to remove? ",
            name: "departmentRemoval",
            choices: employees,
        },
    ]).then(deleteDepartment => {
        console.log(deleteDepartment)
        db.query('DELETE FROM department WHERE id = ?', [deleteDepartment.departmentRemoval], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res)
                viewOptions()
            }
        })
    })
}

const getExistingRolesForDelete = () => {
    const roleQuery = 'SELECT * FROM role'

    db.query(roleQuery, (err, res) => {
        if (err){
            console.log(err)
        }else{
            const roles = res.map(({ id, title, salary }) => ({
                value: id, name: `${title}`, salary: `${salary}`
            }))
            console.table(res)
            deleteRole(roles)
        }
    })
}

const deleteRole = (roles) => {
    return inquirer.prompt ([
        {
            type: "list",
            message: "Which role do you want to remove? ",
            name: "roleRemoval",
            choices: roles,
        },
    ]).then(deleteRole=> {
        console.log(deleteRole)
        db.query('DELETE FROM department WHERE id = ?', [deleteRole.roleRemoval], (err, res) =>{
            if (err){
                console.log(err)
            }else{
                console.table(res)
                viewOptions()
            }
        })
    })
}
