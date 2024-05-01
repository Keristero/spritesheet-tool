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
1. nightmare infinity refactor! (this codebase is scary!)
    1. refactor code to use modules
        1. almost done ✅
        1. done
    1. pull various export types out of the modal singleton
    1. 

1. Fix even export

1. New feature, generating tilesheets
    1. Add new export options which takes all the frames of an animation state and produces a blob neighbour tileset

### V1.1
1. decouple frame select from animation state ✅
1. redoing how sprite selection and anchor point selection works ✅
    1. select a bunch of bounding boxes with drag select ✅
        1. button to combine all selected bounding boxes into one big bounding box ✅
    1. add pop out detailed frame editor with selection zone details and and anchor point selection (replace old anchor point selection) ✅
        - title of modal is based on what you are currently doing (importing frames, editing frames, etc) ✅
        - list of frames you can select to modify ✅
        - when you are importing frames and you press the import button, remove the frame from the list and select the next one ✅
        - set anchor point ✅
        - set other custom points ✅
        - allow fine adjustment of origin bounds

1. add custom points to exported data ✅
    - allow configuration of custom points ✅
    - allow export of custom points ✅
    - allow editing of custom points ✅
    - allow deletion of custom points ✅
1. Add quick anchor point selection (relative to center, top, bottom, left, or right) ✅
    - for new frames ✅

1. Add a clone animation state button which prompts you for a new name, and if you want to flip the X or Y ✅
    1. cant be edited, its a flipped clone of another state ✅
1. Dont copy trasparent color pixels into imported frames ✅
1. ensure pixels are not being cut off on the far right and bottom of selection ✅
1. add button to automatically import all frames from a sheet to the current animation state ✅
1. add button to automatically import all frames from ALL sheets ✅
1. make it pretty
### V1.3
1. export cramped images ✅
1. Undo everything with ctrl+z!
### ...
### V999.9
1. make it pretty

### Quality of life (things I notice then add)
1. fix selection box so that you can start selecting from outside the canvas and end selection outside the canvas
    - for now I've made it so your selection is canceled when the mouse leaves the element, it is clearer behaviour but almost as annoying ✅
    - perhaps a way to do this would be to decouple the selection box from the canvascontainer and have it be drawn on a overlay canvas?
1. Press DEL on keyboard to delete selected frames
1. Hold CTRL on keyboard to make additional selections ✅
    - for Frame Select ✅
    - for input sheets ✅
1. Save tab minimise state to project ✅
1. Add collapse all tabs button
1. Add drag and drop ✅
1. Alow replacement of image in input sheet from clipboard ✅
1. allow drag and drop insert of InputSheets from URL's
1. make purpose of tabs more obvious ✅
1. shrink frame selection canvas after removal of frames ✅
1. add feedback for when you add a frame
1. add a way to reorder frames ✅
1. add feedback for save button ✅
1. add save file button in export for the .png and .animation file
