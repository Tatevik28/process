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
  "deep": () => {
    console.log(findDeepDirectory(__dirname));
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

let results = {};


function findDeepDirectory(dir) {
  if (!dir) return;

  fs.readdir(dir, { withFileTypes: true }, (err, list) => {
      if (err) {
        return 'Error'
      };

      if (!list.length) {
        return 'Empty'
      };

      list.forEach((file, index) => {
        if (file.isDirectory()) {
          results[file.name] = results[file.name] ? (results[file.name]++) : 1;
          console.log(file.name)
          findDeepDirectory(file.name);
        }
      });
  });

 return results;
};