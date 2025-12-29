export default class Auth {
  static login(username, password) {
    // Simple hardcoded check for demonstration.
    // In real app, check against Store.users
    if (username === "admin" && password === "123") {
      localStorage.setItem(
        "lms_user",
        JSON.stringify({ username, role: "admin" })
      );
      return true;
    }
    return false;
  }

  static getUser() {
    return JSON.parse(localStorage.getItem("lms_user"));
  }

  static logout() {
    localStorage.removeItem("lms_user");
    window.location.reload();
  }
}
