async function timedQuery(label, queryFn) {
  const startHrTime = process.hrtime(); // High-res timer
  const startCpu = process.cpuUsage(); // CPU usage in microseconds

  const result = await queryFn();

  const elapsedHrTime = process.hrtime(startHrTime);
  const elapsedCpu = process.cpuUsage(startCpu);

  const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6; // ms
  const cpuUserMs = elapsedCpu.user / 1000; // microseconds → ms
  const cpuSystemMs = elapsedCpu.system / 1000;

  console.log(`[QueryTimer] ${label}`);
  console.log(`  ⏱  Elapsed Time: ${elapsedMs.toFixed(3)} ms`);
  console.log(`  🧠  CPU Time (User): ${cpuUserMs.toFixed(3)} ms`);
  console.log(`  ⚙️  CPU Time (System): ${cpuSystemMs.toFixed(3)} ms`);
  console.log(`  🔧  CPU Total: ${(cpuUserMs + cpuSystemMs).toFixed(3)} ms`);

  return {
    result,
    timing: {
      elapsedMs,
      cpuUserMs,
      cpuSystemMs,
      cpuTotalMs: cpuUserMs + cpuSystemMs,
    },
  };
}

module.exports = { timedQuery };
