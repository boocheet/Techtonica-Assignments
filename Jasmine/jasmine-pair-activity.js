/*
Take this source file as a starting point.

Implement a function called invert.

Creates an object composed of the inverted keys and values of object. If object contains duplicate values, subsequent values overwrite property assignments of previous values.

var object = { 'a': 1, 'b': 2, 'c': 1 };
 
invert(object);
// => { '1': 'c', '2': 'b' }

Implement this function and then create Jasmine tests to verify its 
correctness. Think of all the input that could come in and decide
what to do with them via tests.
*/

const invert = function(obj){
  let inverseObj = {};
  for (let key in obj){
      inverseObj[obj[key]] = key;
  }
  return inverseObj;
}

 module.exports = invert;
