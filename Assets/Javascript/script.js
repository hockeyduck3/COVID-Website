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
}