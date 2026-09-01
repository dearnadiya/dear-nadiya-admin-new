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
   SUPABASE
   ============================================ */

const SUPABASE_URL =
  "https://cwwzsbqfznzwfclajwnw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ADa_gyMfyBZ1ZcdUO8FRfw_iELzOmbQ";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* ============================================
   LOGIN GOOGLE
   ============================================ */

const googleLoginButton =
  document.getElementById("googleLoginButton");


googleLoginButton.addEventListener(
  "click",
  async function () {

    loginError.textContent = "";


    const { error } =
      await supabaseClient.auth.signInWithOAuth({

        provider: "google",

        options: {
  redirectTo:
    "https://dearnadiya.github.io/dear-nadiya-admin-new/"
}

      });


    if (error) {

      loginError.textContent =
        "Login Google gagal: " +
        error.message;

    }

  }
);


/* ============================================
   ADMIN EMAIL
   ============================================ */

const ADMIN_EMAILS = [
  "dearnadiya6@gmail.com"
];


/* ============================================
   CEK SESSION + AKSES ADMIN
   ============================================ */

async function checkGoogleSession() {

  const {
    data: { session }
  } =
    await supabaseClient.auth.getSession();


  if (!session) {

    showLogin();

    return;

  }


  const userEmail =
    session.user.email
      ?.toLowerCase()
      .trim();


  const isAdmin =
    ADMIN_EMAILS
      .map(email => email.toLowerCase().trim())
      .includes(userEmail);


  if (isAdmin) {

    showAdmin();

  } else {

    await supabaseClient.auth.signOut();

    loginError.textContent =
      "Akun Google ini tidak memiliki akses Admin.";

    showLogin();

  }

}

/* ============================================
   LOGOUT GOOGLE
   ============================================ */

logoutButton.addEventListener(
  "click",
  async function () {

    await supabaseClient.auth.signOut();

    showLogin();

  }
);


/* ============================================
   SESSION BERUBAH
   ============================================ */

supabaseClient.auth.onAuthStateChange(
  async function (event, session) {

    if (!session) {

      showLogin();

      return;

    }


    const userEmail =
      session.user.email
        ?.toLowerCase()
        .trim();


    const isAdmin =
      ADMIN_EMAILS
        .map(email => email.toLowerCase().trim())
        .includes(userEmail);


    if (isAdmin) {

      showAdmin();

    } else {

      await supabaseClient.auth.signOut();

      loginError.textContent =
        "Akun Google ini tidak memiliki akses Admin.";

      showLogin();

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
   PRODUK & GO
   ============================================ */

async function loadProducts() {

  pageTitle.textContent = "Produk & GO";

  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>
          <h2>Produk & Group Order</h2>
          <p>Kelola produk dan Group Order Dear Nadiya.</p>
        </div>

        <button
          type="button"
          class="primary-button"
          id="addProductButton"
        >
          ➕ Tambah Produk
        </button>

      </div>

      <div id="productFormContainer"></div>

      <div id="productListContainer">
        <p>Memuat produk...</p>
      </div>

    </div>

  `;


  const addProductButton =
    document.getElementById("addProductButton");

  const productFormContainer =
    document.getElementById("productFormContainer");

  const productListContainer =
    document.getElementById("productListContainer");


  /* ============================================
     TOMBOL TAMBAH PRODUK
     ============================================ */

  addProductButton.addEventListener(
    "click",
    function () {

      productFormContainer.innerHTML = `

        <div class="panel product-form">

          <h3>Tambah Produk / GO</h3>

          <form id="productForm">

            <label>
              Kode Produk
            </label>

            <input
              id="productCode"
              type="text"
              placeholder="Contoh: TRS-001"
              required
            >


            <label>
              Nama Produk
            </label>

            <input
              id="productName"
              type="text"
              placeholder="Nama produk / Group Order"
              required
            >


            <label>
              Jenis
            </label>

            <select id="productType">

              <option value="GO">
                Group Order
              </option>

              <option value="Pre Order">
                Pre Order
              </option>

              <option value="Ready Stock">
                Ready Stock
              </option>

            </select>


            <label>
              Harga
            </label>

            <input
              id="productPrice"
              type="number"
              min="0"
              placeholder="115000"
              required
            >


            <label>
              DP
            </label>

            <input
              id="productDp"
              type="number"
              min="0"
              placeholder="50000"
              value="0"
            >


            <label>
              Deadline List
            </label>

            <input
              id="deadlineList"
              type="date"
            >


            <label>
              Deadline Pembayaran
            </label>

            <input
              id="deadlinePayment"
              type="date"
            >


            <label>
              Status
            </label>

            <select id="productStatus">

              <option value="active">
                Active
              </option>

              <option value="closed">
                Closed
              </option>

              <option value="completed">
                Completed
              </option>

            </select>


            <label>
              Deskripsi
            </label>

            <textarea
              id="productDescription"
              rows="4"
              placeholder="Deskripsi produk..."
            ></textarea>


            <label>
              Jumlah Member
            </label>

            <input
              id="productMembers"
              type="number"
              min="0"
              value="0"
            >


            <label class="checkbox-label">

              <input
                id="showWebsite"
                type="checkbox"
                checked
              >

              Tampilkan di website customer

            </label>


            <div class="form-actions">

              <button
                type="submit"
                class="primary-button"
              >
                Simpan Produk
              </button>

              <button
                type="button"
                id="cancelProductButton"
              >
                Batal
              </button>

            </div>


            <p
              id="productFormMessage"
              class="login-error"
            ></p>

          </form>

        </div>

      `;


      document
        .getElementById("cancelProductButton")
        .addEventListener(
          "click",
          function () {

            productFormContainer.innerHTML = "";

          }
        );


      document
        .getElementById("productForm")
        .addEventListener(
          "submit",
          saveProduct
        );

    }
  );


  /* ============================================
     SIMPAN PRODUK
     ============================================ */

  async function saveProduct(event) {

    event.preventDefault();


    const message =
      document.getElementById(
        "productFormMessage"
      );


    message.textContent =
      "Menyimpan produk...";


    const product = {

      product_code:
        document
          .getElementById("productCode")
          .value
          .trim(),

      name:
        document
          .getElementById("productName")
          .value
          .trim(),

      type:
        document
          .getElementById("productType")
          .value,

      price:
        Number(
          document
            .getElementById("productPrice")
            .value
        ),

      dp:
        Number(
          document
            .getElementById("productDp")
            .value
        ),

      deadline_list:
        document
          .getElementById("deadlineList")
          .value || null,

      deadline_payment:
        document
          .getElementById("deadlinePayment")
          .value || null,

      status:
        document
          .getElementById("productStatus")
          .value,

      description:
        document
          .getElementById("productDescription")
          .value
          .trim(),

      members:
        Number(
          document
            .getElementById("productMembers")
            .value
        ),

      show_website:
        document
          .getElementById("showWebsite")
          .checked

    };


    const {
      error
    } =
      await supabaseClient
        .from("products")
        .insert(product);


    if (error) {

      console.error(error);

      message.textContent =
        "Gagal menyimpan produk: " +
        error.message;

      return;

    }


    message.textContent =
      "Produk berhasil disimpan. ♥";


    productFormContainer.innerHTML = "";

    await loadProductList();

  }

/* ============================================
   TAMPILKAN DAFTAR PRODUK
   ============================================ */

async function loadProductList() {

  const container =
    document.getElementById(
      "productListContainer"
    );


  /* Cegah error jika container belum tersedia */

  if (!container) {

    console.error(
      "productListContainer tidak ditemukan."
    );

    return;

  }


  /* Tampilan awal */

  container.innerHTML =
    "<p>Memuat produk...</p>";


  try {

    /* Ambil data dari Supabase */

    const result =
      await supabaseClient
        .from("products")
        .select("*")
        .order("id", {
          ascending: false
        });


    const data =
      result.data;

    const error =
      result.error;


    console.log(
      "DATA PRODUCTS:",
      data
    );

    console.log(
      "ERROR PRODUCTS:",
      error
    );


    /* Jika ada error */

    if (error) {

      container.innerHTML = `

        <div class="panel">

          <h3>
            Gagal memuat produk
          </h3>

          <p>
            ${error.message}
          </p>

        </div>

      `;

      return;

    }


    /* Jika belum ada data */

    if (
      !data ||
      data.length === 0
    ) {

      container.innerHTML = `

        <div class="panel">

          <h3>
            Belum ada produk
          </h3>

          <p>
            Supabase terhubung,
            tetapi belum ada data produk.
          </p>

        </div>

      `;

      return;

    }


    /* ========================================
       TABEL PRODUK
       ======================================== */

    container.innerHTML = `

      <div class="product-table-wrapper">

        <table class="product-table">

          <thead>

            <tr>

              <th>Kode</th>

              <th>Produk</th>

              <th>Jenis</th>

              <th>Harga</th>

              <th>DP</th>

              <th>Status</th>

              <th>Member</th>

              <th>Website</th>

            </tr>

          </thead>


          <tbody>

            ${data.map(function(product) {

              const price =
                Number(
                  product.price || 0
                ).toLocaleString(
                  "id-ID"
                );


              const dp =
                Number(
                  product.dp || 0
                ).toLocaleString(
                  "id-ID"
                );


              return `

                <tr>

                  <td>
                    ${product.product_code || "-"}
                  </td>


                  <td>
                    ${product.name || "-"}
                  </td>


                  <td>
                    ${product.type || "-"}
                  </td>


                  <td>
                    Rp${price}
                  </td>


                  <td>
                    Rp${dp}
                  </td>


                  <td>
                    ${product.status || "-"}
                  </td>


                  <td>
                    ${product.members || 0}
                  </td>


                  <td>
                    ${
                      product.show_website
                        ? "✓"
                        : "-"
                    }
                  </td>

                </tr>

              `;

            }).join("")}

          </tbody>

        </table>

      </div>

    `;


  } catch (error) {

    console.error(
      "Kesalahan loadProductList:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat produk
        </h3>

        <p>
          Terjadi kesalahan saat mengambil data produk.
        </p>

      </div>

    `;

  }

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

checkGoogleSession();
