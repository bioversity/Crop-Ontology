

function getOptionByValue (select, value) {
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            return options[i]
        }
    }
    return null
}

