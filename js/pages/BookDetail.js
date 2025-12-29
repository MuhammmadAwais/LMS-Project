import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function BookDetail() {
  const id = window.currentBookId;
  if (!id)
    return `<div class="fade-in" style="padding: 2rem;"><h1>No Book Selected</h1><button class="btn btn-outline" onclick="window.history.back()">Back</button></div>`;

  const book = Store.getBookById(id);
  if (!book)
    return `<div class="fade-in" style="padding: 2rem;"><h1>Book Not Found</h1></div>`;
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";

  const reviews = book.reviews || [];
  const reviewsHtml =
    reviews
      .map((r) => {
        const canDelete = isAdmin || (user && user.username === r.user);
        return `
        <div style="border-bottom:1px solid var(--border); padding: 1rem 0;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 2px;">${
                      r.user
                    }</div>
                    <div style="color: #F59E0B; font-size: 0.9rem;">${"★".repeat(
                      r.rating
                    )}${"☆".repeat(5 - r.rating)}</div>
                </div>
                ${
                  canDelete
                    ? `<button onclick="window.deleteReview(${book.id}, ${r.id})" style="color:var(--danger); background:none; border:none; cursor:pointer;" title="Delete Review"><i class='bx bx-trash'></i></button>`
                    : ""
                }
            </div>
            <p style="color:var(--text-muted); font-size:0.95rem; margin-top:0.5rem; line-height: 1.5;">${
              r.comment
            }</p>
        </div>
        `;
      })
      .join("") ||
    "<p style='padding: 1rem 0; color: var(--text-muted);'>No reviews yet. Be the first!</p>";

  const liked = book.likedBy && book.likedBy.includes(user.username);
  const disliked = book.dislikedBy && book.dislikedBy.includes(user.username);

  return `
        <div class="fade-in">
            <button class="btn btn-outline" onclick="window.location.hash='books'" style="margin-bottom:1.5rem;">
                <i class='bx bx-arrow-back'></i> Back to Inventory
            </button>
            
            <div class="card" style="margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 2rem;">
                    <div>
                        <div style="margin-bottom: 0.5rem;">
                            <span class="badge" style="background: var(--bg-body); border: 1px solid var(--border);">${
                              book.category || "General"
                            }</span>
                        </div>
                        <h1 style="color:var(--primary); font-size: 2.5rem; margin-bottom:0.5rem; font-family: var(--font-header);">${
                          book.title
                        }</h1>
                        <h3 style="color: var(--text-main); font-weight: 500;">by ${
                          book.author
                        }</h3>
                        <p style="color:var(--text-muted); margin-top: 5px; font-size: 0.9rem;">ISBN: ${
                          book.isbn
                        }</p>
                    </div>
                    
                    <div style="text-align:right;">
                        <div class="badge ${
                          book.availableStock > 0
                            ? "badge-success"
                            : "badge-danger"
                        }" style="font-size: 1rem; padding: 0.5rem 1rem;">
                            ${
                              book.availableStock > 0
                                ? "Available"
                                : "Out of Stock"
                            }
                        </div>
                        <p style="margin-top: 0.5rem; color: var(--text-muted);">${
                          book.availableStock
                        } of ${book.totalStock} copies left</p>
                    </div>
                </div>

                <hr style="border:0; border-top:1px solid var(--border); margin:2rem 0;">
                
                <h4 style="margin-bottom: 1rem;">Description</h4>
                <p style="line-height:1.7; margin-bottom:2rem; color: var(--text-main); font-size: 1.05rem;">${
                  book.description || "No description provided for this book."
                }</p>

                <div style="display:flex; gap:15px; margin-bottom:1rem; flex-wrap:wrap;">
                    <button class="btn ${
                      liked ? "btn-primary" : "btn-outline"
                    }" onclick="window.handleLike(${book.id}, 'like')">
                        <i class='bx ${
                          liked ? "bxs-like" : "bx-like"
                        }'></i> Like (${book.likes || 0})
                    </button>
                    <button class="btn ${
                      disliked ? "btn-primary" : "btn-outline"
                    }" onclick="window.handleLike(${book.id}, 'dislike')">
                        <i class='bx ${
                          disliked ? "bxs-dislike" : "bx-dislike"
                        }'></i> Dislike (${book.dislikes || 0})
                    </button>
                    ${
                      book.availableStock > 0
                        ? `<button class="btn btn-success" onclick="window.initIssue(${book.id})"><i class='bx bx-book-add'></i> Request to Borrow</button>`
                        : ""
                    }
                </div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 1rem; display: inline-block;">Reviews & Ratings</h3>
                
                <div style="margin-bottom: 2rem; background: var(--bg-body); padding: 1.5rem; border-radius: var(--radius);">
                    <form id="reviewForm" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <div style="min-width: 120px;">
                            <select id="r_rating" required class="form-input">
                                <option value="5">★★★★★</option>
                                <option value="4">★★★★</option>
                                <option value="3">★★★</option>
                                <option value="2">★★</option>
                                <option value="1">★</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <input type="text" id="r_comment" class="form-input" placeholder="Share your thoughts on this book..." required>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class='bx bx-send'></i> Post
                        </button>
                    </form>
                </div>
                
                <div>${reviewsHtml}</div>
            </div>
        </div>
    `;
}
