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
  let currentNode = binary; //head
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

function getMinimumMoves(quantity) {
  let moves = 0;
  let firstConsignment = [0, 0];
  let secondConsignment = quantity;
  let sumFirstConsignment = firstConsignment.reduce((a, b) => a + b);
  let sumSecondConsignment = secondConsignment.reduce((a, b) => a + b);
  let complete = false;
  
  if (!quantity.length) {
    return moves;
  }

  while (!complete) {
    if (sumFirstConsignment === sumSecondConsignment) {
      complete = true;
    }
    if (sumFirstConsignment < sumSecondConsignment) {
      sumFirstConsignment = sumFirstConsignment + secondConsignment[0];
      sumSecondConsignment = sumSecondConsignment - secondConsignment[0];
      firstConsignment.push(secondConsignment[0]);
      secondConsignment.shift();
    }
    if (sumFirstConsignment > sumSecondConsignment) {
      if (sumSecondConsignment === 0) {
        sumFirstConsignment = sumFirstConsignment - firstConsignment[firstConsignment.length - 1];
        sumSecondConsignment = sumSecondConsignment + firstConsignment[firstConsignment.length - 1];
        secondConsignment.push(firstConsignment[firstConsignment.length - 1]);
        firstConsignment.pop();
      }
      complete = true;
    }
  }

  moves = (sumFirstConsignment - sumSecondConsignment);

  return Math.abs(moves);
}

function betterCompression(s) {
  const letters = s.split(/[0-9]/i);
  const filteredLetters = letters.filter((letter) => letter !== "");
  const numbers = s.split(/[a-z]/i);
  const filteredNums = numbers.filter((num) => num !== "");
  let obj = {};
  for (let i = 0; i < filteredLetters.length; i += 1) {
    if (obj[filteredLetters[i]]) {
      obj[filteredLetters[i]] += Number(filteredNums[i])
    } else {
      obj[filteredLetters[i]] = Number(filteredNums[i])
    }
  }
  const objEntries = Object.entries(obj);
  const sortedEntries = objEntries.sort((a, b) => a[0].localeCompare(b[0]));
  const concatenated = objEntries.map((entry) => entry.join("")).join("");
  return sortedEntries;
}

console.log(betterCompression("a12c56a1b5"));
