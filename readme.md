copy paste images into the web page

## Usage
1. copy paste spritesheets / sprites onto the web page
1. add your first *animation state*
1. press the left mouse button to begin selecting a frame
    1. if selection does not detect your frame correctly, try adjusting the selection radius and transparent pixel color
1. release the left mouse button to set your anchor position
1. after you have made a selection, left click the frame again to add it to whatever animation state you have selected
## todo
### V1
1. allow selection of transparent color, default it to the top left pixel ✅
1. add button to delete input sheets ✅
1. allow adding, removing, and selection of animation states ✅
1. add current bounding box to selected animation state ✅
1. add per frame OR entire animation settings
    1. duration ✅
    1. anchor ✅
    1. flipx ✅
    1. flipy ✅
1. auto select first added animation ✅
1. add zoom scaling ✅
    - you can zoom the web page and the pixel scaling does not break too badly
    - once the detailed frame editor is added in V1.1 this wont be needed
1. add animation preview ✅
1. add manual anchor point selection ✅
1. allow selection of multiple frames from the same animation
    - allow selection ✅
    - allow hold ctrl selection ✅
    - allow deselection by clicking on blank spot
    - allow drag box selection
1. super duper refactor
    - make state serializable in preperation for project saving and loading
1. Add project saving
    - save button ✅
    - load button ✅
    - renaming
    - store images in project file
    - dont copy images 
1. Add project loading
1. add image export
    - export cramped images, or evenly spaced
1. allow export of ONB compatible .animation files
1. allow each frame property to be set individually rather than applying the whole lot at once
1. tidy styles a bit

### V1.1
1. redoing how sprite selection and anchor point selection works
    1. either click on a spot or drag over an area to select a single frame to be added
    1. add pop out detailed frame editor with selection zone details and and anchor point selection (replace old anchor point selection)
        - set anchor point
        - set other custom points
        - allow fine adjustment of origin bounds

1. add button to automatically import all frames from a sheet to the current animation state
1. add button to automatically import all frames from ALL sheets
1. make it pretty

### V1.3
1. Add quick anchor point selection (relative to center, top, bottom, left, or right)
1. Undo everything with ctrl+z!
