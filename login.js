import { signUp, signIn } from './auth.js';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const resetBtn = document.getElementById('resetBtn');

window.signUp = () => signUp(emailInput.value, passwordInput.value);
window.signIn = () => signIn(emailInput.value, passwordInput.value);

resetBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;

  if (!email) return alert("Please enter your email first.");

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://yourwebsite.com/reset-password' // optional redirect after reset
  });

  if (error) {
    alert("Error sending reset email: " + error.message);
  } else {
    alert("Check your email for the password reset link!");
  }
});
