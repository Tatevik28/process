import os from "os";

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
};

console.log(`Welcome ${username}!`)

process.stdin.resume();

process.on('exit', data => {
  console.log(`Thank you ${username}, goodbye!`);
});

process.on("SIGINT", (signal) => {
  process.exit(0);
});

process.stdin.on("data", data => {
  const operation = data.toString().trim();

  if (operations.hasOwnProperty(operation)) {
    operations[operation]();
    return ;
  }

  process.stdout.write("Invalid command\n");
})
