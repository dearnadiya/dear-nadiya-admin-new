/* ============================================
   DEAR NADIYA ADMIN
   LOGIN + NAVIGASI + PRODUK + REKAP GO
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

const googleLoginButton =
  document.getElementById("googleLoginButton");


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
   ADMIN EMAIL
   ============================================ */

const ADMIN_EMAILS = [
  "dearnadiya6@gmail.com"
];


/* ============================================
   LOGIN GOOGLE
   ============================================ */

if (googleLoginButton) {

  googleLoginButton.addEventListener(
    "click",
    async function () {

      if (loginError) {
        loginError.textContent = "";
      }

      const {
        error
      } =
        await supabaseClient.auth.signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              "https://dearnadiya.github.io/dear-nadiya-admin-new/"

          }

        });


      if (error) {

        console.error(
          "LOGIN GOOGLE ERROR:",
          error
        );

        if (loginError) {

          loginError.textContent =
            "Login Google gagal: " +
            error.message;

        }

      }

    }
  );

}


/* ============================================
   CEK SESSION
   ============================================ */

async function checkGoogleSession() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      "SESSION ERROR:",
      error
    );

    showLogin();

    return;

  }


  const session =
    data?.session;


  if (!session) {

    showLogin();

    return;

  }


  checkAdminAccess(
    session
  );

}


/* ============================================
   CEK AKSES ADMIN
   ============================================ */

async function checkAdminAccess(
  session
) {

  const userEmail =
    session?.user?.email
      ?.toLowerCase()
      .trim();


  const isAdmin =
    ADMIN_EMAILS
      .map(
        function (email) {

          return email
            .toLowerCase()
            .trim();

        }
      )
      .includes(
        userEmail
      );


  if (isAdmin) {

    showAdmin();

    return;

  }


  await supabaseClient.auth.signOut();


  if (loginError) {

    loginError.textContent =
      "Akun Google ini tidak memiliki akses Admin.";

  }


  showLogin();

}


/* ============================================
   LOGOUT
   ============================================ */

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    async function () {

      await supabaseClient.auth.signOut();

      showLogin();

    }
  );

}


/* ============================================
   SESSION BERUBAH
   ============================================ */

supabaseClient.auth.onAuthStateChange(
  async function (
    event,
    session
  ) {

    if (!session) {

      showLogin();

      return;

    }


    await checkAdminAccess(
      session
    );

  }
);


/* ============================================
   TAMPILKAN ADMIN
   ============================================ */

function showAdmin() {

  if (loginPage) {

    loginPage.classList.add(
      "hidden"
    );

  }


  if (adminApp) {

    adminApp.classList.remove(
      "hidden"
    );

  }


  loadDashboard();

}


/* ============================================
   TAMPILKAN LOGIN
   ============================================ */

function showLogin() {

  if (adminApp) {

    adminApp.classList.add(
      "hidden"
    );

  }


  if (loginPage) {

    loginPage.classList.remove(
      "hidden"
    );

  }

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

function showPage(
  page
) {

  if (page === "dashboard") {

    loadDashboard();

    return;

  }


  if (page === "products") {

    loadProducts();

    return;

  }


  if (page === "orders") {

    loadOrders();

    return;

  }


  if (page === "payments") {

    loadPayments();

    return;

  }


  if (page === "recap") {

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

        <p>Total Pesanan</p>

        <h2>0</h2>

      </div>


      <div class="stat-card">

        <p>Total Pembayaran</p>

        <h2>Rp0</h2>

      </div>


      <div class="stat-card">

        <p>GO Aktif</p>

        <h2>0</h2>

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

  pageTitle.textContent =
    "Produk & GO";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Produk & Group Order
          </h2>

          <p>
            Kelola produk dan Group Order
            Dear Nadiya.
          </p>

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

        <p>
          Memuat produk...
        </p>

      </div>

    </div>

  `;


  const addProductButton =
    document.getElementById(
      "addProductButton"
    );

  const productFormContainer =
    document.getElementById(
      "productFormContainer"
    );


  addProductButton.addEventListener(
    "click",
    function () {

      productFormContainer.innerHTML = `

        <div class="panel product-form">

          <h3>
            Tambah Produk / GO
          </h3>


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
        .getElementById(
          "cancelProductButton"
        )
        .addEventListener(
          "click",
          function () {

            productFormContainer.innerHTML =
              "";

          }
        );


      document
        .getElementById(
          "productForm"
        )
        .addEventListener(
          "submit",
          saveProduct
        );

    }
  );


  await loadProductList();

}


/* ============================================
   SIMPAN PRODUK
   ============================================ */

async function saveProduct(
  event
) {

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
        .getElementById(
          "productCode"
        )
        .value
        .trim(),

    name:
      document
        .getElementById(
          "productName"
        )
        .value
        .trim(),

    type:
      document
        .getElementById(
          "productType"
        )
        .value,

    price:
      Number(
        document
          .getElementById(
            "productPrice"
          )
          .value
      ),

    dp:
      Number(
        document
          .getElementById(
            "productDp"
          )
          .value
      ),

    deadline_list:
      document
        .getElementById(
          "deadlineList"
        )
        .value || null,

    deadline_payment:
      document
        .getElementById(
          "deadlinePayment"
        )
        .value || null,

    status:
      document
        .getElementById(
          "productStatus"
        )
        .value,

    description:
      document
        .getElementById(
          "productDescription"
        )
        .value
        .trim(),

    members:
      Number(
        document
          .getElementById(
            "productMembers"
          )
          .value
      ),

    show_website:
      document
        .getElementById(
          "showWebsite"
        )
        .checked

  };


  const {
    error
  } =
    await supabaseClient
      .from("products")
      .insert(
        product
      );


  if (error) {

    console.error(
      error
    );

    message.textContent =
      "Gagal menyimpan produk: " +
      error.message;

    return;

  }


  message.textContent =
    "Produk berhasil disimpan. ♥";


  document
    .getElementById(
      "productFormContainer"
    )
    .innerHTML =
      "";


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


  if (!container) {

    return;

  }


  container.innerHTML =
    "<p>Memuat produk...</p>";


  const {
    data,
    error
  } =
    await supabaseClient
      .from("products")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      error
    );


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
          Belum ada data produk.
        </p>

      </div>

    `;

    return;

  }


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

          ${data.map(
            function(product) {

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
                    Rp${Number(
                      product.price || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    Rp${Number(
                      product.dp || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
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

            }
          ).join("")}

        </tbody>

      </table>

    </div>

  `;

}


/* ============================================
   REKAP GO
   ============================================ */

function loadRecap() {

  pageTitle.textContent =
    "Rekap GO";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Rekap Pembelian
          </h2>

          <p>
            Kelola rekapan pembelian berdasarkan
            kategori dan kode batch.
          </p>

        </div>


        <button
          type="button"
          class="primary-button"
          id="addRecapButton"
        >
          ➕ Tambah Rekap
        </button>

      </div>


      <!-- ==================================
           KATEGORI
           ================================== -->

      <div
        class="recap-category-buttons"
        id="recapCategoryButtons"
      >

        <button
          type="button"
          class="active"
          data-category="Truz"
        >
          Truz
        </button>

        <button
          type="button"
          data-category="Treasure KR"
        >
          Treasure KR
        </button>

        <button
          type="button"
          data-category="Treasure JP"
        >
          Treasure JP
        </button>

        <button
          type="button"
          data-category="Treasure CH"
        >
          Treasure CH
        </button>

        <button
          type="button"
          data-category="Treasure Thai"
        >
          Treasure Thai
        </button>

        <button
          type="button"
          data-category="Treasure Album"
        >
          Treasure Album
        </button>

        <button
          type="button"
          data-category="Treasure INA"
        >
          Treasure INA
        </button>

      </div>


      <!-- ==================================
           FORM
           ================================== -->

      <div
        id="recapFormContainer"
      ></div>


      <!-- ==================================
           LIST
           ================================== -->

      <div
        id="recapListContainer"
      >

        <p>
          Pilih kategori untuk melihat rekap.
        </p>

      </div>

    </div>

  `;


  let selectedCategory =
    "Truz";


  const categoryButtons =
    document.querySelectorAll(
      "#recapCategoryButtons button"
    );


  /* ========================================
     KATEGORI
     ======================================== */

  categoryButtons.forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          categoryButtons.forEach(
            function(item) {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          selectedCategory =
            button.dataset.category;


          loadRecapList(
            selectedCategory
          );

        }
      );

    }
  );


  /* ========================================
     TOMBOL TAMBAH REKAP
     ======================================== */

  document
    .getElementById(
      "addRecapButton"
    )
    .addEventListener(
      "click",
      function() {

        showRecapBatchForm(
          selectedCategory
        );

      }
    );


  /* ========================================
     LOAD DATA AWAL
     ======================================== */

  loadRecapList(
    selectedCategory
  );

}


/* ============================================
   TRACKING
   ============================================ */

function getTrackingOptions(
  category
) {

  if (
    category ===
    "Treasure INA"
  ) {

    return [

      "Co Seller",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Truz"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH KR",

      "Arrived WH JP",

      "Arrived WH CH",

      "Arrived WH Thai",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Treasure KR"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH KR",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Treasure JP"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH JP",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Treasure CH"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH CH",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Treasure Thai"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH Thai",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  if (
    category ===
    "Treasure Album"
  ) {

    return [

      "Co Web / Seller",

      "Arrived WH KR",

      "Arrived WH JP",

      "Arrived WH CH",

      "Arrived WH Thai",

      "Shipping INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Goods Arrive at Customer"

    ];

  }


  return [

    "Co Web / Seller",

    "Shipping INA",

    "Arrived WH INA",

    "Arrived Admin",

    "Goods Arrive at Customer"

  ];

}


/* ============================================
   TAMPILKAN FORM BATCH
   ============================================ */

function showRecapBatchForm(
  category
) {

  const container =
    document.getElementById(
      "recapFormContainer"
    );


  container.innerHTML = `

    <div class="panel recap-form">

      <h3>
        Tambah Rekap Pembelian
      </h3>


      <form id="recapBatchForm">


        <!-- ==========================
             KATEGORI
             ========================== -->

        <label>
          Kategori
        </label>

        <select
          id="batchCategory"
          required
        >

          <option
            value="Truz"
            ${category === "Truz" ? "selected" : ""}
          >
            Truz
          </option>

          <option
            value="Treasure KR"
            ${category === "Treasure KR" ? "selected" : ""}
          >
            Treasure KR
          </option>

          <option
            value="Treasure JP"
            ${category === "Treasure JP" ? "selected" : ""}
          >
            Treasure JP
          </option>

          <option
            value="Treasure CH"
            ${category === "Treasure CH" ? "selected" : ""}
          >
            Treasure CH
          </option>

          <option
            value="Treasure Thai"
            ${category === "Treasure Thai" ? "selected" : ""}
          >
            Treasure Thai
          </option>

          <option
            value="Treasure Album"
            ${category === "Treasure Album" ? "selected" : ""}
          >
            Treasure Album
          </option>

          <option
            value="Treasure INA"
            ${category === "Treasure INA" ? "selected" : ""}
          >
            Treasure INA
          </option>

        </select>


        <!-- ==========================
             KODE BATCH
             ========================== -->

        <label>
          Kode Batch
        </label>

        <input
          id="batchCode"
          type="text"
          placeholder="Contoh: CH-169"
          required
        >


        <!-- ==========================
             NAMA BARANG
             ========================== -->

        <label>
          Nama Barang
        </label>

        <input
          id="batchItemName"
          type="text"
          placeholder="Contoh: FS Knpops"
          required
        >


        <hr>


        <h3>
          Versi / Member
        </h3>


        <p>
          Tambahkan versi atau member sesuai
          kebutuhan batch.
        </p>


        <!-- ==========================
             ITEM LIST
             ========================== -->

        <div
          id="batchItemsContainer"
        ></div>


        <!-- ==========================
             TAMBAH ITEM
             ========================== -->

        <button
          type="button"
          id="addBatchItemButton"
          class="primary-button"
        >
          ＋ Tambah Versi / Member
        </button>


        <div class="form-actions">

          <button
            type="submit"
            class="primary-button"
          >
            Simpan Batch
          </button>


          <button
            type="button"
            id="cancelBatchButton"
          >
            Batal
          </button>

        </div>


        <p
          id="batchFormMessage"
          class="login-error"
        ></p>


      </form>

    </div>

  `;


  const itemsContainer =
    document.getElementById(
      "batchItemsContainer"
    );


  let itemNumber = 0;


  /* ========================================
     BUAT BARIS ITEM
     ======================================== */

  function addBatchItem() {

    itemNumber++;


    const itemId =
      itemNumber;


    const trackingOptions =
      getTrackingOptions(
        document
          .getElementById(
            "batchCategory"
          )
          .value
      );


    const item = document.createElement(
      "div"
    );


    item.className =
      "batch-item";


    item.dataset.item =
      itemId;


    item.innerHTML = `

      <div
        class="batch-item-header"
      >

        <h4>
          Versi / Member ${itemNumber}
        </h4>


        <button
          type="button"
          class="remove-batch-item"
        >
          ✕ Hapus
        </button>

      </div>


      <label>
        Versi / Member / Character
      </label>

      <input
        type="text"
        class="batch-version"
        placeholder="Contoh: Hyunsuk / Version A / RURU"
      >


      <label>
        Customer
      </label>

      <input
        type="text"
        class="batch-customer"
        placeholder="Nama Customer (4 nomor terakhir WA)"
      >


      <label>
        Qty
      </label>

      <input
        type="number"
        class="batch-quantity"
        min="1"
        value="1"
      >


      <label>
        Harga Barang
      </label>

      <input
        type="number"
        class="batch-price"
        min="0"
        value="0"
      >


      <label>
        DP
      </label>

      <input
        type="number"
        class="batch-dp"
        min="0"
        value="0"
      >


      <label>
        Status DP
      </label>

      <select
        class="batch-dp-status"
      >

        <option value="unpaid">
          Belum Dibayar
        </option>

        <option value="paid">
          Sudah Dibayar
        </option>

      </select>


      <label>
        Pelunasan / Sisa Pembayaran
      </label>

      <input
        type="number"
        class="batch-remaining"
        min="0"
        value="0"
      >


      <label>
        Status Pelunasan
      </label>

      <select
        class="batch-payment-status"
      >

        <option value="unpaid">
          Belum Lunas
        </option>

        <option value="paid">
          Sudah Lunas
        </option>

      </select>


      <label>
        Tracking
      </label>

      <select
        class="batch-tracking"
      >

        ${trackingOptions.map(
          function(option) {

            return `

              <option
                value="${option}"
              >
                ${option}
              </option>

            `;

          }
        ).join("")}

      </select>


      <label>
        Note
      </label>

      <textarea
        class="batch-note"
        rows="3"
        placeholder="Catatan..."
      ></textarea>


      <label>
        Batas CO / Checkout
      </label>

      <input
        type="date"
        class="batch-co-deadline"
      >


      <hr>

    `;


    itemsContainer.appendChild(
      item
    );


    /* ======================================
       HAPUS ITEM
       ====================================== */

    item
      .querySelector(
        ".remove-batch-item"
      )
      .addEventListener(
        "click",
        function() {

          item.remove();

        }
      );

  }


  /* ========================================
     ITEM PERTAMA
     ======================================== */

  addBatchItem();


  /* ========================================
     TAMBAH ITEM
     ======================================== */

  document
    .getElementById(
      "addBatchItemButton"
    )
    .addEventListener(
      "click",
      addBatchItem
    );


  /* ========================================
     GANTI KATEGORI
     ======================================== */

  document
    .getElementById(
      "batchCategory"
    )
    .addEventListener(
      "change",
      function() {

        /*
           Tracking setiap item diperbarui
           sesuai kategori.
        */

        const options =
          getTrackingOptions(
            this.value
          );


        document
          .querySelectorAll(
            ".batch-tracking"
          )
          .forEach(
            function(select) {

              select.innerHTML =
                options.map(
                  function(option) {

                    return `

                      <option
                        value="${option}"
                      >
                        ${option}
                      </option>

                    `;

                  }
                ).join("");

            }
          );

      }
    );


  /* ========================================
     BATAL
     ======================================== */

  document
    .getElementById(
      "cancelBatchButton"
    )
    .addEventListener(
      "click",
      function() {

        container.innerHTML =
          "";

      }
    );


  /* ========================================
     SIMPAN BATCH
     ======================================== */

  document
    .getElementById(
      "recapBatchForm"
    )
    .addEventListener(
      "submit",
      saveBatchRecap
    );

}


/* ============================================
   SIMPAN BATCH REKAP
   ============================================ */

async function saveBatchRecap(
  event
) {

  event.preventDefault();


  const message =
    document.getElementById(
      "batchFormMessage"
    );


  message.textContent =
    "Menyimpan batch...";


  const category =
    document
      .getElementById(
        "batchCategory"
      )
      .value;


  const batchCode =
    document
      .getElementById(
        "batchCode"
      )
      .value
      .trim();


  const itemName =
    document
      .getElementById(
        "batchItemName"
      )
      .value
      .trim();


  if (!batchCode) {

    message.textContent =
      "Kode batch wajib diisi.";

    return;

  }


  if (!itemName) {

    message.textContent =
      "Nama barang wajib diisi.";

    return;

  }


  const itemElements =
    document.querySelectorAll(
      "#batchItemsContainer .batch-item"
    );


  if (
    itemElements.length === 0
  ) {

    message.textContent =
      "Minimal harus ada 1 versi/member.";

    return;

  }


  const records = [];


  itemElements.forEach(
    function(item) {

      const version =
        item
          .querySelector(
            ".batch-version"
          )
          .value
          .trim();


      const customer =
        item
          .querySelector(
            ".batch-customer"
          )
          .value
          .trim();


      const quantity =
        Number(
          item
            .querySelector(
              ".batch-quantity"
            )
            .value
        ) || 1;


      const price =
        Number(
          item
            .querySelector(
              ".batch-price"
            )
            .value
        ) || 0;


      const dp =
        Number(
          item
            .querySelector(
              ".batch-dp"
            )
            .value
        ) || 0;


      const dpStatus =
        item
          .querySelector(
            ".batch-dp-status"
          )
          .value;


      const remaining =
        Number(
          item
            .querySelector(
              ".batch-remaining"
            )
            .value
        ) || 0;


      const paymentStatus =
        item
          .querySelector(
            ".batch-payment-status"
          )
          .value;


      const tracking =
        item
          .querySelector(
            ".batch-tracking"
          )
          .value;


      const note =
        item
          .querySelector(
            ".batch-note"
          )
          .value
          .trim();


      const coDeadline =
        item
          .querySelector(
            ".batch-co-deadline"
          )
          .value ||
        null;


      records.push({

        category:
          category,

        batch_code:
          batchCode,

        item_name:
          itemName,

        customer_name:
          customer ||
          "AVAILABLE",

        version:
          version ||
          "AVAILABLE",

        quantity:
          quantity,

        item_price:
          price,

        dp_amount:
          dp,

        dp_status:
          dpStatus,

        remaining_amount:
          remaining,

        payment_status:
          paymentStatus,

        tracking_status:
          tracking,

        note:
          note ||
          null,

        co_deadline:
          coDeadline

      });

    }
  );


  console.log(
    "DATA BATCH:",
    records
  );


  /* ========================================
     SIMPAN SEMUA BARIS SEKALIGUS
     ======================================== */

  const {
    data,
    error
  } =
    await supabaseClient
      .from("purchase_recap")
      .insert(
        records
      )
      .select();


  console.log(
    "HASIL INSERT:",
    data
  );


  if (error) {

    console.error(
      "ERROR SIMPAN BATCH:",
      error
    );


    message.textContent =
      "Gagal menyimpan batch: " +
      error.message;

    return;

  }


  /* ========================================
     BERHASIL
     ======================================== */

  message.textContent =
    "Batch berhasil disimpan. ♥";


  await loadRecapList(
    category
  );


  setTimeout(
    function() {

      const formContainer =
        document.getElementById(
          "recapFormContainer"
        );


      if (formContainer) {

        formContainer.innerHTML =
          "";

      }

    },
    700
  );

}


/* ============================================
   TAMPILKAN DAFTAR REKAP
   ============================================ */

async function loadRecapList(category) {

  const container =
    document.getElementById("recapListContainer");

  if (!container) return;

  container.innerHTML = "<p>Memuat rekap...</p>";

  try {

    const { data, error } =
      await supabaseClient
        .from("purchase_recap")
        .select("*")
        .eq("category", category)
        .order("batch_code", { ascending: true })
        .order("id", { ascending: true });


    if (error) {

      console.error("ERROR REKAP:", error);

      container.innerHTML = `
        <div class="panel">
          <h3>Gagal memuat rekap</h3>
          <p>${error.message}</p>
        </div>
      `;

      return;
    }


    if (!data || data.length === 0) {

      container.innerHTML = `
        <div class="panel">
          <h3>Belum ada data</h3>
          <p>
            Belum ada rekapan untuk
            <strong>${category}</strong>.
          </p>
        </div>
      `;

      return;
    }


    /* ========================================
       KELOMPOKKAN BERDASARKAN BATCH
       ======================================== */

    const batches = {};

    data.forEach(function(item) {

      const batch =
        item.batch_code || "Tanpa Batch";

      if (!batches[batch]) {

        batches[batch] = {
          batch_code: batch,
          item_name:
            item.item_name || "—",
          items: []
        };

      }

      batches[batch].items.push(item);

    });


    /* ========================================
       FORMAT RUPIAH
       ======================================== */

    function rupiah(value) {

      return "Rp" +
        Number(value || 0)
          .toLocaleString("id-ID");

    }


    /* ========================================
       STATUS
       ======================================== */

    function dpStatus(item) {

      if (item.dp_status === "paid") {

        return `
          <span class="status-paid">
            ✓ Sudah Dibayar
          </span>
        `;

      }

      return `
        <span class="status-unpaid">
          Belum Dibayar
        </span>
      `;

    }


    function paymentStatus(item) {

      if (
        item.payment_status === "paid"
      ) {

        return `
          <span class="status-paid">
            ✓ Sudah Lunas
          </span>
        `;

      }

      return `
        <span class="status-unpaid">
          Belum Lunas
        </span>
      `;

    }


    /* ========================================
       BUAT HTML SETIAP BATCH
       ======================================== */

    const batchHTML =
      Object.values(batches)
        .map(function(batch) {

          return `

            <div class="recap-batch-card">

              <!-- ==========================
                   HEADER BATCH
                   ========================== -->

              <div class="recap-batch-header">

                <div>

                  <div class="recap-batch-code">
                    ${batch.batch_code}
                  </div>

                  <div class="recap-batch-name">
                    ${batch.item_name}
                  </div>

                </div>

                <div class="recap-batch-count">
                  ${batch.items.length} item
                </div>

              </div>


              <!-- ==========================
                   TABEL MEMBER / VERSI
                   ========================== -->

              <div class="product-table-wrapper">

                <table class="product-table recap-table">

                  <thead>

                    <tr>

                      <th>Versi / Member</th>

                      <th>Customer</th>

                      <th>Qty</th>

                      <th>Harga</th>

                      <th>DP</th>

                      <th>Status DP</th>

                      <th>Pelunasan</th>

                      <th>Status Pelunasan</th>

                      <th>Tracking</th>

                      <th>Note</th>

                      <th>Batas CO</th>

                    </tr>

                  </thead>


                  <tbody>

                    ${batch.items
                      .map(function(item) {

                        const customer =
                          item.customer_name ||
                          "AVAILABLE";


                        const version =
                          item.version ||
                          "AVAILABLE";


                        const customerHTML =
                          customer
                            .toUpperCase()
                            .trim() ===
                          "AVAILABLE"

                            ? `
                              <span
                                class="available-member"
                              >
                                AVAILABLE
                              </span>
                            `

                            : customer;


                        const versionHTML =
                          version
                            .toUpperCase()
                            .trim() ===
                          "AVAILABLE"

                            ? `
                              <span
                                class="available-member"
                              >
                                AVAILABLE
                              </span>
                            `

                            : version;


                        const deadline =
                          item.co_deadline

                            ? new Date(
                                item.co_deadline
                              ).toLocaleDateString(
                                "id-ID"
                              )

                            : "—";


                        return `

                          <tr>

                            <td>
                              ${versionHTML}
                            </td>

                            <td>
                              ${customerHTML}
                            </td>

                            <td>
                              ${item.quantity || 1}
                            </td>

                            <td>
                              ${rupiah(
                                item.item_price
                              )}
                            </td>

                            <td>
                              ${rupiah(
                                item.dp_amount
                              )}
                            </td>

                            <td>
                              ${dpStatus(item)}
                            </td>

                            <td>
                              ${rupiah(
                                item.remaining_amount
                              )}
                            </td>

                            <td>
                              ${paymentStatus(item)}
                            </td>

                            <td>
                              ${
                                item.tracking_status ||
                                "—"
                              }
                            </td>

                            <td>
                              ${
                                item.note ||
                                "—"
                              }
                            </td>

                            <td>
                              ${deadline}
                            </td>

                          </tr>

                        `;

                      })
                      .join("")}

                  </tbody>

                </table>

              </div>

            </div>

          `;

        })
        .join("");


    /* ========================================
       TAMPILKAN
       ======================================== */

    container.innerHTML = `

      <div class="recap-category-title">

        <h3>
          ${category}
        </h3>

        <p>
          ${Object.keys(batches).length}
          kode batch
        </p>

      </div>

      ${batchHTML}

    `;


  } catch (error) {

    console.error(
      "Kesalahan loadRecapList:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat rekap
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}

    /* ======================================
       TABEL
       ====================================== */

    container.innerHTML = `

      <div class="product-table-wrapper">

        <table class="product-table recap-table">

          <thead>

            <tr>

              <th>Batch</th>

              <th>Nama Barang</th>

              <th>Versi / Member</th>

              <th>Customer</th>

              <th>Qty</th>

              <th>Harga</th>

              <th>DP</th>

              <th>Status DP</th>

              <th>Pelunasan</th>

              <th>Status Pelunasan</th>

              <th>Tracking</th>

              <th>Note</th>

              <th>Batas CO</th>

            </tr>

          </thead>


          <tbody>

            ${data.map(
              function(item) {

                const customer =
                  item.customer_name ||
                  "AVAILABLE";


                const version =
                  item.version ||
                  "AVAILABLE";


                const customerHTML =
                  customer
                    .toUpperCase()
                    .trim() ===
                  "AVAILABLE"

                    ? `

                      <span
                        class="available-member"
                      >
                        AVAILABLE
                      </span>

                    `

                    : customer;


                const versionHTML =
                  version
                    .toUpperCase()
                    .trim() ===
                  "AVAILABLE"

                    ? `

                      <span
                        class="available-member"
                      >
                        AVAILABLE
                      </span>

                    `

                    : version;


                const dpStatusHTML =
                  item.dp_status ===
                  "paid"

                    ? `

                      <span
                        class="status-paid"
                      >
                        ✓ Sudah Dibayar
                      </span>

                    `

                    : `

                      <span
                        class="status-unpaid"
                      >
                        Belum Dibayar
                      </span>

                    `;


                const paymentStatusHTML =
                  item.payment_status ===
                  "paid"

                    ? `

                      <span
                        class="status-paid"
                      >
                        ✓ Sudah Lunas
                      </span>

                    `

                    : `

                      <span
                        class="status-unpaid"
                      >
                        Belum Lunas
                      </span>

                    `;


                const deadline =
                  item.co_deadline

                    ? new Date(
                        item.co_deadline
                      ).toLocaleDateString(
                        "id-ID"
                      )

                    : "—";


                return `

                  <tr>

                    <td>
                      ${item.batch_code || "—"}
                    </td>


                    <td>
                      ${item.item_name || "—"}
                    </td>


                    <td>
                      ${versionHTML}
                    </td>


                    <td>
                      ${customerHTML}
                    </td>


                    <td>
                      ${item.quantity || 1}
                    </td>


                    <td>
                      Rp${Number(
                        item.item_price || 0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </td>


                    <td>
                      Rp${Number(
                        item.dp_amount || 0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </td>


                    <td>
                      ${dpStatusHTML}
                    </td>


                    <td>
                      Rp${Number(
                        item.remaining_amount || 0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </td>


                    <td>
                      ${paymentStatusHTML}
                    </td>


                    <td>
                      ${item.tracking_status || "—"}
                    </td>


                    <td>
                      ${item.note || "—"}
                    </td>


                    <td>
                      ${deadline}
                    </td>

                  </tr>

                `;

              }
            ).join("")}

          </tbody>

        </table>

      </div>

    `;


  } catch (error) {

    console.error(
      "Kesalahan loadRecapList:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat rekap
        </h3>

        <p>
          ${error.message}
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
   REFRESH
   ============================================ */

if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    function() {

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

}


/* ============================================
   MULAI CEK LOGIN
   ============================================ */

checkGoogleSession();
