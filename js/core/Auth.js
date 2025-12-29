import Store from "./Store.js";

export default class Auth {
  static login(username, password, role) {
    const user = Store.login(username, password, role);
    if (user) {
      // Save user details including role and ban status
      localStorage.setItem("lms_user", JSON.stringify(user));
      return true;
    }
    return false;
  }

  static getUser() {
    const user = JSON.parse(localStorage.getItem("lms_user"));
    // Refresh data from store to check if they were just banned
    if (user) {
      const freshUser = Store.getState().users.find(
        (u) => u.username === user.username
      );
      return freshUser || user;
    }
    return null;
  }

  static isAdmin() {
    const user = this.getUser();
    return user && user.role === "admin";
  }

  static logout() {
    localStorage.removeItem("lms_user");
    window.location.reload();
  }
}
