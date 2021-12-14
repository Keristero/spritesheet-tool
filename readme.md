copy paste images into the web page

## Installation
1. clone this repository or download it as a zip

Method 1 (run locally):
1. open index.html with your browser

Method 2 (host webserver)
1. install nodejs
1. run `npm install` in root
1. run `node run-server.js`

## Usage
1. copy paste spritesheets / sprites onto the web page
1. add your first *animation state*
1. select the frames you want to add to your animation then click import
1. for each frame, set the anchor point - then click add frame (or press enter)
1. when you are done setting up animations, save your project
1. export the spritesheet and .animation file by clicking export then copying the output.

## todo
### 
- add more options to animation preview
    - playback speed
- add animation preview to the frame editor (for the target animation state)
- press enter to import frames
- handle 'anchor' like a custom point, allow recoloring of anchor
- prompt user to select a replacement image rather than waiting for paste
- prompt user for image when they try importing a .animation
- allow fine adjustment of origin bounds
- Undo everything with ctrl+z!
- fix selection box so that you can start selecting from outside the canvas and end selection outside the canvas
- Press DEL on keyboard to delete selected frames
- Add collapse all tabs button
- allow drag and drop insert of InputSheets from URL's
- add feedback for when you add a frame
- add save file button in export for the .png and .animation file