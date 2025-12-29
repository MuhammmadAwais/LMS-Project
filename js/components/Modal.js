export default function Modal(content) {
  return `
        <div style="
            position: fixed; 
            top: 0; left: 0; 
            width: 100%; height: 100%; 
            background: rgba(15, 23, 42, 0.6); 
            backdrop-filter: blur(4px);
            display: flex; 
            justify-content: center; 
            align-items: center; 
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
        ">
            <div class="card" style="width: 100%; max-width: 450px; margin: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                ${content}
            </div>
        </div>
    `;
}
