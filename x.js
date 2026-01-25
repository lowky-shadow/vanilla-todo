let bytes = new Uint8Array([0, 255, 127, 128]);
console.log(bytes);

let uint8Arr = new Uint8Array([1, 255, 127, 128]);
uint8Arr[1] = 300;
console.log(uint8Arr);