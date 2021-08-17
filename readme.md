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
    - export cramped images
1. allow export of ONB compatible .animation files ✅
1. allow each frame property to be set individually rather than applying the whole lot at once
1. tidy styles a bit

### V1.1
1. redoing how sprite selection and anchor point selection works
    1. either click on a spot or drag over an area to select a single frame to be added
    1. add pop out detailed frame editor with selection zone details and and anchor point selection (replace old anchor point selection)
        - set anchor point
        - set other custom points
        - allow fine adjustment of origin bounds

1. add custom points to exported data
1. Add quick anchor point selection (relative to center, top, bottom, left, or right)
1. add button to automatically import all frames from a sheet to the current animation state
1. add button to automatically import all frames from ALL sheets
1. make it pretty
### V1.3
1. Undo everything with ctrl+z!
### ...
### V999.9
1. make it pretty

### Quality of life (things I notice then add)
1. Press DEL on keyboard to delete selected frames
1. Hold CTRL on keyboard to make additional selections
1. Add a clone animation state button which prompts you for a name and if you want to flipx
1. Save tab minimise state to project ✅
1. Add collapse all tabs button