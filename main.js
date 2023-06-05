import fs from 'fs';
import _ from 'lodash';

console.log('Please enter command!');
const operations = {
    'uppercase': (string) => string.toUpperCase(),
    'lowercase': (string) => string.toLowerCase(),
    'reverse': (string) => string.split("").reverse().join(""),
}
process.stdin.on('data', data => {
    data = data.toString().trim();
    let dataArr = data.split(' ');
    if (dataArr.length !== 3) {
        console.log('Please enter correct combination of command');
    } else if (!operations.hasOwnProperty(dataArr[2])) {
        console.log('Invalid operation');
    } else {
        createStreams(...dataArr);
    }
})


function createStreams(inputFile, outputFile, operation) {
    const readableStream = fs.createReadStream(inputFile);
    const writeableStream = fs.createWriteStream(outputFile);

    readableStream.pipe(writeableStream);
    let extension = inputFile.split('.')[1];

    if (!outputFile.includes(extension)) {
        console.log('Please write correct outputFile extenstion');
        readableStream.close();
        writeableStream.close();
        process.exit(0);
    }

    readableStream.on('data', chunk => {
        writeableStream.write(operations[operation](chunk.toString()));
    });

    readableStream.on('error', error => {
        console.log('File not found');
        process.exit(0);
    })


    writeableStream.on('finish', () => {
        console.log('Successfully written');
        process.exit(0);
    })
}
