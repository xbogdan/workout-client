'use strict';

/**
 * Search overlay
 */
(function() {
  var searchOverlay = function(options) {
    this.values = [];
    this.secList = [];
    this.selectedValue = null;
    this.finishCallback = null;

    if (options.values && typeof options.values === 'object') {
      this.values = options.values;
    }

    // if (options.secList && typeof options.secList === 'object') {
    //   this.secList = options.secList;
    // }

    if (options.finishCallback && typeof options.finishCallback === 'function') {
      this.finishCallback = options.finishCallback;
    }

    if (options.createNewFunction && typeof options.createNewFunction === 'function') {
      this.createNewFunction = options.createNewFunction;
    }

    // this.createNewFunction = function() {
    //   this.overlaySecondarySection.className += ' so-overlay-secondary-active';
    // };


    this.build();
  };

  searchOverlay.prototype.build = function() {
    var docFrag = document.createDocumentFragment();

    /* Overlay box */
    this.overlay = document.createElement('div');
    this.overlay.className = 'search-overlay';
    this.overlay.style.display = 'none';


    /* Primary and secondary sections */
    // this.overlayPrimarySection = document.createElement('div');
    // this.overlayPrimarySection.className = 'so-overlay-main';

    // this.overlaySecondarySection = document.createElement('div');
    // this.overlaySecondarySection.className = 'so-overlay-secondary';

    // this.overlay.appendChild(this.overlayPrimarySection);
    // this.overlay.appendChild(this.overlaySecondarySection);


    /* Secondary section */
    // var mg = document.createElement('ul');
    // mg.className = 'search-results';
    //
    // for (var key in this.values) {
    //   var li = document.createElement('li');
    //   li.innerHTML = "Text " + key;
    //   mg.appendChild(li);
    // }
    // this.overlaySecondarySection.appendChild(mg);

    /* Search box */
    this.searchBox = document.createElement('div');
    this.searchBox.className = 'search-input-box';

    this.overlay.appendChild(this.searchBox);


    /* Search input */
    this.searchInput = document.createElement('input');
    this.searchInput.className = 'search-input';
    this.searchInput.placeholder = 'Type here to search';
    this.searchInput.addEventListener('keyup', this.search.bind(this));

    this.clearButton = document.createElement('a');
    this.clearButton.className = 'glyphicon glyphicon-remove';
    this.clearButton.addEventListener('click', this.clear.bind(this));

    this.searchBox.appendChild(this.searchInput);
    this.searchBox.appendChild(this.clearButton);


    /* Search results box */
    this.searchResultsBox = document.createElement('div');
    this.searchResultsBox.className = 'so-search-results-box';

    this.overlay.appendChild(this.searchResultsBox);


    /* Create new result */
    this.createNew = document.createElement('div');
    this.createNew.className = 'so-create-new';

    var text = document.createElement('span');
    text.innerHTML = 'New exercise :';
    text.className = 'so-create-new-text';

    this.createNew.appendChild(text);

    this.createNewExercise = document.createElement('span');
    this.createNewExercise.className = 'so-create-new-exercise';

    this.createNew.appendChild(this.createNewExercise);
    this.createNew.addEventListener('click', this.createNewCallback.bind(this));

    this.searchResultsBox.appendChild(this.createNew);


    /* Search results list */
    this.searchResults = document.createElement('ul');
    this.searchResults.className = 'search-results';

    for (var key in this.values) {
      var li = document.createElement('li');
      li.innerHTML = this.values[key].text;
      li.dataset.id = this.values[key].id;
      li.addEventListener('click', this.select.bind(this, key));
      this.searchResults.appendChild(li);
    }

    this.searchResultsBox.appendChild(this.searchResults);


    /* Buttons */
    this.searchButtons = document.createElement('div');
    this.searchButtons.className = 'search-overlay-btns';

    this.overlay.appendChild(this.searchButtons);

    this.acceptButton = document.createElement('button');
    this.acceptButton.className = 'search-overlay-accept btn btn-lg btn-primary';
    this.acceptButton.innerHTML = 'Select';
    this.acceptButton.addEventListener('click', this.finish.bind(this));

    this.cancelButton = document.createElement('button');
    this.cancelButton.className = 'search-overlay-cancel btn btn-lg';
    this.cancelButton.innerHTML = 'Cancel';
    this.cancelButton.addEventListener('click', this.hide.bind(this));

    this.searchButtons.appendChild(this.acceptButton);
    this.searchButtons.appendChild(this.cancelButton);

    docFrag.appendChild(this.overlay);
    document.body.appendChild(docFrag);
  };

  searchOverlay.prototype.search = function() {
    var searchText = this.searchInput.value.trim().toLowerCase();
    this.createNewExercise.innerHTML = searchText;
    var matched = false;
    var possibleMatch = false;
    for (var key in this.values) {
      var value = this.values[key].text.toLowerCase();
      if (value.indexOf(searchText) === -1) {
        this.hideResult(key);
      } else {
        this.showResult(key);
        possibleMatch = true;
        if (value.trim() === searchText) {
          matched = true;
          this.setValue(key);
        }
      }
    }
    if (!matched) {
      this.unsetValue();
    }

    if (searchText.length >= 3 || !possibleMatch) {
      this.showCreateNew();
    }
    if (matched || searchText.length < 3 && possibleMatch || searchText.length == 0) {
      this.hideCreateNew();
    }
    this.showSearchResults();
  };

  searchOverlay.prototype.clear = function() {
    this.searchInput.value = '';
    var searchResults = this.searchResults.children;
    for (var i = 0; i < searchResults.length; i++) {
      this.showResult(i);
    }
    this.showSearchResults();
    this.hideCreateNew();
    this.unsetValue();
  };

  searchOverlay.prototype.select = function(index) {
    var searchResults = this.searchResults.children;
    this.searchInput.value = searchResults[index].innerHTML;
    this.setValue(index);
    for (var key in this.values) {
      if (this.values[key].id !== searchResults[index].dataset.id) {
        this.hideResult(key);
      }
    }
    this.hideCreateNew();
    this.hideSearchResults();
  };

  /**
   * searchOverlay helpers
   */
  searchOverlay.prototype.hide = function() {
    this.overlay.style.display = 'none';
    document.body.className = document.body.className.replace(/\bnoscroll\b/,'');
  };

  searchOverlay.prototype.show = function() {
    this.clear();
    this.overlay.style.display = 'block';
    this.searchInput.focus();
    document.body.className = document.body.className + ' noscroll';
  };

  searchOverlay.prototype.finish = function() {
    this.hide();
    if (typeof this.finishCallback === 'function') {
      this.finishCallback();
    }
  };

  searchOverlay.prototype.createNewCallback = function() {
    if (typeof this.createNewFunction === 'function') {
      this.createNewFunction();
    }
  };

  searchOverlay.prototype.hideSearchResults = function() {
    this.searchResults.style.display = 'none';
  };

  searchOverlay.prototype.showSearchResults = function() {
    this.searchResults.style.display = 'block';
  };

  searchOverlay.prototype.hideResult = function(index) {
    this.searchResults.children[index].style.display = 'none';
  };

  searchOverlay.prototype.showResult = function(index) {
    this.searchResults.children[index].style.display = 'block';
  };

  searchOverlay.prototype.setValue = function(index) {
    this.selectedValue = this.values[index];
  };

  searchOverlay.prototype.unsetValue = function() {
    this.selectedValue = null;
  };

  searchOverlay.prototype.getValue = function() {
    return this.selectedValue;
  };

  searchOverlay.prototype.getCurrentValue = function() {
    return this.searchInput.value;
  };

  searchOverlay.prototype.showCreateNew = function() {
    this.createNew.style.display = 'block';
  };

  searchOverlay.prototype.hideCreateNew = function() {
    this.createNew.style.display = 'none';
  };

  window.SearchOverlay = searchOverlay;
}());
