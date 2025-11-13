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
  console.log(req.body)
  
});

app.listen(port);
