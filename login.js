import { signUp, signIn } from './auth.js';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const resetBtn = document.getElementById('resetBtn');

window.signUp = () => signUp(emailInput.value, passwordInput.value);
window.signIn = () => signIn(emailInput.value, passwordInput.value);
window.resetPassword = () => signIn();
