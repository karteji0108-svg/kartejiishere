import { getDownloadUrl } from './src/utils/cloudinary.js';
import assert from 'assert';

console.log('Testing getDownloadUrl...');

const tests = [
  {
    input: 'https://res.cloudinary.com/demo/image/upload/v12345678/sample.jpg',
    expected: 'https://res.cloudinary.com/demo/image/upload/fl_attachment/v12345678/sample.jpg',
    name: 'Standard Cloudinary URL'
  },
  {
    input: 'https://example.com/image.jpg',
    expected: 'https://example.com/image.jpg',
    name: 'Non-Cloudinary URL'
  },
  {
    input: '',
    expected: '',
    name: 'Empty URL'
  },
  {
    input: 'https://res.cloudinary.com/demo/image/upload/w_500/v123/sample.jpg',
    expected: 'https://res.cloudinary.com/demo/image/upload/fl_attachment/w_500/v123/sample.jpg',
    name: 'Cloudinary URL with transforms'
  }
];

let passed = 0;
tests.forEach(t => {
  const result = getDownloadUrl(t.input);
  if (result === t.expected) {
    passed++;
  } else {
    console.error(`FAILED: ${t.name}`);
    console.error(`  Input: ${t.input}`);
    console.error(`  Expected: ${t.expected}`);
    console.error(`  Actual:   ${result}`);
  }
});

console.log(`Tests finished: ${passed}/${tests.length} passed.`);
if (passed === tests.length) {
    process.exit(0);
} else {
    process.exit(1);
}
