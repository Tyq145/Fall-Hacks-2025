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
var map;
// google maps function
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}



// Setting Creating the new google maps directions to our new target location

// let targetLong;
// let targetLat;
// let originLong;
// let originLat;

function calcRoute(targetLong, targetLat, originLong, originLat) {

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

    directionsService.route(request, function (response, status) {
        console.log(status);
        if (status == 'OK') {
            // directionsDisplay.setMap(null);
            // directionsDisplay.setMap(map);
            directionsDisplay.setDirections(response);
        }
        else {
            console.log("An error has occured when trying to generate a route. Status: " + status);
        }
    })



}



function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0].geometry.location);
            } else {
                reject("Geocode error: " + status);
            }
        });
    });
}
let targetLong = 0;
let targetLat = 0;
let originLong = 0;
let originLat = 0;
let targetLocation;
let originLocation;

async function test() {
    const { Geocoder } = await google.maps.importLibrary("geocoding");

    originLocation = await geocodeAddress("SFU, Vancouver, Canada");
    targetLocation = await geocodeAddress("UBC, Vancouver, Canada");

    targetLat = targetLocation.lat();
    targetLong = targetLocation.lng();
    originLat = originLocation.lat();
    originLong = originLocation.lng();

    console.log("Target Lat: " + targetLat + " Target Long: " + targetLong);
    console.log("Origin Lat: " + originLat + " Origin Long: " + originLong);

    alert("Your Chosen Origin Location Has Coordinates Longitude: " + originLong + " Latitude: " + originLat);
    alert("Your Chosen Target Location Has Coordinates Longitude: " + targetLong + " Latitude: " + targetLat);

    calcRoute(targetLong, targetLat, originLong, originLat);


}
async function test2() {
    const { Geocoder } = await google.maps.importLibrary("geocoding");

    // "SFU, Vancouver, Canada"
    originLocation = await geocodeAddress((string)(document.getElementById("startaddress").value));
    // "UBC, Vancouver, Canada"
    targetLocation = await geocodeAddress((string)(document.getElementById("address").value));

    targetLat = targetLocation.lat();
    targetLong = targetLocation.lng();
    originLat = originLocation.lat();
    originLong = originLocation.lng();

    console.log("Target Lat: " + targetLat + " Target Long: " + targetLong);
    console.log("Origin Lat: " + originLat + " Origin Long: " + originLong);

    alert("Your Chosen Origin Location Has Coordinates Longitude: " + originLong + " Latitude: " + originLat);
    alert("Your Chosen Target Location Has Coordinates Longitude: " + targetLong + " Latitude: " + targetLat);

    calcRoute(targetLong, targetLat, originLong, originLat);


}



class hands {
    constructor() {
        this.playerValue = 0;
        this.dealerValue = 0;
        this.playerHand = [];
        this.dealerHand = [];

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
    }
    resetGame() {
        hands.playerHand = new Array();
        hands.dealerHand = new Array();
        hands.playerValue = 0;
        hands.dealerValue = 0;
        this.fillDeck();
    }
    win() {
        chips += this.betamount;
        this.resetGame();
    }

    lose() {
        chips -= this.betamount;
        this.resetGame();
    }

    hit() {
        this.drawCardPlayer();
        if (this.handVal(this.hands.playerHand) > 21) {
            this.lose();
        }
        else if (this.handVal(this.hands.playerHand) == 21) {
            this.win();
        }
        if (this.handVal(this.hands.dealerHand) < this.handVal(this.hands.playerHand) || this.handVal(this.hands.dealerHand) < 11) {
            this.drawCardDealer();
            // Dealer has gone over 21 and the player has one the game. 
            if (this.handVal(this.hands.dealerHand) > 21) {
                this.win();
            }
        }
    }
    stand() {
        if (this.handVal(hands.dealerHand) < 17) {
            this.drawCardDealer();
            if (this.handVal(hands.dealerHand) > 21) {
                this.win();
            }
        }
    }

    fillDeck() {
        let val = 0;
        for (let i = 0; i < this.deck.length; i++) {
            this.deck[i] = (val % 13) + 1;
            val++;
        }

    }

    getRandomIndex(max) {
        return Math.floor(Math.random() * max);
    }

    drawCardPlayer() {
        let card = this.getRandomIndex(this.deck.length);
        console.log(this.deck.length);
        console.log(card);
        this.hands.playerHand.push(this.deck[card]);
        console.log(this.deck[card]);
        this.deck.splice(card, 1);

    }
    drawCardDealer() {
        let card = this.getRandomIndex(this.deck.length);
        this.hands.dealerHand.push(this.deck[card]);
        this.deck.splice(card, 1);
    }


    handVal(hand) {
        let val = 0;
        let numAces = 0;

        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];

            if (card > 10) {
                val += 10;
            } else if (card === 1) {
                numAces++;
                val += 11;
            } else {
                val += card;
            }
        }

        while (val > 21 && numAces > 0) {
            val -= 10;
            numAces--;
        }

        return val;
    }

    betchips(bet) {
        this.betamount = bet;
    }

}



async function getTargetLongLat(add) {
    // Get the desired location the user wants to reach from the input
    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests This page details how to convert
    // a given adress to lat and long

    // const geocoder = google.maps.Geocoder;

    const targetLocation = await geocodeAddress(add);
    targetLat = targetLocation.lat();
    targetLong = targetLocation.long();

    // geocoder.geocode({address: add}, function (results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         targetLat = results[0].geometry.location.lat();
    //         targetLong = results[0].geometry.location.lng();
    //     }
    //     else {
    //         console.log("Something has gone horribly wrong with getting the target destination of our path. Status: " + status);
    //     }
    // })
    // calls to get directions need to be made through a lat long object from google. However when we call the geocahing api
    // It will give us a latlongobject we can use.
}
async function getOriginLongLat(add) {
    // const geocoder = google.maps.Geocoder;

    // geocoder.geocode({address: add}, function(result, status){
    //     if(status == google.maps.GeocoderStatus.OK){
    //         originLong = result[0].geometry.location.lng();
    //         originLat = result[0].geometry.location.lat();
    //     }
    //     else{
    //         console.log("Something has gone horrible wrong with getting the origin of path. Status: " + status);
    //     }
    // })

    const originLocation = await geocodeAddress(add);
    originLat = originLocation.lat();
    originLong = originLocation.long();


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

    modifyLongLat() {
        if (missPercentage <= 0) {
            // If tthey fail spectacularly ima send them to point nemo in the middle of the pacific ocean. Most isolated place
            // in the world; 48°52.6′S 123°23.6′W long lat for point nemo.
            targetLat = -26.74561;
            targetLong = -12.058595;
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
        if (Math.floor(Math.random() * 2) == 0) {
            targetLong += 4 * (missPercentage);
        } else {
            targetLong -= 4 * (missPercentage);
        }

        // Now handling the modification of latitudes
        if (Math.floor(Math.random() * 2) == 0) {
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
    ctx.fillStyle = "#1d8a1eff";
    ctx.rect(0, 0.7 * canvas.height, 0.2 * canvas.width, 0.15 * canvas.height);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#9c1818ff";
    ctx.rect(0, 0.85 * canvas.height, 0.2 * canvas.width, 0.15 * canvas.height);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText("HIT", 0.025 * canvas.width, 0.8 * canvas.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText("STAND", 0.025 * canvas.width, 0.9 * canvas.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText("Chips: " + chips, 0.025 * canvas.width, 0.05 * canvas.height);
    ctx.fillText("Bet: " + betamount, 0.025 * canvas.width, 0.11 * canvas.height);
    ctx.closePath();

}

function drawhand(hand) {
    let w = 0.225 * canvas.width;
    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.rect(w, 0.75 * canvas.height, 0.1 * canvas.width, 0.2 * canvas.height);
    ctx.fill();
    ctx.closePath();

    w += 0.025 * canvas.width;
    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText(hand.playerHand[0], w, 0.85 * canvas.height);
    ctx.closePath();

    w += 0.1 * canvas.width;

    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.rect(w, 0.75 * canvas.height, 0.1 * canvas.width, 0.2 * canvas.height);
    ctx.fill();
    ctx.closePath();

    w += 0.025 * canvas.width;

    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText(hand.playerHand[1], w, 0.85 * canvas.height);
    ctx.closePath();
}

let firstdraw = true;
let stand = false;

// Drawing the dealers hand onto the canvas
function drawdealerand(hand) {
    ctx.beginPath();
    ctx.fillStyle = "#28262C";
    ctx.rect(0.25 * canvas.width, 0.1 * canvas.height, 0.5 * canvas.width, 0.3 * canvas.height);
    ctx.fill();
    ctx.closePath();

    let w = 0.275 * canvas.width;
    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.rect(w, 0.15 * canvas.height, 0.1 * canvas.width, 0.2 * canvas.height);
    ctx.fill();
    ctx.closePath();

    w += 0.025 * canvas.width;
    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText(hand.dealerHand[0], w, 0.25 * canvas.height);
    ctx.closePath();

    w += 0.1 * canvas.width;

    ctx.beginPath();
    ctx.fillStyle = "#F9F5FF";
    ctx.rect(w, 0.15 * canvas.height, 0.1 * canvas.width, 0.2 * canvas.height);
    ctx.fill();
    ctx.closePath();

    w += 0.025 * canvas.width;

    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    if (firstdraw && !stand && !gameover) {
        ctx.fillText("?", w, 0.25 * canvas.height);
    } else {
        ctx.fillText(hand.dealerHand[1], w, 0.25 * canvas.height);
    }
    ctx.closePath();
}

function drawtotals(game) {
    game.hands.playerValue = game.handVal(game.hands.playerHand);
    game.hands.dealerValue = game.handVal(game.hands.dealerHand);

    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";

    if (!stand) {
        ctx.fillText("Dealer Total: " + game.hands.dealerHand[0] + " + ?", 0.25 * canvas.width, 0.45 * canvas.height);
        firstdraw = false;
    } else {
        ctx.fillText("Dealer: " + game.hands.dealerValue, 0.3 * canvas.width, 0.45 * canvas.height);
    }
    ctx.closePath();


    ctx.beginPath();
    ctx.fillStyle = "#14248A";
    ctx.textBaseline = "middle";
    ctx.font = "5dvh Arial";
    ctx.fillText("Player: " + game.hands.playerValue, 0.225 * canvas.width, 0.65 * canvas.height);
    ctx.closePath();
}


let gameover = false;
let betamount;
document.getElementById("playbtn").addEventListener("click", function () {

    betamount = parseInt(document.getElementById("bet").value, 10);
    if (betamount <= 0 || betamount == undefined || betamount == NaN) {
        alert("Please provide a amount of chips you're willing to wager.");
        return;
    }
    drawboard();

    let address = document.getElementById("address").value;
    let origin = document.getElementById("startaddress").value;
    if (typeof game != BlackJack) {
        game = new BlackJack();
    }

    game.play();

    game.drawCardPlayer();
    game.drawCardPlayer();
    game.drawCardDealer();
    game.drawCardDealer();

    drawhand(game.hands);
    drawdealerand(game.hands);
    drawtotals(game);

    canvas.addEventListener("click", function () {
        gameover = false;
        firstdraw = true;
        stand = false;

        const hitBtnX = 0;
        const hitBtnY = 0.7 * canvas.height;
        const hitBtnWidth = 0.2 * canvas.width;
        const hitBtnHeight = 0.15 * canvas.height;

        const standBtnX = 0;
        const standBtnY = 0.85 * canvas.height;
        const standBtnWidth = 0.2 * canvas.width;
        const standBtnHeight = 0.15 * canvas.height;


        if (
            mouseX >= hitBtnX &&
            mouseX <= hitBtnX + hitBtnWidth &&
            mouseY >= hitBtnY &&
            mouseY <= hitBtnY + hitBtnHeight
        ) {
            if (game && !gameover) {
                if (game.hands.playerValue > 21) {
                    gameover = true;
                    stand = true;

                    drawboard();
                    drawhand(game.hands);
                    drawdealerand(game.hands);
                    drawtotals(game);
                }
                else {
                    game.hit();
                    drawboard();
                    drawhand(game.hands);
                    drawdealerand(game.hands);
                    drawtotals(game);
                }
            }
        }

        // Check if STAND was clicked
        if (
            mouseX >= standBtnX &&
            mouseX <= standBtnX + standBtnWidth &&
            mouseY >= standBtnY &&
            mouseY <= standBtnY + standBtnHeight
        ) {
            stand = true;
            while (!gameover && game.hands.dealerValue < 17) {
                game.stand();
                drawboard();
                drawhand(game.hands);
                drawdealerand(game.hands);
                drawtotals(game);
            }
        }

    });

    // Getting long lat values for the starting point and end point of our directions
    getTargetLongLat(address);
    getOriginLongLat(origin);


    // targetLocation = geocodeAddress(address);
    // originLocation = geocodeAddress(origin);


});

