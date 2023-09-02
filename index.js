import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-a2a9b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsData = ref(database, "user");

const textareaEl = document.getElementById("textarea-el");
const fromEl = document.getElementById("from-el");
const toEl = document.getElementById("to-el");
const publishBtnEl = document.getElementById("publish-btn");
const endorsementsListEl = document.getElementById("endorsements-list");

publishBtnEl.addEventListener("click", function () {
  const reviewText = textareaEl.value;
  const fromData = fromEl.value;
  const toData = toEl.value;

  if (reviewText && fromData && toData) {
    clearFields();
    pushData(reviewText, fromData, toData);
    textareaEl.style.border = "none";
    fromEl.style.border = "none";
    toEl.style.border = "none";
  } else {
    clearFields();
    textareaEl.style.border = "2px solid red";
    fromEl.style.border = "2px solid red";
    toEl.style.border = "2px solid red";
  }
});

function clearFields() {
  textareaEl.value = "";
  fromEl.value = "";
  toEl.value = "";
}

function pushData(review, sender, to) {
  let arr = [review, sender, to, 0];
  push(endorsementsData, arr);
}

onValue(endorsementsData, function (snapshot) {
  endorsementsListEl.innerHTML = "";
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    for (let i = 0; i < itemsArray.length; i++) {
      let currentReview = itemsArray[i];
      appendReviewToEndorsements(currentReview);
    }
  }
});

function appendReviewToEndorsements(review) {
  let reviewId = review[0];
  let reviewData = review[1];
  let reviewText = reviewData[0];
  let reviewFrom = reviewData[1];
  let reviewTo = reviewData[2];
  let reviewLikes = reviewData[3];

  let newEl = document.createElement("li");
  let mainConEl = document.createElement("div");
  let toEl = document.createElement("h3");
  let reviewEl = document.createElement("p");
  let flexEl = document.createElement("div");
  let fromEl = document.createElement("h3");
  let likesEl = document.createElement("button");
  toEl.textContent = `To ${reviewTo}`;
  reviewEl.textContent = reviewText;
  fromEl.textContent = `From ${reviewFrom}`;
  likesEl.textContent = `♥ ${reviewLikes}`;
  newEl.appendChild(mainConEl);
  mainConEl.appendChild(toEl);
  mainConEl.appendChild(reviewEl);
  mainConEl.appendChild(flexEl);
  flexEl.appendChild(fromEl);
  flexEl.appendChild(likesEl);

  reviewEl.classList = "review-text";
  flexEl.classList = "flex-container";
  likesEl.classList = "like-btn";

  likesEl.addEventListener("click", function () {
    reviewLikes += 1;
    let exactLocationDB = ref(database, `user/${reviewId}`);
    update(exactLocationDB, {
      3: reviewLikes,
    });
  });
  endorsementsListEl.append(newEl);
}
