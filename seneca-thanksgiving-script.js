const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const playButton = document.getElementById("play");
const gameWrap = document.getElementById("gamewrapper");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
//const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items array
const items = [
    {name: "All of the People", clan: "Ha’deyögwe’dage:h", image: "overpopulation.gif", audio: "Bear - SenecaClan.mp4"},
    {name: "Our Mother Earth", clan: "Etinö’ëh Yöëdzade’", image: "earth.gif", audio: "Deer - SenecaClan.mp3"},
    {name: "Water", clan: "Oneganos", image: "rain-water.gif", audio: "Wolf - SenecaClan.mp3"},
    {name: "All the Grasses", clan: "Ha’deyogeo’dza:ge:h", image: "grass.gif", audio: "Turtle - SenecaClan.mp3"},
    {name: "All the Medicines", clan: "Ha’deyonöhgwa’shä:ge:h", image: "sprout.gif", audio: "Beaver - SenecaClan.mp3"},
    {name: "All the Berries", clan: "Ha’deyojiyage:h", image: "berries.gif", audio: "Heron - SenecaClan.mp3"},
    {name: "Strawberry", clan: "Ojisdöda’shä’", image: "strawberry.gif", audio: "Snipe - SenecaClan.mp3"},
    {name: "Forest", clan: "Gahadayë’", image: "environment.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Maple", clan: "Wahda’", image: "maple-leaf.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "All the Animals", clan: "Ha’deganyo’dage:h", image: "footprint.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "All of the Birds", clan: "Ha’degaji’dage:h", image: "bird.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Our Life Sustainers (3 Sisters)", clan: "Jöhehgöh", image: "vegetables.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Wind", clan: "Deyäwë:nye:h", image: "wind.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Our Grandparents Thunderers", clan: "Etihso:d Hadiwënodaje’s", image: "grandparents.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Our elder brother Daytime Orb", clan: "Sedwahji’ Ëde:ka:’ Gähgwa:’", image: "sun.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Our Grandmother Night time Orb", clan: "Etihso:d Söëka:’ Gähgwa:’", image: "moon.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Stars", clan: "Gajihsö’dëönyö’", image: "shooting-star.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Handsome Lake", clan: "Ganyodaiyo’", image: "teamwork.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Sky Dwellers", clan: "Hadiöya’ge:onö’", image: "data.gif", audio: "Hawk - SenecaClan.mp3"},
    {name: "Our Creator", clan: "Sögwajëno’kda’öh", image: "eco-earth.gif", audio: "Hawk - SenecaClan.mp3"},
];

// Items array
// const wampum = [
    // {name: "wampum", image: "wampumsmaller.png"},
// ];

// Initial Time
let seconds = 0,
    minutes = 0;

// For Timer
const timeGenerator = () => {
    seconds += 1;
    // Minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    // Format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};


// Initial Moves & Win Count
let movesCount = 0,
    winCount = 0;

// Calculate moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

// Pick random objects from item array
const generateRandom = (size = 4) => {
    // Temporary array
    let tempArray = [...items];
    // Initializes cardValues array
    let cardValues = [];
    // Size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    // Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // Once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    // Simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
            Create Cards
            before => front side (contains question mark)
            after => back side (contains actual image)
            data-card-value is a custom attribute which stores the names of the cards to match later
        */
        gameContainer.innerHTML += `
            <div class="card-container container-fluid" data-card-value="${cardValues[i].name}" data-audio-value="${cardValues[i].audio}">
                <div class="card-before container-fluid"></div>
                <div class="card card-after text-center container-fluid">
                    <div class"card container-fluid">
                        <p class="card-title cardtext">${cardValues[i].clan}</p>
                        <img src="${cardValues[i].image}" class="container-fluid">
                        <p class="card-title cardtext">${cardValues[i].name}</p>
                    </div>
                </div>
            </div>`;
    }

    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // If selected card is not matched yet, then only run (ie only matched card when clicked, would be ignored)
            // BUG FIX LINE 108 ADDED: && !card.classList.contains("flipped")
            if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
                // Flip the clicked card
                card.classList.add("flipped");
                // If it is the firstcard (!firstCard because first card will initially false)
                if (!firstCard) {
                    // So current card will become firstCard
                    firstCard = card;
                    // Current cards value becomes fisrtCardValue
                    firstCardValue = card.getAttribute("data-card-value");
                    // play audio of word from data-audio-value --> which is basically cardValues[i].audio --> which is items[0].audio
                    let cardaudio = card.getAttribute("data-audio-value");
                    let sound = new Audio(cardaudio);
                    sound.play();
                }
                else {
                    // Increment moves since user selected second card
                    movesCounter();
                    // secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    // play audio of word from data-audio-value --> which is basically cardValues[i].audio --> which is items[0].audio
                    let cardaudio = card.getAttribute("data-audio-value");
                    let sound = new Audio(cardaudio);
                    sound.play();

                    if (firstCardValue == secondCardValue) {
                        // If both cards match add matched class so these cards would be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        // Set firstCard to falsesince next card will be first now
                        firstCard = false;
                        // winCount increment as user found a correct match
                        winCount += 1;
                        // Check if winCount == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<p class="resulttext">You Won!</p> <p class="resulttext">Moves: ${movesCount}!</p>`;
                            stopGame();
                        }
                    }
                    else {
                        // If the cards do not match
                        // Flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 1800);
                    }
                }
            }
        });
    });
};


// Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    // Controls and button visibility
    gameWrap.classList.remove("hide");
    //stopButton.classList.remove("hide");
    //playButton.classList.remove("hide");
    //startButton.classList.add("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    // initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
    initializer();
});

// Stop game
stopButton.addEventListener("click", (stopGame = () => {
    //controls.classList.remove("hide");
    // stopButton.classList.add("hide"); 
    // playButton.classList.remove("hide");
    // startButton.classList.remove("hide");
    clearInterval(interval);
    })
);



// Initialize values and function calls
const initializer = () => {
    result.innerText = "";
    wincount = 0;
    let cardValues = generateRandom();
    // Removed: console.log(cardValues);
    matrixGenerator(cardValues);
};