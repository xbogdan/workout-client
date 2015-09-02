$(document).ready(function() {
  $('body').on('click', '.day-item > .expand-btn', function(event) {
    event.preventDefault();
    event.stopPropagation();
    var $this = $(this);
    if ($this.parent().hasClass('day-expanded')) {
      $this.parent().removeClass('day-expanded');
    } else {
      $('.day-expanded').removeClass('day-expanded');
      $('.exercise-expanded').removeClass('exercise-expanded');
      $this.parent().addClass('day-expanded');
    }
  });

  $('body').on('click', '.exercise-item > .expand-btn', function(event) {
    event.preventDefault();
    event.stopPropagation();
    var $this = $(this);
    if ($this.parent().hasClass('exercise-expanded')) {
      $this.parent().removeClass('exercise-expanded');
    } else {
      $this.parent().addClass('exercise-expanded');
    }
  });

  $('body').on('click', '.edit-btn', function(event) {
    event.stopPropagation();
    $(this).parents('.day-item').toggleClass('editing');
  });


});


// var search = new searchOverlay(
//   [
//     { id: '1', text: 'Skullcrusher'},
//     { id: '4', text: 'Curls'},
//     { id: '5', text: 'Squads'}
//   ]
// );
