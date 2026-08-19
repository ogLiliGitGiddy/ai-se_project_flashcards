// P1P2-T2.1
// P1P2-T4.2

import { decks, getCarouselTitleString } from "./decks.js"; // to get the appropriate title string to display in the carousel title element- shows the current deck name and card count.
import { hexToString, removeColorClasses } from "./colors.js"; // hexToString function to get the color name from the deck color hex string, can apply the appropriate color class to the card

// local
let currentIndex = 0; // P1P2-T6.3 need to reside outside of function.
let showingQuestion = true; // P1P2-T7.1 track whether currently showing question or answer. Initially true because we want to show question first when we render the carousel.
let currentDeck = null; // track the deck currently displayed in the carousel for persistent handlers

function renderCarouselView(deck) {
  // set the current deck and reset index when rendering a new deck
  currentDeck = deck;
  currentIndex = 0;
  // P1P2-T6
  // P1P2-T6.1
  const currentCard = deck.cards[currentIndex]; // P1P2-T6.3 // we will need to know which card we are currently showing in order to update the text and color when we flip the card and when we navigate to the next or previous card. So we can define currentCard variable that gets the current card based on the currentIndex.
  const carouselEl = document.querySelector(".carousel"); // we need to select the carousel element inside the renderCarouselView function, because we will need to update the text and color of the card element inside the carousel whenever we flip the card or navigate to next/previous card. So we need to make sure we are always selecting the current carousel element in the DOM, which is the one that is currently being rendered.
  const carouselTitle = carouselEl.querySelector(".carousel__title"); // P1P2-T6.7 // we need to select the carousel title element so that we can update its text content to show the current deck name and card count. We can use the getCarouselTitleString function to get the appropriate title string based on the current deck.
  // carouselTitle.textContent = getCarouselTitleString(deck); // set the text content of the carousel title element to the string returned by getCarouselTitleString function, which will show the current deck name and card count.
  // remove above use updateDisplay()
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left"); // we also need to select the left and right arrow buttons so that we can add event listeners to them to navigate between cards and also disable them when we are on the first or last card.
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right"); // same reason as leftBtn, we need to select the right button to add event listener and disable/enable it when needed.
  const cardTextEl = carouselEl.querySelector(".carousel__card-text"); // we need to select the card text element so that we can update its text content to show the current question or answer based on whether showingQuestion is true or false.

  // helper function to disable a button by adding the disabled class and attribute.
  function disableButton(buttonEl) {
    // to disable a button, we can add a disabled class that applies the appropriate styles to make it look disabled, and also add the disabled attribute to actually disable the button functionality.
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true; // the disabled attribute is a boolean attribute, so we can set it to true to disable the button.
  }

  // helper function to enable a button by removing the disabled class and attribute.
  function enableButton(buttonEl) {
    // to enable a button, we need to remove the disabled class and also remove the disabled attribute, because just removing the class will not make the button clickable again if it has the disabled attribute.
    buttonEl.classList.remove("carousel__btn_disabled");
    // the disabled attribute is a boolean attribute, so to remove it we can use removeAttribute method.
    buttonEl.removeAttribute("disabled");
  }

  // disable left button if on first card, disable right button if on last card. We can call this function in the updateDisplay function, so that whenever we update the display we also check whether we need to disable or enable the arrows.
  function updateArrows() {
    // if currentIndex is at the first card (i.e. 0), disable left button. Otherwise, enable it.
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    // if currentIndex is at the last card, disable right button. Otherwise, enable it.
    if (currentIndex === currentDeck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  // P1P2-T6.1 // we need a function to update the display of the card text and color based on the current card and whether we are showing question or answer. So we can define an updateDisplay function that will handle updating the text content of the card text element and also updating the color class of the card
  function updateDisplay() {
    const cardEl = carouselEl.querySelector(".carousel__card"); // need to select the card element inside the updateDisplay function, because we will need to update the text and color of the same card element when we flip the card and when we navigate to the next or previous card. So we need to make sure we are always selecting the current card element in the DOM, which is the one inside the carouselEl.

    carouselTitle.textContent = `${currentDeck.name} - ${currentIndex + 1} / ${currentDeck.cards.length}`; // P1P2-T6.7 update the text content of the carousel title element to show the current deck name and card count.

    // text
    if (showingQuestion) {
      cardTextEl.textContent = currentDeck.cards[currentIndex].question;
    } // if showingQuestion is true, set the text content to the question. Otherwise, set it to the answer.
    else {
      cardTextEl.textContent = currentDeck.cards[currentIndex].answer;
    }

    // color: always use the deck color for the carousel card (keep color when flipped)
    removeColorClasses(cardEl);
    if (showingQuestion) {
      const colorName = hexToString(currentDeck.color); // get the color name from the deck color hex string using the hexToString function, so that we can apply the appropriate color class to the card element.
      cardEl.classList.add(`carousel__card_color_${colorName}`); // apply the appropriate color class to the card
    } else {
      cardEl.classList.add(`carousel__card_color_white`); // when showing answer, use gray color for the card, so that we can distinguish between question and answer by both text and color.
    }
    updateArrows();
  }

  // flip button listener
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  // Attach persistent handlers only once. Handlers read `currentDeck` and `currentIndex`.
  if (!carouselEl.dataset.listenersAttached) {
    flipBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion; // P1P2-T6.2 toggle between question and answer
      updateDisplay(); // P1P2-T6.2 call updateDisplay to update the text and color based on the new value of showingQuestion.
    });

    // right arrow listener
    rightBtn.addEventListener("click", () => {
      // increment currentIndex and call updateDisplay to show the next card when right arrow is clicked, but only if we are not already on the last card. Otherwise, do nothing.
      if (currentIndex < currentDeck.cards.length - 1) {
        currentIndex++;
        showingQuestion = true; // reset to showing question whenever we navigate to a new card, so that it will always show the question side up first when we navigate to a new card.
        updateDisplay();
      }
    });

    // disable left arrow when on first card, disable right arrow when on last card. We can do this in the updateDisplay function, so that whenever we update the display we also check whether we need to disable or enable the arrows.
    leftBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        showingQuestion = true;
        updateDisplay();
      }
    });

    carouselEl.dataset.listenersAttached = "true";
  }

  showingQuestion = true; // P1P2-T7.5 reset to showing question whenever we render the carousel, so that it will always start with question side up.
  updateDisplay(); // call updateDisplay at the end of the renderCarouselView function to initialize the display of the card text and color based on the current card and showingQuestion value. This way, whenever we render the carousel, it will show the first card's question with the appropriate color, and also set up the arrows correctly based on the number of cards in the deck.
}

// P1P2-T4.2
export { renderCarouselView }; // we only need to export the renderCarouselView function from this module, because that's the only function that needs to be used outside of this module. The other functions and variables defined in this module are all helper functions and variables that are only used inside this module, so we don't need to export them. By only exporting what is necessary, we can keep our module's public API clean and prevent unnecessary access to internal functions and variables.
