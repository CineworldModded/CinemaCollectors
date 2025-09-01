import { signUp, signIn, resetPassword } from './auth.js';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

window.signUp = () => signUp(emailInput.value, passwordInput.value);
window.signIn = () => signIn(emailInput.value, passwordInput.value);
window.resetPassword = () => resetPassword(emailInput.value);
