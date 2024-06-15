class UserDTO {
  constructor(user) {
    this.userId = user.userId;
    this.username = user.username;
    this.highestScore = user.highestScore;
  }
}

module.exports = UserDTO;
