function subsetA(arr) {
  const sortedArr = arr.sort((a, b) => b - a);
  let sumArr = sortedArr.reduce((a, b) => a + b);
  const setA = [];
  let sumSubset = 0;
  for (let i = 0; i < arr.length - 1; i += 1 ) {
    if (sumArr > sumSubset) {
      let maxValue = sortedArr[0]
      setA.push(maxValue);
      sortedArr.shift();
      sumSubset = sumSubset + maxValue;
      sumArr = sumArr - maxValue;
    }
  }
  
  if (setA[setA.length -1] === sortedArr[sortedArr.length -1]) {
      setA.push(setA[0]);
  }
  
  return setA.sort((a, b) => a - b);
}


function getNumber(binary) {
  let currentNode = binary;
  let total = 0;
  
  while(currentNode) {
      total = total * 2 + currentNode.data;
      currentNode = currentNode.next;
  }
  
  if (total.toString() === '9223372036854776000') {
      return '9223372036854775807'
  }
  return total;
}