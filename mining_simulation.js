class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty, onProgress) {
    const prefix = "0".repeat(difficulty);
    this.nonce = 0;

    const startTime = performance.now();
    let attempts = 0;
    const maxTime = 10000;

    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;

      if (attempts % 100000 === 0 && onProgress) onProgress(attempts);

      const currentTime = performance.now();
      if (currentTime - startTime > maxTime) {
        return {
          success: false,
          attempts,
          timeTaken: currentTime - startTime,
          message: `⛔ Stopped after ${attempts} attempts (~${(currentTime - startTime).toFixed(2)} ms).`,
        };
      }
    }

    const endTime = performance.now();
    this.miningTime = endTime - startTime;

    return {
      success: true,
      attempts,
      timeTaken: this.miningTime,
      message: `✅ Mined in ${attempts} attempts (${this.miningTime.toFixed(2)} ms).`,
    };
  }
}

const container = document.getElementById("blockchain-container-mining");
const infoBar = document.getElementById("info-bar-mining");
const difficultyInput = document.getElementById("difficulty-mining");

let block = new Block(1, new Date().toISOString(), { amount: 10, to: "user1" }, "0");

function displayBlock(block) {
  container.innerHTML = `
    <div class="block-mining">
      <label>Index: <input type="text" value="${block.index}" disabled /></label>
      <label>Timestamp: <input type="text" value="${block.timestamp}" disabled /></label>
      <label>Amount: <input id="amount-input" type="text" value="${block.data.amount}" /></label>
      <label>To: <input id="to-input" type="text" value="${block.data.to}" /></label>
      <label>Previous Hash:<div class="hash">${block.previousHash}</div></label>
      <label>Nonce: <input type="text" value="${block.nonce}" disabled /></label>
      <label>Hash:<div class="hash">${block.hash}</div></label>
      <button class="mine-btn-mining">⛏️ Mine Block</button>
    </div>
  `;

  document.querySelector(".mine-btn-mining").addEventListener("click", () => {
    block.data.amount = document.getElementById("amount-input").value;
    block.data.to = document.getElementById("to-input").value;
    mineHandler();
  });
}

function mineHandler() {
  const difficulty = parseInt(difficultyInput.value, 10);
  infoBar.textContent = "⛏️ Mining in progress...";
  infoBar.style.backgroundColor = "#555";

  setTimeout(() => {
    const result = block.mineBlock(difficulty);
    displayBlock(block);

    if (result.success) {
      infoBar.textContent = result.message;
      infoBar.style.backgroundColor = "#2ecc71";
    } else {
      infoBar.textContent = result.message;
      infoBar.style.backgroundColor = "#e74c3c";
    }
  }, 100);
}

displayBlock(block);
