"use strict";

$(document).ready(function () {

    const serverURL = 'https://oil-bottlenose-pigeon.glitch.me/movies';

    fetch('https://oil-bottlenose-pigeon.glitch.me/movies').then(response => {
        response.json().then(movies => {
            console.log(movies);
        });
    });

    function AJAX(url, method = "GET", data) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        return fetch(url, options)
            .then(res => res.json())
            .then(responseData => responseData)
            .catch(err => err)
    }

// AJAX('https://oil-bottlenose-pigeon.glitch.me/movies' + "/2")
// .then(data => console.log(data))
//
// AJAX(serverURL, "POST", {title: "New Movie 2"})
//     .then(function (data) {
//         console.log(data)
//     });
//
// AJAX(serverURL + "/20", "PUT", {
//     name: "New Movie 2 part 2",
//     message: "hebebebebe"
// })
//     .then(data => console.log(data))
//
// AJAX(serverURL + "/21", "DELETE")
//      .then(data => console.log(data))

//we deleted all the empty IDs
// for(var i = 6; i <= 8; i++) {
//     AJAX(serverURL + "/" + i, "DELETE")
//         .then(data => console.log(data))
// }

    function renderMovie(movie) {
        var html = '<div class="movie">';
        html += '<header>' + movie.title + '</header>';
        if (movie.director !== undefined) html += '<p>' + movie.director + '</p>';
        if (movie.genre !== undefined) html += '<p>' + movie.genre + '</p>';
        if (movie.poster !== undefined) html += `<img src="${movie.poster}">`;
        html += '<p>' + movie.rating + '</p>';
        html += '</div>';
        return html;
    }

    function displayMovie(method, data) {
        AJAX(serverURL, method, data).then(function (movies) {
            loading.toggleClass('d-none');
            movieDisplay.innerHTML = renderMovies(movies);
            addEventListeners();
        });
    }

    function renderMovies(movies) {
        console.log('should be movies array: ', movies);
        var html = '';
        for (var i = 0; i <= movies.length - 1; i++) {
            html += renderMovie(movies[i]);
        }
        return html;
    }

    var movieDisplay = document.getElementById('Movie-Display');
    const loading = $('#loading');
    const addTitle = $('#movie-title');
    const addRating = $('#movie-rating');

    let titleIsValid = false;
    let ratingIsValid = false;

    displayMovie("GET");

    function addEventListeners() {
        addTitle.change(function() {
            console.log($(this).val());
            titleIsValid = $(this).val() !== '';

            if (titleIsValid && ratingIsValid) {
                $('#add_btn').removeAttr('disabled');
            }
        });

        addRating.change(function() {
            console.log($(this).val());
            ratingIsValid = $(this).val() !== '';

            if (titleIsValid && ratingIsValid) {
                $('#add_btn').removeAttr('disabled');
            }
        });

        $('#add_btn').click(function (event) {
            event.preventDefault();
            console.log('add movie button clicked');
                displayMovie(
                    "POST",
                    {"title": addTitle.val(), "rating": addRating.val()}
                );
                displayMovie("GET");
        });

    }

});