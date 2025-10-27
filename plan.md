1. add a new ability by typing name and description in the box and hitting add ability
2. ability gets added to the mon2.abilities list, and then the unordered list is updated
3. when stat block is updated, mon2.abilities list is published to stat block
4. to edit an ability, hit the edit button on the ability – 
    this gets the mon2.ability list entry – and allows in place editing. when defocused, the ability entry in the list is saved, as well as the unordered list updated to include new changes.
5. to delete an ability, hit the delete button on the ability – this deletes the entry from the mon2.ability list, and updates the unordered list
6. allow re-ordering of the list with up and down arrows




1. default load-outs for each level
2. a few default monsters
3. editing the stat names (eg changing the AC label)
4. editing which AC and THAC0 display within the stat block based on the selector
x. changing the THAC0 based on asc/desc armor class
6. formatting the abilities and statblock overall
7. formatting the abilities in the display list
8. attacks better
9. custom alignment
10. fix alignment bug
11. custom hit points, and hit point calculation, and no hit dice
12. safer saving throw editing - being able to edit the name of the saving throw as well as the value independently
13. edit in place abilities list
14. delete abilities from ability display list when deleted from stat block


features:
- import markdown (through text box)
- import OSE SRD format (through text box)
- export markdown

Custom json formatting – a different object per section, hrs separate section. Each attribute includes:
    - key (name for the attribute)
    - value
    - type (eg number, text, long_text, h6, h5, h4, h3, h2, h1, etc.)