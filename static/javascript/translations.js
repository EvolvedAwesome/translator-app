let api_post_translations = (text) => {
    return $.ajax({
        type: "GET",
        url: "http://" + document.location.host + "/api/get_completions.json?search_phrase=" + text,
        contentType: "application/json",
        async: true,
        error: function (result, status) {
          console.log(result);
        }
    })
}

let get_translations = async () => {
    // We could use a data table/dyanmic here but this is laid out
    // as that feels like cheating.
    let phrase = $('#translation_from_textbox').val();

    let translations_list = await api_post_translations(phrase);

    let table_html = '';
    jQuery.each(translations_list, function(idx, row) {
        table_html += '<tr>';
        jQuery.each(row, function(key, translation) {
            if (key !== "id") {
                //table_html += "<td>" + JSON.stringify(phrase).replace(/\"/g, "") + "</td>"
                table_html += "<td>" + JSON.stringify(translation).replace(/\"/g, "") + "</td>"
            }
        });
        table_html += '</tr>';
    })

    $('#translation_suggestions').html(table_html)
};

let add_translation = async () => {
    let phrase = $('#translation_from_textbox').val();
    let translation = $('#translation_to_textbox').val();

    let response = await $.ajax({
        type: "POST",
        url: "http://" + document.location.host + "/api/add_completion.json",
        data: JSON.stringify({ "english_text": phrase, "translation_text": translation }),
        contentType: "application/json",
        async: true,
        error: function (result, status) {
          console.log(result);
        }
    })

    console.log(response);

    $('#translation_from_textbox').val('');
    $('#translation_to_textbox').val('');
    get_translations();
}

$(document).ready(function() {
    // Initally run the get translations to populate the list
    get_translations();

    // Translate on typing 
    $('#translation_from_textbox').on('input', get_translations);
    $('#translation_to_textbox').keypress(function (e) {
        if(e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            add_translation();
        }
    });

    // Add Phrase/translation combo on button click
    $('#translation_submit').click(add_translation);
});
