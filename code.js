// canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

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
    mouseX = event.pageX - canvasBox.left;
    mouseY = event.pageY - canvasBox.top;

    mouseX = mouseX * (canvas.width / canvasBox.width);
    mouseY = mouseY * (canvas.height / canvasBox.height);
}
document.body.addEventListener("mousemove", updateMouseCoordinates);

// google maps function
function myMap() {
var mapProp= {
  center:new google.maps.LatLng(51.508742,-0.120850),
  zoom:5,
};
var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}


// function startGame() {
//     updateGame();
//     window.requestAnimationFrame(drawGame);
// }

// function updateGame() {


//     window.setTimeout(updateGame, 50);
// }

// function drawGame() {
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     window.requestAnimationFrame(drawGame);
// }

class hands {
    constructor() {
        this.playerValue = 0;
        this.dealerValue = 0;
        this.playerHand = new Array();
        this.dealerHand = new Array();
    
    }
};

let chips = 1000;

class BlackJack{ 
    constructor() {
        this.deck = new Array(52);
        this.hands = new hands();
        this.betamount = 100;
    }

    play(){
        this.fillDeck();
        // Get the users betamount
        this.hands = new hands();
    }

    hit(){
        this.drawCardPlayer();
        if(this.handVal(hands.playerHand) > 21){
            chips -= this.betamount;
        }
        if(this.handVal(hands.dealerHand) < this.handVal(hands.playerHand) || this.handVal(hands.dealerHand) < 11){
            this.drawCardDealer();
            // Dealer has gone over 21 and the player has one the game. 
            if(this.handVal(hands.dealerHand) > 21){
                chips += this.betamount;
            }
        }
    }
    stand(){
        if(this.handVal(hands.dealerHand) < this.handVal(hands.playerHand) || this.handVal(hands.dealerHand) < 11){
            this.drawCardDealer();
            if(this.handVal(hands.dealerHand) > 21){
                chips += this.betamount;
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
        this.deck.splice(card,1);
    }

    
    handVal (hand) {
      let val = 0;
      
      for (let i = 0; i < hand.length; i++) {
        let cardval = 0;
        if (hand[i] > 10) {
            cardval = 10;
        }
        else{
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
let long;
let lat;


function getLongLat(address){
    // Get the desired location the user wants to reach from the input
    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests This page details how to convert
    // a given adress to lat and long

    const geocoder = google.maps.Geocoder;

    geocoder.geocode({ 'address': address}, function(results,status){ 
        if(status == google.maps.GeocoderStatus.OK){
            lat = results[0].geometry.location.lat();
            long = results[0].geometry.location.long();
        }
        else{
            console.log("Something has gone horribly horribly wrong.");
        }
    } )
    // calls to get directions need to be made through a lat long object from google. However when we call the geocahing api
    // It will give us a latlongobject we can use.
}

class Offset{
    constructor(){
        let target = 2000;
        let missPercentage = 100.0;

        this.generateOffset();
        this.modifyLongLat();

    }

    generateOffset(){
        if(chips < target){
            missPercentage = chips/target;
        }
    }

    modifyLongLat(){
        if(missPercentage == 0){
            // If they fail spectacularly ima send them to point nemo in the middle of the pacific ocean. Most isolated place
            // in the world; 48°52.6′S 123°23.6′W long lat for point nemo.
            return;
        }
        if(missPercentage == 100.0){
            //If they get a perfect score ima send em to rome: 41°53'48.6"N 12°28'33.9"E 
        }
        // Modifying longitude. 0 means modifyinf east, 1 means modifying west
        // Longitude goes up as you go more east and down as you go more west
        if(Math.floor(Math.random * 2) == 0){
            long += 1 * (missPercentage);
        }else{
            long -= 1 * (missPercentage);
        }

        // Now handling the modification of latitudes

        if(Math.floor(Math.random * 2) == 0){
            lat += 1 * (missPercentage);
        }else{
            lat += 1 * (missPercentage);
        }

        
        
        // Latitude goes up as you go more north and down as you go more south


    }

}

let game;

document.getElementById("playbtn").addEventListener("click", function() {
    let address = document.getElementById("address");
    if(typeof game != BlackJack){
        game = new BlackJack();
    }
    game.play();
    getLongLat(address);
});