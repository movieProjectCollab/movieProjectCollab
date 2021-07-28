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
        html += '<header class="title">' + movie.title + '</header>';
        if (movie.director !== undefined) html += '<p class="director">' + movie.director + '</p>';
        if (movie.genre !== undefined) html += '<p class="genre">' + movie.genre + '</p>';
        if (movie.poster !== undefined) html += `<img src="${movie.poster}">`;
        html += '<p class="rating">' + movie.rating + '</p>';
        html += `<button id="edit-movie-id-${movie.id}" class="edit">Edit</button>`;
        html += `<button id="delete-movie-id-${movie.id}" class="delete">Delete</button>`;
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
        addTitle.change(function () {
            console.log($(this).val());
            titleIsValid = $(this).val() !== '';

            if (titleIsValid && ratingIsValid) {
                $('#add_btn').removeAttr('disabled');
            }
        });

        addRating.change(function () {
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

        $('.edit').click(function (event) {
            console.log($(this).parent().find('img')[0]);
            const movie = {
                title: $(this).parent().find('.title')[0].innerText,
                director: $(this).parent().find('.director')[0].innerText,
                genre: $(this).parent().find('.genre')[0].innerText,
                rating: $(this).parent().find('.rating')[0].innerText,
                // poster: $(this).parent().find('img')[0].
                id: $(this)[0].id.slice(14)
            }

            let editForm = `<h3>Edit a movie</h3>
                <div class="form-group">
                    <label for="edit-movie-title">Title</label>
                    <input id="edit-movie-title" class="form-control" type="text" value="${movie.title}">
                </div>
                <div class="form-group">
                    <label for="edit-movie-rating">Rating</label>
                    <input id="edit-movie-rating" class="form-control" type="text" value="${movie.rating}">
                </div>
                <div class="form-group">
                    <label for="edit-movie-year">Year</label>
                    <input id="edit-movie-year" class="form-control" type="text">
                </div>
                <div class="form-group">
                    <label for="edit-movie-genre">Genre</label>
                    <input id="edit-movie-genre" class="form-control" type="text" value="${movie.genre}">
                </div>
                <div class="form-group">
                    <label for="edit-movie-director">Director</label>
                    <input id="edit-movie-director" class="form-control" type="text" value="${movie.director}">
                </div>
                <div class="form-group">
                    <label for="edit-movie-plot">Plot</label>
                    <textarea id="edit-movie-plot" class="form-control" type="text"></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-movie-actors">Actors</label>
                    <input id="edit-movie-actors" class="form-control" type="text">
                </div>
                <button id="edit-btn" class="btn btn-primary" type="submit">Edit movie</button>`;

            $('#edit-movie-form').html(editForm);

            $('#edit-btn').click(function (event) {
                event.preventDefault();
                // console.log(movie.id);
                // console.log('edit movie button clicked');
                AJAX(serverURL + '/' + movie.id, "PATCH", {
                    title: $('#edit-movie-title').val(),
                    rating: $('#edit-movie-rating').val(),
                    // poster: ,
                    year: $('#edit-movie-year').val(),
                    genre: $('#edit-movie-genre').val(),
                    director: $('#edit-movie-director').val(),
                    plot: $('#edit-movie-plot').val(),
                    actors: $('#edit-movie-actors').val()
                }).then(function() {
                    displayMovie("GET");
                });
            });
        });

        $('.delete').click(function (event) {
            console.log($(this)[0].id);
            let id = $(this)[0].id.slice(16);
            console.log(id);
            AJAX(serverURL + '/' + id, "DELETE")
                .then(function () {
                    displayMovie("GET")
                })
        })
    }

});