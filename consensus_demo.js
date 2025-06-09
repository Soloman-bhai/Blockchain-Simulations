let miners = [];
let stakers = [];
let delegates = [];
let voters = ["User1", "User2", "User3"];

function randomizePoW() {
  miners = [
    { name: "Miner A", power: Math.floor(Math.random() * 100) },
    { name: "Miner B", power: Math.floor(Math.random() * 100) },
    { name: "Miner C", power: Math.floor(Math.random() * 100) },
  ];
  document.getElementById("pow-data").innerText = miners
    .map(m => `${m.name}: ${m.power} power`)
    .join("\n");
}

function randomizePoS() {
  stakers = [
    { name: "Staker X", stake: Math.floor(Math.random() * 1000) },
    { name: "Staker Y", stake: Math.floor(Math.random() * 1000) },
    { name: "Staker Z", stake: Math.floor(Math.random() * 1000) },
  ];
  document.getElementById("pos-data").innerText = stakers
    .map(s => `${s.name}: ${s.stake} stake`)
    .join("\n");
}

function randomizeDPoS() {
  delegates = [
    { name: "Delegate M", votes: 0 },
    { name: "Delegate N", votes: 0 },
    { name: "Delegate O", votes: 0 },
  ];
  for (let voter of voters) {
    const index = Math.floor(Math.random() * delegates.length);
    delegates[index].votes++;
  }
  document.getElementById("dpos-data").innerText = delegates
    .map(d => `${d.name}: ${d.votes} vote(s)`)
    .join("\n");
}

function simulatePoW() {
  const winner = miners.reduce((max, m) => (m.power > max.power ? m : max));
  const result = `🏆 ${winner.name} wins with ${winner.power} power.\n(PoW favors highest computing power.)`;
  document.getElementById("pow-result").innerText = result;
  console.log("PoW Simulation:", miners);
}

function simulatePoS() {
  const winner = stakers.reduce((max, s) => (s.stake > max.stake ? s : max));
  const result = `💰 ${winner.name} wins with ${winner.stake} stake.\n(PoS favors highest token stake.)`;
  document.getElementById("pos-result").innerText = result;
  console.log("PoS Simulation:", stakers);
}

function simulateDPoS() {
  const winner = delegates.reduce((max, d) => (d.votes > max.votes ? d : max));
  const result = `🗳️ ${winner.name} wins with ${winner.votes} votes.\n(DPoS selects top voted delegate.)`;
  document.getElementById("dpos-result").innerText = result;
  console.log("DPoS Simulation:", delegates);
}

// Initialize with random data on load
window.addEventListener("load", () => {
  randomizePoW();
  randomizePoS();
  randomizeDPoS();
});
