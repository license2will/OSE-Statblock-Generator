let defaultPreset;

class AbilityList {
    constructor() {
        this.ability_list = [];
    }

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

    removeIndex(index) {
        if (index >= 0 && index < this.ability_list.length) {
            this.ability_list.splice(index, 1);
        }
    }

    insertItem(ability, index) {
        this.ability_list.splice(index, 0, ability);
    }
}

let mon2 = {
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
    morale: 7, //editable
    alignment: "Neutral",
    custom_alignment: {checked: false, value: ""},
    xP: 20,
    number_appearing: "0 (2d4)",
    treasureType: "None",
    abilities: new AbilityList()
}

// dice interpretation

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
    $("#stat-block .monster_name").html(StringFunctions.RemoveHtmlTags(mon2.name));
    $("#stat-block .description").html(StringFunctions.RemoveHtmlTags(mon2.description));
    
    // Stats
    $("#stat-block .desc_ac").text(mon2.desc_ac.toString());
    $("#stat-block .asc_ac").text(mon2.asc_ac.toString());

    // Hit Dice/HP
    const hit_dice_field = $(".hit_dice_field");
    hit_dice_field.html("<span class=\"hit_dice\"></span> (<span class=\"hit_points\"></span>)</span>")
    if (!mon2.custom_hp.checked) {
        $("#stat-block .hit_dice").text(mon2.hit_dice.toString());
        $("#stat-block .hit_points").text(mon2.hit_points.toString() + "hp");
    } else {
        hit_dice_field.html(mon2.custom_hp.value);
    }

    // Attacks
    $("#stat-block .attacks").html(StringFunctions.FormatString(mon2.attacks));

    // THAC0/Attack Bonus
    $("#stat-block .thac0").text(mon2.thac0.toString());
    if (mon2.attack_bonus >= 0) {
        $("#stat-block .asc_ab").text("+" + mon2.attack_bonus.toString());
    } else { $("#stat-block .asc_ab").text(mon2.attack_bonus.toString()); }

    // Speed
    $("#stat-block .round_speed").text(mon2.round_speed.toString());
    $("#stat-block .turn_speed").text(mon2.speed.toString());
    
    // saves
    $("#stat-block .saves .death_save").text(mon2.saves.death);
    $("#stat-block .saves .wands_save").text(mon2.saves.wands);
    $("#stat-block .saves .paralysis_save").text(mon2.saves.paralysis);
    $("#stat-block .saves .breath_save").text(mon2.saves.breath);
    $("#stat-block .saves .spells_save").text(mon2.saves.spells);
    $("#stat-block .saves .saves_as").text("(" + mon2.saves.saves_as.toString() + ")");
    
    // remaining stats
    $("#stat-block .morale").text(mon2.morale.toString());

    // Alignment
    if (mon2.custom_alignment == undefined) {
        mon2.custom_alignment = {checked: false, value: ""};
    }
    $("#stat-block .alignment").text((mon2.custom_alignment.checked == false ? mon2.alignment.toString() : mon2.custom_alignment.value.toString()));

    $("#stat-block .xp").text(mon2.xP.toString());
    $("#stat-block .number_appearing").text(mon2.number_appearing.toString());
    $("#stat-block .treasure_type").text(mon2.treasureType.toString());
    
    // display all abilites
    const abilities_list = $("#stat-block .abilities_list ul");
    InputFunctions.DisplayAbilitiesList(abilities_list);
}

// Functions for form-setting
var FormFunctions = {
    // Change from Ascending to Descending AC, or vice versa
    ChangeAC: function() {
        const old_ac = mon2.ac_type;
        GetVariablesFunctions.GetAC();
        GetVariablesFunctions.CalcAC(old_ac);
        GetVariablesFunctions.GetTHAC0();
        console.log("mon2.thac0 " + mon2.thac0 + " mon2.attack_bonus " + mon2.attack_bonus);
        GetVariablesFunctions.CalcTHAC0(old_ac);
        console.log("mon2.thac0 " + mon2.thac0 + " mon2.attack_bonus " + mon2.attack_bonus);
        $('#asc_ac_input').val(mon2.asc_ac);
        $('#desc_ac_input').val(mon2.desc_ac);
        $('#thac0_input').val(mon2.thac0);
        $('#attack_bonus_input').val(mon2.attack_bonus);
        this.ShowHideAscendAC();
        UpdateBlockFromVariables();
    },

    // Show or hide between Ascending, Descending or Both AC
    ShowHideAscendAC: function () {
        $(".ac_prompt").show();
        switch (mon2.ac_type) {
            case "asc":
                $(".desc_ac_input_prompt").hide();
                break;
            case "both":
            case "desc":
                $(".asc_ac_input_prompt").hide();
                break;
        }
        // stat block
        // hide both ac types
        $("#stat-block .ac_statblock, #stat-block .thac0, #stat-block .asc_ab_wrapper").hide();
        if (mon2.ac_type == "asc") {
            $("#stat-block .asc_ac_wrapper").html("<span class=\"asc_ac ac_statblock\">12</span>").show();
            $("#stat-block .asc_ab_wrapper").html("<span class=\"asc_ab\">+1</span>").show();
            $("#stat-block .thac0_title").text("AB");
        } else if (mon2.ac_type == "desc") {
            $("#stat-block .desc_ac").show();
            $("#stat-block .thac0").show();
            $("#stat-block .thac0_title").text("THAC0");
        } else if (mon2.ac_type == "both") {
            $("#stat-block .thac0_title").text("THAC0");
            $("#stat-block .asc_ac_wrapper").html(" [<span class=\"asc_ac ac_statblock\">12</span>]");
            $("#stat-block .asc_ab_wrapper").html(" [<span class=\"asc_ab\">+1</span>]");
            $("#stat-block .ac_statblock, #stat-block .thac0, #stat-block .asc_ab_wrapper").show();
        }
    },

    // Custom HP
    ChangeHD: function() {
        $("#custom_hd_check").prop("checked") ? mon2.custom_hp.checked = true : mon2.custom_hp.checked = false;
        if (mon2.custom_hp.checked) {
            $(".hit_dice_normal").hide();
            $(".hit_dice_custom").show();
        } else {
            $(".hit_dice_normal").show();
            $(".hit_dice_custom").hide();
        }
        if (mon2.custom_hp.value == "") {
            mon2.custom_hp.value = mon2.hit_dice.toString() + " (" + mon2.hit_points.toString() + "hp)";
        }
        $("#custom_hit_dice_input").val(mon2.custom_hp.value);
    },

    // Custom Alignment
    ChangeCustomAlignment: function() {
        $("#custom_alignment_check").prop("checked") ? mon2.custom_alignment.checked = true : mon2.custom_alignment.checked = false;
        if (mon2.custom_alignment.checked) {
            $(".alignment_select").hide();
            $(".alignment_custom").show();
        } else {
            $(".alignment_select").show();
            $(".alignment_custom").hide();
        }
        $("#custom_alignment_input").val(mon2.custom_alignment.value);
    },

    CustomSavesAs: function() {
        if ($("#saves_as_input").val() == "other") {
            $("#other_saves_as_input").show();
            mon2.custom_saves_as = true;
        }
        else {
            $("#other_saves_as_input").hide();
            mon2.custom_saves_as = false;
        }

    },

    // Set the forms
    SetForms: function () {
        // Name and type
        $("#name-input").val(mon2.name);
        $("#monster_descr_input").val(mon2.description);
        
        // AC
        $("#asc_ac_input").val(mon2.asc_ac);
        $("#desc_ac_input").val(mon2.desc_ac);
        $("#" + mon2.ac_type + "_armor_choice_input").prop('checked', true);
        this.ShowHideAscendAC();

        // Stats
        $("#hit_dice_input").val(mon2.hit_dice);
        $("#custom_hd_check").prop("checked", mon2.custom_hp.checked);
        $("#custom_hit_dice_input").val(mon2.custom_hp.value);
        this.ChangeHD();

        $("#thac0_input").val(mon2.thac0);
        $("#attack_bonus_input").val(mon2.attack_bonus);
        $("#attacks_input").val(mon2.attacks);
        $("#speed_input").val(mon2.speed);

        // Saves
        $("#death_input").val(mon2.saves.death.slice(1));
        $("#wands_input").val(mon2.saves.wands.slice(1));
        $("#paralysis_input").val(mon2.saves.paralysis.slice(1));
        $("#breath_input").val(mon2.saves.breath.slice(1));
        $("#spells_input").val(mon2.saves.spells.slice(1));
        if (mon2.custom_saves_as !== undefined && mon2.custom_saves_as == true) {
            $("#saves_as_input").val("other");
            $("#other_saves_as_input").val(mon2.saves.saves_as);
        } else { $("#saves_as_input").val(mon2.saves.saves_as); }
        this.CustomSavesAs();

        // remaining stats
        $("#morale_input").val(mon2.morale);

        if (mon2.custom_alignment == undefined) {
            mon2.custom_alignment = {checked: false, value: ""};
        }
        $("#custom_alignment_check").prop("checked", mon2.custom_alignment.checked);
        $("#alignment_select").val(mon2.alignment);
        $("#custom_alignment_input").val(mon2.custom_alignment.value);
        this.ChangeCustomAlignment();


        $("#xp_input").val(mon2.xP);
        $("#num_appearing_input").val(mon2.number_appearing);
        $("#treasure_type_input").val(mon2.treasureType);
    },

    // Initialize Forms
    InitForms: function () {
        // let dropdownBuffer = [
        //     "<option value=*>Hit Dice</option>",
        //     "<option value=0>0 (", data.crs["0"].xp, " XP)</option>",
        //     "<option value=1/8>1/8 (", data.crs["1/8"].xp, " XP)</option>",
        //     "<option value=1/4>1/4 (", data.crs["1/4"].xp, " XP)</option>",
        //     "<option value=1/2>1/2 (", data.crs["1/2"].xp, " XP)</option>"
        // ];
        // for (let cr = 1; cr <= 30; cr++)
        //     dropdownBuffer.push("<option value=", cr, ">", cr, " (", data.crs[cr].xp, " XP)</option>");
        // $("#hit_dice_input").html(dropdownBuffer.join(""));

        // $(".hidden_on_load").hide()
        FormFunctions.CustomSavesAs();
        if (mon2.abilities.ability_list.length == 0) {
            $("#sort_abilities").hide();
        }
    }
}

// Input functions to be called only through HTML
var InputFunctions = {
    // Change Hit Dice based on input dropdown
    InputHitDice: function () {
        mon2.hit_dice = $("#hit_dice_input").val();
    },

    AddAbilityInput: function () {
        const name_input = $("#abilities_name_input");
        const descr_input = $("#abilities_descr_input");

        // add ability to mon2.abilities
        const ability_name = name_input.val().trim();
        const ability_descr = descr_input.val().trim();
        mon2.abilities.addAbility(ability_name, ability_descr);
        console.log(mon2.abilities.toString());

        // clear the ability input fields
        name_input.val("");
        descr_input.val("");

        // update the list of abilities shown
        this.UpdateAbilitiesList(); // also updates stat block
        if (mon2.abilities.ability_list.length > 0) $("#sort_abilities").show();
    },

    UpdateAbilitiesList: function() {
        const displayList = $("#abilities_list_display");
        InputFunctions.DisplayAbilitiesList(displayList, true);
        UpdateStatblock();
    },

    DisplayAbilitiesList: function(displayList, img = false) {
        let html = "";
        mon2.abilities.ability_list.forEach((ability, index) => {
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

    AddEditButtons: function(index) {
        let imageHTML = "<img class='statblock-image' src='dndimages/x-icon.png' alt='Remove' title='Remove' onclick='InputFunctions.RemoveAbilityItem(" + index + ")'>";
        imageHTML += " <img class='statblock-image' src='dndimages/edit-icon.png' alt='Edit' title='Edit' onclick='InputFunctions.EditAbilityItem(" + index + ")'>" +
            " <img class='statblock-image' src='dndimages/copy-icon.png' alt='Copy' title='Copy' onclick='InputFunctions.CopyAbilityItem(" + index + ")'>" +
            " <img class='statblock-image' src='dndimages/up-icon.png' alt='Up' title='Up' onclick='InputFunctions.SwapAbilityItem(" + index + ", -1)'>" +
            " <img class='statblock-image' src='dndimages/down-icon.png' alt='Down' title='Down' onclick='InputFunctions.SwapAbilityItem(" + index + ", 1)'>";
        return imageHTML;
    },

    RemoveAbilityItem: function(index) {
        mon2.abilities.removeIndex(index);
        this.UpdateAbilitiesList();
        if (mon2.abilities.ability_list.length == 0) $("#sort_abilities").hide();
    },

    EditAbilityItem: function(index) {
        const ability = mon2.abilities.ability_list[index];
        $("#abilities_name_input").val(ability.name);
        $("#abilities_descr_input").val(ability.description);
        this.RemoveAbilityItem(index);
    },

    CopyAbilityItem: function(index) {
        const ability = mon2.abilities.ability_list[index];
        mon2.abilities.insertItem({name: ability.name, description: ability.description}, index + 1);
        this.UpdateAbilitiesList();
    },

    SwapAbilityItem: function(index, direction) {
        const arr = mon2.abilities.ability_list;
        const new_index = index + direction;
        if (new_index < 0 || new_index >= arr.length) return;
        let old = arr[new_index];
        arr[new_index] = arr[index];
        arr[index] = old;
        this.UpdateAbilitiesList();
    },

    SortAbilityList: function() {
        mon2.abilities.sort();
        this.UpdateAbilitiesList();
    },

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
        mon2.name = $("#name-input").val().trim();
        mon2.description = $("#monster_descr_input").val().trim();

        // Armor Class
        GetVariablesFunctions.GetAC();
        this.CalcAC(mon2.ac_type);

        // Hit Dice
        mon2.hit_dice = $("#hit_dice_input").val().trim();
        mon2.hit_points = Math.floor(mon2.hit_dice * 4.5);
        mon2.custom_hp.checked = $("#custom_hd_check").prop("checked");
        mon2.custom_hp.value = $("#custom_hit_dice_input").val().trim();

        // Attacks
        mon2.attacks = $("#attacks_input").val().trim();

        // THAC0/Attack Bonus
        GetVariablesFunctions.GetTHAC0();
        this.CalcTHAC0(mon2.ac_type);

        // Speed
        mon2.speed = $("#speed_input").val().trim();
        this.CalcSpeed();

        // Saves
        mon2.saves.death = "D" + $("#death_input").val().trim();
        mon2.saves.wands = "W" + $("#wands_input").val().trim();
        mon2.saves.paralysis = "P" + $("#paralysis_input").val().trim();
        mon2.saves.breath = "B" + $("#breath_input").val().trim();
        mon2.saves.spells = "S" + $("#spells_input").val().trim();
        mon2.custom_saves_as = ($("#saves_as_input").val() == "other");
        mon2.saves.saves_as = mon2.custom_saves_as ? $("#other_saves_as_input").val().trim() : $("#saves_as_input").val().trim();

        // remaining stats
        mon2.morale = $("#morale_input").val().trim();

        //Alignment
        mon2.alignment = $("#alignment_select option:selected").text().trim();
        mon2.custom_alignment.checked = $("#custom_alignment_check").prop("checked");
        mon2.custom_alignment.value = $("#custom_alignment_input").val().trim();

        mon2.xP = $("#xp_input").val().trim();
        mon2.number_appearing = $("#num_appearing_input").val().trim();
        mon2.treasureType = $("#treasure_type_input").val().trim();
    },

    // Get all Variables From Block
    GetVariablesFromBlock: function () {
        // Name and Description
        mon2.name = $(".monster_name").text().trim();
        mon2.description = $(".description").text().trim();

        // Armor Class
        mon2.desc_ac = parseInt($(".desc_ac").text().trim());
        mon2.asc_ac = parseInt($(".asc_ac").text().trim());

        // Stats
        const hit_dice_field = $(".hit_dice_field");
        if (!mon2.custom_hp.checked) {
            mon2.hit_dice = parseInt($(".hit_dice").text().trim());
            mon2.hit_points = Math.floor(mon2.hit_dice * 4.5);
        } else {
            mon2.custom_hp.value = hit_dice_field.text().trim();
        }

        // THAC0/Attack Bonus
        mon2.attacks = $(".attacks").text().trim();
        mon2.thac0 = parseInt($(".thac0").text().trim());
        mon2.attack_bonus = parseInt($(".asc_ab").text().trim().slice(1));
        this.CalcTHAC0(mon2.ac_type);
        mon2.speed = parseInt($(".turn_speed").text().trim());
        this.CalcSpeed();

        // Saves
        mon2.saves.death = $(".death_save").text().trim()
        mon2.saves.wands = $(".wands_save").text().trim()
        mon2.saves.paralysis = $(".paralysis_save").text().trim()
        mon2.saves.breath = $(".breath_save").text().trim()
        mon2.saves.spells = $(".spells_save").text().trim()

        mon2.custom_saves_as = true;
        mon2.saves.saves_as = $(".saves_as").text().trim().slice(1, -1);

        // remaining stats
        mon2.morale = $(".morale").text().trim();

        mon2.custom_alignment.value = $(".alignment").text().trim();
        mon2.custom_alignment.checked = true;

        mon2.xP = $(".xp").text().trim();
        mon2.number_appearing = $(".number_appearing").text().trim();
        mon2.treasureType = $(".treasure_type").text().trim();

        // abilities
        mon2.abilities = new AbilityList();
        $(".abilities_list ul").children().each(function (index) {
            let [name, description] = [$(this).find(".ability_title").text(), $(this).find(".ability_text").text()];
            if (name.trim().slice(-1) == ":") name = name.trim().slice(0, -1);
            mon2.abilities.addAbility(name.trim(), description.trim());
        });
    },

    // Get AC
    GetAC: function() {
        mon2.ac_type = $('input[name="armor_choice-input"]:checked').val().trim();
        mon2.asc_ac = parseInt($("#asc_ac_input").val().trim());
        mon2.desc_ac = parseInt($("#desc_ac_input").val().trim());
    },

    // Get THAC0 and Attack Bonus
    GetTHAC0: function() {
        mon2.ac_type = $('input[name="armor_choice-input"]:checked').val().trim();
        mon2.thac0 = parseInt($("#thac0_input").val().trim());
        mon2.attack_bonus = parseInt($("#attack_bonus_input").val().trim());
    },

    // Calculate Ascending/Descending AC
    CalcAC: function(base_type) {
        const old_ac = (base_type == "asc") ? mon2.asc_ac : mon2.desc_ac;
        const new_ac = (19 - old_ac);
        if (base_type == "asc") {
            mon2.desc_ac = new_ac;
        } else {
            mon2.asc_ac = new_ac;
        }
        return new_ac;
    },

    // Calculate THAC0 and Attack Bonuses based on input type
    CalcTHAC0: function(base_type) {
        const old_thac0 = (base_type == "asc") ? mon2.attack_bonus : mon2.thac0;
        const new_thac0 = (19 - old_thac0);
        if (base_type == "asc") {
            mon2.thac0 = new_thac0;
        } else {
            mon2.attack_bonus = new_thac0;
        }
        return new_thac0;
    },

    CalcSpeed: function() {
        mon2.round_speed = mon2.speed * 3;
    }
}

// Functions for saving/loading data
var SavedData = {
    // Saving
    SaveToLocalStorage: () => localStorage.setItem("SavedData", JSON.stringify(mon2)),

    // Save to file
    SaveToFile: () => saveAs(new Blob([JSON.stringify(mon2)], {
        type: "text/plain;charset=utf-8"
    }), mon2.name.toLowerCase() + ".json"),

    // Retrieve from cached storage
    RetrieveFromLocalStorage: function () {
        let savedData = localStorage.getItem("SavedData");
        if (savedData != undefined) {
            mon2 = JSON.parse(savedData);
            mon2.abilities = Object.assign(new AbilityList(), mon2.abilities);
            InputFunctions.UpdateAbilitiesList();
        }
    },

    // Retrieve monster from file
    RetrieveFromFile: function () {
        let file = $("#file-upload").prop("files")[0],
            reader = new FileReader();

        reader.onload = function (e) {
            mon2 = JSON.parse(reader.result);
            mon2.abilities = Object.assign(new AbilityList(), mon2.abilities);
            InputFunctions.UpdateAbilitiesList();
            Populate();
        };

        reader.readAsText(file);
    },

    // Load a monster from a JSON data object
    LoadFromData: function(JSONdata) {
        mon2 = (JSONdata);
        mon2.abilities = Object.assign(new AbilityList(), mon2.abilities);
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
