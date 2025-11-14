const { convert } = require('convert-svg-to-png');
const express = require('express');

const port = process.env.PORT || 3000 
const app = express();
app.use(express.urlencoded({ extended: true }));

app.post('/convert', async (req, res) => {
  console.log(req.body)
  const defaultWidth = 100;
  const defaultHeight = 100;
  let width = parseInt(req.body['width'], 10);
  let height = parseInt(req.body['height'], 10);

  if (isNaN(width)) {
    width = defaultWidth
  }
   if (isNaN(height)) {
    height = defaultHeight
  }

  const options = { width, height };

  try {
    const png = await convert(req.body['name'], options);
    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed', err);
  }
});


app.post('/colors', async (req, res) => {
  console.log(req.body);
  const { spawn } = require('child_process');

  const pythonProcess = spawn('python', ['colors.py', req.body['colors']]);

  let output = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString(); 
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python script error: ${data}`);
    res.status(500).send(`Color resolution failed: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).send(output); 
      console.log('Color resolution returned:', output  );
    } else {
      res.status(500).send(`Python process exited with code ${code}`);
    }
  });
});

app.listen(port);
