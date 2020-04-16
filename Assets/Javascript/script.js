$(document).ready(function () {
    load();

    var userInput;

    $('#search').on('keydown', function (event) {
        if (event.keyCode === 13) {
            if ($('#search').val().trim() === '') {
                $('.errorText').text('Search field cannot be empty');
                modal.slideDown('fast');
            } else {
                userInput = $('#search').val().trim();
                userInputCheck();
            }
        } 
    })

    $('.button').click(clickSearch)

    $('.cityBtn').click(clickSearch)

    function clickSearch(event) {
        if ($(event.target).hasClass('cityBtn')) {
            userInput = $(event.target).text();
            userInputCheck();
            
        } else if ($(event.target).hasClass('top20')) {
            return;
        } else {
            if ($('#search').val().trim() === '') {
                $('.errorText').text('Search field cannot be empty');
                modal.slideDown('fast');
            } else {
                userInput = $('#search').val().trim();
                userInputCheck();
            }
        }
    }
    // function to account for the response on the covid API - many countries with 2 words in the name have a "-" seperating the words, this accounts for the user not knowing this. 
    function userInputCheck() {
        if (userInput === 'United States' || userInput === 'united states' || userInput === 'America' || userInput === 'america') {
            userInput = 'USA';
        }

        if (userInput === 'South Korea' || userInput === 'south korea') {
            userInput = 'S-Korea';
        }

        if (userInput === 'antigua and barbuda' || userInput === 'Antigua and Barbuda') {
            userInput = 'Antigua-and-Barbuda';
        }

        if (userInput === 'Bosnia and Herzegovina' || userInput === 'bosnia and herzegovina') {
            userInput = 'Bosnia-and-Herzegovina';
        }

        if (userInput === 'Cayman Islands' || userInput === 'cayman islands') {
            userInput = 'Cayman-Islands';
        }

        if (userInput === 'Burkina Faso' || userInput === 'burkina faso') {
            userInput = 'Burkina-Faso';
        }

        if (userInput === 'Channel Islands' || userInput === 'channel islands') {
            userInput = 'Channel-Islands';
        }

        if (userInput === 'Costa Rica' || userInput === 'costa rica') {
            userInput = 'Costa-Rica';
        }

        if (userInput === 'Dominican Republic' || userInput === 'dominican republic') {
            userInput = 'Dominican-Republic';
        }

        if (userInput === 'El salvador' || userInput === 'El Salvador') {
            userInput = 'El-Salvador';
        }

        if (userInput === 'Hong Kong' || userInput === 'hong kong') {
            userInput = 'Hong-Kong';
        }

        if (userInput === 'Isle of Man' || userInput === 'isle-of man') {
            userInput = 'Isle-of-Man';
        }

        if (userInput === 'Ivory Coast"' || userInput === 'ivory coast"') {
            userInput = 'Ivory-Coast"';
        }

        if (userInput === 'New Caledonia' || userInput === 'new caledonia') {
            userInput = 'New-Caledonia';
        }

        if (userInput === 'New Zealand' || userInput === 'new zealand') {
            userInput = 'New-Zealand';
        }

        if (userInput === 'Papua New Guinea' || userInput === 'papua new guinea') {
            userInput = 'Papua-New-Guinea';
        }
        
        if (userInput === 'Puerto Rico' || userInput === 'puerto rico') {
            userInput = 'Puerto-Rico';
        }

        if (userInput === 'saudi arabia' || userInput === 'Saudi Arabia') {
            userInput = 'Saudi-Arabia';
        }

        if (userInput === 'south africa' || userInput === 'South Africa') {
            userInput = 'South-Africa';
        }

        if (userInput === 'Vatican City' || userInput === 'vatican city') {
            userInput = 'Vatican-City';
        }
       

        search();
    }

    function load() {
        if (localStorage.getItem('lastSearch') !== null) {
            // grabs the last searched country from local storage and loads it when a user returns to the site
            userInput = localStorage.getItem('lastSearch');

            search();
        } else {
            var date = new Date();
            var year = date.getFullYear();
            // call to display NYT artciles 
            $.ajax({
                url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
                method: 'GET'
            }).then(function (nyResponse) {
                console.log(nyResponse);

                $('.articleSection').empty();

                for (var i = 0; i < 3; i++) {
                    var div = $('<div>');
                
                    if (nyResponse.response.docs[i].multimedia.length !== 0) {
                        var img = $('<img>').attr({'src': `https://www.nytimes.com/${nyResponse.response.docs[i].multimedia[19].url}`, 'alt': 'New York Times Thumbnail'});
                        $(img).addClass("imgShadow")
                    } else {
                        var img = $('<img>').attr({'src': 'https://i.pinimg.com/originals/c4/81/1d/c4811d59c17568b2ea75b1327d0dfc9e.jpg', 'alt': 'New York Times Thumbnail'});
                        img.css('width', '150px')
                        $(img).addClass("imgShadow")
                    }

                    // var articleLink = $('<a>');

                    var articleParagraph = $('<p>').text(`${nyResponse.response.docs[i].lead_paragraph}...${$('<a>').attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank'}).text('Read more.')}`)
                    
                    // articleLink.append(articleTitle).attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank'});

                    div.append(img, articleParagraph);

                    $('.articleSection').append(div);
                }
            })

        }
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

        $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').slideUp('fast')

        // call to get data related to covid 19 in a country 
        $.ajax(covidSettings).then(function (covidResponse) {
            console.log(covidResponse);
            // displays modal if the country could not be found
            if (covidResponse.results === 0) {
                $('.errorText').text('Country could not be found :(');
                modal.slideDown('fast');
            }

            localStorage.setItem('lastSearch', covidResponse.parameters.country)

            $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').empty();

            $('#currentCases').text(`Current Cases: ${covidResponse.parameters.country}`)

            var newCases = covidResponse.response[0].cases.new;
            // if the response is null for cases today changes display from null to no new cases today otherwise displays the new cases
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
            // if the response is null for deaths today changes display from null to no new cases today otherwise displays the new deaths
            if (todaysDeaths === null) {
                $(".todaysDeaths").text('No new deaths today');
            } else {
                $(".todaysDeaths").text("New Deaths Today: " + todaysDeaths);
            }

            var totalDeaths = covidResponse.response[0].deaths.total;

            $(".totalDeaths").text("Total Deaths: " + totalDeaths);

            var testTotal = covidResponse.response[0].tests.total;
            // accounts for some counties not reporting testing done inforamtion 
            if (testTotal === null) {
                $(".testTotal").text("Amount of Tests Done: unknown");
            } else {
                $(".testTotal").text("Amount of Tests Done: " + testTotal);
            }

            $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').slideDown('slow');

        });

        var bloomSettings = {
            "async": true,
            "crossDomain": true,
            "url": "https://bloomberg-market-and-financial-news.p.rapidapi.com/stories/list?template=CURRENCY&id=usdjpy",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "bloomberg-market-and-financial-news.p.rapidapi.com",
                "x-rapidapi-key": "b2328dbcaamshe375150f85e5095p15818ejsnbf708ecc2a82"
            }
        }

        // call to display the bloomberg financial articles 
        $.ajax(bloomSettings).then(function (bloomResponse) {
            console.log(bloomResponse);
    
            for (var i = 0; i < 3; i++) {
                $(`.finArt${i}`).text(bloomResponse.stories[i].title);
                $(`.finArt${i}`).attr("href", bloomResponse.stories[i].shortURL);
                $(`.finArt${i}Img`).attr("src", bloomResponse.stories[i].thumbnailImage).addClass("imgShadow")
            }
        }).catch(function (error) {
            console.log(error)
        });

        var date = new Date();
        var year = date.getFullYear();
        $('.articleSection0, .articleSection1, .articleSection2').fadeOut('slow');

        $.ajax({
            url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${userInput}+COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
            method: 'GET'
        }).then(function (nyResponse) {
            console.log(nyResponse);

            $('.articleSection0, .articleSection1, .articleSection2').empty();

            for (var i = 0; i < 3; i++) {
                var div = $('<div>');
                
                if (nyResponse.response.docs[i].multimedia.length !== 0) {
                    var img = $('<img>').attr({'src': `https://www.nytimes.com/${nyResponse.response.docs[i].multimedia[19].url}`, 'alt': 'New York Times Thumbnail', 'class': 'nyImg imgShadow'});
                } else {
                    var img = $('<img>').attr({'src': 'https://i.pinimg.com/originals/c4/81/1d/c4811d59c17568b2ea75b1327d0dfc9e.jpg', 'alt': 'New York Times Thumbnail', 'class': 'nyImg imgShadow'});
                    img.css('width', '150px')
                }

                var articleLink = $('<a>').attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank', 'class': 'blueLink'});
              
                articleLink.text('Read more.');

                var articleParagraph = $('<p>').text(nyResponse.response.docs[i].lead_paragraph + '.. ');

                articleParagraph.append(articleLink);
              
                div.append(img, articleParagraph);

                $(`.articleSection${i}`).append(div).fadeIn('slow');

                
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
