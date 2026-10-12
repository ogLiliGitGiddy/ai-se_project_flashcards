// P1P2-T2.1
// P1P2-T2.4
// P1P2-T3c.2
// P1P2-T4.2
import { gallery, getCardByID } from "./gallery.js";
import { stringToHex, hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

// P1P2-T4.5 Define home, carousel, not-found.
const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector(".carousel");
const notFoundSection = document.querySelector("#not-found");
const cardTemplateEl = document.querySelector("#card-template"); // P1P2-T3a.3

// P1P2-T4.5 Define home
function renderHomeView() {
  homeSection.style.display = "block"; // show home view
  carouselSection.style.display = "none"; // hide carousel view
  notFoundSection.style.display = "none"; // hide not found view

  // P1P2-T3a.3
  const cardContainerEl = document.querySelector(".gallery__list"); // we need to select the card container element inside the renderHomeView function, because we will need to update the list of gallery inside the home view whenever we render the home view. So we need to make sure we are always selecting the current card container element in the DOM, which is the one inside the homeSection.
  cardContainerEl.querySelectorAll("li.card__item").forEach((item) => {
    // we can select all the existing card items inside the card container and remove
    if (!item.querySelector(".gallery__new-card-btn")) {
      // we want to keep the "Create New Card" button, which is also an li element with class card__item, so we can check if the item has a child element with the class "gallery__new
      item.remove(); // if it doesn't have the "gallery__new-card-btn" element, that means it's a regular card item and we can remove it from the DOM. This way, we can clear out all the existing card items before we render the updated list of gallery, so that we don't end up with duplicate card items in the DOM.
    }
  });

  // P1P2-T3a.3-1 clones the template, customizes it (for now, just add the card title), and returns it.
  function createCardEl(item) {
    // P1P2-T5.3
    const cloneEl = cardTemplateEl.content // we can access the content of the template element with the content property, which gives us a DocumentFragment containing the elements defined inside the template. Then we can use querySelector to select the li element with class "" inside the template content, and clone it with cloneNode(true) to create a new instance of the card item element that we can customize and add to the DOM.
      .querySelector(".card__item") // select the li element with class "card__item" inside the template content
      .cloneNode(true); // clone it with cloneNode(true) to create a new instance of the card item element that we can customize and add to the DOM. We use true as the argument to cloneNode to indicate that we want to do a deep clone, which means that it will also clone all the child elements inside the li element, so that we can customize those child elements as well.

    // Each card item element should have a link that navigates to the carousel view for that card. So we need to select the link element inside the cloned card item, and set its href attribute to the appropriate URL hash that will navigate to the carousel view for that card when clicked. The URL hash should include the card's ID so that we can identify which card's carousel view to render when the link is clicked.
    const cardLinkEl = cloneEl.querySelector(".card__link");
    cardLinkEl.href = `#carousel/${item.id}`; // we can use a template literal to create the href string, which includes the card's ID from the item object. This way, when the link is clicked, it will navigate to a URL hash like "#carousel/1" or "#carousel/2", where the number corresponds to the ID of the card that was clicked. Then in our router function, we can read this ID from the URL hash and use it to determine which card's carousel view to render.

    // P1P2-T3d gallery property storing their array of gallery. Get the length of this array and use it in a template literal to create the card count text.
    const countEl = cloneEl.querySelector(".card__count");
    countEl.textContent = `${item.gallery.length} Gallery`; // we can use a template literal to create the text content for the card count element, which includes the length of the gallery array from the item object. This way, it will display something like "3 Gallery" or "10 Gallery" based on how many gallery are in that card.

    // P1P2-T3c.3 Each card object stores its color as a hex string. get the corresponding color name. Then use this color name to create the corresponding BEM modifier.
    const color = hexToString(item.color);
    cloneEl.querySelector(".card").classList.add(`card_color_${color}`); // The color modifier belongs on the inner .card <a> element

    // P1P2-T3a.3-1 customizes it (for now, just add the card title)
    const titleEl = cloneEl.querySelector(".card__title"); // be descriptive, don't use cardEl.
    titleEl.textContent = item.name; // assign item.name to its textContent. similar to image with src & alt.

    // P1P2-T3b interactive delete button. When clicked, the card should be removed from the DOM.
    const deleteBtn = cloneEl.querySelector(".card__delete-btn");
    deleteBtn.addEventListener("click", () => {
      // we can add a click event listener to the delete button, and in the event handler function, we can call the remove() method on the cloned card element to remove it from the DOM when the delete button is clicked. This way, when the user clicks the delete button for a card, that card will be removed from the list of gallery displayed on the home view.
      cloneEl.remove();
    });

    return cloneEl; // most have return to how the multiple gallery.
    // without this it will renderCardEl will receive undefined and crash when it tries to prepend it.
  }

  // P1P2-T3a.3-2 creates a card element with createCardEl() and prepends it to the card list element.
  function renderCardEl(item) {
    const titleEl = createCardEl(item); // we can call the createCardEl function to create a new card element for the given item, and then prepend that element to the card container element in the DOM. This way, we can render each card in the gallery array as a card item element in the home view, and they will be displayed in the order they appear in the gallery array (with newer gallery appearing at the top of the list since we are prepending).
    cardContainerEl.prepend(titleEl); // we can use the prepend() method to add the new card element to the beginning of the card container element, so that newer gallery will appear at the top of the list. If we used append() instead, it would add the new card element to the end of the list, which would make newer gallery appear at the bottom.
  }

  // P1P2-T3a.4 Iterate through the gallery array with forEach(), passing it renderCardEl as a callback.
  gallery.forEach(renderCardEl);
}

// P1P2-T4.5 the hash routing instructions.
// this runs router() on initial load.
function renderNotFoundView() {
  homeSection.style.display = "none"; // none=hide other views. flex=use flex in CSS. block=this can't be used in .js if CSS uses flex.
  carouselSection.style.display = "none"; // P1P2-T6.2 none=hide other views. flex=use flex in CSS. block=this can't be used in .js if CSS uses flex.
  notFoundSection.style.display = "flex";
}

/* Main router function that handles hash changes.
 * Reads the current hash and renders the appropriate view.
 */
// this runs router() anytime the hash changes.

function router() {
  const hash = window.location.hash.slice(1) || "home"; // slice() creates new arrays. Splice() modifies original array.

  // the hash routing instructions.
  if (hash === "home" || hash === "") {
    // if the hash is "home" or empty (i.e. no hash), render the home view. This way, the home view will be the default view when the page first loads, since the URL will not have a hash at that point.
    renderHomeView(); // render the home view when the hash is "home" or empty.
  } else if (hash.startsWith("carousel/")) {
    const cardID = hash.split("/")[1]; // if the hash starts with "carousel/", extract the card ID from the hash and render the carousel view for that card. We can extract the card ID from the hash by splitting the hash string on the "/" character and taking the second part (index 1) of the resulting array, which will give us the ID of the card that we want to render in the carousel view. Then we can call the renderCarouselView function with that card object to render the carousel view for that specific card.
    const card = getCardByID(cardID); // we can extract the card ID from the hash by splitting the hash string on the "/" character and taking the second part (index 1) of the resulting array, which will give us the ID of the card that we want to render in the carousel view. Then we can call the renderCarouselView function with that card object to render the carousel view for that specific card.

    homeSection.style.display = "none";
    carouselSection.style.display = "flex"; // ← "flex", not "block"
    notFoundSection.style.display = "none";
    renderCarouselView(card); // render the carousel view for the specified card when the hash starts with "carousel/". We can extract the card ID from the hash by splitting the hash string on the "/" character and taking the second part (index 1) of the resulting array, which will give us the ID of the card that we want to render in the carousel view. Then we can call the renderCarouselView function with that card object to render the carousel view for that specific card.
  } else {
    // any unknown hash (including #about) should show the Not Found view
    renderNotFoundView();
  }
}

// window = global object for hte current tab. actual browser window.
// call the function: addEventListener
window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
