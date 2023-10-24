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

  app.listen(3000, [localIP, 'localhost'], () => {
    console.log('Server started on localhost & network address:', localIP,':3000');
  }); 
} else {
  app.listen(3000, () => {
    console.log('Server started on port 3000', localIP);
  });
}
//this is from the other code to try to auto load the website
app.get('/', (req, res) => {
  // res.sendFile('/home/dick/proj/html-img-viewer-bing/excellent-adds-front-back/index.html'); OLDER VERSION
  res.sendFile(path.join(process.cwd(), 'index.html')); //more universal version that won't break I hope'
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

app.post('/remove-words', async (req, res) => {

  // Get words to remove
   const wordsToRemove = req.body.words;
  
  // Get folder path
  const folder = req.query.folder;

  const textFiles = await fs.promises.readdir(folder);

  for (let file of textFiles) {
    if (file.endsWith('.txt')) {
      
      let filePath = path.join(folder, file);

      let text = await fs.promises.readFile(filePath, 'utf8');
      
      // Split text into words
      const words = text.split(', '); 
      
      // Filter out removed words
      const filtered = words.filter(word => {
        return !wordsToRemove.includes(word);
      });
      
      // Join words back into string
      const updatedText = filtered.join(', ');
      
      // Save updated text
      await fs.promises.writeFile(filePath, updatedText);
    }
  }

  res.send('Words removed');
});

// Add start handler
app.post('/add-start', async (req, res) => {

  // Get words to remove
   const wordsToAdd = req.body.words;
  
  // Get folder path
  const folder = req.query.folder;

  const textFiles = await fs.promises.readdir(folder);

  for (let file of textFiles) {
    if (file.endsWith('.txt')) {
      
      let filePath = path.join(folder, file);

      let text = await fs.promises.readFile(filePath, 'utf8');
      
      // Split text into words
      const words = text.split(', '); 
      console.log('Words to add(server.js):', wordsToAdd);
      // Filter out removed words
      wordsToAdd.forEach(word => {
        if (!words.includes(word)) {
          words.unshift(word); // add to beginning
        }
      });
      
      // Join words back into string
      const updatedText = words.join(', ');
      
      // Save updated text
      await fs.promises.writeFile(filePath, updatedText);
    }
  }

  res.send('Words added to start');
});

// Add end handler
app.post('/add-end', async (req, res) => {

  // Get words to remove
   const wordsToAdd = req.body.words;
  
  // Get folder path
  const folder = req.query.folder;

  const textFiles = await fs.promises.readdir(folder);

  for (let file of textFiles) {
    if (file.endsWith('.txt')) {
      
      let filePath = path.join(folder, file);

      let text = await fs.promises.readFile(filePath, 'utf8');
      
      // Split text into words
      const words = text.split(', '); 
      console.log('Words to add(server.js):', wordsToAdd);
      // Filter out removed words
      wordsToAdd.forEach(word => {
        if (!words.includes(word)) {
          words.push(word); // add to end
        }
      });
      let updatedText = words.join(', ');
      // Join words back into string
      updatedText = updatedText.replace(/\r?\n/g, '');
      //const updatedText = words.join(', ').replace(/\n/g, '');
      
      // Save updated text
      await fs.promises.writeFile(filePath, updatedText);
    }
  }

  res.send('Words added to start');  
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
