// const ImportFunctions = {
//     // Get all variables from preset (in json format)
//     SetPreset: function (preset) {
//     // Name and type
//     mon2.name = preset.name.trim();
//     mon.size = preset.size.trim().toLowerCase();
//     mon.type = preset.type.trim();
//     mon.tag = preset.subtype.trim();
//     mon.alignment = preset.alignment.trim();

//     // Stats
//     mon.strPoints = preset.strength;
//     mon.dexPoints = preset.dexterity;
//     mon.conPoints = preset.constitution;
//     mon.intPoints = preset.intelligence;
//     mon.wisPoints = preset.wisdom;
//     mon.chaPoints = preset.charisma;

//     // CR
//     mon.cr = preset.challenge_rating;
//     mon.customCr = CrFunctions.GetString();
//     mon.customProf = CrFunctions.GetProf();

//     // Armor Class
//     let armorAcData = preset.armor_class,
//         armorDescData = preset.armor_desc ? preset.armor_desc.split(",") : null;

//     // What type of armor do we have? If it doesn't match anything, use "other"
//     mon.shieldBonus = 0;
//     if (armorDescData) {
//         mon.armorName = armorDescData[0];
//         // If we have a shield and nothing else
//         if (armorDescData.length == 1 && armorDescData[0].trim() == "shield") {
//             mon.shieldBonus = 2;
//             mon.armorName = "none";
//         } else {
//             // If we have a shield in addition to something else
//             if (armorDescData.length > 1) {
//                 if (armorDescData[1].trim() == "shield") {
//                     mon.shieldBonus = 2;
//                     mon.armorName = armorDescData[0];
//                 }
//                 // Or if it's just weird
//                 else
//                     armorDescData = [armorDescData.join(",")];
//             }

//             // Is it natural armor?
//             if (mon.armorName == "natural armor") {
//                 let natArmorBonusCheck = armorAcData - MathFunctions.GetAC("none");
//                 if (natArmorBonusCheck > 0)
//                     mon.natArmorBonus = natArmorBonusCheck;

//                 // Weird edge case where the monster has a natural armor bonus of <= 0
//                 else
//                     mon.armorName = "other";
//             }

//             // Is it another type of armor we know?
//             else if (data.armors.hasOwnProperty(armorDescData[0].trim()))
//                 mon.armorName = armorDescData[0].trim();

//             // Is it mage armor?
//             else if (mon.armorName.includes("mage armor"))
//                 mon.armorName = "mage armor";

//             // We have no idea what this armor is
//             else
//                 mon.armorName = "other";
//         }
//     } else
//         mon.armorName = (armorAcData == MathFunctions.GetAC("none") ? "none" : "other");

//     // In case it's an unknown armor type
//     if (mon.armorName == "other") {
//         if (armorDescData)
//             mon.otherArmorDesc = armorDescData[0].includes("(") ? armorDescData :
//                 armorAcData + " (" + armorDescData + ")";
//         else
//             mon.otherArmorDesc = armorAcData + " (unknown armor type)";

//         // Set the nat armor bonus for convenience- often the AC is for natural armor, but doesn't have it in the armor description
//         let natArmorBonusCheck = armorAcData - MathFunctions.GetAC("none");

//         if (natArmorBonusCheck > 0)
//             mon.natArmorBonus = natArmorBonusCheck;
//     } else
//         mon.otherArmorDesc = armorAcData + (preset.armor_desc ? " (" + preset.armor_desc + ")" : "");

//     // Hit Dice
//     mon.hitDice = parseInt(preset.hit_dice.split("d")[0]);
//     mon.hpText = mon.hitDice.toString();
//     mon.customHP = false;

//     // Speeds
//     let GetSpeed = (speedList, speedType) => speedList.hasOwnProperty(speedType) ? parseInt(speedList[speedType]) : 0;

//     mon.speed = GetSpeed(preset.speed, "walk");
//     mon.burrowSpeed = GetSpeed(preset.speed, "burrow");
//     mon.climbSpeed = GetSpeed(preset.speed, "climb");
//     mon.flySpeed = GetSpeed(preset.speed, "fly");
//     mon.swimSpeed = GetSpeed(preset.speed, "swim");
//     mon.hover = preset.speed.hasOwnProperty("hover");

//     if (preset.speed.hasOwnProperty("notes")) {
//         mon.customSpeed = true;
//         mon.speedDesc = preset.speed.walk + " ft. (" + preset.speed.notes + ")";
//     } else {
//         mon.customSpeed = false;
//         mon.speedDesc = StringFunctions.GetSpeed();
//     }

//     // Saving Throws
//     mon.sthrows = [];
//     if (preset.strength_save)
//         this.AddSthrow("str");
//     if (preset.dexterity_save)
//         this.AddSthrow("dex");
//     if (preset.constitution_save)
//         this.AddSthrow("con");
//     if (preset.intelligence_save)
//         this.AddSthrow("int");
//     if (preset.wisdom_save)
//         this.AddSthrow("wis");
//     if (preset.charisma_save)
//         this.AddSthrow("cha");

//     // Skills
//     mon.skills = [];
//     if (preset.skills) {
//         for (let index = 0; index < data.allSkills.length; index++) {
//             let currentSkill = data.allSkills[index],
//                 skillCheck = StringFunctions.StringReplaceAll(currentSkill.name.toLowerCase(), " ", "_");
//             if (preset.skills[skillCheck]) {
//                 let expectedExpertise = MathFunctions.PointsToBonus(mon[currentSkill.stat + "Points"]) + Math.ceil(CrFunctions.GetProf() * 1.5),
//                     skillVal = preset.skills[skillCheck];
//                 this.AddSkill(data.allSkills[index].name, (skillVal >= expectedExpertise ? " (ex)" : null));
//             }
//         }
//     }

//     // Conditions
//     mon.conditions = [];
//     let conditionsPresetArr = ArrayFunctions.FixPresetArray(preset.condition_immunities);
//     for (let index = 0; index < conditionsPresetArr.length; index++)
//         this.AddCondition(conditionsPresetArr[index]);

//     // Damage Types
//     mon.damagetypes = [];
//     mon.specialdamage = [];
//     this.AddPresetDamage(preset.damage_vulnerabilities, "v");
//     this.AddPresetDamage(preset.damage_resistances, "r");
//     this.AddPresetDamage(preset.damage_immunities, "i");

//     // Languages
//     mon.languages = [];
//     mon.telepathy = 0;
//     mon.understandsBut = "";
//     if (preset.languages.includes("understands")) {
//         let speaksUnderstandsArr = preset.languages.split("understands"),
//             speaks = speaksUnderstandsArr[0].length > 0 ? speaksUnderstandsArr[0].trim().split(",") : [],
//             understands = speaksUnderstandsArr[1].split(" but "),
//             understandsLangs = understands[0].replace(", and ", ",").replace(" and ", ",").split(","),
//             understandsBut = understands.length > 1 ? understands[1].trim() : "";

//         for (let index = 0; index < speaks.length; index++)
//             this.AddLanguage(speaks[index], true);
//         for (let index = 0; index < understandsLangs.length; index++)
//             this.AddLanguage(understandsLangs[index], false);

//         if (understandsBut.toLowerCase().includes("telepathy")) {
//             mon.telepathy = parseInt(understandsBut.replace(/\D/g, ''));
//             understandsBut = understandsBut.substr(0, understandsBut.lastIndexOf(","));
//         }
//         mon.understandsBut = understandsBut;
//     }
//     else {
//         let languagesPresetArr = preset.languages.split(",");
//         for (let index = 0; index < languagesPresetArr.length; index++) {
//             let languageName = languagesPresetArr[index].trim();
//             languageName.toLowerCase().includes("telepathy") ?
//                 mon.telepathy = parseInt(languageName.replace(/\D/g, '')) :
//                 this.AddLanguage(languageName, true);
//         }
//     }

//     // Senses
//     mon.blindsight = 0;
//     mon.blind = false;
//     mon.darkvision = 0;
//     mon.tremorsense = 0;
//     mon.truesight = 0;
//     let sensesPresetArr = preset.senses.split(",");
//     for (let index = 0; index < sensesPresetArr.length; index++) {
//         let senseString = sensesPresetArr[index].trim().toLowerCase(),
//             senseName = senseString.split(" ")[0],
//             senseDist = StringFunctions.GetNumbersOnly(senseString);
//         switch (senseName) {
//             case "blindsight":
//                 mon.blindsight = senseDist;
//                 mon.blind = senseString.toLowerCase().includes("blind beyond");
//                 break;
//             case "darkvision":
//                 mon.darkvision = senseDist;
//                 break;
//             case "tremorsense":
//                 mon.tremorsense = senseDist;
//                 break;
//             case "truesight":
//                 mon.truesight = senseDist;
//                 break;
//         }
//     }

//     // This
//     mon.shortName = "";
//     mon.pluralName = "";

//     // Legendary?
//     mon.isLegendary = Array.isArray(preset.legendary_actions);
//     if (preset.legendary_desc == null || preset.legendary_desc.length == 0)
//         this.LegendaryDescriptionDefault();
//     else
//         mon.legendariesDescription = preset.legendary_desc;
//     FormFunctions.SetLegendaryDescriptionForm();

//     // Mythic?
//     mon.isMythic = Array.isArray(preset.mythic_actions);
//     if (preset.mythicy_desc == null || preset.mythic_desc.length == 0)
//         this.MythicDescriptionDefault();
//     else
//         mon.legendariesDescription = preset.mythic_desc;
//     FormFunctions.SetMythicDescriptionForm();

//     // Lair?
//     mon.isLair = Array.isArray(preset.lair_actions);
//     if (preset.lair_desc == null || preset.lair_desc.length == 0) {
//         this.LairDescriptionDefault();
//         this.LairDescriptionEndDefault();
//     }
//     else {
//         mon.lairDescription = preset.lair_desc;
//         mon.lairDescriptionEnd = preset.lair_desc_end;
//     }
//     FormFunctions.SetLairDescriptionForm();

//     // Regional Effects?
//     mon.isRegional = Array.isArray(preset.regional_actions);
//     if (preset.regional_desc == null || preset.regional_desc.length == 0) {
//         this.RegionalDescriptionDefault();
//         this.RegionalDescriptionEndDefault();
//     }
//     else {
//         mon.regionalDescription = preset.regional_desc;
//         mon.regionalDescriptionEnd = preset.regional_desc_end;
//     }
//     FormFunctions.SetRegionalDescriptionForm();
//     FormFunctions.SetRegionalDescriptionEndForm();

//     // Abilities
//     mon.abilities = [];
//     mon.actions = [];
//     mon.bonusActions = [];
//     mon.reactions = [];
//     mon.legendaries = [];
//     mon.mythics = []
//     mon.lairs = [];
//     mon.regionals = [];
//     let abilitiesPresetArr = preset.special_abilities,
//         actionsPresetArr = preset.actions,
//         bonusActionsPresetArr = preset.bonusActions,
//         reactionsPresetArr = preset.reactions,
//         legendariesPresetArr = preset.legendary_actions,
//         mythicPresetArr = preset.mythic_actions,
//         lairsPresetArr = preset.lair_actions,
//         regionalsPresetArr = preset.regional_actions;

//     let self = this,
//         AbilityPresetLoop = function (arr, name) {
//             if (Array.isArray(arr)) {
//                 for (let index = 0; index < arr.length; index++)
//                     self.AddAbilityPreset(name, arr[index]);
//             }
//         }

//     AbilityPresetLoop(abilitiesPresetArr, "abilities");
//     AbilityPresetLoop(actionsPresetArr, "actions");
//     AbilityPresetLoop(bonusActionsPresetArr, "bonusActions");
//     AbilityPresetLoop(reactionsPresetArr, "reactions");
//     if (mon.isLegendary)
//         AbilityPresetLoop(legendariesPresetArr, "legendaries");
//     if (mon.isMythic)
//         AbilityPresetLoop(mythicPresetArr, "mythics");
//     if (mon.isLair)
//         AbilityPresetLoop(lairsPresetArr, "lairs");
//     if (mon.isRegional)
//         AbilityPresetLoop(regionalsPresetArr, "regionals");

//     mon.separationPoint = undefined; // This will make the separation point be automatically calculated in UpdateStatblock
//     }
// }