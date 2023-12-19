class UserDTO {
    constructor(user) {
        this.name = user.name
        this.lastname = user.lastname
        this.email = user.email
        this.phone = user.phone?user.phone:''
    }
}

module.exports = UserDTO
