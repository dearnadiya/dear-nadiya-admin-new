/* ============================================
   DEAR NADIYA ADMIN
   LOGIN + NAVIGASI
   ============================================ */


/* ============================================
   ELEMENT
   ============================================ */

const loginPage =
  document.getElementById("loginPage");

const adminApp =
  document.getElementById("adminApp");

const loginForm =
  document.getElementById("loginForm");

const loginError =
  document.getElementById("loginError");

const logoutButton =
  document.getElementById("logoutButton");

const refreshButton =
  document.getElementById("refreshButton");

const pageTitle =
  document.getElementById("pageTitle");

const pageContent =
  document.getElementById("pageContent");


/* ============================================
   LOGIN
   ============================================ */

loginForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    const username =
      document
        .getElementById("username")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    if (
      username === "admin" &&
      password === "180322"
    ) {

      sessionStorage.setItem(
        "dearNadiyaAdmin",
        "true"
      );


      loginError.textContent = "";


      showAdmin();

    } else {

      loginError.textContent =
        "Username atau password salah.";

    }

  }
);


/* ============================================
   TAMPILKAN ADMIN
   ============================================ */

function showAdmin() {

  loginPage.classList.add(
    "hidden"
  );


  adminApp.classList.remove(
    "hidden"
  );


  loadDashboard();

}


/* ============================================
   TAMPILKAN LOGIN
   ============================================ */

function showLogin() {

  adminApp.classList.add(
    "hidden"
  );


  loginPage.classList.remove(
    "hidden"
  );

}


/* ============================================
   LOGOUT
   ============================================ */

logoutButton.addEventListener(
  "click",
  function () {

    sessionStorage.removeItem(
      "dearNadiyaAdmin"
    );


    showLogin();

  }
);


/* ============================================
   SIDEBAR
   ============================================ */

const menuButtons =
  document.querySelectorAll(
    ".menu-button"
  );


menuButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const page =
          button.dataset.page;


        if (!page) {
          return;
        }


        menuButtons.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        showPage(
          page
        );

      }
    );

  }
);


/* ============================================
   PINDAH HALAMAN
   ============================================ */

function showPage(page) {

  if (
    page === "dashboard"
  ) {

    loadDashboard();

    return;

  }


  if (
    page === "products"
  ) {

    loadProducts();

    return;

  }


  if (
    page === "orders"
  ) {

    loadOrders();

    return;

  }


  if (
    page === "payments"
  ) {

    loadPayments();

    return;

  }


  if (
    page === "recap"
  ) {

    loadRecap();

    return;

  }

}


/* ============================================
   DASHBOARD
   ============================================ */

function loadDashboard() {

  pageTitle.textContent =
    "Dashboard";


  pageContent.innerHTML = `

    <div class="dashboard-stats">

      <div class="stat-card">

        <p>
          Total Pesanan
        </p>

        <h2>
          0
        </h2>

      </div>


      <div class="stat-card">

        <p>
          Total Pembayaran
        </p>

        <h2>
          Rp0
        </h2>

      </div>


      <div class="stat-card">

        <p>
          GO Aktif
        </p>

        <h2>
          0
        </h2>

      </div>

    </div>


    <div class="welcome-card">

      <h2>
        Selamat datang di Dear Nadiya Admin ♥
      </h2>

      <p>
        Kelola produk, Group Order,
        pesanan, pembayaran, dan rekap
        dari satu dashboard.
      </p>

    </div>

  `;

}


/* ============================================
   PRODUK
   ============================================ */

function loadProducts() {

  pageTitle.textContent =
    "Produk & GO";


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Produk & Group Order
      </h2>

      <p>
        Halaman Produk & GO siap digunakan.
      </p>


      <button
        type="button"
        class="primary-button"
        id="testProductButton"
      >
        ➕ Tambah Produk
      </button>

    </div>

  `;


  document
    .getElementById(
      "testProductButton"
    )
    .addEventListener(
      "click",
      function () {

        alert(
          "Tombol Produk berhasil berfungsi."
        );

      }
    );

}


/* ============================================
   PESANAN
   ============================================ */

function loadOrders() {

  pageTitle.textContent =
    "Pesanan";


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Pesanan
      </h2>

      <p>
        Halaman Pesanan berhasil dibuka.
      </p>

    </div>

  `;

}


/* ============================================
   PEMBAYARAN
   ============================================ */

function loadPayments() {

  pageTitle.textContent =
    "Pembayaran";


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Pembayaran
      </h2>

      <p>
        Halaman Pembayaran berhasil dibuka.
      </p>

    </div>

  `;

}


/* ============================================
   REKAP
   ============================================ */

function loadRecap() {

  pageTitle.textContent =
    "Rekap GO";


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Rekap Group Order
      </h2>

      <p>
        Halaman Rekap GO berhasil dibuka.
      </p>

    </div>

  `;

}


/* ============================================
   REFRESH
   ============================================ */

refreshButton.addEventListener(
  "click",
  function () {

    const activeButton =
      document.querySelector(
        ".menu-button.active"
      );


    if (
      activeButton &&
      activeButton.dataset.page
    ) {

      showPage(
        activeButton.dataset.page
      );

    } else {

      loadDashboard();

    }

  }
);


/* ============================================
   SESSION CHECK
   ============================================ */

if (
  sessionStorage.getItem(
    "dearNadiyaAdmin"
  ) === "true"
) {

  showAdmin();

} else {

  showLogin();

     }
