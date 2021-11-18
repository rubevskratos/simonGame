var gameIsOn = false;
var soundsStatus = true;


//Classic Simon Board Game with extra dificulty based on a totally different sequence every time.
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


//Versus edition!
function SimonVersus() {
    //This game will start with a sequence of 1 introduced by player 1, which player 2 need to respond in the same way.
    //If success, then it's player 2's turn to introduce the lvl 1 sequence. And for player 1 to answer. 
    //if Both succeed, then level will increase by 1 and both players will need to correctly answer his opponent's sequence until one of them fail.
    var self = this;
    var level = 1;
    var playerTurn = false; //false - Player 1, true - Player 2
    var bothPlayed = false;
    var sequence = [];
    var countUserInput = 0;
    var buttons = document.getElementsByClassName('color');
    var counter = document.getElementById('counter')
    var thisTurn;
    
    this.resetCounters = function() {
        sequence = [];
        countUserInput = 0;
        console.log(sequence);
        console.log(countUserInput);
    }
    
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

    this.getPlayerSequence = function() {
        //Get the sequence.
        sequence.push(this.getAttribute('id'));

        if(soundsStatus === true) 
         self.playSound(this.getAttribute('id'))

        //Finalizes the Sequence when it's equally large than current level, and shows alternate player turn.
        if (sequence.length === level) {
            playerTurn = !playerTurn;
            thisTurn = playerTurn === true ? 2 : 1;
            counter.innerHTML = `<p>Player ${thisTurn} Answer.<br>Level ${level}</p>`
            //Clears listeners and enables new listener on user output.
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].removeEventListener('click',self.getPlayerSequence);
                buttons[i].addEventListener('click',self.checkPlayerAnswer)
            }
        } 
    }

    this.checkPlayerAnswer = function() {
        if(soundsStatus === true) 
            self.playSound(this.getAttribute('id'))

        if (this.getAttribute('id') !== sequence[countUserInput]) {
            self.gameIsOver();
            return;
        }

        countUserInput++;

        if (countUserInput === sequence.length) {
            if (bothPlayed === false) {
                self.nextStage();
            } else {
                level++;
                thisTurn = 1;
                self.nextStage();
            }
        }
    }

    this.nextStage = function() {
        //              Clears sequence and counters.
        self.resetCounters();
        //              finalizes sequence check.
        playerTurn = !playerTurn;
        //              Alternate user turn.
        counter.innerHTML = `<p>Player ${thisTurn} Turn.<br>Level ${level}</p>`

        bothPlayed = !bothPlayed;
        //              Clears listeners and enables new listener for user input.
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].removeEventListener('click',self.checkPlayerAnswer);
            buttons[i].addEventListener('click',self.getPlayerSequence);
        }
    }
    
    this.init = function() {
        //Shows First Player Turn Text.
        counter.innerHTML = `<p>Player 1 Turn.<br>Level 1</p>`
        
        if(soundsStatus === true) 
            this.playSound('intro')
        //Initializes buttons to listen to Player Input.

        for (var i = 0; i < buttons.length; i++)
            buttons[i].addEventListener('click',self.getPlayerSequence)
    }

    this.showGameOver = function() {
        let board = document.getElementById('board')
        
        let gameOver = document.createElement('div')
        gameOver.setAttribute('id', 'gameOver');
        gameOver.innerHTML = '<h1>GAME OVER!</h1>'
        board.appendChild(gameOver);
    }

    this.gameIsOver = function() {
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

function versusStart() {
    let versusInstructions = '<p>This versus game is for 2 players. Each level starts with Player 1 creating a sequence the same length as the level (1 at level 1, 2 at level 2...). Then it\'s Player 2\'s turn to recreate the same pattern. If they succeed, roles are changed, and now it\'s Player 2 who initiates the sequence and Player 1 who needs to recreate the pattern. If both succeed, the level increases, and so the length of the pattern. The game continues until one of the players does not succeed.</p>'

    let counter = document.getElementById('counter');
    counter.style.fontSize = '25px';
    counter.style.lineHeight = 'inherit';

    if (gameIsOn == false) {
        gameIsOn = true;
        var game = new SimonVersus();
        game.init();
        let instructions = document.getElementById('instructions');
        instructions.innerHTML = versusInstructions;
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

//Start button, starts new game
let versus = document.getElementById('versus')
versus.addEventListener('click',versusStart)

//Sounds button changes appearance and sets variable soundsStatus true or false.
let soundButton = document.getElementById('noSounds');
soundButton.addEventListener('click',setSounds)
