## 1. What is the difference between var, let, and const?
> In JavaScript var, let and const are keywords to declare variables. But they differ in scope and other rules. We can reassign var and let but we can't do the same when it's Const. 

## 2. What is the difference between map(), forEach(), and filter()?
> mar(), forEach() and filter() are methods in JavaScript used to iterate over array elements. But they have different purpose and what they return. 
#### 2.1 map();
The map() method creates a new array by calling a provided function on every element in the original array. 
#### 2.2 forEach();
The forEach() executes a provided function once for each array element. But it doesn't return a new array like map().
#### 2.3 filter();
The filter() method creates a new array with element that pass a test through it's filtering method as it says.

## 3. What are arrow functions in ES6?
> Arrow funtion is new in JavaScript and it was introduced in ES6. It provides a shorter syntex and handle the `this` keyword differently. 
```js
const add = (a, b) => a + b;
```
## 4. How does destructuring assignment work in ES6?
> Destructuring assignment in ES6 is a powerful syntax. It allows us to unpack values from arrays or properties from objects into distinct variables.

##  5. Explain template literals in ES6. How are they different from string concatenation?
> Template literals, introduced in ES6 are a modern way to write or create strings in JavaScript. They're enclosed in backticks (``) instead of single or double quotes. 
The different of them is that we can use multi-line string and string interpolation using them. 
