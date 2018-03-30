// ________________________
//
//  reuseable code
//
// ________________________

let cardData;
let totalPages;
let currentPage = 1;

function initializeButton(buttonText, buttonClasses = [], buttonType) {
  const button = document.createElement('BUTTON');
  button.textContent = buttonText;
  button.setAttribute('type', buttonType);
  buttonClasses.forEach(function(index) {
    button.classList.add(index);
  });
  return button;
}

function insertButton(location, button) {
  location.parentNode.insertBefore(button, location);
  location.style.display = 'none';
}

function insertIntoAndReplace(location, button) {
  location.parentNode.appendChild(button);
  location.parentNode.removeChild(location);
}

function loadCards() {
  // 1. get database data as json data from /load-cards route
  const triggerRandom = document.querySelector('#trigger-random');
  let method, url;
      method = 'GET';
      url = '/load-cards';
  
  $.ajax({
    type: method,
    url: url,
    dataType: 'json',
    contentType : 'application/json'
  })
    .done(function(response) {
      console.log("Cards loaded successfully");
      cardData = response;
      console.log(cardData);
      // if site visitor navigated via url:
      if(triggerRandom) {
        const flashcardId = randomCard(cardData);
        window.location.href = `/quiz/${flashcardId}`;
      }
    })
    .fail(function(error) {
      console.log("Failed to load cards", error);
    })
}

//  redirect to a random card by cardId
function randomCard(data) {
  console.log('randomize card');
  // 2. return random number and feed to /cards route
  const numberOfCards = data.length;
  const flashcardIndex = Math.floor( Math.random() * numberOfCards );
  console.log(flashcardIndex);
  const flashcardId = data[flashcardIndex]._id;
  return flashcardId;
}

// Pagination Logic
// ----------------------

function loadNewPage(pageToLoad = 1, numberPerPage = 10) {
  // console.log(pageToLoad);
  // console.log(numberPerPage);

  let method, url;
      method = 'GET';
      url = `/load-cards/${numberPerPage}/${pageToLoad}`;
  
  $.ajax({
    type: method,
    url: url,
    dataType: 'json',
    contentType : 'application/json'
  })
    .done(function(response) {
      console.log("Cards loaded successfully");
      cardData = response.cardPrompts;
      currentPage = response.current;
      totalPages = response.totalPages;
      refreshList(cardData, numberPerPage);
      // console.log(cardData);
    })
    .fail(function(error) {
      console.log("Failed to load cards", error);
    })
}

function refreshList(cardData, numberPerPage) {
  const data = document.querySelector('#data');
  data.textContent = '';

  cardData.forEach(function(index, i){

    const tableRow = document.createElement('tr');
    const rowNumber = document.createElement('th');
    const japanesePhraseCell = document.createElement('td');
    const englishTranslationCell = document.createElement('td');
    const detailsButtonCell = document.createElement('td');
    const detailsButton = initializeButton('Details', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');

    rowNumber.setAttribute('scope', 'row');
    rowNumber.textContent = (i + 1) + (numberPerPage * (currentPage - 1));
    japanesePhraseCell.classList.add('kana');
    $(japanesePhraseCell).html(index.japanesePhrase);
    englishTranslationCell.textContent = index.englishTranslation;
    detailsButtonCell.appendChild(detailsButton);

    data.appendChild(tableRow);
    tableRow.appendChild(rowNumber);
    tableRow.appendChild(japanesePhraseCell);
    tableRow.appendChild(englishTranslationCell);
    tableRow.appendChild(detailsButtonCell);

    detailsButton.addEventListener('click', (e) => {
      console.log(`details button ${i} pressed`);
      window.location.href = `/cards/${index._id}`;
    })
  });
}

// End Pagination Logic
// ----------------------

// ________________________
//
//  event handlers: buttons
//
// ________________________

//  Details button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const details = document.querySelectorAll('.details-button');
  if (details) {
    details.forEach(function(index, i){
      const databaseId = index.getAttribute('data-database-id');
      const detailsButton = initializeButton('Details', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertButton(index, detailsButton);
  
      // Handle click event
      detailsButton.addEventListener('click', (e) => {
        console.log(`details button ${i} pressed`);
        window.location.href = `/cards/${databaseId}`;
      })
    });
  }
})

//  Add Card button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const addCard = document.querySelector('.add-card-button');
  if (addCard) {
    const addCardButton = initializeButton('Add Card', ['btn', 'btn-outline-success', 'btn-lg'], 'button');
    insertButton(addCard, addCardButton);

    addCardButton.addEventListener('click', (e) => {
      window.location.href = '/add';
    })
  }
})

// Pagination Logic
// ----------------------

//  First Page button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const firstPage = document.querySelector('.first-page-button');
  // if (currentPage !== 1) {
    if (firstPage) {
      const firstPageButton = initializeButton('«', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertIntoAndReplace(firstPage, firstPageButton);

      firstPageButton.addEventListener('click', (e) => {
        console.log('first page button pressed');
        console.log(currentPage);
        // window.location.href = '';
        loadNewPage();
      })
    }
  // } else {
  //   firstPage.parentNode.removeChild(firstPage);
  // }
})

//  Prev Page button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const prevPage = document.querySelector('.prev-page-button');
  // if (currentPage !== 1) {
    if (prevPage) {
      const prevPageButton = initializeButton('<', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertIntoAndReplace(prevPage, prevPageButton);
  
      prevPageButton.addEventListener('click', (e) => {
        console.log('prev page button pressed');
        console.log(currentPage);
        // window.location.href = '';
        loadNewPage(currentPage - 1);
      })
    }
  // } else {
  //   prevPage.parentNode.removeChild(prevPage);
  // }
})

//  Page Number button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const pageNumbers = document.querySelectorAll('.page-number-button');
  if (pageNumbers) {
    pageNumbers.forEach(function(index, i){
      const pageNumberButton = initializeButton(`${ i + 1 }`, ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertIntoAndReplace(index, pageNumberButton);
  
      pageNumberButton.addEventListener('click', (e) => {
        console.log(`page ${ i + 1 } button pressed`);
        console.log(currentPage);
        // window.location.href = '';
        loadNewPage(i + 1);
      })
    });
  }
})

//  Next Page button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  if (currentPage !== totalPages) {
    const nextPage = document.querySelector('.next-page-button');
    if (nextPage) {
      const nextPageButton = initializeButton('>', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertIntoAndReplace(nextPage, nextPageButton);
  
      nextPageButton.addEventListener('click', (e) => {
        console.log('next page button pressed');
        console.log(currentPage);
        // window.location.href = '';
        loadNewPage(currentPage + 1);
      })
    }
  }
})

//  Last Page button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  if (currentPage !== totalPages) {
    const lastPage = document.querySelector('.last-page-button');
    if (lastPage) {
      const lastPageButton = initializeButton('»', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      insertIntoAndReplace(lastPage, lastPageButton);
  
      lastPageButton.addEventListener('click', (e) => {
        console.log('last page button pressed');
        console.log(currentPage);
        // window.location.href = '';
        console.log(totalPages);
        loadNewPage(totalPages);
      })
    }
  }
})

// End Pagination Logic
// ----------------------

//  Edit Card button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const editCard = document.querySelector('.edit-card-button');
  const cardId = editCard.getAttribute('data-database-id').toString();
  if (editCard) {
    const editCardButton = initializeButton('Edit Card', ['btn', 'btn-info', 'btn-sm', 'add-space'], 'button');
    insertButton(editCard, editCardButton);

    editCardButton.addEventListener('click', (e) => {
      // editCard.style.display = '';
      // e.target.style.display = 'none';
      //  wire up button here
      console.log('edit button pressed');
      window.location.href = `/editcard/${cardId}`;
    })
  }
})

//  Delete Card button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const deleteCard = document.querySelector('.delete-card-button');
  const cardId = deleteCard.getAttribute('data-database-id').toString();
  if (deleteCard) {
    const deleteCardButton = initializeButton('Delete Card', ['btn', 'btn-danger', 'btn-sm', 'add-space'], 'button');
    insertButton(deleteCard, deleteCardButton);

    deleteCardButton.addEventListener('click', (e) => {
      console.log('delete button pressed');
      if (confirm("Are you sure?")) {
        $.ajax({
          type: 'DELETE',
          url: '/cards/' + cardId,
          dataType: 'json',
          contentType : 'application/json',
        })
          .done(function(response) {
            console.log("File", cardId, "is DOOMED!!!!!!");
            window.location.href = '/';
          })
          .fail(function(error) {
            console.log("I'm not dead yet!", error);
          })
      }
    })
  }
})

//  Show answer button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const answer = document.querySelector('.answer');
  const japanesePhrase = document.querySelector('.japanese-phrase');
  const englishTranslation = document.querySelector('.english-translation');
  englishTranslation.style.display = 'none';
  if (answer) {
    const answerShowButton = initializeButton('Show English', ['btn', 'btn-outline-secondary', 'btn-lg'], 'button');
    insertButton(answer, answerShowButton);

    answerShowButton.addEventListener('click', (e) => {
      if (answerShowButton.textContent === 'Show English') {
        answer.style.display = '';
        e.target.textContent = 'Show Japanese';
        englishTranslation.style.display = '';
        japanesePhrase.style.display = 'none';
      } else if (answerShowButton.textContent === 'Show Japanese') {
        answer.style.display = '';
        e.target.textContent = 'Show English';
        englishTranslation.style.display = 'none';
        japanesePhrase.style.display = '';
      }
    })
  }
})

//  Next button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const next = document.querySelector('.next-button');
  if (next) {
    const nextButton = initializeButton('Next Card', ['btn', 'btn-success', 'btn-sm', 'float-right'], 'button');
    insertButton(next, nextButton);

    nextButton.addEventListener('click', (e) => {
      window.location.href = `/cards`;
    })
  }
})

//  Save Changes button: editcard.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const saveChanges = document.querySelector('.save-changes-button');
  const cardId = saveChanges.getAttribute('data-database-id').toString();
  if (saveChanges) {
    const saveChangesButton = initializeButton('Save Changes', ['btn', 'btn-outline-success', 'btn-sm', 'add-space'], 'button');
    insertButton(saveChanges, saveChangesButton);

    saveChangesButton.addEventListener('click', (e) => {

      const cardData = {
        japanesePhrase: $('#japanesePhrase').val(),
        englishTranslation: $('#englishTranslation').val(),
        _id: cardId
      };
    
      let method, url;
      method = 'PUT';
      url = '/editcard/' + cardData._id;
    
      $.ajax({
        type: method,
        url: url,
        data: JSON.stringify(cardData),
        dataType: 'json',
        contentType : 'application/json'
      })
        .done(function(response) {
          console.log("We have posted the data");
          window.location.href = `/`;
        })
        .fail(function(error) {
          console.log("Failures at posting, we are", error);
        })
    
      console.log("Your file data", cardData);      
    })
  }
})

//  Cancel button: editcard.pug, addcard.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const cancel = document.querySelector('.cancel-button');
  const cardId = cancel.getAttribute('data-database-id').toString();
  if (cancel) {
    let cancelButton;
    if (cardId) {
      cancelButton = initializeButton('Cancel', ['btn', 'btn-success', 'btn-sm'], 'button');
    } else if (!cardId) {
      cancelButton = initializeButton('Cancel', ['btn', 'btn-success'], 'button');
    }
    insertButton(cancel, cancelButton);

    cancelButton.addEventListener('click', (e) => {
      if (cardId) {
        window.location.href = `/cards/${cardId}`;
      } else if (!cardId) {
        window.location.href = '/';
      }
    })
  }
})

//  Begin Quiz button: greeting.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const beginQuiz = document.querySelector('.begin-quiz-button');
  if (beginQuiz) {
    const beginQuizButton = initializeButton('Begin Quiz', ['btn', 'btn-outline-success', 'btn-lg'], 'button');
    insertButton(beginQuiz, beginQuizButton);
    loadCards();

    beginQuizButton.addEventListener('click', (e) => {
      let flashcardId = randomCard(cardData);
      window.location.href = `/quiz/${flashcardId}`;
    })
  }
})
