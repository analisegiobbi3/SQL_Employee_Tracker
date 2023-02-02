class Role {
    constructor (name, salary, department){
        this.name = name
        this.salary = salary
        this.department = department
    }

    getRoleName(){
        this.name
    }

    getSalary(){
        this.salary
    }

    getDepartment(){
        this.department
    }
}

module.exports = Role