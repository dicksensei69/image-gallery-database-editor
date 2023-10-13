# image-gallery-database-editor
This a tool for editing large groups of image files with their text files beside them.  I'm developing it to help make image databases for LoRa/Stable Diffusion model making.

# install
to install this you will need npm installed and after npm is installed and you have git cloned the repo you will need to ```npm install express``` 

# starting the server
Drop your images into public or simlink to a folder with your database of blip captioned images.  Then inside of the repo folder run node server.js to bring up the back end and go to http://localhost:3000 from there you can navigate to the folders through the text box at the top.

If you would like to reach the server from your phone or another computer on the network I have added the --listen flag.  To use this you will type the nomral server startup plus the --listen flag eg. ```node server.js --listen```
