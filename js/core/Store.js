const DB_KEY = "lms_v2_data";

const seeds = {
  books: [
    {
      id: 1,
      title: "The Clean Coder",
      author: "Robert Martin",
      isbn: "978-0137",
      status: "Available",
      holder: "",
    },
    {
      id: 2,
      title: "JavaScript Info",
      author: "Ilya Kantor",
      isbn: "978-0321",
      status: "Issued",
      holder: "John Doe",
    },
  ],
  users: [
    { username: "admin", password: "123" }, // Default User
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

  // --- BOOK METHODS ---

  static getBooks(query = "") {
    const books = this.getState().books;
    if (!query) return books;

    // Search Logic: Case insensitive search on Title, Author, or ISBN
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        b.isbn.includes(lowerQuery)
    );
  }

  static getBookById(id) {
    return this.getState().books.find((b) => b.id == id);
  }

  static addBook(book) {
    const state = this.getState();
    book.id = Date.now();
    book.status = "Available"; // Default
    book.holder = "";
    state.books.push(book);
    this.saveState(state);
  }

  static updateBook(updatedBook) {
    const state = this.getState();
    const index = state.books.findIndex((b) => b.id == updatedBook.id);
    if (index !== -1) {
      // Preserve status and holder unless explicitly changed
      state.books[index] = { ...state.books[index], ...updatedBook };
      this.saveState(state);
    }
  }

  static deleteBook(id) {
    const state = this.getState();
    state.books = state.books.filter((b) => b.id != id);
    this.saveState(state);
  }

  // --- ISSUE / RETURN METHODS ---

  static issueBook(id, studentName) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == id);
    if (book && book.status === "Available") {
      book.status = "Issued";
      book.holder = studentName;
      this.saveState(state);
      return true;
    }
    return false;
  }

  static returnBook(id) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == id);
    if (book && book.status === "Issued") {
      book.status = "Available";
      book.holder = "";
      this.saveState(state);
      return true;
    }
    return false;
  }

  // --- THEME ---
  static toggleTheme() {
    const state = this.getState();
    state.theme = state.theme === "light" ? "dark" : "light";
    this.saveState(state);
    return state.theme;
  }
}
