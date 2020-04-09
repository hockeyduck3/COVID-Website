var userInput;

$('.button').click(function () {
    userInput = $('#search').val();

    search();
})

function search () {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://covid-193.p.rapidapi.com/statistics?country=${userInput}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "61b6db55b3msh35943488960f57dp1ace38jsn832bfa80a52f"
        }
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    $.ajax({
        url:"https://api.nytimes.com/svc/search/v2/articlesearch.json?q=COVID-19&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH",
        method: 'GET'
    }).then(function (response2) {
        console.log(response2)
    })
}
// Image
var settings3 = {
	"async": true,
	"crossDomain": true,
	"url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/random_masks_usage_instructions.php",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
		"x-rapidapi-key": "e437273f0fmshecdb698a70bb50fp155d37jsn8b4b323d67aa"
	}
}

$.ajax(settings3).done(function (response3) {
    // var img = $('<img>').attr('src', response3);
    $(document.body).append(response3)
});