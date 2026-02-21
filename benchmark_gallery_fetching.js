const { performance } = require('perf_hooks');

// Simulation of fetch operations
const simulateFetch = (name, duration) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ docs: [], name });
    }, duration);
  });
};

const runBenchmark = async () => {
  console.log("Starting Benchmark...");

  // Scenario 1: Sequential
  const startSeq = performance.now();
  await simulateFetch('Gallery', 100);
  await simulateFetch('Activities', 100);
  const endSeq = performance.now();
  const timeSeq = endSeq - startSeq;
  console.log(`Sequential Execution Time: ${timeSeq.toFixed(2)} ms`);

  // Scenario 2: Parallel
  const startPar = performance.now();
  await Promise.all([
    simulateFetch('Gallery', 100),
    simulateFetch('Activities', 100)
  ]);
  const endPar = performance.now();
  const timePar = endPar - startPar;
  console.log(`Parallel Execution Time: ${timePar.toFixed(2)} ms`);

  // Improvement
  const improvement = ((timeSeq - timePar) / timeSeq) * 100;
  console.log(`Performance Improvement: ${improvement.toFixed(2)}%`);
};

runBenchmark();
