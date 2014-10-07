'use strict';
var airbnbScrapper = require('airbnb-scrapper');
var $ = require('jquery');
/**
 * Finds the first element for which a predicate function returns a truthy value
 * for in an array.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Mixed} The found element or `undefined` if the predicate didn't
 * return a truthy value for any element
 */

function find(arr, fn) {
  for(var i = 0, len = arr.length; i < len; i++) {
    if(fn(arr[i])) {
      return arr[i];
    }
  }
}

/**
 * Iterates a function `fn` over a collection `coll`.
 *
 * @param {{Array|Object}} coll
 * @param {Function} fn
 */

function each(coll, fn) {
  var keys = Object.keys(coll);
  for(var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    fn(coll[key], key);
  }
}

/**
 * Loads a comparison list from local storage, parses it and returns it. If no
 * `airbnb-comparison-list` key exists in local storage, will return an empty
 * list.
 *
 * @return {Array}
 */

function loadComparison() {
  var clist = localStorage.getItem('airbnb-comparison-list');

  if(clist) {
    return JSON.parse(clist);
  }

  return [];
}

/**
 * Saves the current state of the comparison list to local storage.
 *
 * @param {Array} clist
 */

function saveComparison(clist) {
  localStorage.setItem('airbnb-comparison-list', JSON.stringify(clist));
}

/**
 * Gets or creates an element `elType` with id `id`.
 *
 * @param {String} elType
 * @param {String} id
 * @return {Element}
 */

function getOrCreateElement(elType, id) {
  var el = document.getElementById(id);

  if(!el) {
    el = document.createElement(elType);
    el.id = id;
  }

  return el;
}

/**
 * Initializes the add to comparison DOM element, with the necessary event
 * handlers attached.
 *
 * @param {Element} comparisonList The `ul` tag containing compared elements
 * @return {Element}
 */

function initAddToComparisonButton(comparisonList, storedItems) {
  function handleClick(evt) {
    evt.stopPropagation();
    var currentPosting = airbnbScrapper.extractInfo($);
    comparisonList.appendChild(initComparisonListItem(currentPosting));

    storedItems.push(currentPosting);
    saveComparison(storedItems);
  }

  var addToComparison = getOrCreateElement('div', 'add-to-comparison');
  addToComparison.className = 'btn btn-block btn-large';
  addToComparison.innerHTML = 'Add to comparison';
  addToComparison.addEventListener('click', handleClick, true);
  addToComparison.style.marginBottom = '10px';

  return addToComparison;
}

/**
 * Initializes a new comparison list item node based on an information object.
 *
 * @param {Object} info
 * @return {Element}
 */

function initComparisonListItem(info) {
  // <li>
  //   <div class="comparison-item-wrapper">
  //     <h3>{{title}}</h3>
  //     <table>...</table>
  //   </div>
  // </li>
  var li = document.createElement('li');
  var innerWrapper = document.createElement('div');
  var header = document.createElement('h3');
  var table = document.createElement('table');

  li.appendChild(innerWrapper);
  innerWrapper.className = 'comparison-item-wrapper';

  innerWrapper.appendChild(header);
  header.innerHTML = info.title;

  innerWrapper.appendChild(table);
  each(info, function(value, key) {
    var tr = document.createElement('tr');
    var keyTd = document.createElement('td');
    var valueTd = document.createElement('td');

    keyTd.innerHTML = key;
    valueTd.innerHTML = value;

    tr.appendChild(keyTd);
    tr.appendChild(valueTd);
    table.appendChild(tr);
  });

  return li;
}

/**
 * Initializes the comparison window DOM element and returns it.
 *
 * @param {Element} comparisonList
 * @param {Array} storedItems
 * @return {Element}
 */

function initComparisonWindow(comparisonList, storedItems) {
  each(storedItems, function(item) {
    comparisonList.appendChild(initComparisonListItem(item));
  });

  var comparisonWindow = getOrCreateElement('div', 'comparison-window');

  comparisonWindow.style.display = 'none';
  comparisonWindow.appendChild(comparisonList);

  var explanationText = document.createElement('p');
  explanationText.className = 'comparison-tip';
  explanationText.innerHTML =
    'Add items to the comparison by clicking "Add to Comparison" at the right';

  comparisonWindow.appendChild(explanationText);
  return comparisonWindow;
}

/**
 * Initializes a expand/colapse comparison list button and returns it.
 *
 * @param {Element} comparisonWindow
 * @return {Element}
 */

function initExpandComparisonWindowButton(comparisonWindow) {
  function handleClick() {
    var currDisplay = comparisonWindow.style.display;
    comparisonWindow.style.display = currDisplay === 'none' ? 'block' :
                                                                'none';
  }

  var expandComparisonWindow = getOrCreateElement('div', 'expand-comparison-window');
  expandComparisonWindow.className = 'btn btn-block btn-large';
  expandComparisonWindow.innerHTML = 'See compared postings';
  expandComparisonWindow.addEventListener('click', handleClick);

  return expandComparisonWindow;
}

/**
 * Initializes the comparison plugin and adds it to DOM.
 */

function initAirbnbCompare() {
  // Get comparison items saved to the local storage:
  var storedItems = loadComparison();

  // Get or create the comparison window:
  var comparisonList = document.createElement('ul');
  var comparisonWindow = initComparisonWindow(comparisonList, storedItems);
  var expandComparisonWindow = initExpandComparisonWindowButton(comparisonWindow);
  document.body.appendChild(comparisonWindow);
  document.body.appendChild(expandComparisonWindow);

  // Get or create the "add to comparison button":
  var bookItDiv = document.getElementById('book_it');
  var addToComparison = initAddToComparisonButton(comparisonList, storedItems);
  var addToWishListWrapper = find(bookItDiv.children, function(el) {
    return el.className === 'wishlist-wrapper';
  });

  addToWishListWrapper.appendChild(addToComparison);
  return addToComparison;
}

initAirbnbCompare();

