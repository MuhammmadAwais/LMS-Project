import Store from "../core/Store.js";
import BookTable from "../components/BookTable.js";

export default function Books() {
  // We get books based on the current search query stored in window (or empty)
  const currentSearch = window.currentSearchTerm || "";
  const books = Store.getBooks(currentSearch);

  return `
        <div class="fade-in">
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h1>Book Inventory</h1>
                
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="searchInput" 
                           placeholder="Search by title, author, isbn..." 
                           value="${currentSearch}"
                           style="width: 300px;">
                </div>
            </header>

            <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
                <h3 style="margin-bottom: 1rem;" id="formTitle">Add New Book</h3>
                <form id="bookForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                    <input type="hidden" id="b_id"> <div class="input-group">
                        <input type="text" id="b_title" placeholder="Book Title" required />
                    </div>
                    <div class="input-group">
                        <input type="text" id="b_author" placeholder="Author Name" required />
                    </div>
                    <div class="input-group">
                        <input type="text" id="b_isbn" placeholder="ISBN Code" required />
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn btn-primary" id="formBtn">+ Add Book</button>
                        <button type="button" class="btn btn-outline" id="cancelBtn" style="display: none;" onclick="window.resetForm()">Cancel</button>
                    </div>
                </form>
            </div>

            <div id="bookTableContainer">
                ${BookTable(books)}
            </div>
        </div>
    `;
}
