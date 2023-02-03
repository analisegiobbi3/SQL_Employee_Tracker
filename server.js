const inquirer = require('inquirer')
const mysql = require('mysql2');


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
                addRole()
                break
            case "add an employee":
                addEmployee()
                break
            case "update an employee role":
                updateEmployee()
                break
            case "quit":
                db.end()
                break
        }
    })
};

const viewAllDep = () => {
   const departmentQuery = 'SELECT * FROM department;'
   db.query(departmentQuery, (req, res) =>{
        console.log(res);
        viewOptions()
   })

}

const viewAllRole = () => {
    const roleQuery = 'SELECT * FROM role;'
    db.query(roleQuery, (req, res) =>{
         console.log(res);
         viewOptions()
    })
 }

 const viewAllEmployee = () => {
    const employeeQuery = 'SELECT * FROM employee;'
    db.query(employeeQuery, (req, res) =>{
         console.log(res);
         viewOptions()
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
        db.query('INSERT INTO department (name) VALUES (?)', [newDepartment.departmentName], (req, res =>{
            console.log(res)
            viewOptions()
        }))

    })
};

const addRole = () =>{
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'name',
            message: 'Enter role: ',
        },

        {
            type: 'input',
            name: 'salary',
            message: 'Enter employee salary: ',
        },

        {
            type: 'input',
            name: 'department',
            message: 'Enter employee department: ',
        },
    ])
    .then(newRole =>{
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [newRole.name, newRole.salary, newRole.department], (req, res) =>{
            console.log(res);
            viewOptions()
        })

    })
};

const addEmployee = () =>{
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
            type: 'input',
            name: 'role',
            message: 'Enter employee role: ',
        },

        {
            type: 'input',
            name: 'manager',
            message: 'Enter employee manager: ',
        },
    ])
    .then(newEmployee =>{
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.manager], (req, res) =>{
            console.log(res)
            viewOptions()
        })

    })
    
}

 

const updateEmployee = () =>{
    
}


