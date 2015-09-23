'use strict';

/**
 * Search overlay
 */
(function() {
  var searchOverlay = function() {

    this.values = [];
    this.selectedValue = null;
    this.finishCallback = null;

    if (arguments[0] && typeof arguments[0] === 'object' ) {
      this.values = arguments[0];
    }

    if (arguments[1] && typeof arguments[1] === 'function' ) {
      this.finishCallback = arguments[1];
    }

    this.build();
  };

  searchOverlay.prototype.build = function() {
    var docFrag = document.createDocumentFragment();

    this.overlay = document.createElement('div');
    this.overlay.className = 'search-overlay';
    this.overlay.style.display = 'none';

    this.searchBox = document.createElement('div');
    this.searchBox.className = 'search-input-box';

    this.searchInput = document.createElement('input');
    this.searchInput.className = 'search-input';
    this.searchInput.placeholder = 'Type here to search';
    this.searchInput.addEventListener('keyup', this.search.bind(this));

    this.clearButton = document.createElement('a');
    this.clearButton.className = 'glyphicon glyphicon-remove';
    this.clearButton.addEventListener('click', this.clear.bind(this));

    this.searchBox.appendChild(this.searchInput);
    this.searchBox.appendChild(this.clearButton);

    this.searchResults = document.createElement('ul');
    this.searchResults.className = 'search-results';

    for (var key in this.values) {
      var li = document.createElement('li');
      li.innerHTML = this.values[key].text;
      li.dataset.id = this.values[key].id;
      li.addEventListener('click', this.select.bind(this, key));
      this.searchResults.appendChild(li);
    }

    this.searchButtons = document.createElement('div');
    this.searchButtons.className = 'search-overlay-btns';

    this.acceptButton = document.createElement('button');
    this.acceptButton.className = 'search-overlay-accept btn btn-lg btn-primary';
    // this.acceptButton.className = 'btn btn-lg btn-primary';
    this.acceptButton.innerHTML = 'Select';
    this.acceptButton.addEventListener('click', this.finish.bind(this));

    this.cancelButton = document.createElement('button');
    this.cancelButton.className = 'search-overlay-cancel btn btn-lg';
    // this.cancelButton.className = 'btn btn-lg';
    this.cancelButton.innerHTML = 'Cancel';
    this.cancelButton.addEventListener('click', this.hide.bind(this));

    this.searchButtons.appendChild(this.acceptButton);
    this.searchButtons.appendChild(this.cancelButton);

    this.overlay.appendChild(this.searchBox);
    this.overlay.appendChild(this.searchResults);
    this.overlay.appendChild(this.searchButtons);

    docFrag.appendChild(this.overlay);
    document.body.appendChild(docFrag);
  };

  searchOverlay.prototype.search = function() {
    var searchText = this.searchInput.value.toLowerCase();
    var matched = false;
    for (var key in this.values) {
      var value = this.values[key].text.toLowerCase();
      if (value.indexOf(searchText) === -1) {
        this.hideResult(key);
      } else {
        this.showResult(key);
        if (value === searchText) {
          matched = true;
          this.setValue(key);
        }
      }
    }
    if (!matched) {
      this.unsetValue();
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
    document.body.className = document.body.className + ' noscroll';
  };

  searchOverlay.prototype.finish = function() {
    this.hide();
    if (typeof this.finishCallback === 'function') {
      this.finishCallback();
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

  window.SearchOverlay = searchOverlay;
}());
