# Language Learning App

### Final Project,
### Code Louisville January 2018 session

---

This is a Node.js project using MongoDb to persist data.  The intent of the project is to create a system of flashcards so the user can quiz oneself on foreign language words, with the example being in Japanese.  The user can add cards, edit them, delete them, view a list of all of them, and view the details of one card.  In this way, the user can create their own quiz to test their knowledge.

---

To view this app, download the source files from Github and do the following:

* Go to root directory of project
* Run ‘npm install’ to install necessary packages (requires node and npm installed on local machine)
* _Make sure there is an internet connection because, though it can be run by your local machine, the project is dependent on resources linked from the internet_
* Run ‘npm start’ to begin the app server process
* Open a browser window and navigate to `http://localhost:3000`

---

To navigate site:

* To view CRUD functions (create, read, update, delete), browse to "List All Cards" from the header based navigation menu (or it comes up automatically at the site root). From the list, either click "Add Card" to add, or click "Details" for one of the items to edit or delete.  When you add a new card, click on the last page of the list to view it.
* To view flashcards and quiz yourself, click on "Begin Quiz" from the navigation menu.

Please note: As an additional piece of functionality, I added pagination for the list page.  Currently, it is functional but still buggy, and due to time constraints, I am committing as is with the intention of fixing the bugs at a later time.