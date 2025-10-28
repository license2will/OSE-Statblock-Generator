
// Save function
var TrySaveFile = () => {
    SavedData.SaveToFile();
}

// Upload file function
var LoadFilePrompt = () => {
    $("#file-upload").click();
}

// Load function
var TryLoadFile = () => {
    SavedData.RetrieveFromFile();
}

// Print function
function TryPrint() {
    let printWindow = window.open();
    printWindow.document.write('<html><head><meta charset="utf-8"/><title>' + mon.name + '</title><link rel="shortcut icon" type="image/x-icon" href="./dndimages/favicon.ico" /><link rel="stylesheet" type="text/css" href="css/statblock-style.css"><link rel="stylesheet" type="text/css" href="css/libre-baskerville.css"><link rel="stylesheet" type="text/css" href="css/noto-sans.css"></head><body><div id="print-block" class="content">');
    printWindow.document.write($("#stat-block-wrapper").html());
    printWindow.document.write('</div></body></html>');
}

// View as image function
function TryImage() {
    const node = document.getElementById('stat-block');
    if (node != null) {
        htmlToImage
            .toBlob(node)
            .then(function (blob) {
                if (window.saveAs) {
                window.saveAs(blob, mon2.name.toLowerCase() + '.png');
                } else {
                FileSaver.saveAs(blob, 'monster.png');
            }
            });
        // htmlToImage
        //     .toJpeg(node, { quality: 0.95 })
        //     .then(function (dataUrl) {
        //         var link = document.createElement('a');
        //         link.download = mon2.name.toLowerCase() + '.jpeg';
        //         link.href = dataUrl;
        //         link.click();
        //     });
    }
}

// markdown export
function TryMarkdown() {
    let markdownWindow = window.open();
    let markdown = ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>', mon2.name, '</title><link rel="shortcut icon" type="image/x-icon" href="./dndimages/favicon.ico" /></head><body>'];
    
    markdown.push("<h1>Markdown Export</h1>");
    markdown.push(BuildMarkdown_basic(mon2));

    markdown.push("</body></html>");

    markdownWindow.document.write(markdown.join(""));
}

function BuildMarkdown_basic(mon) {
    let markdown_lines = [];

    markdown_lines.push("###### " + mon.name);
    markdown_lines.push("");
    markdown_lines.push(mon.description);

    markdown_lines.push("");
    markdown_lines.push("___");
    markdown_lines.push("");
    
    markdown_lines.push(ConvertStatsToMarkdown_basic(mon));

    markdown_lines.push("");
    markdown_lines.push("___");
    markdown_lines.push("");

    mon.abilities.ability_list.forEach(ability => {
        let string = "- ";
        const name = ability.name;
        const descr = ability.description;
        if (name != "") {
            string += "**" + name;
            if (descr != "") string += ":";
            string += "**";
            if (descr != "") string += " ";
        }
        if (descr != "") {
            string += descr;
        }
        markdown_lines.push(string);
        markdown_lines.push("");
    });

    return ConvertMarkdownToHtmlString(markdown_lines);
}

function ConvertStatsToMarkdown_basic(mon) {
    let string = "";

    const ac_type = mon.ac_type;
    string += "**AC** " + ((ac_type == "asc") ? mon2.asc_ac : mon2.desc_ac );
    string += (ac_type == "both") ? " [" + mon2.asc_ac + "], " : ", ";
    string += "**HD** " + mon2.hit_dice + " (" + mon2.hit_points + "), ";
    string += "**Att** " + mon2.attacks + ", ";

    const attack_bonus = (mon2.attack_bonus >= 0 ? "+" : "") + mon2.attack_bonus;
    if (ac_type == "asc") {
        string += "**AB** " + attack_bonus + ", ";
    }
    else {
        string += "**THAC0** " + mon2.thac0 + ((ac_type == "both") ? " [" + attack_bonus + "], " : ", ");
    }

    string += "**MV** " + mon2.round_speed + "' (" + mon2.speed + "'), ";
    string += "**SV** " + mon2.saves.death + " "
                         + mon2.saves.wands + " "
                         + mon2.saves.paralysis + " "
                         + mon2.saves.breath + " "
                         + mon2.saves.spells + " "
                         + "(" + mon2.saves.saves_as + "), ";
    string += "**ML** " + mon2.morale + ", ";
    string += "**AL** " + mon2.alignment + ", ";
    string += "**XP** " + mon2.xP + ", ";
    string += "**NA** " + mon2.number_appearing + ", ";
    string += "**TT** " + mon2.treasureType;

    return string;
}

function ConvertMarkdownToHtmlString(markdownLines) {
    // Add line breaks and code tags
    let builtLines = [];
    
    markdownLines.forEach(line => {
        line.split("<br>").forEach(subLine => {
            builtLines.push(`${subLine}\n`);
        });
    });

    return `<textarea style="width: 60vw; height: 80vh;">${builtLines.join("")}</textarea>`
}