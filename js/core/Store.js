const DB_KEY = "lms_v5_ultimate";

const seeds = {
  settings: {
    finePerDay: 10,
    maxBorrowDays: 14,
  },
  books: [
    {
      id: 1,
      title: "The Clean Coder",
      author: "Robert Martin",
      isbn: "978-0137",
      category: "Programming",
      description: "A code of conduct for professional programmers.",
      totalStock: 5,
      availableStock: 5,
      status: "Available",
      reviews: [],
      likes: 0,
      dislikes: 0,
    },
  ],
  transactions: [],
  complaints: [], // { id, user, text, date, status, reply: "" }
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

  // --- SETTINGS ---
  static getSettings() {
    return this.getState().settings || seeds.settings;
  }

  static updateSettings(newSettings) {
    const state = this.getState();
    state.settings = { ...state.settings, ...newSettings };
    this.saveState(state);
  }

  // --- COMPLAINTS & REPLIES (NEW) ---
  static addComplaint(username, text) {
    const state = this.getState();
    if (!state.complaints) state.complaints = [];

    state.complaints.push({
      id: Date.now(),
      user: username,
      text,
      date: new Date().toISOString(),
      status: "Open",
      reply: null, // Placeholder for admin reply
    });
    this.saveState(state);
  }

  static replyToComplaint(id, replyText) {
    const state = this.getState();
    const complaint = state.complaints.find((c) => c.id == id);
    if (complaint) {
      complaint.reply = replyText;
      complaint.status = "Resolved";
      this.saveState(state);
    }
  }

  static getComplaints() {
    return this.getState().complaints || [];
  }

  // --- BOOKS & REVIEWS ---
  static getBooks(query = "", category = "All") {
    const state = this.getState();
    let books = state.books;
    if (category !== "All")
      books = books.filter((b) => b.category === category);
    if (query) {
      const lower = query.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower)
      );
    }
    return books;
  }

  static getBookById(id) {
    return this.getState().books.find((b) => b.id == id);
  }

  static addReview(bookId, username, rating, comment) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == bookId);
    if (book) {
      if (!book.reviews) book.reviews = [];
      book.reviews.push({
        user: username,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString(),
      });
      this.saveState(state);
    }
  }

  static toggleLike(bookId, type) {
    const state = this.getState();
    const book = state.books.find((b) => b.id == bookId);
    if (book) {
      if (type === "like") book.likes = (book.likes || 0) + 1;
      else book.dislikes = (book.dislikes || 0) + 1;
      this.saveState(state);
    }
  }

  static addBook(book) {
    const state = this.getState();
    book.id = Date.now();
    book.totalStock = parseInt(book.totalStock);
    book.availableStock = parseInt(book.totalStock);
    book.reviews = [];
    book.likes = 0;
    book.dislikes = 0;
    state.books.push(book);
    this.saveState(state);
  }

  static updateBook(updatedBook) {
    const state = this.getState();
    const index = state.books.findIndex((b) => b.id == updatedBook.id);
    if (index !== -1) {
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

  // --- TRANSACTIONS ---
  static getTransactions() {
    return this.getState().transactions;
  }

  static issueBook(bookId, username, requestedDateStr) {
    const state = this.getState();
    const user = state.users.find((u) => u.username === username);
    const book = state.books.find((b) => b.id == bookId);
    const settings = state.settings || seeds.settings;

    if (!user || user.isBanned) return "BANNED";
    if (!book || book.availableStock < 1) return "OUT_OF_STOCK";

    // Date Validation
    const today = new Date();
    const reqDate = new Date(requestedDateStr);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + parseInt(settings.maxBorrowDays));

    // If simple manual issue (no date provided), default to max days
    const finalDate = requestedDateStr ? reqDate : maxDate;

    book.availableStock--;

    const transaction = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      username: username,
      issueDate: today.toISOString(),
      dueDate: finalDate.toISOString(),
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
    const tx = state.transactions.find((t) => t.id == transactionId);
    const settings = state.settings || seeds.settings;

    if (!tx) return false;

    const today = new Date();
    const due = new Date(tx.dueDate);
    let fine = 0;

    if (today > due) {
      const diffTime = Math.abs(today - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * parseInt(settings.finePerDay);
    }

    tx.status = "Returned";
    tx.returnDate = today.toISOString();
    tx.fine = fine;

    const book = state.books.find((b) => b.id == tx.bookId);
    if (book) book.availableStock++;

    this.saveState(state);
    return fine;
  }

  // --- AUTH ---
  static getUsers() {
    return this.getState().users;
  }

  static login(username, password, role) {
    return this.getState().users.find(
      (u) =>
        u.username === username && u.password === password && u.role === role
    );
  }

  static signup(username, password) {
    const state = this.getState();
    if (state.users.find((u) => u.username === username)) return false;
    state.users.push({ username, password, role: "student", isBanned: false });
    this.saveState(state);
    return true;
  }

  static toggleTheme() {
    const state = this.getState();
    state.theme = state.theme === "light" ? "dark" : "light";
    this.saveState(state);
    return state.theme;
  }
}
