// NOTE: If using jQuery in JS Stack it before the regular JS scripts!!!
$(document).ready(() => {
  const cardMode = $('#dummy-radio-btn');
  const paymentCardDetails = $('.payment-card-details');

  const tobbeyMode = $('#other-radio-btn');
  const tobbeyDetails = $('.tobbey-details');
  

 // paymentCardDetails.hide();  // Initially hiding the presence of card detials div!
  tobbeyDetails.hide();  // Initially hiding the presence of card detials div!

  // adding 'change' event listener for "radio" btn  to watch whether there is any changes in btn like(:checked/ :unchecked)
  cardMode.on('change', () => {
    if(cardMode.is(':checked')) {  // if :checked means, slideDown...using .stop() function to to trigger this function immediately to happen! without any delay or stuck in stack by passing (true, true) helps to proceed immidiately!
      paymentCardDetails.stop(true, true).slideDown(1000);
      tobbeyDetails.stop(true, true).slideUp(1000);
    }
    else {
      paymentCardDetails.stop(true, true).slideUp(1000);  // This ".stop(true, true)" ensures that any previous animations on these elements are immediately stoped and don't conflict with the new animations.
      tobbeyDetails.stop(true, true).slideDown(1000);
    }
  });

  tobbeyMode.on('change', () => {
    if(tobbeyMode.is(':checked')) {
      tobbeyDetails.stop(true, true).slideDown(1000);
      paymentCardDetails.stop(true, true).slideUp(1000);
    }
    else {
      tobbeyDetails.stop(true, true).slideUp(1000);
      paymentCardDetails.stop(true, true).slideDown(1000);
    }
  });

  const checkBox = $('#if-checked');
  const otherAdd = $('#other-address');

  otherAdd.hide();
  $('#if-checked-hide').hide();
  
  checkBox.on('change', () => {
    if(checkBox.is(':checked')) {
      otherAdd.stop(true, true).slideUp(1000);
      $('#if-checked-hide').fadeOut(970);
    }
    else {
      otherAdd.stop(true, true).slideDown(1000);
      $('#if-checked-hide').fadeIn(1000);
    }
  });
});



const form = document.querySelector('.form-details');

form.addEventListener('input', (e) => {    
  if(e.target.tagName === 'INPUT') {
    const input = e.target;
    const span = input.closest('label').querySelector('.input-placeholder');

    if(input.value.trim() === '') {
      span.style.display = 'none';
      input.style.height = '42px';
    }
    else {
      span.style.display = 'block';
      span.style.marginBottom = "1px";
      input.style.height = '19px';
    }

    // Function to Validate User Email--
    if(input.id === 'email-inp') {
      let userMail = input.value;
      let emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if(userMail === '') {
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
        document.querySelector('.validate-purpose').innerHTML = 'Email is required';
      }
      else if(!emailRegex.test(userMail)) {
        document.querySelector('.validate-purpose').innerHTML = `Enter a valid email`;
      }
      else{
        document.querySelector('.validate-purpose').innerHTML = '';
        input.closest('.email-input-div').style = "";

        // This will Work as Expects bcoz, "input.closest('.email-input-div')" is an DOM element..so, it has .closest() DOM method!
        // But "userMail.closest('.email-input-div')" will not work Bcoz, userMail is always a string!...Its a collection of Email-input's value!
      }
    }

    
    // Function to Validate User's Phone-num1--
    if(input.id === 'user-num1') {
      let phoneNum1 = input.value;

      if(phoneNum1 === '') {
        document.querySelector('.validate-purpose-1').innerHTML = 'Number is required';
      }
      else if((phoneNum1.length >= 10) && (phoneNum1.length < 11)) {
        document.querySelector('.validate-purpose-1').innerHTML = '';
        input.closest('.email-input-div').style = "";
      }
      else {
        document.querySelector('.validate-purpose-1').innerHTML = `Enter a valid phone number`;
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
      }
    }

   // Function to Validate User's Phone-num2--
    if(input.id === 'user-num2' && input) {
      let phoneNum2 = input.value;

      if(phoneNum2 === '') {
        document.querySelector('.validate-purpose-2').innerHTML = 'Number is required';
      }
      else if((phoneNum2.length >= 10) && (phoneNum2.length < 11)) {
        document.querySelector('.validate-purpose-2').innerHTML = '';
        input.closest('.email-input-div').style = "";
      }
      else {
        document.querySelector('.validate-purpose-2').innerHTML = `Enter a valid phone number`;
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
      }
    }

    if(input.id === 'user-address') {
      const userAdd = input.value;

      if(userAdd === '') {
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
      }
      else {
        input.closest('.email-input-div').style = '';
      }
    }

    if(input.id === 'user-city') {
      const userCity = input.value;

      if(userCity === '') {
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
      }
      else {
        input.closest('.email-input-div').style = '';
      }
    }

    if(input.id === 'user-home') {
      const userAdd2 = input.value;

      if(userAdd2 === '') {
        input.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
      }
      else {
        input.closest('.email-input-div').style = '';
      }
    }
  }
});

// Building logic for Bill summary!
let totalMRP = 0;
const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const finalHTML = localStorage.getItem("finalHTML");
const checkOutPage = document.querySelector('.check-out-form-bill');
const emptyCheckoutState = document.querySelector('.if-empty-cart-checkout');

window.addEventListener('load', () => {
if(cartItems.length === 0 || finalHTML === '') {
  checkOutPage.remove(); 
  emptyCheckoutState.style.display = 'block';
}
else {
  let generatedHTML = '';
  cartItems.forEach(product => {
    generatedHTML += `<div class="product-flex-lists">
                        <div class="product-img-name">
                          <img src="${product.img}" alt="">
                          <span class="quantity-count">${product.quantity}</span>
                          <p>${product.name}</p>
                        </div>
                        <p><span>&#8377;${Number(product.price) * Number(product.quantity)}</span></p>
                      </div>`
  });

  const listOfProducts = document.querySelector('.make-it-unscroll');
  listOfProducts.innerHTML = generatedHTML;

  totalMRP = 0;
  const shippingPrice = 100;
  let billHTML = '';

  cartItems.forEach(product => {
    let productCost = Number(product.quantity) * Number(product.price);
    totalMRP += productCost;
  });

  billHTML += `<div class="bill-summary">
                 <p><span class="total-items-count">Subtotal • ${cartItems.length} items</span><span class="sub-price">&#8377;${totalMRP}</span></p>
                 <p class="shipping-cost">Shipping<span class="ship-cost">&#8377;${shippingPrice}</span></p>
                 <p class="grand-total">TOTAL<span class="final-total">&#8377;${totalMRP + shippingPrice}</span></p>
               </div>`;

  listOfProducts.innerHTML += billHTML;
}
});  

function payBtn() {
  const payNowBtn = document.querySelector('.payNowBtn');
  const email = document.getElementById('email-inp');
  const phNum1 = document.getElementById('user-num1');
  const userAddress = document.getElementById('user-address');
  const userCity = document.getElementById('user-city');
  const userAppart = document.getElementById('user-home');


  if(email.value === '' || phNum1.value === '' || userAddress.value === '' || userAppart.value === '' || userCity.value === '') {
    alert('Please fill the neccessary input\'s for deliery purpose');

    // For E-mail
    email.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
    document.querySelector('.validate-purpose').innerHTML = 'Email is required';

    // For Phone--
    phNum1.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
    document.querySelector('.validate-purpose-1').innerHTML = 'Contact number is required';

    userAddress.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
    userAppart.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
    userCity.closest('.email-input-div').style.cssText = `border-color: red;  box-shadow: 0px 0px 2px red;`;
  }
  else {
    payNowBtn.style.cursor = 'wait';
    setTimeout(() => {
      window.location.href = "ShopIn-success-page.html";
      payNowBtn.style.cursor = 'pointer';
    }, 1500);
  }
}
