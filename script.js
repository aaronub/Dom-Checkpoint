/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

//change html
function updateCoffeeView(coffeeQty) {
  // let coffee = document.getElementById('big_coffee');
  let coffeeCounter = document.getElementById('coffee_counter');
  // let cps = document.querySelector('#cps');
  coffeeCounter.innerText = coffeeQty;
  // your code here
}

// increment coofee count by 1 everytime invoke
function clickCoffee(data) {
  // your code here
  let coffeeCounter = document.getElementById('coffee_counter');
  data.coffee ++;
  coffeeCounter.innerText = data.coffee;
  // unlockProducers(data.producers, data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/
// (produces array, coffee count)
function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(elem => {
    if (coffeeCount >= (elem.price/2)) {
      elem.unlocked = true;
    }
  })
}
// return new array for unlocked producers
function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter(elem => elem.unlocked)
}

// for id to regular name
function makeDisplayNameFromId(id) {
  // your code here
  return id.split('_')
  .map(elem => elem[0].toUpperCase() + elem.slice(1))
  .join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
}

// change html:
// update current unlocked status, 
// reset produce container childNodes to empty
// if unlocked 'true', make it div, append to producer container
// test specs, childNodes[0].childNoes length is 5 !?!?!?!
function renderProducers(data) {
  // your code here
  let container = document.getElementById('producer_container');
  let producersArr = data.producers;
  // Because this is array, so this can mutate the original array
  // if primitive date, this not working
  unlockProducers(producersArr, data.coffee);
  let unLockedArr = producersArr.filter (elem => elem.unlocked);
  // why??????????????????
  deleteAllChildNodes(container);
  unLockedArr.forEach(elem => {
    container.appendChild(makeProducerDiv(elem))
  })
  
}

/**************
 *   SLICE 3
 **************/

//get producer object when given id 
function getProducerById(data, producerId) {
  // your code here
  let producersArr = data.producers
  return producersArr.filter(elem => elem.id === producerId)[0];
  
  
}

function canAffordProducer(data, producerId) {
  // your code here
  let coffees = data.coffee;
  let producersArr = data.producers
  let price = producersArr.filter(elem => elem.id === producerId)[0].price
  return coffees >= price;
}

//change html cps
function updateCPSView(cps) {
  // your code here
  let webCps = document.getElementById('cps');
  // innerHTML not working????????????????????????/
  webCps.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

// changing data object only: Given id, if can afford,  
// change data.coffee, datacps, producer price and producer qty
function attemptToBuyProducer(data, producerId) {
  // your code here
  let canAfford = canAffordProducer(data, producerId);
  // let producersArr = data.producers;
  if (canAfford) {
    //why also working????????????????????????????????????????????????????????
    // let producer = producersArr.filter(elem => elem.id === producerId)[0]
    // producer.qty ++;
    // data.coffee -= producer.price;
    // producer.price = updatePrice(producer.price);
    // data.totalCPS += producer.cps;
    data.producers.forEach(elem => {
      if(elem.id === producerId) {
        elem.qty ++;
        data.coffee -= elem.price;
        elem.price = updatePrice(elem.price);
        data.totalCPS += elem.cps;
      }
    })
  }
  // No need to return, right???????????????
  return canAfford;
}

function buyButtonClick(event, data) {
  // your code here
  if(event.target.tagName === 'BUTTON' ) {
    let name = event.target.id.slice(4);
    let canAfford = canAffordProducer(data, name);
    if(canAfford) {
      attemptToBuyProducer(data, name);
      let coffeeE = document.getElementById('coffee_counter');
      coffeeE.innerText = data.coffee;
      // Need to invoke render??????????????????
      renderProducers(data);
      let cps = document.getElementById('cps');
      cps.innerText = data.totalCPS;
    } else {
      window.alert("Not enough coffee!")
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
