var gameIsOn = false;
var soundsStatus = true;

function SimonGame() {
    //game variables
    var self = this;
    var level = 1;
    var countUserClick = 0;
    var sequenceCounter = 0;
    var sequence = [];
    var buttons;
    
    
    //game functions
    var sounds = {
        green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        yellow: new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
        intro: new Audio('media/sound/intro.mp3')
      };

    this.playSound = function(color) {
        var thisSound = color;
        
        sounds[thisSound].currentTime=0;
        sounds[thisSound].play();
      };
    
    this.resetCounters = function () {
        countUserClick=0;
        sequence=[];
        sequenceCounter=0;
    }

    this.addSequence = function () {
        for (var i = 0; i < level; i++) {
            sequence.push(buttons[Math.floor(Math.random() * 4)].getAttribute('id'));
        }
    }
    
    this.showSequence = function() {
        let counter = document.getElementById('counter');
        counter.innerText = level;

        let interval = setInterval(function () {
            let element = document.getElementById(sequence[sequenceCounter])
            element.classList.add('active')
            
            if(soundsStatus === true) 
                self.playSound(sequence[sequenceCounter])

            setTimeout(function () {
                element.classList.remove('active')
            }, 700)
            
            if (sequenceCounter === sequence.length - 1) {
                clearInterval(interval);
            } else {
                sequenceCounter++;
            }
        }, 1000)
    }
    
    this.checkUserInput = function () {
        let picked = this.getAttribute('id')
        let current = sequence[countUserClick]

        if (soundsStatus === true)
            self.playSound(picked);

         if(picked !== current) {
             self.gameIsOver();
             return;
         }

         countUserClick++;

        if (countUserClick === sequence.length) {
            level++;
            self.resetCounters();
            self.addSequence();
            self.showSequence();
        }
    }
    

    
    this.init = function () {
        buttons = document.getElementsByClassName('color');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", self.checkUserInput);
        }

        this.addSequence()
        
        if(soundsStatus === true) {
            this.playSound('intro')

            let wait = setTimeout(self.showSequence, 5000)
        } else {
            self.showSequence();
        }
        
    }
    
    
    this.showGameOver = function() {
        let board = document.getElementById('board')
        
        let gameOver = document.createElement('div')
        gameOver.setAttribute('id', 'gameOver');
        gameOver.innerHTML = '<h1>GAME OVER!</h1>'
        board.appendChild(gameOver);
    }
    
    this.gameIsOver = function () {
        this.showGameOver();
    }
}


//External functions for menu buttons (start, restart, sounds...)

function gameStart() {
    if (gameIsOn == false) {
        gameIsOn = true;
        var game = new SimonGame()
        game.init();
    }
}

function reload() {
    window.location.reload();
}

function setSounds() {
    soundsStatus = !soundsStatus;
    switch (soundsStatus) {
        case false:
            soundButton.classList.add('active');
            break;
        case true:
            soundButton.classList.remove('active');
            break;
    }
}

//Restart button reloads the page (restarts the game)
let restart = document.getElementById('restart');
restart.addEventListener('click', reload);

//Start button, starts new game
let start = document.getElementById('start')
start.addEventListener('click',gameStart)

//Sounds button changes appearance and sets variable soundsStatus true or false.
let soundButton = document.getElementById('noSounds');
soundButton.addEventListener('click',setSounds)