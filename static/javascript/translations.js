// User facing error display function
let display_error = (error_message) => {
    // If error is already displayed than wiggle it a bit
    error_box = $('div#error_box')
    if (error_box.is(":visible")) {
        $('div#error_box').effect("shake");
    }
    else {
        error_box.html("<p>" + error_message + "</p>").css("padding", "10px").show(100);
    }
}

// Get the translations from the Translation API
let get_translations = async () => {
    // We could use a data table/dyanmic here but this is laid out
    // as that feels like cheating.
    let phrase = $('#translation_from_textbox').val();

    let translations_list = await $.ajax({
        type: "GET",
        url: "http://" + document.location.host + "/api/1.0/get_completions.json?search_phrase=" + phrase,
        contentType: "application/json",
        async: true,
        error: function (result, status) {
          console.log(result);
        }
    });

    if (translations_list.status !== "Success!") {
        display_error(translations_list.message);
    }

    let table_html = '';
    jQuery.each(translations_list.data, function(idx, row) {
        table_html += '<tr>';
        let id = 0;
        jQuery.each(row, function(key, translation) {
            if (key === "id") {
                id = translation;
            }
            else {
                //table_html += "<td>" + JSON.stringify(phrase).replace(/\"/g, "") + "</td>"
                table_html += "<td data-id='" + JSON.stringify(id).replace(/\"/g, "") + "'>" + JSON.stringify(translation).replace(/\"/g, "") + "</td>"
            }
        });
        table_html += '</tr>';
    })

    $('#translation_suggestions').html(table_html)
};

// Add the translation from the textboxes to the database
let add_translation = async () => {
    let phrase = $('#translation_from_textbox').val();
    let translation = $('#translation_to_textbox').val();

    // Check that the phrase and translation are not empty
    if (!phrase || !translation) {
        // Display a user-facing error
        display_error("You must enter both a phrase and it's translation to add to the database</p>");
        return
    }
    let response = await $.ajax({
        type: "POST",
        url: "http://" + document.location.host + "/api/1.0/add_completion.json",
        data: JSON.stringify({ "english_text": phrase, "translation_text": translation }),
        contentType: "application/json",
        async: true,
        error: function (result, status) {
            console.log(result);
        }
    })

    if (response.status !== "Success!") {
        display_error(response.message);
        return
    }

    //console.log(response);
    $('#translation_from_textbox').val('');
    $('#translation_to_textbox').val('');
    $('div#error_box').hide(100);
    get_translations();
}

// Remove the translation from the database using an API call
let remove_translation = async (translation_id) => {
    if (!translation_id) {
        display_error("That phrase entry data-id isn't valid");
        return
    }

    let response = await $.ajax({
        type: "POST",
        url: "http://" + document.location.host + "/api/1.0/remove_completion.json",
        data: JSON.stringify({ "translation_id" : translation_id }),
        contentType: "application/json",
        async: true,
        error: function (result, status) {
            console.log(result);
        }
    })

    if (response.status !== "Success!") {
        display_error(response);
        return
    }

    get_translations();
}

// Run our functions and create our bindings once
// the dom has loaded.
$(document).ready(function() {
    // Initally run the get translations to populate the list
    get_translations();

    // Translate on keepress
    $('#translation_from_textbox').on('input', get_translations);

    // Hitting enter in the "translation" textbox causes
    // it to submit
    $('#translation_to_textbox').keypress(function (e) {
        if(e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            add_translation();
        }
    });

    // Add Phrase/translation combo on button click
    $('#translation_submit').click(add_translation);

    // Create a targeted dropdown menu for deleting the entries

    // Using a high scoped variable here to store the click state is a bit
    // hacky, but we are guranteed that there will only be one menu at any time
    let contextmenu_target = null;

    // Overwrite default contextmenu
    $('tbody#translation_suggestions').bind("contextmenu", function (event) {
        event.preventDefault();
        contextmenu_target = event.target;
        // Create at mousecursor location
        $(".dropdown-menu").finish().toggle(100).css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });

    // Hide dropdown menu if we click away
    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents(".dropdown-menu").length > 0) {
            $(".dropdown-menu").hide(100);
        }
    });

    // Add remove_translation api call to the delete dropdown action
    $(".dropdown-menu li").click(function(event){
        let data_id_int = parseInt($(contextmenu_target).attr("data-id"));
        switch($(this).attr("data-action")) {
            case "delete": remove_translation(data_id_int); break;
        }
        $(".dropdown-menu").hide(100);
    });
});
