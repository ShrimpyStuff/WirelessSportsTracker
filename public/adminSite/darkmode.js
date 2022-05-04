let darkmodeSwitch = document.getElementById('darkmodeSwitch');
let firstLength;
darkmodeSwitch.addEventListener('change', () => {
    let sheet = document.styleSheets[0];
    if (darkmodeSwitch.checked) {
        firstLength = sheet.cssRules.length;
        sheet.insertRule('body { background-color: #666666}', firstLength);
        sheet.insertRule('table caption { background-color: rgb(0, 204, 85)}', firstLength);
        sheet.insertRule('tr {background-color: rgb(21, 183, 140)}', firstLength+1);
        sheet.insertRule('tr:nth-child(even) {background-color: rgb(55, 149, 124)}', firstLength+2);
        sheet.insertRule('button { background-color: rgb(28, 144, 176)}', firstLength+3);
        sheet.insertRule('button:hover:not(:disabled) { background-color: #00a0cc}', firstLength+4);
    } else {
        sheet.deleteRule(firstLength);
        sheet.deleteRule(firstLength);
        sheet.deleteRule(firstLength);
        sheet.deleteRule(firstLength);
        sheet.deleteRule(firstLength);
        sheet.deleteRule(firstLength);
    }
});