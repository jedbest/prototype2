const SCRIPT_URL = "PUT_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

const form = document.getElementById('gymForm');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

const prices = {
  "Daily": 1500,
  "Weekly": 5000,
  "Monthly": 12000,
  "3 Months": 30000
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    plan: document.getElementById('plan').value,
    price: prices[document.getElementById('plan').value] || 0
  };

  if(!data.plan){
    message.innerHTML = "<div style='color:red;'>Please select a plan</div>";
    return;
  }

  submitBtn.innerText = "Processing...";
  submitBtn.disabled = true;
  message.innerHTML = "<div style='color:#a6ff00;'>Please wait...</div>";

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (result.status === 'already_exists') {
      window.location.href = `already-registered.html?phone=${data.phone}&expiry=${result.expiry}&days=${result.daysLeft}`;
    } else if (result.status === 'success') {
      window.location.href = `thank-you.html?name=${encodeURIComponent(data.name)}&plan=${data.plan}&expiry=${result.expiryDate}`;
    } else {
      message.innerHTML = "<div style='color:red;'>Something went wrong. Try again.</div>";
      submitBtn.innerText = "Submit Registration";
      submitBtn.disabled = false;
    }

  } catch (err) {
    message.innerHTML = "<div style='color:red;'>Network error. Check internet and try again.</div>";
    submitBtn.innerText = "Submit Registration";
    submitBtn.disabled = false;
  }
});