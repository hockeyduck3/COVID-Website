var userInput;

$('.button').click(clickSearch)

$('.cityBtn').click(clickSearch)

function clickSearch (event) {
    console.log(event.target)

    if ($(event.target).hasClass('cityBtn')) {
        userInput = $(event.target).text();
        search();
    } else {
        if ($('#search').val() === '') {
            alert('Field cannot be empty')
        } else {
            userInput = $('#search').val();
            search();
        }
    }

}

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

    $.ajax(settings).then(function (response) {
        console.log(response);
        var newCases = response.response[0].cases.new
        $(".newCases").text("New Cases Today: " + newCases) 
        var activeCases = response.response[0].cases.active
        $(".activeCases").text("Total Active Cases: " + activeCases) 
        var recovered = response.response[0].cases.recovered
        $(".recovered").text("Total Recovered: " + recovered) 
        var todaysDeaths = response.response[0].deaths.new
        $(".todaysDeaths").text("New Deaths Today: " + todaysDeaths) 
        var totalDeaths = response.response[0].deaths.total
        $(".totalDeaths").text("Total Deaths: " + totalDeaths) 
        var testTotal = response.response[0].tests.total
        $(".testTotal").text("Amount of Tests Done: " + testTotal) 
    });


    var date = new Date();
    var year = date.getFullYear();

    $.ajax({
        url:`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
        method: 'GET'
    }).then(function (response2) {
        console.log(response2)

        for (var i = 0; i < 3; i++) {
            var div = $('<div>');

            var articleTitle = $('<h4>').text(response2.response.docs[i].abstract);

            var articleLink = $('<a>').text('Article Link');
            articleLink.attr('href', response2.response.docs[i].web_url);
            articleLink.attr('target', '_blank')

            div.append(articleTitle, articleLink);

            $('.articleSection').append(div)
        }
    })
}
