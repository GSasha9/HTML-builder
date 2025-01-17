const fs = require('fs');
const path = require('path');
const wStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const { stdin, stdout } = process;
stdout.write('Hello. Enter your text\n');
stdin.on('data', (chunk) => {
  const text = chunk.toString().trim();
  if (text.toLowerCase() === 'exit') {
    process.exit();
  } else {
    wStream.write(text + '\n');
  }
});
process.on('exit', () => stdout.write("\nThank you. Check 'text.txt'"));
process.on('SIGINT', () => {
  process.exit();
})
wStream.on('error', (error) => {
  stdout.write(error.message);
});
