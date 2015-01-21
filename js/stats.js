/*
 * Hook to start loading the data when the page is ready
 */
$(document).ready(function() {
    // Show the loading sign
    $('#main-container').addClass('loading')
    
    // Clean up previously displayed data
    cleanPage();

    // Fire up an AJAX query to load the new data
    $.getJSON("data/stats.json", function(data) {
        // Load the data
        loadData(data);

        // Hide loading sign
        $('#main-container').removeClass('loading')
    });
});

/*
 * Reset content holders
 */
function cleanPage() {
    $.each(['nb_parsed_sheets','nb_parsed_sheets_overview'], function(index,v) {
        $("#table_"+v).empty();
    });
}

/*
 * Loads the data from the JSON file and fills in all the different elements of the page
 */
function loadData(data) {
    // Fill in the summary and breakdown tables
    $.each(['nb_parsed_sheets','nb_parsed_sheets_overview'], function(index,value) {
        $.each(data[value], function(index, entry) {
            row = $("<tr/>", {"class": entry.nbsheets == entry.total ? 'success' : 'danger'});
            $("<td/>").text(entry.datasetname).appendTo(row);
            $("<td/>").text(entry.nbsheets).appendTo(row);
            $("<td/>").text(entry.total).appendTo(row);
            row.appendTo("#table_"+value);
        });
    });
};

/*
 * Utility function used to sort keys for tables
 */
function sortKeys(a,b){
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
};
