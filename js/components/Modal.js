// js/components/Modal.js
export default function Modal(content) {
  return `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center;">
            <div class="card" style="width: 400px;">${content}</div>
        </div>
    `;
}
