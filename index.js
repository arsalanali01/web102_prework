/*****************************************************************************
 * Challenge 2: Review the provided code.
 * -> Imports data from games.js
 * -> Defines a helper to delete all child elements from a parent element
 *****************************************************************************/

// import the JSON data about the crowd funded games from the games.js file
// NOTE: index.html must load this with: <script type="module" src="index.js"></script>
import GAMES_DATA from './games.js';   // default export is a JSON *string*
const GAMES_JSON = JSON.parse(GAMES_DATA); // turn JSON string into an array of objects

console.log('Loaded games:', GAMES_JSON.length); // should log 11

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Shared references
 *****************************************************************************/

// grab the element that will hold all game cards
const gamesContainer = document.getElementById('games-container');

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills: DOM manipulation, for loops, template literals, functions
 *****************************************************************************/

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // clear before rendering (useful when filtering)
  gamesContainer.innerHTML = '';

  // loop over each game and create a card
  for (const game of games) {
    // create a new div element, which will become the game card
    const card = document.createElement('div');

    // add the class game-card to the list
    card.classList.add('game-card');

    // set the inner HTML using a template literal to display some info about each game
    // TIP: ensure there’s a space before "/>" in the <img> tag for some HTML parsers
    card.innerHTML = `
      <img class="game-img" src="${game.img}" alt="${game.name} cover" />
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <p><strong>Pledged:</strong> $${Number(game.pledged).toLocaleString('en-US')}</p>
      <p><strong>Goal:</strong> $${Number(game.goal).toLocaleString('en-US')}</p>
      <p><strong>Backers:</strong> ${Number(game.backers).toLocaleString('en-US')}</p>
    `;

    // append the game to the games-container
    gamesContainer.appendChild(card);
  }
}

// initial render of all games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying:
 * total number of contributions, amount donated, and number of games on the site.
 * Skills: arrow functions, reduce, template literals
 *************************************************************************************/

// grab the contributions card element
const contributionsCard = document.getElementById('num-contributions');

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => acc + Number(game.backers), 0);

// set the inner text formatted with commas
contributionsCard.innerText = totalContributions.toLocaleString('en-US');

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById('total-raised');
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + Number(game.pledged), 0);

// set inner text with a dollar sign + commas
raisedCard.innerText = `$${totalRaised.toLocaleString('en-US')}`;

// grab number of games card and set its inner text
const gamesCard = document.getElementById('num-games');
gamesCard.innerText = GAMES_JSON.length.toLocaleString('en-US');

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * Skills: functions, filter
 *************************************************************************************/

// button elements
const unfundedBtn = document.getElementById('unfunded-btn');
const fundedBtn   = document.getElementById('funded-btn');
const allBtn      = document.getElementById('all-btn');

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // get games where pledged < goal
  const unfunded = GAMES_JSON.filter(g => Number(g.pledged) < Number(g.goal));

  // render
  addGamesToPage(unfunded);
  console.log('unfunded count:', unfunded.length); // expect 7
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // get games where pledged >= goal
  const funded = GAMES_JSON.filter(g => Number(g.pledged) >= Number(g.goal));

  // render
  addGamesToPage(funded);
  console.log('funded count:', funded.length); // expect 4
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);
  addGamesToPage(GAMES_JSON);
  console.log('all count:', GAMES_JSON.length); // expect 11
}

// wire up the events
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click',   filterFundedOnly);
allBtn.addEventListener('click',      showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills: template literals, ternary operator
 *************************************************************************************/

// grab the description container
const descriptionContainer = document.getElementById('description-container');

// Step 1 — count unfunded games
const unfundedCount = GAMES_JSON.filter(g => Number(g.pledged) < Number(g.goal)).length;

// Step 2 — summary line with proper commas + ternary grammar
const summary = `
  A total of $${totalRaised.toLocaleString('en-US')} has been raised for
  ${GAMES_JSON.length.toLocaleString('en-US')} games. 
  Currently, ${unfundedCount} ${unfundedCount === 1 ? 'game remains' : 'games remain'} unfunded.
  We need your help to fund these amazing games!
`.trim();

// Step 3 — append to the page
const p = document.createElement('p');
p.textContent = summary;
descriptionContainer.appendChild(p);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills: spread operator, destructuring, template literals, sort
 ************************************************************************************/

// grab the containers
const firstGameContainer  = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// 1) Sort a *copy* of the games by pledged (descending) so we don't mutate GAMES_JSON
const sortedGames = [...GAMES_JSON].sort(
  (a, b) => Number(b.pledged) - Number(a.pledged)
);

// 2) Destructure the top two from the sorted list (rest holds the remaining games)
const [topGame, secondGame, ...rest] = sortedGames;

// 3) Clear the containers (in case this code re-runs)
firstGameContainer.innerHTML = "";
secondGameContainer.innerHTML = "";

// 4) Create & append the top funded game's element
const topEl = document.createElement("p");
topEl.textContent = topGame.name; // e.g., "Zoo Tycoon: The Board Game"
firstGameContainer.appendChild(topEl);

// 5) Create & append the second most funded game's element
const secondEl = document.createElement("p");
secondEl.textContent = secondGame.name; // e.g., "How to Read Minds 2 Kit: Ellusionist x Peter Turner"
secondGameContainer.appendChild(secondEl);

// (Optional) Log to verify
console.log("Top funded:", topGame?.name, "Runner up:", secondGame?.name);