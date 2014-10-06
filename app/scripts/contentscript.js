'use strict';
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
 * Initializes the add to comparison DOM element, with the necessary event
 * handlers attached.
 *
 * @return {Element}
 */

function initAddToComparisonButton() {
  function handleClick(evt) {
    evt.stopPropagation();
    console.log('Compare all things!');
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
 * Initializes the comparison window DOM element and returns it.
 *
 * @return {Element}
 */

function initComparisonWindow() {
  var comparisonWindow = document.getElementById('chrome-airbnb-compare');
  if(!comparisonWindow) {
    comparisonWindow = document.createElement('div');
  }

  comparisonWindow.id = 'comparison-window';
  comparisonWindow.style.display = 'none';

  // TODO - REMOVE STUBBED ENTRIES FROM THE COMPARISON WINDOW:
  comparisonWindow.innerHTML =
    '<ul>'+
    '<li>San Juan, near Beach, Ashford Ave</li>'+
    '<li>Bla bla bla bla</li>'+
    '<li>Something that should be here</li>'+
    '<li>Stuff I need to unstub</li>'+
    '</ul>';

  return comparisonWindow;
}

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
  var comparisonWindow = initComparisonWindow();
  var expandComparisonWindow = initExpandComparisonWindowButton(comparisonWindow);
  document.body.appendChild(comparisonWindow);
  document.body.appendChild(expandComparisonWindow);

  // Get or create the "add to comparison button":
  var bookItDiv = document.getElementById('book_it');
  var addToComparison = initAddToComparisonButton();
  var addToWishListWrapper = find(bookItDiv.children, function(el) {
    return el.className === 'wishlist-wrapper';
  });

  addToWishListWrapper.appendChild(addToComparison);
  return addToComparison;
}
initAirbnbCompare();
