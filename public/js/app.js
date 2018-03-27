// ------------------------
//  reuseable code
// ------------------------

let cardData;

function initializeButton(buttonText, buttonClasses = [], buttonType) {
  const button = document.createElement('BUTTON');
  button.textContent = buttonText;
  button.setAttribute('type', buttonType);
  buttonClasses.forEach(function(index) {
    button.classList.add(index);
  });
  return button;
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
        window.location.href = `/cards/${flashcardId}`;
      }
    })
    .fail(function(error) {
      console.log("Failed to load cards", error);
    })
}

//  redirect to a random card by cardId - unfinished function
function randomCard(data) {
  console.log('randomize card');
  // 2. return random number and feed to /cards route
  const numberOfCards = data.length;
  const flashcardIndex = Math.floor( Math.random() * numberOfCards );
  console.log(flashcardIndex);
  const flashcardId = data[flashcardIndex]._id;
  return flashcardId;
}

// ------------------------
//  event handlers: buttons
// ------------------------

//  Details button: index.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const details = document.querySelectorAll('.details-button');
  if (details) {
    details.forEach(function(index, i){
      const databaseId = index.getAttribute('data-database-id');
      const detailsButton = initializeButton('Details', ['btn', 'btn-outline-secondary', 'btn-sm'], 'button');
      index.parentNode.insertBefore(detailsButton, index);
      index.style.display = 'none';    
  
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
    addCard.parentNode.insertBefore(addCardButton, addCard);
    addCard.style.display = 'none';    

    addCardButton.addEventListener('click', (e) => {
      window.location.href = '/add';
    })
  }
})

//  Edit Card button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const editCard = document.querySelector('.edit-card-button');
  const cardId = editCard.getAttribute('data-database-id').toString();
  if (editCard) {
    const editCardButton = initializeButton('Edit Card', ['btn', 'btn-info', 'btn-sm', 'add-space'], 'button');
    editCard.parentNode.insertBefore(editCardButton, editCard);
    editCard.style.display = 'none';    

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
    deleteCard.parentNode.insertBefore(deleteCardButton, deleteCard);
    deleteCard.style.display = 'none';    

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
    answer.parentNode.insertBefore(answerShowButton, answer);
    answer.style.display = 'none';

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
    next.parentNode.insertBefore(nextButton, next);
    next.style.display = 'none';

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
    saveChanges.parentNode.insertBefore(saveChangesButton, saveChanges);
    saveChanges.style.display = 'none';    

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

//  Cancel button: card.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const cancel = document.querySelector('.cancel-button');
  const cardId = cancel.getAttribute('data-database-id').toString();
  if (cancel) {
    const cancelButton = initializeButton('Cancel', ['btn', 'btn-success', 'btn-sm'], 'button');
    cancel.parentNode.insertBefore(cancelButton, cancel);
    cancel.style.display = 'none';

    cancelButton.addEventListener('click', (e) => {
      window.location.href = `/cards/${cardId}`;
    })
  }
})

//  Begin Quiz button: greeting.pug
document.addEventListener('DOMContentLoaded', (e) => {
  const beginQuiz = document.querySelector('.begin-quiz-button');
  if (beginQuiz) {
    const beginQuizButton = initializeButton('Begin Quiz', ['btn', 'btn-outline-success', 'btn-lg'], 'button');
    beginQuiz.parentNode.insertBefore(beginQuizButton, beginQuiz);
    beginQuiz.style.display = 'none';    
    loadCards();

    beginQuizButton.addEventListener('click', (e) => {
      let flashcardId = randomCard(cardData);
      window.location.href = `/cards/${flashcardId}`;
    })
  }
})

// to do: implement a 'next' button for quiz