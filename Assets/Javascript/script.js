$(document).ready(function () { 
    var userInput;

    $('.button').click(clickSearch)

    $('.cityBtn').click(clickSearch)

    function clickSearch (event) {
        if ($(event.target).hasClass('cityBtn')) {
            userInput = $(event.target).text();
            search();
        } else if ($(event.target).hasClass('top20')){
            return;
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
            $('#currentCases').text(`Current Cases: ${response.parameters.country}`)

            var newCases = response.response[0].cases.new;

            if (newCases === null) {
                $(".newCases").text('No new cases today');
            } else {
                $(".newCases").text("New Cases Today: " + newCases);
            }
            
            var activeCases = response.response[0].cases.active;
            
            $(".activeCases").text("Total Active Cases: " + activeCases);
            
            var recovered = response.response[0].cases.recovered;
            
            $(".recovered").text("Total Recovered: " + recovered); 
            
            var todaysDeaths = response.response[0].deaths.new;

            if (todaysDeaths === null) {
                $(".todaysDeaths").text('No new deaths today'); 
            } else {
                $(".todaysDeaths").text("New Deaths Today: " + todaysDeaths); 
            }
            
            var totalDeaths = response.response[0].deaths.total;
            
            $(".totalDeaths").text("Total Deaths: " + totalDeaths); 
            
            var testTotal = response.response[0].tests.total;

            if (testTotal === null) {
                $(".testTotal").text("Amount of Tests Done: unknown");
            } else {
                $(".testTotal").text("Amount of Tests Done: " + testTotal);
            }
            
        });


        var date = new Date();
        var year = date.getFullYear();

        $.ajax({
            url:`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${userInput}+COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
            method: 'GET'
        }).then(function (response2) {
            console.log(response2);

            $('.articleSection').empty();

            for (var i = 0; i < 3; i++) {
                var div = $('<div>');
                
                var articleLink = $('<a>');

                var articleTitle = $('<h4>').text(response2.response.docs[i].headline.main);
                
                articleLink.append(articleTitle).attr({'href': response2.response.docs[i].web_url, 'target': '_blank'});S

                div.append(articleLink);

                $('.articleSection').append(div);
            }
        })
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://bloomberg-market-and-financial-news.p.rapidapi.com/stories/list?template=CURRENCY&id=usdjpy",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "bloomberg-market-and-financial-news.p.rapidapi.com",
            "x-rapidapi-key": "b2328dbcaamshe375150f85e5095p15818ejsnbf708ecc2a82"
        }
    }

    $.ajax(settings).then(function (response) {
        console.log(response);
    });
})