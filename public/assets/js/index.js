// When the user clicks the button, open the modal for the
// article we clicked on
$(document).on('click', '.add-comment', function() {
  console.log('Add comment clicked');

  const articleID = $(this).attr('articleid');
  console.log(articleID);

  // gets modal
  const modalID = 'myModal' + articleID;
  const modal = document.getElementById(modalID);

  modal.style.display = 'block';
});

// When user clicks on <span> (x), close modal
// for the article that is open.
$(document).on('click', '.close', function() {
  console.log('close clicked');

  const articleID = $(this).attr('articleid');
  console.log(articleID);

  // Get the modal
  const modalID = 'myModal' + articleID;
  const modal = document.getElementById(modalID);

  modal.style.display = 'none';
})
;