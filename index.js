"use strict";

fetch('https://oil-bottlenose-pigeon.glitch.me/movies').then( response => {
    response.json().then( movies => {
        console.log(movies);
    });
});