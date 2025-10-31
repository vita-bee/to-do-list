// src/index.js
import "./styles.css";
import { format, addDays } from 'date-fns';

console.log("hello");


const today = new Date();
const tomorrow = addDays(today, 1);

console.log('Today:', format(today, 'yyyy-MM-dd'));
console.log('Tomorrow:', format(tomorrow, 'yyyy-MM-dd'));