import Auth from "./Auth.js";

export default class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || "dashboard";

    // --- AUTH GUARD ---
    const user = Auth.getUser();
    if (!user && hash !== "login") {
      window.location.hash = "login";
      return;
    }

    if (user && hash === "login") {
      window.location.hash = "dashboard";
      return;
    }
    // ------------------

    const pageContainer = document.getElementById("page-content");
    const renderPage = this.routes[hash] || this.routes["dashboard"];

    if (pageContainer && renderPage) {
      // If it's the login page, we might want to hide the Sidebar/Navbar
      // We can handle that in app.js by checking the hash
      pageContainer.innerHTML = renderPage();
      window.dispatchEvent(new Event("page-rendered"));
    }
  }
}
