function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, do you want to live in ' + address + '?');

    //           StreetView

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    //            NY Times with .getJSON()
    var articles
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    //Build URL
    url += '?' + $.param({
        // Change here to your nyTimes API-Key
        'api-key': "xxxxxxxxxxxxxxxxxxxxxx",
        'q': cityStr
    });

    $nytHeaderElem.text('New York Times Articles About ' + cityStr);

    $.getJSON(url, function(data) {
            var articles = data.response.docs;
            $.each(articles, function(key, val) {
                $nytElem.append('<li class="article">' + '<a href="' + val.web_url + '">' + val.headline.main + '</a>' + '<p>' + val.snippet + '</p>' + '</li>');
            })
        })
        .error(function(erro) {
            $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
        });

    //           Wikipedia with .ajax()

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    // Error jsonp

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia resources');
    }, 8000);

    $.ajax({
            url: wikiUrl,
            dataType: "jsonp"
        })
        .done(function(data) {
            var articleList = data[1];

            for (var i = 0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki' + articleStr;
                $wikiElem.append('<li><a href ="' + url + '">' + articleStr + '</a></li>');
            };
            //Stoping Timeout
            clearTimeout(wikiRequestTimeout);
        });

    return false;
};

$('#form-container').submit(loadData);
