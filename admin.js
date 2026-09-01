/* ============================================
   DEAR NADIYA ADMIN
   LOGIN TEST
   ============================================ */

const loginPage =
  document.getElementById("login");

const adminApp =
  document.getElementById("app");


function login() {

  const username =
    document.getElementById("u").value.trim();

  const password =
    document.getElementById("p").value;


  if (
    username === "admin" &&
    password === "180322"
  ) {

    loginPage.classList.add("hidden");

    adminApp.classList.remove("hidden");

  } else {

    alert(
      "Username atau password salah."
    );

  }

}


/* ============================================
   LOGOUT
   ============================================ */

function logout() {

  adminApp.classList.add("hidden");

  loginPage.classList.remove("hidden");

}
