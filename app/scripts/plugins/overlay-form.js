/*
 * Overlay form
 *
 * Github source code:
 * https://github.com/xbogdan/overlay-form
 *
 * Copyright (c) 2015 - Bogdan Boamfa
 *
 * License MIT
 *
 * Version:  v1.0
 * Last update: 2015-11-19
 */
'use strict';

(function() {
  var of = function(options) {
    this.inputs = [];
    this.fields = [];

    if (options.finishCallback && typeof options.finishCallback === 'function') {
      this.finishCallback = options.finishCallback;
    }
    if (options.beforeShow && typeof options.beforeShow === 'function') {
      this.beforeShow = options.beforeShow;
    }
    if (options.afterHide && typeof options.afterHide === 'function') {
      this.afterHide = options.afterHide;
    }
    if (options.fields && typeof options.fields === 'object') {
      this.fields = options.fields;
    }

    anchor = null;
    if (options.anchor && typeof options.anchor === 'string') {
      var anchor = document.getElementById(options.anchor);
    }

    this.build(anchor);
  };

  of.prototype.build = function(anchor) {
    var docFrag = document.createDocumentFragment();

    /* Overlay box */
    this.overlay = document.createElement('div');
    this.overlay.className = 'of';
    this.overlay.id = 'of-' + Math.random().toString(36).substr(2, 9);
    this.overlay.style.display = 'none';

    this.ofBox = document.createElement('div');
    this.ofBox.className = 'of__box';
    this.overlay.appendChild(this.ofBox);

    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      this.addField(field.label, field.inputType, field.inputName, field.value);
    }

    var buttonsBox = document.createElement('div');
    buttonsBox.className = 'of__buttons-box';

    this.cancelButton = document.createElement('button');
    this.cancelButton.innerHTML = 'Cancel';
    this.cancelButton.className = 'of__button of__cancel';
    this.cancelButton.setAttribute('type', 'button');
    this.cancelButton.addEventListener('click', this.hideAction.bind(this));
    buttonsBox.appendChild(this.cancelButton);

    this.submitButton = document.createElement('button');
    this.submitButton.innerHTML = 'Submit'
    this.submitButton.className = 'of__button of__submit';
    this.submitButton.setAttribute('type', 'button');
    this.submitButton.addEventListener('click', this.submitAction.bind(this));
    buttonsBox.appendChild(this.submitButton);

    this.ofBox.appendChild(buttonsBox);

    docFrag.appendChild(this.overlay);

    if (anchor === null) {
      document.body.appendChild(docFrag);
    } else {
      anchor.appendChild(docFrag);
    }
  };

  of.prototype.addField = function(labelText, inputType, inputName, value) {
    // label
    var label = document.createElement('label');
    label.innerHTML = labelText;
    label.className = 'of__label';

    // input ID
    var inputId = 'of__input-' + Math.random().toString(36).substr(2, 9);
    label.setAttribute('for', inputId);

    // create input
    var input = document.createElement('input');
    input.id = inputId;
    input.className = 'of__input';
    input.setAttribute('type', inputType);
    if (typeof inputName === 'undefined') {
      var inputName = labelText.split(' ').join('-').toLowerCase();
    }
    input.setAttribute('name', inputName);
    if (typeof value !== 'undefined') {
      input.value = value;
    }

    var container = document.createElement('div');
    this.inputs.push(input);
    container.appendChild(label);
    container.appendChild(input);
    this.ofBox.appendChild(container);
  };

  of.prototype.clearInputs = function() {
    for (var i = 0; i < this.inputs.length; i++) {
      this.inputs[i].value = '';
    }
  };

  of.prototype.hide = function() {
    this.overlay.style.display = 'none';
    document.body.className = document.body.className.replace(/\bnoscroll\b/,'');
    this.clearInputs();
  };

  of.prototype.hideAction = function() {
    this.hide();
    if (typeof this.afterHide !== 'undefined') {
      this.afterHide();
    }
  };

  of.prototype.show = function() {
    if (typeof this.beforeShow !== 'undefined') {
      this.beforeShow(this.inputs);
    }
    this.overlay.style.display = 'block';
    document.body.className = document.body.className + ' noscroll';
  };

  of.prototype.submitAction = function() {
    var fieldValues = [];
    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      fieldValues.push({
        name: input.getAttribute('name'),
        value: input.value
      });
    }
    this.finishCallback(fieldValues);
    this.hide();
  };

  window.of = of;
}());
