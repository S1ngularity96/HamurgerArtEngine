function generateShuffledSequene(start, end) {
  let set = new Set();
  let sequence = [];
  if (start < end && start >= 0) {
    let neededSize = end + 1 - start;
    let currentSize = 0;
    while (currentSize != neededSize) {
      let num = Math.floor(Math.random() * (end + 1 - start)) + start;
      if (!set.has(num)) {
        set.add(num);
        sequence.push(num);
        currentSize++;
      }
    }
  }
  return sequence;
}
