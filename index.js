import os from "os";
import fs from "fs";
import path from "path"
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const username = os.userInfo().username;


const operations = {
  ".exit": () => process.exit(0),
  "os --cpus": () => {
    const cpus = os.cpus();
    const models = cpus.map((cpu) => cpu.model);
    console.log(`CPUs amount is ${cpus.length}`)
    console.table(models);
  },
  "os --homedir": () => console.log(os.homedir()),
  "os --username": () => console.log(username),
  "os --architecture": () => console.log(os.arch()),
  "os --hostname": () => console.log(os.hostname()),
  "os --platform": () => console.log(os.platform()),
  "os --memory": () => console.log(os.totalmem()),
  "ls": () => {
    fs.readdir(__dirname, { withFileTypes: true },(err, files) => {
      if (err) {
        console.log(err);
        return ;
      }

      const newFiles = files.map((file) => ({
        name: file.name,
        type: file.isFile() ? "File" : "Directory"
      }))

      console.table(newFiles.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "Directory" ? -1 : 1;
      }))
    })
  },
  "add": (name) => {
    fs.writeFile(`${name}`, '', (err) => {})
  },
  "rn": (oldName, newName) => {
    if (oldName.includes('/')) {
      let lastIndex = oldName.lastIndexOf('/');
      newName = oldName.slice(0, lastIndex) + '/' + newName;
    }
    fs.rename(oldName, newName, (err) => {})
  },
  "cp": (file, directory) => {
    fs.copyFile(file, directory + '/' + file, (err) => {})
  },
  "mv": (file, directory) => {
    fs.rename(file, directory + '/' + file, (err) => {})
  },
  "rm": (name) => {
    fs.unlink(name, (err) => {})
  },
  "deep": (folder) => {
    findDeepestDirectory(`${folder.toString().trim()}`);
  }
};

console.log(process.cwd())

console.log(`Welcome ${username}!`)

process.stdin.resume();

process.on('exit', data => {
  console.log(`Thank you ${username}, goodbye!`);
});

process.on("SIGINT", (signal) => {
  process.exit(0);
});

process.stdin.on("data", data => {
  let operation = data.toString().trim();

  if (operations.hasOwnProperty(operation)) {
    operations[operation]();
    return ;
  } else {
    Object.keys(operations).forEach(item => {
      if (operation.startsWith(item)) {
        let list = operation.split(' ');
        if (list.length === 3) {
          operations[item](list[1], list[2]);
        } else {
          operations[item](list[1]);
        }
      }
    })
    return ;
  }

  process.stdout.write("Invalid command\n");
})

let arr = [];

function getAllFiles(dirPath){
  fs.readdirSync(dirPath).forEach(function(file) {
    let filepath = path.join(dirPath, file);
    let stat= fs.statSync(filepath);
    if (stat.isDirectory()) {
      getAllFiles(filepath);
      arr.push(filepath)
    }
  });
}

function findDeepestDirectory(folder) {
  getAllFiles(folder);

  let deepest = 0;
  let index;
  arr.forEach((item, ind) => {
    if (item.split('/').length > deepest) {
      deepest = item.split('/').length;
      index = ind;
    }
  })

  fs.writeFile(arr[index] + '/file.txt', 'hello world', (res, err) => {
    process.exit(0)
  })
}