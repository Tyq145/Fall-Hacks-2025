// canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//adjusting canvas size
function adjustCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const observer = new ResizeObserver(adjustCanvasSize);
observer.observe(canvas);
adjustCanvasSize();

// mouse position
let mouseX = canvas.width;
let mouseY = canvas.height;

function updateMouseCoordinates(event) {
    canvasBox = canvas.getBoundingClientRect();
    mouseX = event.pageX - canvasBox.left;
    mouseY = event.pageY - canvasBox.top;

    mouseX = mouseX * (canvas.width / canvasBox.width);
    mouseY = mouseY * (canvas.height / canvasBox.height);
}
document.body.addEventListener("mousemove", updateMouseCoordinates);

// google maps function
var map;
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}


// function startGame() {
//     updateGame();
//     window.requestAnimationFrame(drawGame);
// }

// function updateGame() {
//     ctx.beginPath();
//     ctx.fillStyle = "red";
//     ctx.rect(0, 0, canvas.width, canvas.height);
//     ctx.fill();
//     ctx.closePath();

//     window.setTimeout(updateGame, 50);
// }

// function drawGame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     window.requestAnimationFrame(drawGame);
// }


// Setting Creating the new google maps directions to our new target location

function calcRoute() {
    // Temporary value untill I can get a proper starting Lat Lng
    var start = new google.maps.LatLng(originLat, originLong);
    var end = new google.maps.LatLng(targetLat, targetLong);

    // Generating a properly formatted directions call.
    var request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING"
    };
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var directionsService = new google.maps.DirectionsService();

    directionsService.route(request, function(response, status){
        if(status == 'OK'){
            directionsDisplay.setDirections(response);
        }
        else{
            console.log("An error has occured when trying to generate a route. IDK");
        }
    })



}



class hands {
    constructor() {
        this.playerValue = 0;
        this.dealerValue = 0;
        this.playerHand = new Array();
        this.dealerHand = new Array();

    }
};

let chips = 1000;

class BlackJack {
    constructor() {
        this.deck = new Array(52);
        this.hands = new hands();
        this.betamount = 100;
    }

    play() {
        this.fillDeck();
        this.hands = new hands();
        
        // Get the users betamount
        this.betamount = document.getElementById("bet");

        startGame();
    }

    win(){
        chips += this.betamount;
    }

    lose(){
        chips -= this.betamount;
    }

    hit() {
        this.drawCardPlayer();
        if (this.handVal(hands.playerHand) > 21) {
            this.lose();
        }
        if (this.handVal(hands.dealerHand) < this.handVal(hands.playerHand) || this.handVal(hands.dealerHand) < 11) {
            this.drawCardDealer();
            // Dealer has gone over 21 and the player has one the game. 
            if (this.handVal(hands.dealerHand) > 21) {
                this.win();
            }
        }
    }
    stand() {
        if (this.handVal(hands.dealerHand) < this.handVal(hands.playerHand) || this.handVal(hands.dealerHand) < 11) {
            this.drawCardDealer();
            if (this.handVal(hands.dealerHand) > 21) {
                this.win();
            }
        }
    }

    fillDeck() {
        let val = 0;
        for (let i = 0; i < this.deck.length; i++) {
            this.deck[i] = val % 14;
            val++;
        }

    }
    getRandomIndex(max) {
        return Math.floor(Math.random * max);
    }

    drawCardPlayer() {
        let card = getRandomIndex(this.deck.length);
        this.hands.playerHand.push(this.deck[card]);
        this.deck.splice(card, 1);
    }
    drawCardDealer() {
        let card = this.getRandomIndex(this.deck.length);
        this.hands.dealerHand.push(this.deck[card]);
        this.deck.splice(card, 1);
    }


    handVal(hand) {
        let val = 0;

        for (let i = 0; i < hand.length; i++) {
            let cardval = 0;
            if (hand[i] > 10) {
                cardval = 10;
            }
            else {
                cardval = hand[i];
            }

            val += cardval;
        }

        return val;
    }

    betchips(bet) {
        this.betamount = bet;
    }

}
let targetLong;
let targetLat;
let originLong;
let originLat;


function getTargetLongLat(address) {
    // Get the desired location the user wants to reach from the input
    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests This page details how to convert
    // a given adress to lat and long

    const geocoder = google.maps.Geocoder;

    geocoder.geocode({'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            targetLat = results[0].geometry.location.lat();
            targetLong = results[0].geometry.location.long();
        }
        else {
            console.log("Something has gone horribly wrong with getting the target destination of our path.");
        }
    })
    // calls to get directions need to be made through a lat long object from google. However when we call the geocahing api
    // It will give us a latlongobject we can use.
}
function getOriginLongLat(address){
    const geocoder = google.maps.Geocoder;
    
    geocoder.geocode({'address': address}, function(result, status){
        if(status == google.maps.GeocoderStatus.OK){
            originLong = result[0].geometry.location.long();
            originLat = result[0].geometry.location.lat();
        }
        else{
            console.log("Something has gone horrible wrong with getting the origin of path.");
        }
    })
}

class Offset {
    constructor() {
        var target = 2000;
        var missPercentage;

        this.generateOffset();
        this.modifyLongLat();

    }

    generateOffset() {
        if (chips < target) {
            missPercentage = chips / target;
        }
    }
L
    modifyLongLat() {
        if (missPercentage <= 0) {
a            // If tthey fail spectacularly ima send them to point nemo in the middle of the pacific ocean. Most isolated place
            // in the world; 48°52.6′S 123°23.6′W long lat for point nemo.
            targetLat =  -26.74561;
            targetLong =  -12.058595;
            return;
        }
        else if (missPercentage == 100.0) {
            //If they get a perfect score ima send em to rome: 41°53'48.6"N 12°28'33.9"E 
            targetLat = 41.901584;
            targetLong = 12.48344;
            return;
        }
        // Modifying longitude. 0 means modifyinf east, 1 means modifying west
        // Longitude goes up as you go more east and down as you go more west
        if (Math.floor(Math.random * 2) == 0) {
            targetLong += 4 * (missPercentage);
        }else {
            targetLong -= 4 * (missPercentage);
        }

        // Now handling the modification of latitudes
        if (Math.floor(Math.random * 2) == 0) {
            targetLat += 4 * (missPercentage);
        } else {
            targetLat -= 4 * (missPercentage);
        }
        // Latitude goes up as you go more north and down as you go more south
    }

}

let game;

function drawboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.fillStyle = "#28262C";
    ctx.rect(0, 0.7 * canvas.height, canvas.width, 0.3 * canvas.height);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.rect(0, 0.7 * canvas.height, 0.2 * canvas.width, 0.3 * canvas.height);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.rect(0, 0.7 * canvas.height, 0.2 * canvas.width, 0.3 * canvas.height);
    ctx.fill();
    ctx.closePath();

}



document.getElementById("playbtn").addEventListener("click", function () {
    drawboard();


    let address = document.getElementById("address").value;
    let origin = document.getElementById("startAdress").value;
    if (typeof game != BlackJack) {
        game = new BlackJack();
    }


    // Getting long lat values for the starting point and end point of our directions
    getTargetLongLat(address);
    getOriginLongLat(origin);
    game.play();
});

