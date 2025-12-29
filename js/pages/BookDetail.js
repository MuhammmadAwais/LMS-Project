import Store from "../core/Store.js";
import Auth from "../core/Auth.js";

export default function BookDetail() {
  const id = window.currentBookId;
  if (!id)
    return `<div class="fade-in"><h1>No Book Selected</h1><button class="btn btn-outline" onclick="window.history.back()">Back</button></div>`;

  const book = Store.getBookById(id);
  if (!book) return `<div class="fade-in"><h1>Book Not Found</h1></div>`;
  const user = Auth.getUser();
  const isAdmin = user && user.role === "admin";

  const reviews = book.reviews || [];
  const reviewsHtml =
    reviews
      .map((r) => {
        // Show delete button if Admin OR if it's the user's own review
        const canDelete = isAdmin || (user && user.username === r.user);

        return `
        <div style="border-bottom:1px solid var(--border); padding: 0.5rem 0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${r.user}</strong>
                    <span style="color:orange; margin-left: 5px;">${"★".repeat(
                      r.rating
                    )}</span>
                </div>
                ${
                  canDelete
                    ? `<button onclick="window.deleteReview(${book.id}, ${r.id})" style="color:red; background:none; border:none; cursor:pointer;">🗑 Delete</button>`
                    : ""
                }
            </div>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-top:5px;">${
              r.comment
            }</p>
        </div>
        `;
      })
      .join("") || "<p>No reviews yet.</p>";

  // Check if user has liked/disliked
  const liked = book.likedBy && book.likedBy.includes(user.username);
  const disliked = book.dislikedBy && book.dislikedBy.includes(user.username);

  return `
        <div class="fade-in">
            <button class="btn btn-outline" onclick="window.location.hash='books'" style="margin-bottom:1rem;">← Back</button>
            
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:start; flex-wrap:wrap;">
                    <div>
                        <h1 style="color:var(--primary); margin-bottom:0.5rem;">${
                          book.title
                        }</h1>
                        <h3>by ${book.author}</h3>
                        <p style="color:var(--text-muted);">ISBN: ${
                          book.isbn
                        } | Category: ${book.category}</p>
                    </div>
                    <div style="text-align:right;">
                        <h2 style="${
                          book.availableStock > 0
                            ? "color:var(--success)"
                            : "color:var(--danger)"
                        }">
                            ${
                              book.availableStock > 0
                                ? "Available"
                                : "Out of Stock"
                            }
                        </h2>
                        <p>${book.availableStock} / ${
    book.totalStock
  } copies</p>
                    </div>
                </div>

                <hr style="border:0; border-top:1px solid var(--border); margin:1.5rem 0;">
                
                <h4>Description</h4>
                <p style="line-height:1.6; margin-bottom:2rem;">${
                  book.description || "No description provided."
                }</p>

                <div style="display:flex; gap:10px; margin-bottom:2rem; flex-wrap:wrap;">
                    <button class="btn ${
                      liked ? "btn-primary" : "btn-outline"
                    }" onclick="window.handleLike(${book.id}, 'like')">
                        👍 Like (${book.likes || 0})
                    </button>
                    <button class="btn ${
                      disliked ? "btn-primary" : "btn-outline"
                    }" onclick="window.handleLike(${book.id}, 'dislike')">
                        👎 Dislike (${book.dislikes || 0})
                    </button>
                    ${
                      book.availableStock > 0
                        ? `<button class="btn btn-success" onclick="window.initIssue(${book.id})">Request to Borrow</button>`
                        : ""
                    }
                </div>
            </div>

            <div class="card" style="margin-top:2rem;">
                <h3>Reviews & Ratings</h3>
                <div style="margin: 1rem 0; padding:1rem; background:var(--bg-body); border-radius:8px;">
                    <form id="reviewForm">
                        <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
                            <select id="r_rating" required style="padding:0.5rem;">
                                <option value="5">★★★★★</option>
                                <option value="4">★★★★</option>
                                <option value="3">★★★</option>
                                <option value="2">★★</option>
                                <option value="1">★</option>
                            </select>
                            <input type="text" id="r_comment" placeholder="Write a review..." required style="flex:1; padding:0.5rem; min-width:200px;">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
                <div>${reviewsHtml}</div>
            </div>
        </div>
    `;
}
