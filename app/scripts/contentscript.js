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
 * Initializes the add to comparison DOM element, with the necessary event
 * handlers attached.
 *
 * @param {Element} comparisonList The `ul` tag containing compared elements
 * @return {Element}
 */

function initAddToComparisonButton(comparisonList) {
  function handleClick(evt) {
    evt.stopPropagation();
    var currentPosting = airbnbScrapper.extractInfo($);
    comparisonList.appendChild(initComparisonListItem(currentPosting));
  }

  var addToComparison = document.getElementById('add-to-comparison');
  if(!addToComparison) {
    addToComparison = document.createElement('div');
  }

  addToComparison.id = 'add-to-comparison';
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
  var li = document.createElement('li');
  var header = document.createElement('h3');

  header.innerHTML = info.title;
  li.appendChild(header);

  each(info, function(value, key) {
    var text = document.createTextNode(key + ': ' + value);
    li.appendChild(text);
  });

  return li;
}

/**
 * Initializes the comparison window DOM element and returns it.
 *
 * @param {Element} comparisonList
 * @return {Element}
 */

function initComparisonWindow(comparisonList) {
  var comparisonWindow = document.getElementById('chrome-airbnb-compare');
  if(!comparisonWindow) {
    comparisonWindow = document.createElement('div');
  }

  comparisonWindow.id = 'comparison-window';
  comparisonWindow.style.display = 'none';
  comparisonWindow.appendChild(comparisonList);

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

  var expandComparisonWindow = document.getElementById('expand-comparison-window');
  if(!expandComparisonWindow) {
    expandComparisonWindow = document.createElement('div');
  }

  expandComparisonWindow.id = 'expand-comparison-window';
  expandComparisonWindow.className = 'btn btn-block btn-large';
  expandComparisonWindow.innerHTML = 'See compared postings';
  expandComparisonWindow.addEventListener('click', handleClick);

  return expandComparisonWindow;
}

/**
 * Initializes the comparison plugin and adds it to DOM.
 */

function initAirbnbCompare() {
  // Get or create the comparison window:
  var comparisonList = document.createElement('ul');
  var comparisonWindow = initComparisonWindow(comparisonList);
  var expandComparisonWindow = initExpandComparisonWindowButton(comparisonWindow);
  document.body.appendChild(comparisonWindow);
  document.body.appendChild(expandComparisonWindow);

  // Get or create the "add to comparison button":
  var bookItDiv = document.getElementById('book_it');
  var addToComparison = initAddToComparisonButton(comparisonWindow);
  var addToWishListWrapper = find(bookItDiv.children, function(el) {
    return el.className === 'wishlist-wrapper';
  });

  addToWishListWrapper.appendChild(addToComparison);
  return addToComparison;
}
initAirbnbCompare();
