var myFrontPage = $("#mittdesign");
if (myFrontPage)
{
    var courseId = getCourseId();
    var href= "/api/v1/courses/" + courseId + "/modules?per_page=100";

    getModules(courseId, function(modules) {
        var html = "Moduloversikt";
        html = html + '<div class="container-fluid">';
        var noOfModules = modules.length;
        for (var i = 0; i < noOfModules; i++) {
            var m = modules[i];
            html = html + '<div class="well well-lg">';
            for (var j = 0; j < m.items.length; j++) {
                var item = m.items[j];
                var completed = false;
                if (item.completion_requirement)
                {
                    if(item.completion_requirement.completed)
                    {
                        completed = true;
                    }
                }
                if(completed)
                {        
                    html = html + '<a class="btn btn-success" role="button" href="' + item.html_url + '">&nbsp;</a>';
                }
                else
                {
                    html = html + '<a class="btn btn-danger" role="button" href="' + item.html_url + '">&nbsp;</a>';
                }                
            }
            html = html + "</div>";
        }
        html = html + "</div>";
        myFrontPage.html(html);
    });
}

function getModules(courseId, callback)
{
    $.getJSON(href, function(modules) {
        var noOfModules = modules.length;
        var asyncsDone = 0;
        for (var i = 0; i < noOfModules; i++) {
            var m = modules[i];
            var href= host + "/api/v1/courses/" + courseId + "/modules/" + m.id + "/items?per_page=100";
            $.getJSON(
                href,
                (function(j) {
                    return function(items) {
                        modules[j].items = items;
                        asyncsDone++;

                        if(asyncsDone === noOfModules) {
                            callback(modules);
                        }
                    };
                }(i)) // calling the function with the current value
            );
        };
    });
}
function getCourseId()
{
    var currentUrl = "" + document.location;
    var matches = currentUrl.match(/\/courses\/(\d+)/);
    if (matches != null) {
        return parseInt(matches[1], 10);
    }
    return null;
}
