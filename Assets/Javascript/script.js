$(document).ready(function () {
    load();

    var userInput;

    $('.button').click(clickSearch)

    $('.cityBtn').click(clickSearch)

    function clickSearch(event) {
        if ($(event.target).hasClass('cityBtn')) {
            userInput = $(event.target).text();
            search();
        } else if ($(event.target).hasClass('top20')) {
            return;
        } else {
            if ($('#search').val() === '') {
                $('.errorText').text('Search field cannot be empty');
                modal.slideDown('fast');
            } else {
                userInput = $('#search').val();
                search();
            }
        }
    }

    function load() {
        var date = new Date();
        var year = date.getFullYear();

        $.ajax({
            url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
            method: 'GET'
        }).then(function (nyResponse) {
            console.log(nyResponse);

            $('.articleSection').empty();

            for (var i = 0; i < 3; i++) {
                var div = $('<div>');
              
                if (nyResponse.response.docs[i].multimedia.length !== 0) {
                    var img = $('<img>').attr('src', `https://www.nytimes.com/${nyResponse.response.docs[i].multimedia[19].url}`);
                } else {
                    var img = $('<img>').attr('src', 'https://i.pinimg.com/originals/c4/81/1d/c4811d59c17568b2ea75b1327d0dfc9e.jpg');
                    img.css('width', '150px')
                }

                var articleLink = $('<a>');

                var articleTitle = $('<h4 style="text-decoration: none; color: blue; font-size: medium">').text(nyResponse.response.docs[i].headline.main);
                
                articleLink.append(articleTitle).attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank'});

                div.append(img, articleLink);

                $('.articleSection').append(div);
            }
        })

        var bloomSettings = {
            "async": true,
            "crossDomain": true,
            "url": "https://bloomberg-market-and-financial-news.p.rapidapi.com/stories/list?template=CURRENCY&id=usdjpy",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "bloomberg-market-and-financial-news.p.rapidapi.com",
                "x-rapidapi-key": "7e99fbd181msh93eb9db94711373p1b2374jsn70b4f002fe55"
            }
        }
    
        // $.ajax(bloomSettings).then(function (bloomResponse) {
        //     console.log(bloomResponse);
    
        //     for (var i = 0; i < 3; i++) {
        //         $(`.finArt${i}`).text(bloomResponse.stories[i].title);
        //         $(`.finArt${i}`).attr("href", bloomResponse.stories[i].shortURL);
        //         $(`.finArt${i}Img`).attr("src", bloomResponse.stories[i].thumbnailImage)
        //     }
        // }).catch(function (error) {
        //     console.log(error)
        // });
    }

    function search() {
        var covidSettings = {
            "async": true,
            "crossDomain": true,
            "url": `https://covid-193.p.rapidapi.com/statistics?country=${userInput}`,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "x-rapidapi-key": "61b6db55b3msh35943488960f57dp1ace38jsn832bfa80a52f"
            }
        }

        $.ajax(covidSettings).then(function (covidResponse) {
            console.log(covidResponse);

            $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, testTotal').empty();

            $('#currentCases').text(`Current Cases: ${covidResponse.parameters.country}`)

            var newCases = covidResponse.response[0].cases.new;

            if (newCases === null) {
                $(".newCases").text('No new cases today');
            } else {
                $(".newCases").text("New Cases Today: " + newCases);
            }

            var activeCases = covidResponse.response[0].cases.active;

            $(".activeCases").text("Total Active Cases: " + activeCases);

            var recovered = covidResponse.response[0].cases.recovered;

            $(".recovered").text("Total Recovered: " + recovered);

            var todaysDeaths = covidResponse.response[0].deaths.new;

            if (todaysDeaths === null) {
                $(".todaysDeaths").text('No new deaths today');
            } else {
                $(".todaysDeaths").text("New Deaths Today: " + todaysDeaths);
            }

            var totalDeaths = covidResponse.response[0].deaths.total;

            $(".totalDeaths").text("Total Deaths: " + totalDeaths);

            var testTotal = covidResponse.response[0].tests.total;

            if (testTotal === null) {
                $(".testTotal").text("Amount of Tests Done: unknown");
            } else {
                $(".testTotal").text("Amount of Tests Done: " + testTotal);
            }

        });


        var date = new Date();
        var year = date.getFullYear();

        $.ajax({
            url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${userInput}+COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
            method: 'GET'
        }).then(function (nyResponse) {
            console.log(nyResponse);

            $('.articleSection').empty();

            for (var i = 0; i < 3; i++) {
                var div = $('<div>');
              
                if (nyResponse.response.docs[i].multimedia.length !== 0) {
                    var img = $('<img>').attr('src', `https://www.nytimes.com/${nyResponse.response.docs[i].multimedia[19].url}`);
                } else {
                    var img = $('<img>').attr('src', 'https://i.pinimg.com/originals/c4/81/1d/c4811d59c17568b2ea75b1327d0dfc9e.jpg');
                    img.css('width', '150px')
                }

                var articleLink = $('<a>');

                var articleTitle = $('<h4 style="text-decoration: none; color: blue; font-size: medium">').text(nyResponse.response.docs[i].headline.main);
                
                articleLink.append(articleTitle).attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank'});

                div.append(img, articleLink);

                $('.articleSection').append(div);
            }
        })
    }
})



// Modal code
var modal = $('#errorModal');

$('.close').click(function () {
    modal.slideUp('fast');
})

$(document).click(function (event) {
    if ($(event.target).hasClass('modal')) {
        modal.slideUp('fast');
    }
})