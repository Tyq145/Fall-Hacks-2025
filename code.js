const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function adjustCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const observer = new ResizeObserver(adjustCanvasSize);
observer.observe(canvas);

adjustCanvasSize();


function startGame() {
    updateGame();
    window.requestAnimationFrame(drawGame);
}

function updateGame() {


    window.setTimeout(updateGame, 50);
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(drawGame);
}

class hands {
    constructor() {
        this.playerValue = 0;
        this.dealerValue = 0;
        this.playerHand = new Array();
        this.dealerHand = new Array();
    
    }
};

class BlackJack{ 
    constructor() {
        this.deck = new Array(52);
        this.hands = new hands();
        this.chips = 100;
    }

    hit(){
        this.drawCardPlayer();
        if(this.handVal(hands.playerHand) > 21){
            this.chips = 
        }
        if(this.handVal(hands.dealerHand) < this.handVal(hands.playerHand) || this.handVal(hands.dealerHand) < 11){
            this.drawCardDealer();
            if(this.hands)
        }
    }

    fillDeck() {
        let val = 0;
        for (let i = 0; i < this.deck.length(); i++) {
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
      
      for (let i = 0; i < hand.length(); i++) {
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
}

