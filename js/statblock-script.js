let defaultPreset;

// Ability List class – handles all monster special abilities
class AbilityList {
    constructor() {
        // List of abilities in format {name: "", description: ""}
        this.ability_list = [];
    }

    // Add an ability to the ability list; if replace is true, will replace existing ability with same name
    addAbility(name, description, replace=false) {
        name = name.trim();
        description = description.trim();
        if (replace) {
            for (let i = 0; i < this.ability_list.length; i++) {
                if (this.ability_list[i].name.toLowerCase() === name.toLowerCase()) {
                    if (name == "") {
                        if (this.ability_list[i].description == description) {
                            // dont add the same entry twice
                            return;
                        }
                        // don't replace entries without names but different descriptions
                        continue;
                    }

                    // replace ability in list
                    this.ability_list[i].name = name;
                    this.ability_list[i].description = description;
                    return;
                }
            }
        }
        this.ability_list.push({name: name, description: description});
    }

    // convert the list to a string
    toString() {
        let result = "";
        for (let i = 0; i < this.ability_list.length; i++) {
            result += this.ability_list[i].name;
            if (this.ability_list[i].description != "") {
                result += ": " + this.ability_list[i].description;
            }
            result += "\n";
        }
        return result.trim();
    }

    // Sort the list but put empty names last
    sort() {
        this.ability_list.sort((a, b) => {
            if (!(a.name == "" || b.name == "")) {
                const comp = a.name.localeCompare(b.name);
                if (comp != 0) return comp;
                return a.description.localeCompare(b.description);
            }
            if (a.name == b.name) {
                return a.description.localeCompare(b.description);
            }
            // put empty names last
            return a.name.localeCompare(b.name) * -1;
        });
    }

    // Rmove an item from the list; can either remove any item with the given name, or match both name and description, 
    // or just description if name is empty
    removeItem(name, descr = null) {
        if (name == "" && descr != null) {
            this.ability_list = this.ability_list.filter(ability => !(ability.name == "" && ability.description == descr));
            return;
        }
        name = name.toLowerCase().trim();
        if (descr != null) {
            descr = descr.toLowerCase().trim();
            this.ability_list = this.ability_list.filter(ability => !(ability.name == name && ability.description == descr));
            return;
        }
        this.ability_list = this.ability_list.filter(ability => ability.name !== name);
    }

    // Remove item at index given
    removeIndex(index) {
        if (index >= 0 && index < this.ability_list.length) {
            this.ability_list.splice(index, 1);
        }
    }

    // Insert item at index given
    insertItem(ability, index) {
        this.ability_list.splice(index, 0, ability);
    }
}

// JavaScript object to hold monster data; equivalent to json files
let mon = {
    name: "Monster2", 
    description: "A monster.",
    ac_type: "desc",
    asc_ac: 7,
    desc_ac: 12,
    hit_dice: 2,
    hit_points: 9,
    custom_hp: {checked: false, value: ""},
    attacks: "",
    thac0: 18,
    attack_bonus: 1,
    round_speed: 150,
    speed: 50,
    custom_saves_as: false,
    saves: {
        death: "D12",
        wands: "W13",
        paralysis: "P14",
        breath: "B15",
        spells: "S16",
        saves_as: "1"
    },
    morale: 7, 
    alignment: "Neutral",
    custom_alignment: {checked: false, value: ""},
    xP: 20,
    number_appearing: "0 (2d4)",
    treasureType: "None",
    abilities: new AbilityList()
}

// Update the main stat block from form variables
function UpdateBlockFromVariables() {
    GetVariablesFunctions.GetAllVariables();
    UpdateStatblock();
}

// Update the main stat block
function UpdateStatblock() {
    // Save Before Continuing
    SavedData.SaveToLocalStorage();

    // Name and description
    $("#stat-block .monster_name").html(StringFunctions.RemoveHtmlTags(mon.name));
    $("#stat-block .description").html(StringFunctions.RemoveHtmlTags(mon.description));
    
    // Stats
    $("#stat-block .desc_ac").text(mon.desc_ac.toString());
    $("#stat-block .asc_ac").text(mon.asc_ac.toString());

    // Hit Dice/HP
    const hit_dice_field = $(".hit_dice_field");
    hit_dice_field.html("<span class=\"hit_dice\"></span> (<span class=\"hit_points\"></span>)</span>")
    if (!mon.custom_hp.checked) {
        $("#stat-block .hit_dice").text(mon.hit_dice.toString());
        $("#stat-block .hit_points").text(mon.hit_points.toString() + "hp");
    } else {
        hit_dice_field.html(mon.custom_hp.value);
    }

    // Attacks
    $("#stat-block .attacks").html(StringFunctions.FormatString(mon.attacks));

    // THAC0/Attack Bonus
    $("#stat-block .thac0").text(mon.thac0.toString());
    if (mon.attack_bonus >= 0) {
        $("#stat-block .asc_ab").text("+" + mon.attack_bonus.toString());
    } else { $("#stat-block .asc_ab").text(mon.attack_bonus.toString()); }

    // Speed
    $("#stat-block .round_speed").text(mon.round_speed.toString());
    $("#stat-block .turn_speed").text(mon.speed.toString());
    
    // saves
    $("#stat-block .saves .death_save").text(mon.saves.death);
    $("#stat-block .saves .wands_save").text(mon.saves.wands);
    $("#stat-block .saves .paralysis_save").text(mon.saves.paralysis);
    $("#stat-block .saves .breath_save").text(mon.saves.breath);
    $("#stat-block .saves .spells_save").text(mon.saves.spells);
    $("#stat-block .saves .saves_as").text("(" + mon.saves.saves_as.toString() + ")");
    
    // remaining stats
    $("#stat-block .morale").text(mon.morale.toString());

    // Alignment
    if (mon.custom_alignment == undefined) {
        mon.custom_alignment = {checked: false, value: ""};
    }
    $("#stat-block .alignment").text((mon.custom_alignment.checked == false ? mon.alignment.toString() : mon.custom_alignment.value.toString()));

    $("#stat-block .xp").text(mon.xP.toString());
    $("#stat-block .number_appearing").text(mon.number_appearing.toString());
    $("#stat-block .treasure_type").text(mon.treasureType.toString());
    
    // display all abilites
    const abilities_list = $("#stat-block .abilities_list ul");
    InputFunctions.DisplayAbilitiesList(abilities_list);
}

// Functions for form-setting
var FormFunctions = {
    // Change from Ascending to Descending AC, or vice versa
    ChangeAC: function() {
        const old_ac = mon.ac_type;
        GetVariablesFunctions.GetAC();
        GetVariablesFunctions.CalcAC(old_ac);
        GetVariablesFunctions.GetTHAC0();
        console.log("mon.thac0 " + mon.thac0 + " mon.attack_bonus " + mon.attack_bonus);
        GetVariablesFunctions.CalcTHAC0(old_ac);
        console.log("mon.thac0 " + mon.thac0 + " mon.attack_bonus " + mon.attack_bonus);
        $('#asc_ac_input').val(mon.asc_ac);
        $('#desc_ac_input').val(mon.desc_ac);
        $('#thac0_input').val(mon.thac0);
        $('#attack_bonus_input').val(mon.attack_bonus);
        this.ShowHideAscendAC();
        UpdateBlockFromVariables();
    },

    // Show or hide between Ascending, Descending or Both AC
    ShowHideAscendAC: function () {
        //Form
        $(".ac_prompt").show();
        switch (mon.ac_type) {
            case "asc":
                $(".desc_ac_input_prompt").hide();
                break;
            case "both":
            case "desc":
                $(".asc_ac_input_prompt").hide();
                break;
        }
        // Stat block
        $("#stat-block .ac_statblock, #stat-block .thac0, #stat-block .asc_ab_wrapper").hide();
        if (mon.ac_type == "asc") {
            $("#stat-block .asc_ac_wrapper").html("<span class=\"asc_ac ac_statblock\">12</span>").show();
            $("#stat-block .asc_ab_wrapper").html("<span class=\"asc_ab\">+1</span>").show();
            $("#stat-block .thac0_title").text("AB");
        } else if (mon.ac_type == "desc") {
            $("#stat-block .desc_ac").show();
            $("#stat-block .thac0").show();
            $("#stat-block .thac0_title").text("THAC0");
        } else if (mon.ac_type == "both") {
            $("#stat-block .thac0_title").text("THAC0");
            $("#stat-block .asc_ac_wrapper").html(" [<span class=\"asc_ac ac_statblock\">12</span>]");
            $("#stat-block .asc_ab_wrapper").html(" [<span class=\"asc_ab\">+1</span>]");
            $("#stat-block .ac_statblock, #stat-block .thac0, #stat-block .asc_ab_wrapper").show();
        }
    },

    // Show/hide the custom HD input, and set the values
    ChangeHD: function() {
        $("#custom_hd_check").prop("checked") ? mon.custom_hp.checked = true : mon.custom_hp.checked = false;
        if (mon.custom_hp.checked) {
            $(".hit_dice_normal").hide();
            $(".hit_dice_custom").show();
        } else {
            $(".hit_dice_normal").show();
            $(".hit_dice_custom").hide();
        }
        if (mon.custom_hp.value == "") {
            mon.custom_hp.value = mon.hit_dice.toString() + " (" + mon.hit_points.toString() + "hp)";
        }
        $("#custom_hit_dice_input").val(mon.custom_hp.value);
    },

    // Show/hide the custom alignment input, and set the values
    ChangeCustomAlignment: function() {
        $("#custom_alignment_check").prop("checked") ? mon.custom_alignment.checked = true : mon.custom_alignment.checked = false;
        if (mon.custom_alignment.checked) {
            $(".alignment_select").hide();
            $(".alignment_custom").show();
        } else {
            $(".alignment_select").show();
            $(".alignment_custom").hide();
        }
        $("#custom_alignment_input").val(mon.custom_alignment.value);
    },

    // Show/hide the custom 'saves as' input
    CustomSavesAs: function() {
        if ($("#saves_as_input").val() == "other") {
            $("#other_saves_as_input").show();
            mon.custom_saves_as = true;
        }
        else {
            $("#other_saves_as_input").hide();
            mon.custom_saves_as = false;
        }

    },

    // Set the form values from the monster object
    SetForms: function () {
        // Name and type
        $("#name-input").val(mon.name);
        $("#monster_descr_input").val(mon.description);
        
        // AC
        $("#asc_ac_input").val(mon.asc_ac);
        $("#desc_ac_input").val(mon.desc_ac);
        $("#" + mon.ac_type + "_armor_choice_input").prop('checked', true);
        this.ShowHideAscendAC();

        // Stats
        $("#hit_dice_input").val(mon.hit_dice);
        $("#custom_hd_check").prop("checked", mon.custom_hp.checked);
        $("#custom_hit_dice_input").val(mon.custom_hp.value);
        this.ChangeHD();

        $("#thac0_input").val(mon.thac0);
        $("#attack_bonus_input").val(mon.attack_bonus);
        $("#attacks_input").val(mon.attacks);
        $("#speed_input").val(mon.speed);

        // Saves
        $("#death_input").val(mon.saves.death.slice(1));
        $("#wands_input").val(mon.saves.wands.slice(1));
        $("#paralysis_input").val(mon.saves.paralysis.slice(1));
        $("#breath_input").val(mon.saves.breath.slice(1));
        $("#spells_input").val(mon.saves.spells.slice(1));
        if (mon.custom_saves_as !== undefined && mon.custom_saves_as == true) {
            $("#saves_as_input").val("other");
            $("#other_saves_as_input").val(mon.saves.saves_as);
        } else { $("#saves_as_input").val(mon.saves.saves_as); }
        this.CustomSavesAs();

        // remaining stats
        $("#morale_input").val(mon.morale);

        if (mon.custom_alignment == undefined) {
            mon.custom_alignment = {checked: false, value: ""};
        }
        $("#custom_alignment_check").prop("checked", mon.custom_alignment.checked);
        $("#alignment_select").val(mon.alignment);
        $("#custom_alignment_input").val(mon.custom_alignment.value);
        this.ChangeCustomAlignment();


        $("#xp_input").val(mon.xP);
        $("#num_appearing_input").val(mon.number_appearing);
        $("#treasure_type_input").val(mon.treasureType);
    },

    // Initialize Forms
    InitForms: function () {
        FormFunctions.CustomSavesAs();
        if (mon.abilities.ability_list.length == 0) {
            $("#sort_abilities").hide();
        }
    }
}

// Input functions to be called only through HTML
var InputFunctions = {
    // Change Hit Dice based on input dropdown
    InputHitDice: function () {
        mon.hit_dice = $("#hit_dice_input").val();
    },

    // Add ability to ability list
    AddAbilityInput: function () {
        const name_input = $("#abilities_name_input");
        const descr_input = $("#abilities_descr_input");

        // add ability to mon.abilities
        const ability_name = name_input.val().trim();
        const ability_descr = descr_input.val().trim();
        mon.abilities.addAbility(ability_name, ability_descr);
        console.log(mon.abilities.toString());

        // clear the ability input fields
        name_input.val("");
        descr_input.val("");

        // update the list of abilities shown
        this.UpdateAbilitiesList(); // also updates stat block
        if (mon.abilities.ability_list.length > 0) $("#sort_abilities").show();
    },

    // Update display of ability list
    UpdateAbilitiesList: function() {
        const displayList = $("#abilities_list_display");
        InputFunctions.DisplayAbilitiesList(displayList, true);
        UpdateStatblock();
    },

    // Display the special abilities in a list – polymorphic, can be used for stat block or form
    DisplayAbilitiesList: function(displayList, img = false) {
        let html = "";
        mon.abilities.ability_list.forEach((ability, index) => {
            const name = ability.name;
            const descr = ability.description;
            html += "<li>";
            if (img) html += this.AddEditButtons(index) + " ";
            if (name != "") {
                html += "<span class=\"ability_title\">";
                html += StringFunctions.RemoveHtmlTags(name);
                if (descr != "") { html += ":";}
                html += "</span> ";
            }
            if (descr != "") {
                html += "<span class=\"ability_text\">";
                html += StringFunctions.FormatString(StringFunctions.RemoveHtmlTags(descr));
                html += "</span>";
            }
            html += "</li>";    
        });
        displayList.html(html);
    },

    // Helper function to insert edit, remove, copy, etc. buttons at the front of an ability entry
    AddEditButtons: function(index) {
        let imageHTML = "<img class='statblock-image' src='dndimages/x-icon.png' alt='Remove' title='Remove' onclick='InputFunctions.RemoveAbilityItem(" + index + ")'>";
        imageHTML += " <img class='statblock-image' src='dndimages/edit-icon.png' alt='Edit' title='Edit' onclick='InputFunctions.EditAbilityItem(" + index + ")'>" +
            " <img class='statblock-image' src='dndimages/copy-icon.png' alt='Copy' title='Copy' onclick='InputFunctions.CopyAbilityItem(" + index + ")'>" +
            " <img class='statblock-image' src='dndimages/up-icon.png' alt='Up' title='Up' onclick='InputFunctions.SwapAbilityItem(" + index + ", -1)'>" +
            " <img class='statblock-image' src='dndimages/down-icon.png' alt='Down' title='Down' onclick='InputFunctions.SwapAbilityItem(" + index + ", 1)'>";
        return imageHTML;
    },

    // Delete an ability
    RemoveAbilityItem: function(index) {
        mon.abilities.removeIndex(index);
        this.UpdateAbilitiesList();
        if (mon.abilities.ability_list.length == 0) $("#sort_abilities").hide();
    },

    // Edit an ability
    EditAbilityItem: function(index) {
        const ability = mon.abilities.ability_list[index];
        $("#abilities_name_input").val(ability.name);
        $("#abilities_descr_input").val(ability.description);
        this.RemoveAbilityItem(index);
    },

    // Duplicate abilities
    CopyAbilityItem: function(index) {
        const ability = mon.abilities.ability_list[index];
        mon.abilities.insertItem({name: ability.name, description: ability.description}, index + 1);
        this.UpdateAbilitiesList();
    },

    // Array function to swap abilities in the ability list
    SwapAbilityItem: function(index, direction) {
        const arr = mon.abilities.ability_list;
        const new_index = index + direction;
        if (new_index < 0 || new_index >= arr.length) return;
        let old = arr[new_index];
        arr[new_index] = arr[index];
        arr[index] = old;
        this.UpdateAbilitiesList();
    },

    // Sort list of abilities
    SortAbilityList: function() {
        mon.abilities.sort();
        this.UpdateAbilitiesList();
    },

    // Select which preset to load
    GetPreset: function () {
        let name = $("#monster-select").val();
        if (name == "") return;
        if (name == "default") {
            SavedData.LoadFromData(defaultPreset);
            FormFunctions.SetForms();
            UpdateStatblock();
            return;
        }
        $.getJSON("js/JSON/" + name + ".json", function (json) {
            SavedData.LoadFromData(json);
            FormFunctions.SetForms();
            UpdateStatblock();
        })
            .fail(function () {
                console.error("Failed to load preset.");
                return;
            })
    }
}

// Functions to get/set important variables
var GetVariablesFunctions = {
    // Get all Variables from forms
    GetAllVariables: function () {
        // Name and Description
        mon.name = $("#name-input").val().trim();
        mon.description = $("#monster_descr_input").val().trim();

        // Armor Class
        GetVariablesFunctions.GetAC();
        this.CalcAC(mon.ac_type);

        // Hit Dice
        mon.hit_dice = $("#hit_dice_input").val().trim();
        mon.hit_points = Math.floor(mon.hit_dice * 4.5);
        mon.custom_hp.checked = $("#custom_hd_check").prop("checked");
        mon.custom_hp.value = $("#custom_hit_dice_input").val().trim();

        // Attacks
        mon.attacks = $("#attacks_input").val().trim();

        // THAC0/Attack Bonus
        GetVariablesFunctions.GetTHAC0();
        this.CalcTHAC0(mon.ac_type);

        // Speed
        mon.speed = $("#speed_input").val().trim();
        this.CalcSpeed();

        // Saves
        mon.saves.death = "D" + $("#death_input").val().trim();
        mon.saves.wands = "W" + $("#wands_input").val().trim();
        mon.saves.paralysis = "P" + $("#paralysis_input").val().trim();
        mon.saves.breath = "B" + $("#breath_input").val().trim();
        mon.saves.spells = "S" + $("#spells_input").val().trim();
        mon.custom_saves_as = ($("#saves_as_input").val() == "other");
        mon.saves.saves_as = mon.custom_saves_as ? $("#other_saves_as_input").val().trim() : $("#saves_as_input").val().trim();

        // remaining stats
        mon.morale = $("#morale_input").val().trim();

        //Alignment
        mon.alignment = $("#alignment_select option:selected").text().trim();
        mon.custom_alignment.checked = $("#custom_alignment_check").prop("checked");
        mon.custom_alignment.value = $("#custom_alignment_input").val().trim();

        mon.xP = $("#xp_input").val().trim();
        mon.number_appearing = $("#num_appearing_input").val().trim();
        mon.treasureType = $("#treasure_type_input").val().trim();
    },

    // Get all Variables From Block
    GetVariablesFromBlock: function () {
        // Name and Description
        mon.name = $(".monster_name").text().trim();
        mon.description = $(".description").text().trim();

        // Armor Class
        mon.desc_ac = parseInt($(".desc_ac").text().trim());
        mon.asc_ac = parseInt($(".asc_ac").text().trim());

        // Stats
        const hit_dice_field = $(".hit_dice_field");
        if (!mon.custom_hp.checked) {
            mon.hit_dice = parseInt($(".hit_dice").text().trim());
            mon.hit_points = Math.floor(mon.hit_dice * 4.5);
        } else {
            mon.custom_hp.value = hit_dice_field.text().trim();
        }

        // THAC0/Attack Bonus
        mon.attacks = $(".attacks").text().trim();
        mon.thac0 = parseInt($(".thac0").text().trim());
        mon.attack_bonus = parseInt($(".asc_ab").text().trim().slice(1));
        this.CalcTHAC0(mon.ac_type);
        mon.speed = parseInt($(".turn_speed").text().trim());
        this.CalcSpeed();

        // Saves
        mon.saves.death = $(".death_save").text().trim()
        mon.saves.wands = $(".wands_save").text().trim()
        mon.saves.paralysis = $(".paralysis_save").text().trim()
        mon.saves.breath = $(".breath_save").text().trim()
        mon.saves.spells = $(".spells_save").text().trim()

        mon.custom_saves_as = true;
        mon.saves.saves_as = $(".saves_as").text().trim().slice(1, -1);

        // remaining stats
        mon.morale = $(".morale").text().trim();

        mon.custom_alignment.value = $(".alignment").text().trim();
        mon.custom_alignment.checked = true;

        mon.xP = $(".xp").text().trim();
        mon.number_appearing = $(".number_appearing").text().trim();
        mon.treasureType = $(".treasure_type").text().trim();

        // abilities
        mon.abilities = new AbilityList();
        $(".abilities_list ul").children().each(function (index) {
            let [name, description] = [$(this).find(".ability_title").text(), $(this).find(".ability_text").text()];
            if (name.trim().slice(-1) == ":") name = name.trim().slice(0, -1);
            mon.abilities.addAbility(name.trim(), description.trim());
        });
    },

    // Get AC
    GetAC: function() {
        mon.ac_type = $('input[name="armor_choice-input"]:checked').val().trim();
        mon.asc_ac = parseInt($("#asc_ac_input").val().trim());
        mon.desc_ac = parseInt($("#desc_ac_input").val().trim());
    },

    // Get THAC0 and Attack Bonus
    GetTHAC0: function() {
        mon.ac_type = $('input[name="armor_choice-input"]:checked').val().trim();
        mon.thac0 = parseInt($("#thac0_input").val().trim());
        mon.attack_bonus = parseInt($("#attack_bonus_input").val().trim());
    },

    // Calculate Ascending/Descending AC
    CalcAC: function(base_type) {
        const old_ac = (base_type == "asc") ? mon.asc_ac : mon.desc_ac;
        const new_ac = (19 - old_ac);
        if (base_type == "asc") {
            mon.desc_ac = new_ac;
        } else {
            mon.asc_ac = new_ac;
        }
        return new_ac;
    },

    // Calculate THAC0 and Attack Bonuses based on input type
    CalcTHAC0: function(base_type) {
        const old_thac0 = (base_type == "asc") ? mon.attack_bonus : mon.thac0;
        const new_thac0 = (19 - old_thac0);
        if (base_type == "asc") {
            mon.thac0 = new_thac0;
        } else {
            mon.attack_bonus = new_thac0;
        }
        return new_thac0;
    },

    CalcSpeed: function() {
        mon.round_speed = mon.speed * 3;
    }
}

// Functions for saving/loading data
var SavedData = {
    // Saving
    SaveToLocalStorage: () => localStorage.setItem("SavedData", JSON.stringify(mon)),

    // Save to file
    SaveToFile: () => saveAs(new Blob([JSON.stringify(mon)], {
        type: "text/plain;charset=utf-8"
    }), mon.name.toLowerCase() + ".json"),

    // Retrieve from cached storage
    RetrieveFromLocalStorage: function () {
        let savedData = localStorage.getItem("SavedData");
        if (savedData != undefined) {
            mon = JSON.parse(savedData);
            mon.abilities = Object.assign(new AbilityList(), mon.abilities);
            InputFunctions.UpdateAbilitiesList();
        }
    },

    // Retrieve monster from file
    RetrieveFromFile: function () {
        let file = $("#file-upload").prop("files")[0],
            reader = new FileReader();

        reader.onload = function (e) {
            mon = JSON.parse(reader.result);
            mon.abilities = Object.assign(new AbilityList(), mon.abilities);
            InputFunctions.UpdateAbilitiesList();
            Populate();
        };

        reader.readAsText(file);
    },

    // Load a monster from a JSON data object
    LoadFromData: function(JSONdata) {
        mon = (JSONdata);
        mon.abilities = Object.assign(new AbilityList(), mon.abilities);
        InputFunctions.UpdateAbilitiesList();
        Populate();
    }
}

// Functions that return a string
var StringFunctions = {
    // Add italics, indents, and newlines
    FormatString: function (string, isBlock = false) {
        if (typeof string != "string")
            return string;

        // Complicated regex stuff to add indents
        if (isBlock) {
            let execArr, newlineArr = [],
                regExp = new RegExp("(\r\n|\r|\n)+", "g");
            while ((execArr = regExp.exec(string)) !== null)
                newlineArr.push(execArr);
            let index = newlineArr.length - 1;
            while (index >= 0) {
                let newlineString = newlineArr[index],
                    reverseIndent = (string[newlineString.index + newlineString[0].length] == ">");

                string = this.StringSplice(string, newlineString.index, newlineString[0].length + (reverseIndent ? 1 : 0),
                    "</div>" + (newlineString[0].length > 1 ? "<br>" : "") + (reverseIndent ? "<div class='reverse-indent'>" : "<div class='indent'>"));

                index--;
            }
        }

        // Italics and bold
        string = this.FormatStringHelper(string, "_", "<i>", "</i>")
        string = this.FormatStringHelper(string, "**", "<strong>", "</strong>")
        return string;
    },

    // FormatString helper function
    FormatStringHelper: function (string, target, startTag, endTag) {
        while (string.includes(target)) {
            let startIndex = string.indexOf(target);
            string = this.StringSplice(string, startIndex, target.length, startTag);
            let endIndex = string.indexOf(target, startIndex + target.length);
            if (endIndex < 0)
                return string + endTag;
            string = this.StringSplice(string, endIndex, target.length, endTag);
        }
        return string;
    },

    // HTML strings

    MakePropertyHTML: function (property, firstLine) {
        if (property.arr.length == 0) return "";
        let htmlClass = firstLine ? "property-line first" : "property-line",
            arr = Array.isArray(property.arr) ? property.arr.join(", ") : property.arr;
        return "<div class=\"" + htmlClass + "\"><div><h4>" + StringFunctions.RemoveHtmlTags(property.name) + "</h4> <p>" + StringFunctions.RemoveHtmlTags(this.FormatString(arr, false)) + "</p></div></div><!-- property line -->"
    },

    MakeTraitHTML: function (name, description) {
        return "<div class=\"property-block\"><div><h4>" + StringFunctions.RemoveHtmlTags(name) + ".</h4><p> " + this.FormatString(StringFunctions.RemoveHtmlTags(description), true) + "</p></div></div> <!-- property block -->";
    },

    MakeTraitHTMLLegendary: function (name, description) {
        return "<div class=\"property-block reverse-indent legendary\"><div><h4>" + StringFunctions.RemoveHtmlTags(name) + ".</h4><p> " + this.FormatString(StringFunctions.RemoveHtmlTags(description), true) + "</p></div></div> <!-- property block -->";
    },

    MakeTraitHTMLLairRegional: function (name, description) {
        return "<div class=\"property-block lairregional\"><div><li>" + this.FormatString(StringFunctions.RemoveHtmlTags(description), true) + "</li></div></div> <!-- property block -->";
    },

    // General string operations

    ConcatUnlessEmpty(item1, item2, joinString = ", ") {
        return item1.length > 0 ?
            item2.length > 0 ? item1 + joinString + item2 :
                item1 : item2.length > 0 ? item2 : "";
    },

    StringSplice: (string, index, remove, insert = "") => string.slice(0, index) + insert + string.slice(index + remove),

    StringReplaceAll: (string, find, replacement) => string.split(find).join(replacement),

    StringCapitalize: (string) => string[0].toUpperCase() + string.substr(1),

    GetNumbersOnly: (string) => parseInt(string.replace(/\D/g, '')),

    RemoveHtmlTags(string) {
        if (typeof (string) != "string")
            return string;
        return StringFunctions.StringReplaceAll(string, '<', "&lt;")
    }
}

// Populate form
function Populate() {
    FormFunctions.InitForms();
    FormFunctions.SetForms();
    UpdateStatblock();
}

// Document ready function
$(function () {
    // Load the preset monster names
    let monsterSelect = $("#monster-select");
    const listOptions = [
                        {name: "HD <=1", value:"hd1"},
                        {name: "HD 1+ to 2", value:"hd2"},
                        {name: "HD 2+ to 3", value:"hd3"},
                        {name: "HD 3+ to 4", value:"hd4"},
                        {name: "HD 4+ to 5", value:"hd5"},
                        {name: "HD 5+ to 6", value:"hd6"},
                        {name: "HD 6+ to 7", value:"hd7"},
                        {name: "HD 7+ to 9", value:"hd9"},
                        {name: "HD 9+ to 11",  value:"hd11"},
                        {name: "HD 11+ to 13", value:"hd13"},
                        {name: "HD 13+ to 15", value:"hd15"},
                        {name: "HD 15+ to 17", value:"hd17"},
                        {name: "HD 17+ to 19", value:"hd19"},
                        {name: "HD 19+ to 21", value:"hd21"},
                        {name: "HD 21+", value:"hd22"},
                        {name: "", value:""},
                        {name: "Acolyte (1HD)", value:"acolyte"},
                        {name: "Bandit (1HD)", value:"bandit"},
                        {name: "Basilisk (6+1**HD)", value:"basilisk"},
                        {name: "Black Bear (4HD)", value:"black bear"},
                        {name: "Camel (2HD)", value:"camel"},
                        {name: "Cave Bear (7HD)", value:"cave bear"},
                        {name: "Grizzly Bear (5HD)", value:"grizzly bear"},
                        {name: "Polar Bear (6HD)", value:"polar bear"}
                        ]
    $.each(listOptions, function (index, option) {
        monsterSelect.append("<option value='" + option.value + "'>" + option.name + "</option>");
    });

    // Load the default preset (black bear)
    $.getJSON("js/JSON/black bear.json", function (json) {
        console.log(typeof(json) + " " + JSON.stringify(json));
        SavedData.LoadFromData(json);
        defaultPreset = json;
    });
    SavedData.RetrieveFromLocalStorage();
    Populate();
});
