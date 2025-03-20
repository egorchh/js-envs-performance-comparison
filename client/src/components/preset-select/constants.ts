import { Preset } from './types.ts';

const quickSortCodeSnippet =
`
function quickSort(arr, left = 0, right = arr.length - 1) {
\tif (left >= right) return;
\tconst pivotIndex = partition(arr, left, right);
\tquickSort(arr, left, pivotIndex - 1);
\tquickSort(arr, pivotIndex + 1, right);
}

function partition(arr, left, right) {
\tconst pivot = arr[right];
\tlet i = left;
\tfor (let j = left; j < right; j++) {
\t\tif (arr[j] < pivot) {
\t\t\t[arr[i], arr[j]] = [arr[j], arr[i]];
\t\t\ti++;
\t\t}
\t}
\t[arr[i], arr[right]] = [arr[right], arr[i]];
\treturn i;
}

const arr = Array.from({ length: 10000 }, () => Math.random());
quickSort(arr);
console.log(arr.slice(0, 10));
`

const jsonParsingCodeSnippet =
`
const obj = Object.fromEntries(
\tArray.from({ length: 10000 }, (_, i) => [\`key\${i}\`, { value: i, meta: { flag: true } }])
);

const jsonString = JSON.stringify(obj);
const parsedObj = JSON.parse(jsonString);
console.log(Object.keys(parsedObj).length);
`

const destructuringCodeSnippet =
`
const obj1 = Object.fromEntries(Array.from({ length: 10000 }, (_, i) => [\`key\${i}\`, i]));
const obj2 = Object.fromEntries(Array.from({ length: 10000 }, (_, i) => [\`key\${i}\`, i + 1]));

const mergedDestructuring = { ...obj1, ...obj2 };
const mergedAssign = Object.assign({}, obj1, obj2);

console.log(mergedDestructuring.key5000 === mergedAssign.key5000);
`

const primeCheckCodeSnippet =
`
function isPrime(n) {
\tif (n < 2) return false;
\tif (n % 2 === 0 || n % 3 === 0) return n === 2 || n === 3;
\tfor (let i = 5; i * i <= n; i += 6) {
\t\tif (n % i === 0 || n % (i + 2) === 0) return false;
\t}
\treturn true;
}

console.log(isPrime(5600748293801));
`

const promiseHandlingCodeSnippet =
`
async function testPromises() {
\tfor (let i = 0; i < 1_000_000; i++) {
\t\tawait new Promise(resolve => setTimeout(resolve, 0));
\t}
\tconsole.log('Done');
}

testPromises();
`

export const presets: Record<string, Preset> = {
    quickSort: {
        label: 'Быстрая сортировка',
        codeSnippet: quickSortCodeSnippet
    },
    jsonParsing: {
        label: 'Обработка JSON',
        codeSnippet: jsonParsingCodeSnippet
    },
    destructuring: {
        label: 'Деструктуризация массива',
        codeSnippet: destructuringCodeSnippet
    },
    isPrimeCheck: {
        label: 'Проверка числа на простоту',
        codeSnippet: primeCheckCodeSnippet
    },
    promiseHandling: {
        label: 'Обработка промисов',
        codeSnippet: promiseHandlingCodeSnippet
    }
};