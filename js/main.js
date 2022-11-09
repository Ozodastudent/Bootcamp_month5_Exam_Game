let formEl = document.querySelector(".form");
let selectLevelEl = document.querySelector(".select");
let selectTimeEl = document.querySelector(".select-time");
let questionEl = document.querySelector(".game_question");
let optionListEl = document.querySelector(".list");
let scoreCount = document.querySelector(".count");
let timeCount = document.querySelector(".timer");
let gameModal = document.querySelector(".modal");
let gameModalList = document.querySelector(".modal_list");
let gameModalBtn = document.querySelector(".modal-btn");
let gameModalCloseBtn = document.querySelector(".modal-close");
const heroEl = document.querySelector(".hero");
let gameHeader = document.querySelector(".hero_header");
let gameMainPart = document.querySelector(".hero_body");
let gameStartPage = document.querySelector(".game_main_page");

let easyLevel = roadSymbol.slice(0, 20);
let normalLevel = roadSymbol.slice(0, 40);
let difficultLevel = roadSymbol.slice(0, 70);
let errorBox = [];
let errorCount = 0;
let count = 0;

function getQuestion(arr) {
  let randomQuestionId = arr[Math.floor(Math.random() * arr.length)];
  questionEl.textContent = randomQuestionId.symbol_title;
}

formEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  if ((selectLevelEl.value != "") & (selectTimeEl.value != "")) {
    if (selectLevelEl.value == "all") {
      getQuestion(roadSymbol);
      renderCards(roadSymbol, optionListEl);
    }
    if (selectLevelEl.value == "easy") {
      getQuestion(easyLevel);
      renderCards(easyLevel, optionListEl);
    }
    if (selectLevelEl.value == "medium") {
      getQuestion(normalLevel);
      renderCards(normalLevel, optionListEl);
    }
    if (selectLevelEl.value == "hard") {
      getQuestion(difficultLevel);
      renderCards(difficultLevel, optionListEl);
    }
    if (selectTimeEl.value == 3) {
      let renderHours = 60 * 3;
      startTimer(renderHours, timeCount);
    }
    if (selectTimeEl.value == 5) {
      let renderHours = 60 * 5;
      startTimer(renderHours, timeCount);
    }
    if (selectTimeEl.value == 10) {
      let renderHours = 60 * 10;
      startTimer(renderHours, timeCount);
    }
    gameStartPage.style.display = "none";
    heroEl.classList.add("show-modal");
  }
});

function renderCards(item, element) {
  element.innerHTML = "";
  item.forEach((item) => {
    let newOptionItem = document.createElement("li");
    newOptionItem.classList.add("new_option_item");
    newOptionItem.dataset.id = item.id;
    const listImg = document.createElement("img");
    listImg.src = item.symbol_img;
    listImg.classList.add("card-img");
    listImg.alt = item.symbol_title;
    listImg.dataset.id = item.id;
    const listTrueImg = document.createElement("img");
    listTrueImg.classList.add("list_true");
    listTrueImg.src = "./images/checkmark.gif";
    const listWrongImg = document.createElement("img");
    listWrongImg.src = "./images/error.png";
    listWrongImg.classList.add("list_wrong");
    newOptionItem.appendChild(listImg);
    newOptionItem.appendChild(listTrueImg);
    newOptionItem.appendChild(listWrongImg);
    scoreCount.textContent = count;
    element.appendChild(newOptionItem);
  });
}

function renderErrors(arr, element) {
  element.innerHTML = "";
  arr.forEach((item) => {
    const elItem = document.createElement("li");
    elItem.dataset.id = item.id;
    const modalListImg = document.createElement("img");
    modalListImg.src = item.symbol_img;
    modalListImg.classList.add("modal_list_img");
    modalListImg.alt = item.symbol_title;
    modalListImg.dataset.id = item.id;
    const modalListTitle = document.createElement("p");
    modalListTitle.textContent = item.symbol_title;
    elItem.append(modalListImg, modalListTitle);
    scoreCount.textContent = count;
    element.appendChild(elItem);
  });
}

optionListEl.addEventListener("click", (evt) => {
  if (selectLevelEl.value == "all") {
    renderErrorModal(roadSymbol, evt);
  }
  if (selectLevelEl.value == "easy") {
    renderErrorModal(easyLevel, evt);
  }
  if (selectLevelEl.value == "medium") {
    renderErrorModal(normalLevel, evt);
  }
  if (selectLevelEl.value == "hard") {
    renderErrorModal(difficultLevel, evt);
  }
});

function renderErrorModal(arr, evt) {
  if (evt.target.matches(".card-img")) {
    let btnId = Number(evt.target.dataset.id);
    let itemId = arr.find((item) => item.id === btnId);
    if (itemId.symbol_title == questionEl.textContent) {
      const itemDel = arr.findIndex((item) => item.id === btnId);
      arr.splice(itemDel, 1);
      if (arr.length == "") {
        gameModal.classList.add("show-modal");
        document.querySelector(".modal_count").textContent =
          "Your mark: " + count;
        document.querySelector(".modal_error").textContent =
          "Your mistakes: " + errorCount;
      }
      if (arr.length == "" && errorBox.length == "") {
        document.querySelector(".modal_title").textContent =
          "All of your answers are true";
      }
      evt.target.parentElement.childNodes[1].style.opacity = "0.2";
      evt.target.parentElement.childNodes[3].classList.add("d-block");
      getQuestion(arr);
      count += 2;
      scoreCount.textContent = count;
    } else {
      count--;
      errorCount++;
      setTimeout(function () {
        evt.target.parentElement.classList.add("error");
        setTimeout(function () {
          evt.target.parentElement.classList.remove("error");
        }, 100);
      }, 0);
      if (!errorBox.includes(itemId)) {
        errorBox.push(itemId);
      }
      scoreCount.textContent = count;
      if (errorCount >= 5) {
        gameModal.classList.add("show-modal");
      }
    }
  }
}

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  var timerFunction = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(timerFunction);
    }
    if (timer >= 10) {
      timeCount.style.color = "white";
    } else {
      timeCount.style.color = "red";
    }
    if (timer == 0) {
      gameModal.classList.add("show-modal");
    }
  }, 1000);
}
gameModalBtn.addEventListener("click", function () {
  gameModalBtn.style.display = "none";
  renderErrors(errorBox, gameModalList);
  if (gameModalList.childNodes.length != 0) {
    document.querySelector(".modal-card").style.overflowY = "scroll";
  }
});

gameModalCloseBtn.addEventListener("click", function () {
  gameModal.classList.remove("show-modal");
  window.location.reload();
});
