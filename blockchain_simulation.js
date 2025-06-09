class Block {
  constructor(index, timestamp, data, previousHash, difficulty) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.miningTime = null;
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.timestamp + JSON.stringify(this.data) +
      this.previousHash + this.nonce
    ).toString();
  }

  mineBlock() {
    const prefix = "0".repeat(this.difficulty);
    const start = performance.now();

    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const end = performance.now();
    this.miningTime = end - start;
  }
}

let blockchain = [];
const blockchainContainer = document.getElementById("blockchain-container");
const infoBar = document.getElementById("info-bar");

function createInitialChain() {
  blockchain = [];
  const difficulty = parseInt(document.getElementById("difficulty").value);

  const block1 = new Block(1, new Date().toISOString(), { amount: 0, to: "0x0000" }, "0", difficulty);
  const block2 = new Block(2, new Date().toISOString(), { amount: 0, to: "0x0000" }, block1.hash, difficulty);
  const block3 = new Block(3, new Date().toISOString(), { amount: 0, to: "0x0000" }, block2.hash, difficulty);

  blockchain.push(block1, block2, block3);
  renderBlockchain();
}

function renderBlockchain() {
  blockchainContainer.innerHTML = "";

  blockchain.forEach((block, index) => {
    const blockEl = document.createElement("div");
    blockEl.className = "block";
    blockEl.classList.toggle("invalid", !isValidChain()[index]);

    blockEl.innerHTML = `
      <h2>Block #${block.index}</h2>

      <label>
        Amount:
        <input type="number" value="${block.data.amount}" onchange="editData(${index}, 'amount', this.value)" />
      </label>

      <label>
        To:
        <input type="text" value="${block.data.to}" onchange="editData(${index}, 'to', this.value)" />
      </label>

      <div class="prev-hash"><strong>Prev Hash:</strong><br>${block.previousHash}</div>
      <div class="hash"><strong>Hash:</strong><br>${block.hash}</div>
      <div><strong>Nonce:</strong> ${block.nonce}</div>
      ${block.miningTime !== null ? `<div class="mining-time">⏱️ Mined in: ${block.miningTime.toFixed(2)} ms</div>` : ""}
      <button onclick="mineBlock(${index})">⛏️ Mine</button>
    `;

    blockchainContainer.appendChild(blockEl);
  });

  updateInfoBar();
}

function updateInfoBar() {
  const validArray = isValidChain();
  const isValid = validArray.every((v) => v);
  if (isValid) {
    infoBar.className = "valid";
    infoBar.textContent = "✅ Blockchain is valid";
  } else {
    infoBar.className = "invalid";
    infoBar.textContent = "❌ Blockchain is INVALID — Mine or fix the incorrect blocks!";
  }
}

function isValidChain() {
  const difficulty = parseInt(document.getElementById("difficulty").value);
  const prefix = "0".repeat(difficulty);
  return blockchain.map((block, i) => {
    const isHashValid = block.hash.startsWith(prefix);
    const isPrevValid = i === 0 || block.previousHash === blockchain[i - 1].hash;
    return isHashValid && isPrevValid;
  });
}

function editData(index, field, value) {
  const block = blockchain[index];
  block.data[field] = field === "amount" ? parseFloat(value) : value;
  block.hash = block.calculateHash();
  block.nonce = 0;
  block.miningTime = null;

  // Update following blocks' prevHash
  for (let i = index + 1; i < blockchain.length; i++) {
    blockchain[i].previousHash = blockchain[i - 1].hash;
    blockchain[i].hash = blockchain[i].calculateHash();
    blockchain[i].nonce = 0;
    blockchain[i].miningTime = null;
  }

  renderBlockchain();
}

function mineBlock(index) {
  blockchain[index].mineBlock();

  for (let i = index + 1; i < blockchain.length; i++) {
    blockchain[i].previousHash = blockchain[i - 1].hash;
    blockchain[i].hash = blockchain[i].calculateHash();
    blockchain[i].nonce = 0;
    blockchain[i].miningTime = null;
  }

  renderBlockchain();
}

function resetChain() {
  createInitialChain();
}

window.onload = createInitialChain;
