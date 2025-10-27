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
    markdown_lines.push("test");

    return ConvertMarkdownToHtmlString(markdown_lines);
}

function ConvertMarkdownToHtmlString(markdownLines) {
    // Add line breaks and code tags
    let builtLines = [];
    
    markdownLines.forEach(line => {
        line.split("<br>").forEach(subLine => {
            builtLines.push(`${subLine}<br>`);
        });
    });

    return `<code>${builtLines.join("")}</code>`
}