const DB_KEY = "lms_v3_rbac";

const seeds = {
  books: [
    {
      id: 1,
      title: "The Clean Coder",
      author: "Robert Martin",
      isbn: "978-0137",
      status: "Available",
      holder: null,
      requestedBy: null,
    },
    {
      id: 2,
      title: "JavaScript Info",
      author: "Ilya Kantor",
      isbn: "978-0321",
      status: "Available",
      holder: null,
      requestedBy: null,
    },
  ],
  // "admin" is hardcoded. Students will be added here.
  users: [
    { username: "admin", password: "123", role: "admin", isBanned: false },
    { username: "student", password: "123", role: "student", isBanned: false },
  ],
  theme: "light",
};

export default class Store {
  static init() {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(seeds));
    }
  }

  static getState() {
    return JSON.parse(localStorage.getItem(DB_KEY));
  }

  static saveState(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  // --- USER / AUTH METHODS ---

  static login(username, password, role) {
    const users = this.getState().users;
    return users.find(
      (u) =>
        u.username === username && u.password === password && u.role === role
    );
  }

  static signup(username, password) {
    const state = this.getState();
    if (state.users.find((u) => u.username === username)) {
      return false; // User exists
    }
    state.users.push({ username, password, role: "student", isBanned: false });
    this.saveState(state);
    return true;
  }

  static getUsers() {
    return this.getState().users.filter((u) => u.role === "student");
  }

  static toggleBan(username) {
    const state = this.getState();
    const user = state.users.find((u) => u.username === username);
    if (user) {
      user.isBanned = !user.isBanned;
      this.saveState(state);
    }
  }

  // --- BOOK METHODS ---

  static getBooks(query = "") {
    const books = this.getState().books;
    if (!query) return books;
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        b.isbn.includes(lowerQuery)
    );
  }

  static addBook(book) {
    const state = this.getState();
    book.id = Date.now();
    book.status = "Available";
    book.holder = null;
    book.requestedBy = null;
    state.books.push(book);
    this.saveState(state);
  }

  static updateBook(updatedBook) {
    const state = this.getState();
    const index = state.books.findIndex((b) => b.id == updatedBook.id);
    if (index !== -1) {
      // Merge but protect status/holder
      const old = state.books[index];
      state.books[index] = { ...old, ...updatedBook };
      this.saveState(state);
    }
  }

  static deleteBook(id) {
    const state = this.getState();
    state.books = state.books.filter((b) => b.id != id);
    this.saveState(state);
  }

  // --- ISSUE / REQUEST FLOW ---

  static requestBook(bookId, username) {
    const state = this.getState();
    const user = state.users.find((u) => u.username === username);
    const book = state.books.find((b) => b.id == bookId);

    if (user.isBanned) return "BANNED";
    if (book.status !== "Available") return "UNAVAILABLE";

    book.status = "Requested";
    book.requestedBy = username;
    this.saveState(state);
    return "SUCCESS";
  }

  static approveRequest(bookId) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == bookId);
    if (book && book.status === "Requested") {
      book.status = "Issued";
      book.holder = book.requestedBy;
      book.requestedBy = null;
      this.saveState(state);
    }
  }

  static rejectRequest(bookId) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == bookId);
    if (book) {
      book.status = "Available";
      book.requestedBy = null;
      this.saveState(state);
    }
  }

  static returnBook(bookId) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == bookId);
    book.status = "Available";
    book.holder = null;
    book.requestedBy = null;
    this.saveState(state);
  }

  // --- THEME ---
  static toggleTheme() {
    const state = this.getState();
    state.theme = state.theme === "light" ? "dark" : "light";
    this.saveState(state);
    return state.theme;
  }
}
