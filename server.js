const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
//this is from the other code to try to auto load the website
app.get('/', (req, res) => {
  res.sendFile('/home/dick/proj/html-img-viewer-bing/index.html'); 
});
//the above is from the other claude code to try to load the website
app.use(express.json());
// older one app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.get('/list-files', (req, res) => {
  const folder = req.query.folder;
  fs.readdir(folder, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err); // Log the error        
        return res.status(500).send(err);
    }
    const imageFiles = files.filter(f => f.match(/\.(jpeg|jpg|png)$/));
    const textFiles = files.filter(f => f.match(/\.txt$/));
    console.log('Sending response:', { imageFiles, textFiles }); // Log the response
    res.json({ imageFiles, textFiles });
  });
});

app.put('/update-text', (req, res) => {
  const { filename, text } = req.body;
  fs.writeFile(filename, text, err => {
    if (err) return res.status(500).send(err);
    res.send('Saved');
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
