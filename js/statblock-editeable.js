//---> make statblock editable on click
$(document).ready(function() {
    // Attach a click event listener to the fields inside the #stat-block div
    $('#stat-block').on('click', '*', function(event) {
        // Prevent the event from propagating to parent elements
        event.stopPropagation();

        // Ensure the clicked element has no child elements and is not an <hr> element
        if ($(this).children().length === 0 && !$(this).is('hr') && !$(this).is('[contenteditable]')) {
            // Make the element editable
            $(this).attr('contenteditable', 'true');
            // Optionally, focus on the element
            $(this).focus();
        }
    });

    // Remove editable attribute when the user clicks outside the element
    $('#stat-block').on('blur', '*', function(event) {
        event.stopPropagation();
        $(this).removeAttr('contenteditable');
        console.log(this.innerHTML);
        GetVariablesFunctions.GetVariablesFromBlock();
        FormFunctions.SetForms();
        UpdateBlockFromVariables();
        InputFunctions.UpdateAbilitiesList();
    });
});
