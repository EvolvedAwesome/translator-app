let api_post_translations = (text) => {
    return $.ajax({
        type: "POST",
        url: "https://" + document.location.hostname + "/api/get_completions.json",
        data: JSON.stringify({ "search_phrase": text }),
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
    // Test Translations 
    /*
    translations = [
        {"yes":"yes_translated"},
        {"no":"no_translated"}
    ];*/

    let table_html = '';
    jQuery.each(translations_list, function(idx, row) {
        table_html += '<tr>';
        jQuery.each(row, function(phrase, translation) {
            table_html += "<td>" + JSON.stringify(phrase).replace(/\"/g, "") + "</td>"
            table_html += "<td>" + JSON.stringify(translation).replace(/\"/g, "") + "</td>"
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
        url: "https://" + document.location.hostname + "/api/add_completion.json",
        data: JSON.stringify({ "english_text": phrase, "translated_text": translation }),
        contentType: "application/json",
        async: true,
        error: function (result, status) {
          console.log(result);
        }
    })

    console.log(response);

    $('#translation_from_textbox').empty();
    $('#translation_to_textbox').empty();
}

$(document).ready(function() {
    // Initally run the get translations to populate the list
    get_translations();

    // Translate on typing 
    $('#translation_from_textbox').on('input', get_translations);

    // Add Phrase/translation combo on button click
    $('#translation_submit').click(add_translation);
});
