class Employee {
    constructor (firstName, lastName, role, manager){
        this.firstName = firstName
        this.lastName = lastName
        this.role = role
        this.manager = manager
    }

    getFirstName() {
        this.firstName
    }

    getLastName() {
        this.lastName
    }

    getRole() {
        this.role
    }

    getManager() {
        this.manager
    }

}

module.exports = Employee