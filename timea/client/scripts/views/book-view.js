'use strict';
var app = app || {};

(function(module) {
  $('.icon-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  })

  function resetView() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const bookView = {};

  bookView.initIndexPage = function(ctx, next) {
    resetView();
    $('.book-view').show();
    $('#book-list').empty();
    module.Book.all.forEach(book => $('#book-list').append(book.toHtml()));
    next()
  }

  bookView.initDetailPage = function(ctx, next) {
    resetView();
    $('.detail-view').show();
    $('.book-detail').empty();
    let template = Handlebars.compile($('#book-detail-template').text());
    $('.book-detail').append(template(ctx.book));

    $('#update-btn').on('click', function() {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', function() {
      module.Book.destroy($(this).data('id'));
    });
    next()
  }

  bookView.initCreateFormPage = function() {
    resetView();
    $('.create-view').show();
    $('#create-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    })
  }

  bookView.initUpdateFormPage = function(ctx) {
    resetView();
    $('.update-view').show()
    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    })
  };

// COMMENT: What is the purpose of this method?
//it initializes the search form page
  bookView.initSearchFormPage = function() {
    resetView();
    $('.search-view').show();
    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      //page refresh
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      //event target is the form, if they don't fill out a field it is going to be blank (empty string)
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // to clear out the user input 
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  //it initiates the result page
  bookView.initSearchResultsPage = function() {
    resetView();
    $('.search-results').show();
    $('#search-list').empty();

    // COMMENT: Explain how the .forEach() method is being used below.
    //it goes through the books to adds the one searched to the book list, there below on the weird parent line 
    module.Book.all.forEach(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', function(e) {
      // COMMENT: Explain the following line of code.
      //this points to the book items template, where the third parent has the data-bookid attribute, where the book searched is to be appended
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  module.bookView = bookView;
})(app)

