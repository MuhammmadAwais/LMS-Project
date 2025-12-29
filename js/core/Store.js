const DB_KEY = "lms_v4_pro";

const seeds = {
  books: [
    {
      id: 1,
      title: "The Clean Coder",
      author: "Robert Martin",
      isbn: "978-0137",
      category: "Programming",
      totalStock: 5,
      availableStock: 5,
      status: "Available", // 'Available' or 'Out of Stock'
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      isbn: "978-0321",
      category: "Fiction",
      totalStock: 2,
      availableStock: 2,
      status: "Available",
    },
  ],
  // Tracks who has what: { bookId, username, issueDate, dueDate, status: 'Issued'|'Returned', fine: 0 }
  transactions: [],
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

  // --- BOOK & STOCK METHODS ---

  static getBooks(query = "", category = "All") {
    const state = this.getState();
    let books = state.books;

    if (category !== "All") {
      books = books.filter((b) => b.category === category);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(lowerQuery) ||
          b.author.toLowerCase().includes(lowerQuery) ||
          b.isbn.includes(lowerQuery)
      );
    }
    return books;
  }

  static addBook(book) {
    const state = this.getState();
    book.id = Date.now();
    book.totalStock = parseInt(book.totalStock);
    book.availableStock = parseInt(book.totalStock);
    book.status = "Available";
    state.books.push(book);
    this.saveState(state);
  }

  static updateBook(updatedBook) {
    const state = this.getState();
    const index = state.books.findIndex((b) => b.id == updatedBook.id);
    if (index !== -1) {
      // Logic to adjust available stock if total stock changes could go here
      // For simplicity, we overwrite basic details
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

  // --- TRANSACTION ENGINE (ISSUE/RETURN) ---

  static getTransactions() {
    return this.getState().transactions;
  }

  static issueBook(bookId, username, daysToReturn = 7) {
    const state = this.getState();
    const user = state.users.find((u) => u.username === username);
    const book = state.books.find((b) => b.id == bookId);

    // Validation
    if (!user || user.isBanned) return "BANNED";
    if (!book || book.availableStock < 1) return "OUT_OF_STOCK";

    // Decrease Stock
    book.availableStock--;
    if (book.availableStock === 0) book.status = "Out of Stock";

    // Create Transaction
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(daysToReturn));

    const transaction = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      username: username,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      status: "Issued",
      fine: 0,
    };

    state.transactions.push(transaction);
    this.saveState(state);
    return "SUCCESS";
  }

  static returnBook(transactionId) {
    const state = this.getState();
    const txIndex = state.transactions.findIndex((t) => t.id == transactionId);

    if (txIndex === -1) return false;
    const tx = state.transactions[txIndex];

    // 1. Calculate Fine
    const today = new Date();
    const due = new Date(tx.dueDate);
    let fine = 0;

    if (today > due) {
      const diffTime = Math.abs(today - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 1; // $1 per day
    }

    // 2. Update Transaction
    tx.status = "Returned";
    tx.returnDate = today.toISOString();
    tx.fine = fine;

    // 3. Restore Stock
    const book = state.books.find((b) => b.id == tx.bookId);
    if (book) {
      book.availableStock++;
      if (book.availableStock > 0) book.status = "Available";
    }

    this.saveState(state);
    return fine; // Return fine amount to display
  }

  // --- USER MANAGEMENT ---
  static getUsers() {
    return this.getState().users;
  }

  static signup(username, password) {
    /* Same as before */
    const state = this.getState();
    if (state.users.find((u) => u.username === username)) return false;
    state.users.push({ username, password, role: "student", isBanned: false });
    this.saveState(state);
    return true;
  }

  static login(username, password, role) {
    return this.getState().users.find(
      (u) =>
        u.username === username && u.password === password && u.role === role
    );
  }

  static toggleTheme() {
    /* Same as before */
    const state = this.getState();
    state.theme = state.theme === "light" ? "dark" : "light";
    this.saveState(state);
    return state.theme;
  }
}
