// Make sure not to load anything until the document is ready
$(document).ready(function () {
    // Set the variables userInput and loadOrSearch to nothing for now. They will be updated later in the code as needed.
    var userInput;
    var loadOrSearch;
    
    // Run the load function
    load();

    // In the search bar, when the user presses a key down
    $('#search').on('keydown', function (event) {
        // Check and see if the user clicked the 'Enter' key
        if (event.keyCode === 13) {
            // If they did then run the clickSearch function
            clickSearch();
        } 
    })

    // Whenever any button with the class of 'button' or 'cityBtn' is clicked, run the clickSearch function.
    $('.button, .cityBtn').click(clickSearch)

    // This is the first funcrtion that will run
    function load() {
        // Hide the Bloomberg article stuff with the jQuery hide function
        $('.finArt, .finArtImg').hide();

        // Settings for the Bloomberg ajax request
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
            // Console log the response
            console.log(bloomResponse);
    
            // For loop to go over the first 3 items in the Bloomberg response
            for (var i = 0; i < 3; i++) {
                // Give the 'a' tags in the Bloomberg section an href, and set the text to the title of the article
                $(`.finArt${i}`).attr("href", bloomResponse.stories[i].shortURL).text(bloomResponse.stories[i].title);

                // Give the 'img' tags in the Bloomberg section a src img, and add the class of 'imgShadow' for the css to target
                $(`.finArt${i}Img`).attr("src", bloomResponse.stories[i].thumbnailImage).addClass("imgShadow");
            }

            // Then after the for loop is done, fade the Bloomberg section in
            $('.finArt, .finArtImg').fadeIn('slow');
            
        }).catch(function (error) {
            // Just in case if the Bloomberg api returns an error, console log it.
            console.log(error)
        });

        // Then check and see if the user has made a previous search
        if (localStorage.getItem('lastSearchedCountry') !== null) {
            //If they have then grab the last searched country from local storage and set it to the userInput variable
            userInput = localStorage.getItem('lastSearchedCountry');

            // Set the variable loadOrSearch to search
            loadOrSearch = 'search';

            // Run the search function
            search();
        } 
        
        // If the user has not made any previous searches
        else {
            // Set loadOrSearch to load
            loadOrSearch = 'load';

            // Run the nyTimesSearch
            nyTimesSearch();
        }
    }

    // This function will activate when the user clicks a button on the page
    function clickSearch() {
        // First, check and see if what triggered the function has the class 'cityBtn'
        if ($(this).hasClass('cityBtn')) {
            // If it does then set the variable to the text of the button that the suer clicked
            userInput = $(event.target).text();

            // Set the loadOrSearch variable to search
            loadOrSearch = 'search';

            // Run userInputCheck function
            userInputCheck();
            
        } 
        
        // Or if the user just clicked on the top20 button, then do an empty return because we don't want anything to happen
        else if ($(this).hasClass('top20')) {
            return;
        } 
        
        // Finally if neither of the if statements above run, then that means the user either clicked on the 'search button' in the navbar or hit ther 'Enter' button on their keyboard
        else {
            // First check and see if the searchbar is empty
            if ($('#search').val().trim() === '') {
                // If it is then display this error
                $('.errorText').text('Search field cannot be empty');
                displayError();
            } 
            
            // Then check and see if the search bar has both letters and numbers in it's value
            else if ($('#search').val().trim().match(/[a-z]/i) && $('#search').val().trim().match(/[0-9]/)) {
                // If it does then display this error
                $('.errorText').text('Search field cannot contain letters and numbers');
                displayError();
            }
            
            // If it is not empty
            else {
                // Set the userInput variable to the value in the searchbar with the extra whitespaces trimmed off
                userInput = $('#search').val().trim();

                // Set the loadOrSearch variable to search
                loadOrSearch = 'search';

                // Run the userInputCheck function
                userInputCheck();
            }
        }
    }
    
    // Function to account for the response on the covid API - many countries with 2 or more words in their name have a "-" seperating the words, this accounts for the user not knowing this. 
    function userInputCheck() {
        // If the user searches for the United States
        if (userInput === 'United States' || userInput === 'united states' || userInput === 'United states' || userInput === 'America' || userInput === 'america') {
            userInput = 'USA';
        }

        // If the user searches for South Korea
        if (userInput === 'South Korea' || userInput === 'south korea') {
            userInput = 'S-Korea';
        }

        // If none of the other if statements run then this else statement will grab the userInput and replace any spaces between words with a '-'. For example, 'Hong Kong' will become 'Hong-Kong'.
        else {
            userInput = userInput.replace(/\s+/g, '-');
        }

        // Run the search function
        search();
    }

    // Function for searching
    function search() {
        // Variable for the covid search settings
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

        // Call to get data related to covid 19 in the country the user chose 
        $.ajax(covidSettings).then(function (covidResponse) {
            // Display the covid response
            console.log(covidResponse);
            
            // Display an error if the country could not be found
            if (covidResponse.results === 0) {
                $('.errorText').text('Country could not be found :(');
                displayError();
            } 
            
            // If the country was found
            else {
                // Hide the previous results
                $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').hide();
    
                // Save the user's search to the user's local storage
                localStorage.setItem('lastSearchedCountry', covidResponse.parameters.country)

                // Empty out the previous results
                $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').empty();

                // Set the text of the current cases to display the country name as well
                $('#currentCases').text(`Current Cases: ${covidResponse.parameters.country}`)

                // Variable for the new cases
                var newCases = covidResponse.response[0].cases.new;

                // if the response is null, new cases today changes display from null to 'No new cases today'. Otherwise it displays the new cases.
                if (newCases === null) {
                    $(".newCases").text('No new cases today');
                } else {
                    $(".newCases").text("New Cases Today: " + newCases);
                }

                // Variable for the active cases
                var activeCases = covidResponse.response[0].cases.active;

                // Change the text to the total active cases for that country
                $(".activeCases").text("Total Active Cases: " + activeCases);

                // Variable for the recovered
                var recovered = covidResponse.response[0].cases.recovered;

                // Change the text to the total recovered case for that country
                $(".recovered").text("Total Recovered: " + recovered);

                // Variable for today's deaths
                var todaysDeaths = covidResponse.response[0].deaths.new;

                // If the response is null for deaths. today deaths changes from null to 'No new deaths today'. Otherwise it will displays the new deaths for that day.
                if (todaysDeaths === null) {
                    $(".todaysDeaths").text('No new deaths today');
                } else {
                    $(".todaysDeaths").text("New Deaths Today: " + todaysDeaths);
                }

                // Variable for the total deaths
                var totalDeaths = covidResponse.response[0].deaths.total;

                // Change the text to the total deaths for that country
                $(".totalDeaths").text("Total Deaths: " + totalDeaths);

                // Variable for total test done
                var testTotal = covidResponse.response[0].tests.total;

                // If the country has not reported there total number of tests, then it will display 'unknown'. Otherwise it will display that number of tests done.
                if (testTotal === null) {
                    $(".testTotal").text("Amount of Tests Done: unknown");
                } else {
                    $(".testTotal").text("Amount of Tests Done: " + testTotal);
                }

                // After everything has been set then it will show the user the results using jQuery's slide down animation
                $('.newCases, .activeCases, .recovered, .todaysDeaths, .totalDeaths, .testTotal').fadeIn('slow');
                
                // Run the nyTimesSearch function
                nyTimesSearch();
            }
        });
    }

    // Function for showing the New York Times articles
    function nyTimesSearch() {
        // This 2 variables will grab the current year. This way the year isn't hard coded in
        var date = new Date();
        var year = date.getFullYear();

        // Check and see if loadOrSearch is set the load
        if (loadOrSearch === 'load') {
            // If it is then this will set the ajaxSettings variable to look for just basic articles on covid-19
            var ajaxSettings = {
                url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
                method: 'GET'
            }
        } 

        // If loadOrSearch is set to search
        else {
            // Then this will set the ajaxSettings variable to look for covid-19 articles about the country that the user searched for
            var ajaxSettings = {
               url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${userInput}+COVID19&fq=${year}&api-key=fba9vvYnRyI2O33HRL1AhwLy6ywpxVpH`,
               method: 'GET'
            }
        }

        // Fade out the previous articles
        $('.articleSection0, .articleSection1, .articleSection2').fadeOut('slow');

        // Run the ajax call to grab the NY Times articles
        $.ajax(ajaxSettings).then(function (nyResponse) {
            // Console log the response
            console.log(nyResponse);

            // Empty out the previous articles
            $('.articleSection0, .articleSection1, .articleSection2').empty();

            // Then run a for loop to grab the first 3 articles that come back from the ajax request
            for (var i = 0; i < 3; i++) {
                // First create a new div
                var div = $('<div>');
                
                // Then check and see if there are any images attached to that article
                if (nyResponse.response.docs[i].multimedia.length !== 0) {
                    // If there are then set the variable img to the thumbnail from the NY Times, give it an alt, and give it the classes of 'nyImg' and 'imgShadow'. 
                    var img = $('<img>').attr({'src': `https://www.nytimes.com/${nyResponse.response.docs[i].multimedia[19].url}`, 'alt': 'New York Times Thumbnail', 'class': 'nyImg imgShadow'});
                } 
                
                // If the article does not have any images
                else {
                    // Then set the variable img to the NY Times logo, give it an alt, and give it the classes of 'nyImg' and 'imgShadow'. Then set the width to 150px.
                    var img = $('<img>').attr({'src': 'https://i.pinimg.com/originals/c4/81/1d/c4811d59c17568b2ea75b1327d0dfc9e.jpg', 'alt': 'New York Times Thumbnail', 'class': 'nyImg imgShadow'}).css('width', '150px');
                }

                // Set the variable articleLing to a new 'a' tag, with an href linking back to the article on the NY Times website, give it a target of '_blank' so it'll go to a new tab, give it the class of 'blueLink', then set the text to 'Read more'.
                var articleLink = $('<a>').attr({'href': nyResponse.response.docs[i].web_url, 'target': '_blank', 'class': 'blueLink'}).text('Read more.');

                // Set the variable articleParagraph to a new 'p' tag with the ttext set to the lead paragraph from the article
                var articleParagraph = $('<p>').text(nyResponse.response.docs[i].lead_paragraph + '.. ');

                // Append the articleLink varaible to the articleParagraph varaible
                articleParagraph.append(articleLink);
            
                // Then appened the img and articleParagraph variables to the div variable
                div.append(img, articleParagraph);

                // Then append the div to articleSection 0, 1, and 2, and fade in the results.
                $(`.articleSection${i}`).append(div).fadeIn('slow');
            }

           // Just in case if there is an error with 
        }).catch(function (nyError) {
            // Console log the error
            console.log(nyError);

            // Then display the error
            $('.errorText').text(`Error: ${nyError.status} ${nyError.statusText}. Sorry about that :(`);
            displayError();
        })
    }

    // This simple function will just display any error that occurs with a slide down animation
    function displayError() {
        modal.slideDown('fast');
    }

    // Variable for the modal
    var modal = $('#errorModal');

    // When the user clicks the close button on the modal it'll make the modal slide up
    $('.close').click(function () {
        modal.slideUp('fast');
    })

    // When anything on the document is clicked
    $(document).click(function (event) {
        // Check and see if the event target has a class of 'modal'
        if ($(event.target).hasClass('modal')) {
            // If it does then get rid of the error modal using the slide up animation
            modal.slideUp('fast');
        }
    })
})