console.clear();
const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const logger = require("./IMRANC.js");
const path = require('path'); 
const PORT = process.env.PORT || 8080;
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/website/imran.html'));
});

// إضافة مسار مباشر لتحديث الكوكيز بدون كلمة سر
app.get('/update-cookie', (req, res) => {
  const newCookie = req.query.cookie;
  if (newCookie) {
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, '../../appstate.json'), newCookie);
    res.send('Cookie updated successfully! Restarting bot...');
    process.exit(1); // إعادة تشغيل البوت لتطبيق الكوكيز الجديدة
  } else {
    res.status(400).send('No cookie provided');
  }
});
console.clear();
function startBot(message) {
    (message) ? logger(message, "starting") : "";
  console.log(chalk.blue('DEPLOYING MAIN SYSTEM'));
  logger.loader(`deploying app on port ${chalk.blueBright(PORT)}`);
  app.listen(logger.loader(`app deployed on port ${chalk.blueBright(PORT)}`));
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "IMRANB.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot();
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
    logger("an error occurred : " + JSON.stringify(error), "error");
  });
};
startBot();
