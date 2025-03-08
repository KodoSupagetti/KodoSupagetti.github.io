'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// TODO: enable to select mobile responsive category
// select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
// const form = document.querySelector("[data-form]");
// const formInputs = document.querySelectorAll("[data-form-input]");
// const formBtn = document.querySelector("[data-form-btn]");

// // add event to all form input field
// for (let i = 0; i < formInputs.length; i++) {
//   formInputs[i].addEventListener("input", function () {

//     // check form validation
//     if (form.checkValidity()) {
//       formBtn.removeAttribute("disabled");
//     } else {
//       formBtn.setAttribute("disabled", "");
//     }

//   });
// }



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

const startInput = document.querySelector('input[name="start"]');
const videoText = document.getElementById("mediashare-text");

function updateVideoText() {
  const startSeconds = parseInt(startInput.value) || 0;
  const endSeconds = startSeconds + 60;
  videoText.textContent = `The video will play from second ${startSeconds} to ${endSeconds}`;
}

// Run once when page loads
updateVideoText();

// Add event listeners to detect changes in input values
startInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value === "" || this.value < 0) {
    this.value = 0;
  }
  this.addEventListener("input", updateVideoText);
})

const form = document.querySelector("[data-form]");
const inputs = document.querySelectorAll("[data-form-input]");
const submitButton = document.querySelector("[data-form-btn]");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Check if the user has sent in the last 5 minutes
  const lastSentTime = localStorage.getItem("lastSentTime");
  const now = Date.now();

  if (lastSentTime && now - lastSentTime < 5 * 60 * 1000) {
    alert("You can only send a message once every 5 minutes.");
    return;
  }

  // Get value from form input
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    youtube: formData.get('youtube'),
    start: formData.get('start')
  };

  try {
    const response = await fetch("https://murmuring-savannah-14363-f13e51393712.herokuapp.com/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        alert("Permintaan tidak valid. Pastikan data yang Anda masukkan benar.");
      } else if (response.status === 429) {
        alert("Terlalu banyak permintaan. Silakan coba lagi nanti.");
      } else {
        throw new Error("Gagal mengirim pesan. Silakan coba lagi.");
      }
      return;
    }

    // Save last sent time
    localStorage.setItem("lastSentTime", Date.now());

    // Reset form after success
    inputs.forEach((input) => (input.value = ""));
    alert("Your message has been sent successfully!");
  } catch (error) {
    alert(error.message);
  }
});
