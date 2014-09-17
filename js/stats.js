// Constants
var DATA_FIELDS =  ['nb_datasets','nb_datasets_expected','nb_observations','nb_observations_released','nb_observations_ignored','nb_observations_leftover']

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
    $.each(DATA_FIELDS, function(index,v) {
        $("#"+v).empty();
    });
    
    $.each(['nbs_per_src_overview','nbs_per_src'], function(index,v) {
        $("#table_"+v).empty();
    });
    
    $("#table_nb_occurences").empty();
    
    $("#observations-donut").empty();
      
    $("#dimensions-donut").empty();
}

/*
 * Loads the data from the JSON file and fills in all the different elements of the page
 */
function loadData(data) {
    // Fill in basic numbers
    $.each(DATA_FIELDS, function(index,v) {
        $("#"+v).text(data[v]);
    });

    // Fill in the summary and breakdown tables
    $.each(['nbs_per_src_overview','nbs_per_src'], function(index,v) {
        keys = $(Object.keys(data[v])).sort(sortKeys);
        $.each(keys, function(index, key) {
            val = data[v][key];
            row = $("<tr/>", {"class": val.datasets == val.datasets_expected ? 'success' : 'danger'});
            $("<td/>").text(key).appendTo(row);
            $("<td/>").text(val.datasets).appendTo(row);
            $("<td/>").text(val.datasets_expected).appendTo(row);
            $("<td/>").text(val.observations).appendTo(row);
            row.appendTo("#table_"+v);
        });
    });

    // Fill in the dimensions table
    keys = $(Object.keys(data['nb_occurences'])).sort(sortKeys);
    $.each(keys, function(index, key) {
        val = data['nb_occurences'][key];
        row = $("<tr/>");
        $("<td/>").text(key).appendTo(row);
        $("<td/>").text(val).appendTo(row);
        row.appendTo("#table_nb_occurences");
    });

    // Plot the observations
    plot_data = [];
    plot_data.push({'label':"released",'data':data['nb_observations_released']});
    plot_data.push({'label':"ignored",'data':data['nb_observations_ignored']});
    plot_data.push({'label':"left over",'data':data['nb_observations_leftover']});
    $.plot('#observations-donut', plot_data, {
        series: {
            pie: {
                innerRadius: 0.5,
                show: true
            }
        },
        grid: {
            hoverable: true
        }
    });

    // Plot the dimensions
    plot_data = [];
    $.each(data['nb_occurences'], function(key, value) {
        plot_data.push({'label':key,'data':value});
    });
    $.plot('#dimensions-donut', plot_data, {
        series: {
            pie: {
                innerRadius: 0.5,
                show: true
            }
        },
        grid: {
            hoverable: true
        }
    });
};

/*
 * Utility function used to sort keys for tables
 */
function sortKeys(a,b){
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
};
