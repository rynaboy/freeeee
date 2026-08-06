const express = require('express');
const { exec } = require('child_process');
const app = express();

app.post('/restart', (req, res) => {
  // Executes the Windows restart command locally
  exec('shutdown /r /t 0', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send("Failed to issue restart command.");
    }
    res.send("System restart initiated.");
  });
});

app.listen(3000, () => console.log('Local admin server running on port 3000'));
