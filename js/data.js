/*
 * Hook to initialise YASQE and YASR when the page is ready
 */
$(document).ready(function() {
    $.yasqe = YASQE($('#yasqe')[0], {
        sparql: {
            endpoint: 'http://lod.cedar-project.nl/cedar/sparql',
            showQueryButton: true
        }
    });
    $.yasr = YASR($("#yasr")[0], {
        //this way, the URLs in the results are prettified using the defined prefixes in the query
        getUsedPrefixes: $.yasqe.getPrefixesFromQuery
    });

    // Set some of the hooks to link YASR and YASQE
    $.yasqe.options.sparql.handlers.success = function(data, textStatus, xhr) {
        $.yasr.setResponse({response: data, contentType: xhr.getResponseHeader("Content-Type")});
    };
    $.yasqe.options.sparql.handlers.error = function(xhr, textStatus, errorThrown) {
        var exceptionMsg = textStatus + " (response status code " + xhr.status + ")";
        if (errorThrown && errorThrown.length) exceptionMsg += ": " + errorThrown;
        $.yasr.setResponse({exception: exceptionMsg});
    };
});

function loadQuery (queryname) {
    $.ajax("rq/" + queryname + ".sparql", {
        dataType: 'text',
        success: function (data) {
            $.yasqe.setValue(data);
            $.yasqe.query();
        }
    });
}