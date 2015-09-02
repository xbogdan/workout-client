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
});
