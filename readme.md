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
### V1
1. allow selection of transparent color, default it to the top left pixel ✅
1. add button to delete input sheets ✅
1. allow adding, removing, and selection of animation states ✅
1. add current bounding box to selected animation state ✅
1. add per frame OR entire default animation settings ✅
    1. duration ✅
    1. anchor ✅
    1. flipx ✅
    1. flipy ✅
1. auto select first added animation ✅
1. add zoom scaling ✅
    - you can zoom the web page and the pixel scaling does not break too badly ✅
1. add animation preview ✅
1. add manual anchor point selection ✅
1. allow selection of multiple frames from the same animation
    - allow selection ✅
    - allow hold ctrl selection 
    - allow deselection by clicking on blank spot ✅
    - allow drag box selection ✅
1. super duper refactor ✅
    - make state serializable in preperation for project saving and loading ✅
1. Add project saving
    - save button ✅
    - load button ✅
    - serialize images correctly ✅
    - renaming ✅
    - store images in project file ✅
    - dont copy images ✅
1. Add project loading
    - load input sheets ✅
    - load animation states ✅
1. create modal object for export / detailed image import ✅
    - Pop up modal ✅
    - Close modal ✅
1. add image export ✅
    - export evenly spaced images ✅
1. allow export of ONB compatible .animation files ✅
1. seperate frame selection canvas from the selection overlay (should hide selection in frame previews) ✅

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
        - set other custom points
        - allow fine adjustment of origin bounds

1. add custom points to exported data
    - allow configuration of custom points
    - allow export of custom points
    - allow editing of custom points
1. Add quick anchor point selection (relative to center, top, bottom, left, or right) ✅
    - for new frames ✅

1. Add a clone animation state button which prompts you for a new name, and if you want to flip the X or Y ✅
    1. cant be edited, its a flipped clone of another state ✅
1. Dont copy trasparent color pixels into imported frames
1. ensure pixels are not being cut off on the far right and bottom of selection ✅
1. add button to automatically import all frames from a sheet to the current animation state ✅
1. add button to automatically import all frames from ALL sheets ✅
1. make it pretty
### V1.3
1. export cramped images
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
1. allow drag and drop insert of InputSheets from URL's
1. make purpose of tabs more obvious ✅
1. shrink frame selection canvas after removal of frames ✅
1. add feedback for when you add a frame
1. add a way to reorder frames
1. add feedback for save button ✅
1. add save file button in export for the .png and .animation file
