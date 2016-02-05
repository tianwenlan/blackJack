var dealerHand = new Array();
var playerHand = new Array();
var currentMoney = 50;
var betMoney = 10;
var gameOver = false;

// Constructor for Card objects
function Card(num,suit){
   this.num = num;
   this.suit = suit;
   this.pname = pname;
}

// The function pname() makes a picture name for an image.
// The filenames are a concatenation of card number and suit
// Ace = 1 and King = 13
function pname(){
   return "img/" + this.num + "_of_" + this.suit + ".png";
}

// Constructor for Deck Object
function deck() {
   this.cards = new Array(52);
   this.nextCard = 0;
   // fill the deck (in order, for now)
   for (i=1; i<14; i++) {
     this.cards[i-1] = new Card(i,"spades");
     this.cards[i+12] = new Card(i,"hearts");
     this.cards[i+25] = new Card(i,"diamonds");
     this.cards[i+38] = new Card(i,"clubs");
   }
   this.shuffle = shuffle;
   this.dealCard = dealCard;
}

//Fisher-Yates Shuffle Algorithm
function shuffle(){
        var toSwap;
        var tempCard;
        for(var i = 52; i >0; i--){
                toSwap = Math.floor(Math.random()*i);
                tempCard = this.cards[i];
                this.cards[i] = this.cards[toSwap];
                this.cards[toSwap] = tempCard;
        }
        this.nextCard = 0;
}

function dealCard() {
   return this.cards[this.nextCard++];
}


var deck = new deck();
deck.shuffle();


function gameStart() {
        document.getElementById("currMoney").innerHTML = "$" + currentMoney;
        if(deck.nextCard > 39) {  // shuffle the deck if 75% of
                deck.shuffle();  // the cards have been used.
        }    
        dealerHand = new Array();
        playerHand = new Array();

        //Deal cards
        dealerHand[0] = deck.dealCard();  // This is the hole card.
        document.images[0].src = "img/back.jpg"; // The hole card is not shown
        dealerHand[1] = deck.dealCard();
        document.images[1].src = dealerHand[1].pname();
        for(var i = 2; i < 6; i++) {
                document.images[i].src = "img/empty.gif";
        }

        playerHand[0] = deck.dealCard();
        document.images[6].src = playerHand[0].pname();
        playerHand[1] = deck.dealCard();
        document.images[7].src = playerHand[1].pname();
        for (var i = 8; i < 12; i++) {
                document.images[i].src = "img/empty.gif";
        }
        
        var playerScore = score(playerHand);

        if(playerScore == 21){
                document.getElementById("gameResult").innerHTML = "Black Jack!";
                currentMoney += parseInt(betMoney);
                document.getElementById("currMoney").innerHTML = "$" + currentMoney;
                gameOver = true;
        }else{
                // Reset the form fields and the state variables
                window.status = "";
                document.form1.dealer.value = "";
                document.form1.gameResult.value = "";
                document.form1.player.value = "";
                gameOver = false;
        }
} // end function newGame()

function bet(){
        betMoney = document.getElementById("betValue").value;
}

function hit() {
        var total = 0;
        var newCard = 0;  // index for the new card position
        if (gameOver) {
                window.status = "Game over.  Click the New Game button to start a new hand."
        }else{
                newCard = playerHand.length;
                playerHand[newCard] = deck.dealCard();
                document.images[newCard + 6].src = playerHand[newCard].pname();
                total = score(playerHand);
                if (total > 21 ) {  // Busted, game over.
                        document.form1.player.value = total + "  busted";
                        document.images[0].src = dealerHand[0].pname(); // reveal the dealer hole card
                        document.form1.dealer.value = score(dealerHand);
                        checkWinner();
                        gameOver = true;
                }else{
                        document.form1.player.value = total;
                }
        }
} // end function hit()


function stand() {
        var total = 0;
        var newCard = 0;  // index for the new card position
        if(gameOver) {
                window.status = "Game over.  Click the New Game button to start a new hand."
        }else{
                document.images[0].src = dealerHand[0].pname(); // reveal the dealer hole card
                while (score(dealerHand) < 17) {  // Dealer stands on soft 17
                        newCard = dealerHand.length;
                        dealerHand[newCard] = deck.dealCard();
                        document.images[newCard].src = dealerHand[newCard].pname();
                }

                total = score(dealerHand);
                if (total > 21) {  // Busted
                        document.form1.dealer.value = total + "  busted";
                }else{
                        document.form1.dealer.value = total;
                }
        }    

        checkWinner();
        gameOver = true; // The game ends after the player stands.

} // end function stand()

function score(hand){
        var total = 0;
        var aceNum = 0; //this variable counts the number of aces in the hand
        var cardValue = 0; //the trump pictures on a card used to be called pips
        for(var i = 0; i < hand.length; i++){
                cardValue = hand[i].num;
                if(cardValue == 1){
                        aceNum = aceNum + 1;
                        total = total + 11;
                }else{
                        if(cardValue == 11 || cardValue == 12 || cardValue == 13){
                                cardValue = 10;
                        }
                        total += cardValue;
                }
        }

        while(aceNum > 0 && total > 21){ //count the aces as 1 instead of 11 if the total is over 21
                total = total - 10;
                aceNum = aceNum - 1;
        }

        return total;
}

function checkWinner(){
        var playerScore = score(playerHand);
        var dealerScore = score(dealerHand);
        if(playerScore > 21){ //busted
                document.getElementById("gameResult").innerHTML = "Black Jack!";
                currentMoney -= parseInt(betMoney);
        }else{
                if(dealerTotal > 21) { // Busted
                        document.getElementById("gameResult").innerHTML = "Dealer Win!!";
                        currentMoney += parseInt(betMoney);
                }else{
                        if(playerScore == dealerScore){
                                document.getElementById("gameResult").innerHTML = "Tie Game";
                        }else if(playerScore > dealerScore){
                                document.getElementById("gameResult").innerHTML = "You Win!!";
                                currentMoney += parseInt(betMoney);
                        }else if(playerScore < dealerScore){
                                document.getElementById("gameResult").innerHTML = "Dealer Win!!";
                                currentMoney -= parseInt(betMoney);
                        }
                }
        }
}

function reset(){
        var dealerHand = new Array();
        var playerHand = new Array();
        var currentMoney = 50;
        var betMoney = 10;
        var gameOver = false;
}