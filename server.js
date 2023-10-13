const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
let localIP;


if (process.argv.includes('--listen')) {
  const networkInterfaces = os.networkInterfaces();

  const interfaces = Object.keys(networkInterfaces)
    .map(nicName => networkInterfaces[nicName])
    .reduce((result, nics) => result.concat(nics), []);

  const activeInterface = interfaces.find(nic => nic.family === 'IPv4' && !nic.internal);

  localIP = activeInterface.address;

  app.listen(3000, localIP, () => {
    console.log('Server started on port 3000', localIP);
  }); 
} else {
  app.listen(3000, () => {
    console.log('Server started on port 3000', localIP);
  });
}
//this is from the other code to try to auto load the website
app.get('/', (req, res) => {
  res.sendFile('/home/dick/proj/html-img-viewer-bing/index.html'); 
});
//the above is from the other claude code to try to load the website
app.use(express.json());
app.use(express.static('public'));
//app.use('/img', express.static(path.join(__dirname, 'public/img')));

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
  const fullPath = `public/${filename}`;
  fs.writeFile(fullPath, text, err => {
    if (err) {
        console.error(err);
        return res.status(500).send('Error updating file');}
    else {
        res.send('Saved');}
  });
});
