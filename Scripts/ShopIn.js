// Setting JQuery for Cart Btn to display the Overlay-Cart-Items-Container:
$(document).ready(() => {
  $(".cart-btn").click(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const finalHTML = localStorage.getItem("finalHTML");
    const userName = getCookie("userName");
    const closeInfo = $('.close-cart-popup');
    const aboutCart = $('.cart-empty-review');

    if (finalHTML !== '' && cartItems.length > 0 && userName) {
      aboutCart.hide();
      document.getElementById("main-container").innerHTML = localStorage.getItem("finalHTML");
      document.getElementById("main-container").classList.add("overlay-container");

      $(".overlay-container").fadeToggle(1000);
    }
    else {
      aboutCart.toggle();
      closeInfo.click(() => {
        aboutCart.hide();
      });
    }
  });

  $("#form-close-icon").click(() => {
    $(".login-overlay").fadeOut(1100);
    $(".user-form").fadeOut(1100);
  });

  $(document).on("click", ".cartAddBtn", () => {
    const formOverlay = $(".login-overlay");
    const userForm = $(".user-form");

    const userName = getCookie("userName");
    if (userName === "" || userName === null) {
      formOverlay.fadeIn(1100);
      userForm.fadeIn(1100);
    }
  });

  $(document).on("submit", ".user-form", () => {
    const formOverlay = $(".login-overlay");
    const userForm = $(".user-form");
    const userName = $("#userName");
    const nameRegEx = /^[A-Z][a-z]+$/ ;
    const userMail = $("#userMail");
    const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,}$/;
    const userNum = $("#userNum");

    if ( userName.val() !== "" && nameRegEx.test(userName.val()) && userMail.val() !== ""  && 
         emailRegEx.test(userMail.val()) && userNum.val() !== "" &&
         userNum.val().length >= 10 && userNum.val().length < 11 ) {

      formOverlay.fadeOut(1100);
      userForm.fadeOut(1100);
    }
  });
});

function HandleXBars(x) {
  x.classList.toggle("change");
}

window.addEventListener("load", () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const finalHTML = localStorage.getItem("finalHTML");
  const checkOutState = localStorage.getItem("checkOutState"); // Check if there's a checkout state saved
  const userName = getCookie("userName");

  if ( userName !== "" && userName !== null &&
    cartItems.length > 0 && checkOutState === "true" && finalHTML !== null) {
    // If checkOutState === 'true', meaning the user has previously reached the checkout stage.

    checkOut(); // Display the checkout state if it's stored
    document.getElementById("cart-item-btn-count").innerHTML = cartItems.length;
    document.getElementById("main-container").classList.add("overlay-container");
    document.querySelector(".overlay-container").style.display = "block";
    document.getElementById("main-container").innerHTML = localStorage.getItem("finalHTML");
  } 
  else if (userName !== "" && userName !== null) {
    document.getElementById("cart-item-btn-count").innerHTML = cartItems.length;
  }

  goToTopEvent();
});

// Main function to execute the Items!!!
function displayItems(id) {
  // Fetching the json file through fetch..works bettr thn AJAX!
  fetch("/Data/myProducts.json")
    .then((response) => response.json())
    .then((myObjects) => {
      // Filtering the user clicked filter-id's products in our json file
      const productOfProducts = myObjects
        .filter((product) => product["filter-id"] === id)
        .map((product) => product.products)
        .flat();

      // Making "none" the html page and Make "block" the Fetch area before fetching--
      const globalHome = document.querySelector(".global-view");
      const fetchProducts = document.getElementById("home-block");
      const shopInAbout = document.querySelector(".shopIn-about-detail-note");
      globalHome.style.display = "none";
      shopInAbout.style.display = "none";
      fetchProducts.style.display = "block";

      // Modifing the collection of arrays of obj's into a HTML bootstrap Cards!
      const productInHtml = productOfProducts.map(displayProduct).join("");
      const block = document.querySelector("#main-block");
      block.innerHTML = productInHtml;

      cardImgHeight();
    })
    .catch((error) => {
      handleFetchError(error);
    });

  goToTopEvent();
}

function cardImgHeight() {
  const allImg =  document.querySelectorAll('#main-block img')
  allImg.forEach(img => {
   img.style.cssText = `width: 100%; height: 100%; background-size: cover; background-position: center;  box-shadow: 0px 3px 3px lightgray; border-radius: 25px`;
  });
}

// Making Function for Input-search results---
document.getElementById("form").addEventListener("input", (e) => {
  e.preventDefault();

  const userValue = document.getElementById("search").value.toLowerCase(); // userValue.toLowerCase() prevent from case-sensitive by making user's value as case-insensitive
  const globalHome = document.querySelector(".global-view");
  const fetchProducts = document.getElementById("home-block");
  const block = document.querySelector("#main-block");

    // First check if input is empty
  if(userValue.trim() === '') {
    globalHome.style.display = 'block';
    fetchProducts.style.display = 'none';
    return;             // an immediate return when input is 'empty'.
  }

  fetch("/Data/myProducts.json")
    .then((response) => response.json())
    .then((myObjects) => {
      
      const matchedGrpProducts = myObjects
      .filter(myObject => myObject.keywords.some(keyword => keyword.includes(userValue)))
      .map(product => product.products)
      .flat()

      const matchedProductsList = myObjects
        .map((object) => object.products)
        .flat()
        .filter((product) => product["product-name"].toLowerCase().includes(userValue)
        );

        const allMatchedProducts = [...matchedProductsList, ...matchedGrpProducts];

      // if matched means,...modifying that array into an html content using .map()
      if (allMatchedProducts.length > 0) {
        globalHome.style.display = 'none';
        fetchProducts.style.display = 'block';
        const productHTML = allMatchedProducts.map(displayProduct).join("");
        block.innerHTML = productHTML;
      } 
      else {
        block.innerHTML = `<div class="empty-dashboard-div">
                           <i id="empty-file" class="fa-regular fa-folder-open"></i>
                           <p>Sorry, there are no matches for "${userValue}"</p>
                         </div>
                         <div style="text-align:center; font-size: 25px; margin: 25px; margin-bottom: 35px;">Also You can Check the other related products</div>`;
      }
      cardImgHeight();
    })
    .catch((error) => {
      handleFetchError(error);
    });

  goToTopEvent();
});

function displayComItems(id1, id2) {
  const block = document.querySelector("#main-block");

  fetch("/Data/myProducts.json")
    .then((response) => response.json())
    .then((myObjects) => {
      // filtering the product items by
      const mensProduct = myObjects
        .filter((product) => product["filter-id"] === id1)
        .map((product) => product.products)
        .flat();

      const womensProduct = myObjects
        .filter((product) => product["filter-id"] === id2)
        .map((product) => product.products)
        .flat();

      // Making "none" the html page and Make "block" the Fetch area before fetching--
      const globalHome = document.querySelector(".global-view");
      const fetchProducts = document.getElementById("home-block");
      globalHome.style.display = "none";
      fetchProducts.style.display = "block";

      // Modifing the collection of arrays of obj's into a HTML bootstrap Cards!
      const mensProductHTML = mensProduct.map(displayProduct).join("");
      const womensProductHTML = womensProduct.map(displayProduct).join("");
     
      block.innerHTML = mensProductHTML;
      block.innerHTML += womensProductHTML;

      cardImgHeight();
    })
    .catch((error) => {
      handleFetchError(error);
    });

  goToTopEvent();
}

// Making Function to handle ERROR Block
function handleFetchError(error) {
  console.log("Error : " + error);
  const globalHome = document.querySelector(".global-view");
  const fetchProducts = document.getElementById("home-block");
  const shopInAbout = document.querySelector(".shopIn-about-detail-note");
  const block = document.getElementById("main-block");
  globalHome.style.display = "none";
  shopInAbout.style.display = "none";
  fetchProducts.style.display = "block";
  block.innerHTML = `<h1 style="text-align : center; margin: 3em 0 4em;">Sorry, Unable to fetch data please try again later</h1>`;
}

// Making function for the list of products....that how we  going to print!
function displayProduct(product) {
  // Creating a dummy attri! (data-id) is for identifying the current Product-card!!!
  return `  <div data-id="${product["product-id"]}" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card shadow-sm" style="width: 100%;">
              <img src="${product.imgSrc}" class="card-img-top rounded product-card-image" alt="${product.imgSrc}">
              <div class="card-body mb-2">
                <h5 class="card-title text-dark">${product["product-name"]}</h5>
                <p class="card-text display-6">&#8377;${product.price}</p>
                <span class= "greeting-msg"></span><br/>
                <button class="btn bg-dark ps-4 pe-4 pt-2 pb-2 text-light cartAddBtn" onclick= "addToCart(${product["product-id"]},'${product["product-name"]}','${product.imgSrc}',${product.price})">Add to Cart</button>
              </div>
            </div>
          </div> `;
  // in addToCart btn...we want ensure with adding single quotes('') inside the onclick function only for Alphabetic letters..not for 'product-id' and 'product-price' bcoz these are numbers by nature!
}

// Making function for the Home list-item to extract and print the all products of items in the O/P;
function backToHome() {
  const fetchProducts = document.getElementById("home-block");
  const homePage = document.querySelector(".global-view");
  const shopInAbout = document.querySelector(".shopIn-about-detail-note");
  fetchProducts.style.display = "none";
  homePage.style.display = "block";
  shopInAbout.style.display = "block";

  goToTopEvent();
}

// Making function for Checking the Items from Cart:
function checkingCart(id, name, imgSrc, price) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]"); // Note: Json.parse() => converts str into an JS Obj, iSo that I denote '[]' so tht it would return []

  if (!Array.isArray(cartItems)) {
    // This condition Intentionally make the extracted item from localStorage to an array!----
    cartItems = []; // Reset to an empty array if it's not
  }

  let isMatchingId = false;

  cartItems.forEach((item) => {
    if (item.id === id) {
      alert(`The Product ${name} is already in the cart!`);
      isMatchingId = true;
      return;
    }
  });

  if (!isMatchingId) {
    cartItems.push({
      id: id,
      name: name,
      price: price,
      img: imgSrc,
      quantity: 1,
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  

    // Updating Cart Count---
    document.getElementById("cart-item-btn-count").innerHTML = cartItems.length;
  
    // Apply greeting msg---Better try..but this below part is only not working for 1st click...other than it's Good!!!
    const CartGreeetingMsg = document.querySelector( `[data-id="${id}"] .greeting-msg` );
  
    let interval = null;
    interval = setInterval(() => {
      if (CartGreeetingMsg) {
        CartGreeetingMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Cart added!`;
        CartGreeetingMsg.style.opacity = "1";
      }
    }, 0);
  
    setTimeout(() => {
      clearInterval(interval);
      CartGreeetingMsg.remove();
      CartGreeetingMsg.style.opacity = "0";
    }, 1000);
  } 
}

// Function for Add to Cart!
function addToCart(id, name, imgSrc, price) {
  const userName = getCookie("userName"); // passing "userName" arg to getCookie();

  if (userName !== "" && userName !== null) {
    checkingCart(id, name, imgSrc, price);

    // Create a HTML generated block to display the user clicked product's cart details in the cartItems!!!
    const overlayContainer = document.querySelector("#main-container");
    const existedCart = overlayContainer.querySelector(`#product-${id}`); // Using querySelector..it gets the first matched "ID"!! (NOTE: It not works in id that starts with (numeric!) That's y? I used (product-id) ==>(product-10) using this way not affect the process)
    if (existedCart) {
      return;
    }

    if (overlayContainer) {
      overlayContainer.classList.add("overlay-container");
    }

    // Making an <h1> element with <span> to Display cookie value!
    if (!document.getElementById("cookie-h1")) {
      const headOne = document.createElement("h1");
      const cookieSpan = document.createElement("span");

      headOne.id = "cookie-h1";
      headOne.setAttribute("class", "col-12 text-center mb-4");
      cookieSpan.id = "cookie-name";

      headOne.innerHTML = "Welcome Mr.";
      cookieSpan.innerHTML = `${userName}`;

      headOne.appendChild(cookieSpan);
      overlayContainer.appendChild(headOne);
    }

    // Creating an element <div class="cart-container">
    const cartContainer = document.createElement("div");
    cartContainer.id = `product-${id}`;
    cartContainer.setAttribute("class", "cart-container");
    cartContainer.innerHTML = ` <p id="para-name">Product Name: <span id="product-name">${name}</span></p>
                                 <label id="quantity">Quantity: <button id="minus-btn" onclick="subQuantity(${id})">-</button> <span class="items">1</span> <button id="plus-btn" onclick="plusQuantity(${id})">+</button></label>
                                <p id="para-price">Price: <span id="price">&#8377;${price}</span></p>
                                 <button id="delBtn" onclick="removeItem(${id},'${name}',${price},'${imgSrc}')">Delete</button>`;

    // Creating the Last 2 btns (Clear All) and (Check-Out)  Dynamically
    const lastBtns1 = document.getElementById("last-btns"); // for checking if the 2 btns are there in the overlay..it ensure to avoide the duplicates!
    if (!lastBtns1) {
      // if not means
      const lastBtns = document.createElement("div"); // Creating a div and setting an id for that i.e:(<div id="last-btns">)
      lastBtns.id = "last-btns"; // After creating we need to make the HTML btn content to print!
      overlayContainer.appendChild(lastBtns);
      lastBtns.innerHTML = ` <button id="del-all" onclick="clearAll()">Clear All</button>
                             <button id="check" onclick="checkOut()">Check-Out</button>`;
    }

    // Appending the cartContainer div to overlay div!!!
    overlayContainer.insertBefore(cartContainer, document.getElementById("last-btns"));

    // This div was the cart div.....we must update other div in below this!!!!!
    localStorage.setItem( "finalHTML", document.getElementById("main-container").innerHTML );

    populateQuantity(id);
  } 
  else {
    const userForm = document.querySelector(".user-form");

    userForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let userName = document.getElementById("userName").value;
      const userMail = document.getElementById("userMail").value;
      const userNum = document.getElementById("userNum").value;
      const inValidNameMsg = document.querySelector(".invalid-input-name");
      const inValidMailMsg = document.querySelector(".invalid-input-mail");
      const inValidNumMsg = document.querySelector(".invalid-input-num");
      const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,}$/;
      const nameRegEx = /^[A-Z][a-z]+$/ ;

      let isValid = true; // Initialized that this Form is Valid!(true); This often will change when any the cond! not met

      // Validation for User's Number
      if (userNum === "") {
        inValidNumMsg.innerHTML = "Number is required";
        isValid = false; // If UserNum failed to met Condition ===> Not Valid(false);
      } 
      else if ( userNum.length < 10 || userNum.length >= 11 || isNaN(userNum) ) {
        inValidNumMsg.innerHTML = "Enter a valid number";
        isValid = false;
      } 
      else {
        inValidNumMsg.innerHTML = "";
      }

      // Validation for User's Mail
      if (userMail === "") {
        inValidMailMsg.innerHTML = "Email is required";
        isValid = false; // If UserMail failed to met Condition ===> Not Valid(false);
      } 

      else if (!emailRegEx.test(userMail)) {
        inValidMailMsg.innerHTML = "Enter a valid email";
        isValid = false;
      } 
      else {
        inValidMailMsg.innerHTML = "";
      }

      // Validation for User's Name
      if(userName === "") {
        inValidNameMsg.innerHTML = "Username is required";
        isValid = false;
      }
      else if (!nameRegEx.test(userName)) {
        inValidNameMsg.innerHTML = "Username must start with capital letter";
        isValid = false; 
      } 
      else if (userName.length < 3) {
        inValidNameMsg.innerHTML = "Username must atleast have more than 3 characters";
        isValid = false;
      } 
      else {
        inValidNameMsg.innerHTML = "";
      }

      // Now Checking the Condition (isValid), If It "true" ===> this block will Execute.
      // If "false" ===> (i.e) if any of the block's condition met failed means..Form not get Submited!
      if (isValid) {
        const uName = userName;

        if (uName !== "" && uName !== null) {
          setCookie("userName", uName);

          // When a new user login via Form...It's better to clear all the existing data in localStorage related to this Shopping Website!!!
          localStorage.removeItem("cartItems");
          localStorage.removeItem("finalHTML");
          localStorage.removeItem("checkOutState");

          checkingCart(id, name, imgSrc, price);

          // After entering userName via Prompt!...insert the cartItems....dynamically
          const userName = getCookie("userName");
          document.getElementById("main-container").classList.add("overlay-container");

          const returnCartHTML = ` <h1 id="cookie-h1" class="col-12 text-center mb-4 h">Welcome Mr.<span id="cookie-name">${userName}</span></h1>
                                      <div id="product-${id}" class="cart-container">
                                        <p id="para-name">Product Name: <span id="product-name">${name}</span></p>
                                         <label id="quantity">Quantity: <button id="minus-btn" onclick="subQuantity(${id})">-</button> <span class="items">1</span> <button id="plus-btn" onclick="plusQuantity(${id})">+</button></label>
                                        <p id="para-price">Price: <span id="price">&#8377;${price}</span></p>
                                        <button id="delBtn" onclick="removeItem(${id},'${name}',${price},'${imgSrc}')">Delete</button>
                                      </div>
                            
                                      <div id="last-btns">
                                        <button id="del-all" onclick="clearAll()">Clear All</button>
                                        <button id="check" onclick="checkOut()">Check-Out</button>
                                      </div>`;

          document.getElementById("main-container").innerHTML = returnCartHTML;
          localStorage.setItem("finalHTML", returnCartHTML);

          populateQuantity(id);
        }
      }
    });
    document.getElementById("userName").value = "";
    document.getElementById("userMail").value = "";
    document.getElementById("userNum").value = "";
  }
}

document.getElementById("userName").addEventListener("input", (e) => {
  const userNameData = e.target.value;
  const inValidNameMsg = document.querySelector(".invalid-input-name");
  const nameRegEx = /^[A-Z][a-z]+$/ ;

  if(userNameData === "") {
    inValidNameMsg.innerHTML = "Username is required";
  }
  else if(!nameRegEx.test(userNameData)) {
    inValidNameMsg.innerHTML = "Username must start with capital letter";
  }
  else if (userNameData.length < 3) {
    inValidNameMsg.innerHTML = "Username must atleast have more than 3 characters";
  } 
  else {
    inValidNameMsg.innerHTML = "";
  }
});

document.getElementById("userMail").addEventListener("input", (e) => {
  const userMailData = e.target.value;
  const inValidMailMsg = document.querySelector(".invalid-input-mail");
  const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,}$/;

  if (userMailData === "") {
    inValidMailMsg.innerHTML = "Email is required";
  } 
  else if (!emailRegEx.test(userMailData)) {
    inValidMailMsg.innerHTML = "Enter a valid email";
  } 
  else {
    inValidMailMsg.innerHTML = "";
  }
});

document.getElementById("userNum").addEventListener("input", (e) => {
  const userNumData = e.target.value;
  const inValidNumMsg = document.querySelector(".invalid-input-num");

  if (userNumData === "") {
    inValidNumMsg.innerHTML = "Number is required";
  } 
  else if ( userNumData.length < 10 || userNumData.length >= 11 || isNaN(userNumData) ) {
    inValidNumMsg.innerHTML = "Enter a valid number";
  } 
  else {
    inValidNumMsg.innerHTML = "";
  }
});

// Now Let's start making function for removeItem();
function removeItem(id, name, price, imgSrc) {
  // STEP-1  Getting items from the localStorage! and make them parsed--
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  if (!Array.isArray(cartItems)) {
    cartItems = []; // Reset to an empty array if it's not
  }

  //  STEP-2  Need to filter the "product's id" and delete it frm Both array and localStorage---
  cartItems.forEach((item, index) => {
    if (
      item.id === id &&
      item.name === name &&
      item.price === price &&
      item.img === imgSrc
    ) {
      cartItems.splice(index, 1);
    }
  });

  // Instantly Updating the changes of Respective Arrays [], into localStorage---
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  //  STEP-3 Now, Delete it from DOM! - Need to get the Product's ID to delete it out!
  const productId = document.getElementById(`product-${id}`); // Ensure that to recieve function (arg) as an "id"  don't denote it in STRING!!
  if (productId) {
    productId.remove();
  }

  //  STEP-4 Wants to Hide the overlayContainer---
  const overlayContainer = document.getElementById("main-container");
  const lastBtns = document.getElementById("last-btns");
  const allCartContainer = overlayContainer.querySelectorAll(".cart-container");

  // Making Perfect Condition to hide the overlayContainer only when the cartContainer.length gets === 0!
  if (allCartContainer.length === 0) {
    overlayContainer.classList.remove("overlay-container");
    overlayContainer.innerHTML = "";
    lastBtns.remove();
    document.cookie = "userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    localStorage.setItem("cartItems", "");
    localStorage.setItem("finalHTML", "");
  } else {
    // Atlast Save all the contents inside the overlayContainer to
    localStorage.setItem(
      "finalHTML",
      document.getElementById("main-container").innerHTML
    );
  }

  // STEP-5 Update Cart Count after removal of item
  document.getElementById("cart-item-btn-count").innerHTML = cartItems.length;
}

function clearAll() {
  const overlayContainer = document.getElementById("main-container");

  if (overlayContainer) {
    overlayContainer.innerHTML = "";
    overlayContainer.classList.remove("overlay-container");
    localStorage.setItem("cartItems", "");
    localStorage.setItem("finalHTML", "");
    localStorage.setItem("checkOutState", "");
    document.cookie = "userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  document.getElementById("cart-item-btn-count").innerHTML = "0";
}

// Function for Quantity incre--
function plusQuantity(productId) {
  // getting overlay-container-- for..making loop through and getting all plusBtn to modify---
  const overlayContainer = document.getElementById("main-container");

  // Using overlay-container..getting all the plus-btn inside it! for event listener---
  const plusBtn = overlayContainer.querySelectorAll("#plus-btn");

  // This step is IMPORTANT--using querySelector i'm getting the exact ".items" i.e: <span>....bcoz...btn trigger OKAY..but reaction that btn triggered span tag ku dhn nadakanum!!
  let itemCount = document.querySelector(`#product-${productId} .items`);

  // adding Event Listeners for '+' btn whenever it clicks in and out...this function will trigger!
  plusBtn.forEach((plus) => {
    plus.addEventListener("mousedown", (e) => {
      if (e.target.id === "plus-btn") {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });

    plus.addEventListener("mouseup", (e) => {
      if (e.target.id === "plus-btn") {
        e.target.style.transform = "";
      }
    });
  });

  let currentCount = Number(itemCount.textContent);
  if (currentCount) {
    currentCount++;
    itemCount.innerHTML = currentCount;
    populateQuantity(productId);
  }
  localStorage.setItem(
    "finalHTML",
    document.getElementById("main-container").innerHTML
  );
}

function subQuantity(productId) {
  // NOTE: Never forget to include css selector while using querySelector...

  const overlayContainer = document.getElementById("main-container");
  const subBtn = overlayContainer.querySelectorAll("#minus-btn");
  let itemCount = document.querySelector(`#product-${productId} .items`); // .items => refers to <span> tag...I.E:  currently clicked btn's current (product's id)'s present <span> tag which is inside the cartContainer!!!

  subBtn.forEach((sub) => {
    sub.addEventListener("mousedown", (e) => {
      if (e.target.id === "minus-btn") {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });

    sub.addEventListener("mouseup", (e) => {
      if (e.target.id === "minus-btn") {
        e.target.style.transform = "";
      }
    });
  });

  let currentCount = Number(itemCount.textContent);
  if (currentCount === 1) {
    return;
  } else {
    currentCount--;
    itemCount.innerHTML = currentCount;
    populateQuantity(productId);
  }
  localStorage.setItem(
    "finalHTML",
    document.getElementById("main-container").innerHTML
  );
}

function populateQuantity(productId) {
  // getting the "cartItems" from the localStorage...
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // getting the current Quantity count from the DOM!
  let itemCount = Number(
    document.querySelector(`#product-${productId} .items`).textContent
  );

  let isMatchingId = false; // Initially There is no matching/repeated Product ID exists, So, It sets to false

  if (!Array.isArray(cartItems)) {    // this condition checks the cartItems is an Array or not..this (! NOT) Operator negalate the result
    cartItems = [];
  }

  cartItems.forEach((item) => {
    if (item.id === productId) {
      // NOTE:  item => item.id === productId,  In this item.id  this "id" refers to the key name of obj inside an array...that we push into it in later steps!!!
      item.quantity = itemCount;
      isMatchingId = true; // One matching ID is exists...so, the Flag is now sets to true!
    }
  });

  // Now the flag is True, means there is matching/existed ID of product....And We making it false to push the ID and Quantity in an Obj format into an Array!
  if (!isMatchingId) {
    cartItems.push({
      id: productId,
      quantity: itemCount,
    });
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // very very Important!!! to save the changes that we made in cart list..I.E: cart-quantity-count!
  localStorage.setItem( "finalHTML", document.getElementById("main-container").innerHTML );
}

// Making function for checkOut()
let totalMRP = 0; // Globally Initializing the "totalMRP" as "0", so that can get acess easily everywhere!

function checkOut() {
    const overlay = document.querySelector(".check-out-overlay");
    const myCart = document.querySelector(".myCart");
    const orderSummary = document.querySelector(".check-out-bill");

    overlay.style.display = "block";  
    myCart.style.display = "block";
    orderSummary.style.display = "block";
    document.querySelector(".empty-bag").style.display = "none";
    

    // Retrieving Data from localStorage!
    let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    if (cartItems !== null) {
      let generatedHTML = "";

      cartItems.forEach((product) => {
        generatedHTML += ` <div id="products-${product.id}" class="list-of-products">
                            <div class="product-img">
                              <img src="${product.img}" alt="">
                            </div>
                    
                            <div class="product-details">
                              <p class="product-name">${product.name}</p>
                              <p class="product-price">&#8377;${product.price}</p>
                              <p class="product-quantity">
                                <label id="qty">Qty: <button class="decrease-btn" onclick="minusQuantity(${product.id})">-</button> <span class="item" id="counts">${product.quantity}</span> <button class="increase-btn" onclick="addQuantity(${product.id})">+</button></label>
                              </p>
                              <p class="delivery"><i class="fa-solid fa-truck-fast"></i> Standard Delivery Available • Pay and Pick Available</p><hr>
                              <div class="remove-this">
                                <button onclick="removeItem1(${product.id})">Remove</button>
                              </div>
                            </div>
                         </div>`;
      });

      const flexProduct = document.querySelector(".flex-product");
      flexProduct.innerHTML = generatedHTML;

      let billGeneratedHTML = "";
      const shippingPrice = 100;

      updateBill(); // First of all, the Idea behind making this function to use it anywhere we wnat to render the product's price,quantity changes this will reflect on the totalMRP!

      billGeneratedHTML += `<h2>ORDER SUMMARY</h2><hr>
                           <p class="total-amount">Total MRP <span class="total-price">&#8377;${totalMRP}</span></p>
                           <p class="tax">Tax <span>&#8377;0</span></p>
                           <p class="shipping-charges">Shipping Charges <span class="shippings">&#8377;${shippingPrice}</span></p><hr>
                           <p class="final-amnt">Total Amount Payable <span class="amount-payable">&#8377;${
                             totalMRP + shippingPrice
                           }</span></p>
                           <button class="proceed-to-pay-btn" onclick="proceedToPay()">PROCEED TO PAY</button>`;

      const orderSummary = document.querySelector(".check-out-bill");
      orderSummary.innerHTML = billGeneratedHTML;

      // I'M Trying to Storing this function only IMP! process in sessionStorage!

      const checkOutState = {
        cartItems: cartItems,
        totalMRP: totalMRP,
        shippingPrice: shippingPrice,
        generatedHTML: generatedHTML,
        billGeneratedHTML: billGeneratedHTML,
      };

      localStorage.setItem("checkOutState", JSON.stringify(checkOutState));
    }
}

function removeItem1(productId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  cartItems.forEach((item, index) => {
    if (item.id === productId) {
      cartItems.splice(index, 1);
    }
  });

  const product = document.getElementById(`products-${productId}`);
  if (product) {
    product.remove();
  }

  // const flexProduct = document.querySelectorAll(`.flex-product #products-${productId}`);    NOTE: This technique doesn't work!!! BCOZ...that is ID (Unique). so, if that unique item deleted means quickly....this condition get Executed!(display:none;)

  const flexProduct = document.querySelector(".flex-product");
  const allCheckOutProducts = flexProduct.querySelectorAll(".list-of-products");

  if (allCheckOutProducts.length === 0) {
    const orderSummary = document.querySelector(".check-out-bill");
    orderSummary.style.display = "none";

    const emptyBag = document.querySelector(".empty-bag");
    emptyBag.style.display = "block";

    document.cookie = "userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    localStorage.setItem("cartItems", "");
    localStorage.setItem("checkOutState", "");
    localStorage.setItem("finalHTML", "");
  }

  // If User clicks the remove btn in checkOut page...that clicked item will get deleted .... also..that same item in cart List..need deletes too!....for that we need to call that respective function for that cart List items..in order to delete!
  removeItem(productId);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  document.getElementById("cart-item-btn-count").innerHTML = cartItems.length;

  updateBill();
}

function addQuantity(productId) {
  let itemCount = document.querySelector(`#product-${productId} .items`); // .items => refers to <span> tag...I.E:  currently clicked btn's current (product's id)'s present <span> tag which is inside the cartContainer!!!
  let spanCount = document.querySelector(`#products-${productId} .item`);
  const increaseBtn = document.querySelectorAll(".increase-btn");

  increaseBtn.forEach((button) => {
    button.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("increase-btn")) {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });

    button.addEventListener("mouseup", (e) => {
      if (e.target.classList.contains("increase-btn")) {
        e.target.style.transform = "none";
      }
    });
  });

  let currentCount = Number(spanCount.textContent);
  let currentCount1 = Number(itemCount.textContent);

  if (currentCount || currentCount1) {
    currentCount++;
    currentCount1++;
    spanCount.innerHTML = currentCount;
    itemCount.innerHTML = currentCount1;
    populateQuantity(productId);
  }

  updateBill();
}

function minusQuantity(productId) {
  let itemCount = document.querySelector(`#product-${productId} .items`);
  let spanCount = document.querySelector(`#products-${productId} .item`);

  const decreaseBtn = document.querySelectorAll(".decrease-btn");

  decreaseBtn.forEach((button) => {
    button.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("decrease-btn")) {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });

    button.addEventListener("mouseup", (e) => {
      if (e.target.classList.contains("decrease-btn")) {
        e.target.style.transform = "none";
      }
    });
  });

  let currentCount = Number(spanCount.textContent);
  let currentCount1 = Number(itemCount.textContent);
  if (currentCount === 1 || currentCount1 === 1) {
    return;
  } else {
    currentCount--;
    currentCount1--;
    spanCount.innerHTML = currentCount;
    itemCount.innerHTML = currentCount1;
    populateQuantity(productId);
  }

  updateBill();
}

function updateBill() {
  // NOTE: This totalMRP is already declared Globally!
  totalMRP = 0; // Reseting totalMRP variable to '0' will update through looping over cartItems and update!
  const shippingPrice = 100;

  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  cartItems.forEach((summary) => {
    let productCost = Number(summary.price) * Number(summary.quantity);
    totalMRP += productCost;
  });

  const totalCost = document.querySelector(".total-price");
  if (totalCost) {
    // NOTE: It is Very Important to make check whether the DOM element is available or not through IF Condition!
    totalCost.innerHTML = `&#8377;${totalMRP}`;
  }
  const amountPayable = document.querySelector(".amount-payable");
  if (amountPayable) {
    amountPayable.innerHTML = `&#8377;${totalMRP + shippingPrice}`;
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function goBack() {
  const overlay = document.querySelector(".check-out-overlay");
  overlay.style.display = "none";

  const myCart = document.querySelector(".myCart");
  myCart.style.display = "none";
}

function continueShopping() {
  const emptyBag = document.querySelector(".empty-bag");
  emptyBag.style.display = "none";

  const overlay = document.querySelector(".check-out-overlay");
  overlay.style.display = "none";

  const myCart = document.querySelector(".myCart");
  myCart.style.display = "none";
}

function proceedToPay() {
    const proceedToPay =  document.querySelector('.proceed-to-pay-btn');
    localStorage.setItem("checkOutState", "true");
    proceedToPay.style.cursor = 'wait';

    setTimeout(() => {
      window.location.href = "ShopIn-check-out.html"; 
      proceedToPay.style.cursor = 'pointer';
    }, 1300);
}

// Final Step!!!  Making Cookie for our Application! to ensue user login;
function setCookie(cName, cValue) {
  let myCookie = cName + "=" + cValue;
  let date = new Date();
  // date.setMinutes(date.getMinutes() + 3);
  date.setHours(date.getHours() + 1); // Cookie setting to 1hour!
  document.cookie = `${myCookie};expires=${date.toUTCString()};path=/`; // DON'T leave space inB/W while setting cookie!
}
function getCookie(cName) {
  let myCookie = cName + "="; // setting up myCookie to get search for...
  const decodedCookie = decodeURIComponent(document.cookie);
  // decoded cookie la iruka ; padi split pannren and that signifies as an array!

  // Making split up cookie with signing ";" ==> ,
  const cookieArray = decodedCookie.split(";"); // ['name=value', 'expires=date', 'path']

  // using loop to extract values! Bcoz all the key:value of document.cookie is now an Array!
  for (let i = 0; i < cookieArray.length; i++) {
    const currentCookie = cookieArray[i].indexOf(myCookie);
    if (currentCookie !== -1) {
      let value = cookieArray[i].substring(cookieArray[i].indexOf("=") + 1);
      if (value === "") {
        continue;
      } else {
        return value;
      }
    }
  }
  return ""; // if empty means return that empty....only after the loop finishes!
}

// Making function for go-to top
const goToTop = document.getElementById("go-to-top-btn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 250) {
    goToTop.style.display = "block";
  } else {
    goToTop.style.display = "none";
  }
});

function goToTopEvent() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Making function for carousel to display food items
let currentIndex = 0; // setting current index position as 0
const productPerView = 2; // viewport of per slide is 1(product-item)
const ulFoodContainer = document.querySelector(".product-list"); // getting ul
let allFoodItems = document.querySelectorAll(".product-item"); // getting all li
const totalFoodItems = allFoodItems.length; // getting li's total length

function moveCarousel(direction) {
  let FoodItemsWidth = document.querySelector(".product-item").offsetWidth + 14; // get an element's width including padding and border

  if (direction === "front") {
    // translateX(-value) moves the container in Clock-wise direction.
    if (currentIndex + productPerView < totalFoodItems) {
      currentIndex++;
      ulFoodContainer.style.transform = `translateX(-${
        currentIndex * FoodItemsWidth
      }px)`;
    }
  } else if (direction === "back") {
    if (currentIndex > 0) {
      currentIndex--;
      ulFoodContainer.style.transform = `translateX(-${
        currentIndex * FoodItemsWidth
      }px)`;
    }
  }
}

// Making function for email-validation
function validationMailBtn() {
  const subscribeBtn = document.querySelector("#email-subs-btn");
  const userEmailValue = document.querySelector("#email-box-last").value;
  const validateMsg = document.querySelector(".email-validation-quotation");
  let mailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let isMailValid = true;

  if (userEmailValue === "" && subscribeBtn.innerHTML === "Subscribe") {
    validateMsg.innerHTML = "Email is required";
    isMailValid = false; // Telling that invalid
  } 
  else if (!mailRegex.test(userEmailValue)) {
    validateMsg.innerHTML = "Please Enter a valid email";
    isMailValid = false; // Telling that invalid
  } 
  else {
    validateMsg.innerHTML = "";
  }

  return isMailValid;
}

let emailBox = document.querySelector("#email-box-last");
emailBox.addEventListener("input", (e) => {
  e.preventDefault();
  validationMailBtn();
});

function proceedSubs() {
  const mailBox = document.querySelector("#email-box-last");

  // If validationMailBtn() returns ===> true means,
  if (validationMailBtn()) {
    document.querySelector("#email-subs-btn").style.cursor = "wait";

    setTimeout(() => {
      document.querySelector("#email-subs-btn").style.cursor = "pointer";
    }, 1300);

    setTimeout(() => {
      document.querySelector("#email-subs-btn").innerHTML = "Subscribed";
      alert("Thank you for Subcription");
    }, 900);

    setTimeout(() => {
      mailBox.value = "";
    }, 2000);
  } 
  else {
    document.querySelector("#email-subs-btn").innerHTML = "Subscribe";
  }
}

const date = new Date();
const currentYear = date.getFullYear();
document.getElementById('current-year-shopin').innerText = currentYear;