// ==========================================
// FEATURE 1: PRE-ORDER ESTIMATOR
// ==========================================

// Array of Objects storing menu item data
const bakeryMenu = [
  { id: "sourdough", name: "Artisanal Sourdough Loaf", price: 8.50 },
  { id: "cake-jars", name: "Custom Cake Jars (6-Pack)", price: 24.00 },
  { id: "croissants", name: "Butter Croissant Box (4-Pack)", price: 14.00 },
  { id: "custom-cake", name: "Specialty Celebration Cake", price: 45.00 }
];

// 1. Populate options dynamically from array
function populateMenuOptions(menuItems, selectElement) {
  selectElement.innerHTML = "";
  menuItems.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} ($${item.price.toFixed(2)})`;
    selectElement.appendChild(option);
  });
}

// 2. Helper function: Find price by item ID
function getUnitPrice(itemId, menuItems) {
  const selectedItem = menuItems.find(item => item.id === itemId);
  return selectedItem ? selectedItem.price : 0;
}

// 3. Helper function: Calculate total amount
function calculateTotalAmount(unitPrice, quantity) {
  const validQty = Math.max(1, parseInt(quantity) || 1);
  return unitPrice * validQty;
}

// 4. Update total display on the screen
function updateEstimateDisplay() {
  const selectElem = document.getElementById("product-select");
  const qtyElem = document.getElementById("quantity-input");
  const totalElem = document.getElementById("total-price");

  if (!selectElem || !qtyElem || !totalElem) return;

  const unitPrice = getUnitPrice(selectElem.value, bakeryMenu);
  const total = calculateTotalAmount(unitPrice, qtyElem.value);

  totalElem.textContent = `$${total.toFixed(2)}`;
}

// Initialize Interactive Estimator
function initEstimator() {
  const productSelect = document.getElementById("product-select");
  const quantityInput = document.getElementById("quantity-input");

  if (productSelect && quantityInput) {
    populateMenuOptions(bakeryMenu, productSelect);
    updateEstimateDisplay();

    productSelect.addEventListener("change", updateEstimateDisplay);
    quantityInput.addEventListener("input", updateEstimateDisplay);
  }
}

// ==========================================
// STEP 3: FORM VALIDATION LOGIC
// ==========================================

// Helper: Show specific error message
function showError(elementId, message) {
  const errorElem = document.getElementById(elementId);
  if (errorElem) {
    errorElem.textContent = message;
    errorElem.style.color = "#d9534f";
  }
}

// Helper: Clear specific error message
function clearError(elementId) {
  const errorElem = document.getElementById(elementId);
  if (errorElem) {
    errorElem.textContent = "";
  }
}

// Rule 1: Required Field & Min Length Check
function validateName(name) {
  if (!name.trim()) {
    return "Full name is required.";
  }
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters long.";
  }
  return "";
}

// Rule 2: Email Format Validation
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return "Email address is required.";
  }
  if (!emailPattern.test(email.trim())) {
    return "Please enter a valid email address (e.g., name@example.com).";
  }
  return "";
}

// Rule 3: Message Length Check
function validateMessage(message) {
  if (!message.trim()) {
    return "Order details are required.";
  }
  if (message.trim().length < 10) {
    return "Please provide at least 10 characters of order details.";
  }
  return "";
}

// Main Form Handler
function handleFormSubmit(event) {
  event.preventDefault();

  const nameVal = document.getElementById("fullname").value;
  const emailVal = document.getElementById("email").value;
  const messageVal = document.getElementById("message").value;

  const nameError = validateName(nameVal);
  const emailError = validateEmail(emailVal);
  const messageError = validateMessage(messageVal);

  // Update UI error fields
  nameError ? showError("fullname-error", nameError) : clearError("fullname-error");
  emailError ? showError("email-error", emailError) : clearError("email-error");
  messageError ? showError("message-error", messageError) : clearError("message-error");

  // Prevent submission if any errors exist
  if (nameError || emailError || messageError) {
    return;
  }

  // Clear errors & show success message
  const successElem = document.getElementById("form-success");
  if (successElem) {
    successElem.textContent = "Thank you! Your pre-order request has been received.";
    successElem.style.color = "#2e7d32";
  }

  // Reset form inputs
  document.getElementById("contact-form").reset();
}

// Initialize Validation Event Listeners
function initFormValidation() {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
}

// ==========================================
// DOM LOAD INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initEstimator();
  initFormValidation();
});
// ==========================================
// FEATURE 3: BROWSER STORAGE (localStorage)
// ==========================================

const STORAGE_KEY_NAME = "warmOven_userName";
const STORAGE_KEY_EMAIL = "warmOven_userEmail";

// 1. Save user details to localStorage
function saveUserData(name, email) {
  try {
    localStorage.setItem(STORAGE_KEY_NAME, name);
    localStorage.setItem(STORAGE_KEY_EMAIL, email);
  } catch (e) {
    console.warn("localStorage is not available:", e);
  }
}

// 2. Load stored user data and pre-fill form fields
function loadUserData() {
  try {
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);

    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    if (savedName && nameInput) {
      nameInput.value = savedName;
    }
    if (savedEmail && emailInput) {
      emailInput.value = savedEmail;
    }
  } catch (e) {
    console.warn("Unable to load from localStorage:", e);
  }
}

// ==========================================
// UPDATED FORM SUBMIT HANDLER
// ==========================================
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameVal = nameInput.value;
  const emailVal = emailInput.value;
  const messageVal = messageInput.value;

  const nameError = validateName(nameVal);
  const emailError = validateEmail(emailVal);
  const messageError = validateMessage(messageVal);

  // Update UI error fields
  nameError ? showError("fullname-error", nameError) : clearError("fullname-error");
  emailError ? showError("email-error", emailError) : clearError("email-error");
  messageError ? showError("message-error", messageError) : clearError("message-error");

  // Prevent submission if any errors exist
  if (nameError || emailError || messageError) {
    return;
  }

  // SAVE TO LOCAL STORAGE on valid submission
  saveUserData(nameVal.trim(), emailVal.trim());

  // Show success message
  const successElem = document.getElementById("form-success");
  if (successElem) {
    successElem.textContent = "Thank you! Your pre-order request has been received. (Your details have been saved for next time!)";
    successElem.style.color = "#2e7d32";
  }

  // Clear only the message box so user details remain visible
  messageInput.value = "";
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initEstimator();
  initFormValidation();
  
  // Restore saved name and email when page loads
  loadUserData();
});
