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


  await checkAdminAccess(
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

  if (
    page ===
    "dashboard"
  ) {

    loadDashboard();

    return;

  }


  if (
    page ===
    "products"
  ) {

    loadProducts();

    return;

  }


  if (
    page ===
    "orders"
  ) {

    loadOrders();

    return;

  }


  if (
    page ===
    "payments"
  ) {

    loadPayments();

    return;

  }


  if (
    page ===
    "recap"
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


      <div
        id="productFormContainer"
      ></div>


      <div
        id="productListContainer"
      >

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
        .value ||
      null,

    deadline_payment:
      document
        .getElementById(
          "deadlinePayment"
        )
        .value ||
      null,

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
          Tambahkan produk atau Group Order
          pertama Anda.
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

            <th>
              Kode
            </th>

            <th>
              Produk
            </th>

            <th>
              Jenis
            </th>

            <th>
              Harga
            </th>

            <th>
              DP
            </th>

            <th>
              Status
            </th>

            <th>
              Website
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(item) {

              return `

                <tr>

                  <td>
                    ${item.product_code || "—"}
                  </td>

                  <td>
                    ${item.name || "—"}
                  </td>

                  <td>
                    ${item.type || "—"}
                  </td>

                  <td>
                    Rp${Number(
                      item.price || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    Rp${Number(
                      item.dp || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    ${item.status || "—"}
                  </td>

                  <td>
                    ${
                      item.show_website
                        ? "Tampil"
                        : "Tidak"
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
   UPDATE STATUS PEMBAYARAN
   ============================================ */

async function updatePaymentStatus(
  id,
  newStatus
) {

  const { error } =
    await supabaseClient
      .from("dn_payment_submissions")
      .update({
        status: newStatus
      })
      .eq("id", id);


  if (error) {

    console.error(
      "ERROR UPDATE PAYMENT:",
      error
    );

    alert(
      "Gagal mengubah status pembayaran: " +
      error.message
    );

    return;
  }


  alert(
    newStatus === "confirmed"
      ? "Pembayaran berhasil dikonfirmasi."
      : "Pembayaran ditolak."
  );


  await loadPayments();

}

/* ============================================
   LIHAT BUKTI PEMBAYARAN
   ============================================ */

async function viewPaymentProof(
  proofPath
) {

  if (!proofPath) {

    alert(
      "Bukti pembayaran tidak tersedia."
    );

    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient
      .storage
      .from("payment-proofs")
      .createSignedUrl(
        proofPath,
        600
      );


  if (error) {

    console.error(
      "ERROR VIEW PAYMENT PROOF:",
      error
    );

    alert(
      "Gagal membuka bukti pembayaran: " +
      error.message
    );

    return;
  }


  if (
    !data ||
    !data.signedUrl
  ) {

    alert(
      "Link bukti pembayaran tidak tersedia."
    );

    return;
  }


  window.open(
    data.signedUrl,
    "_blank"
  );

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
           KATEGORI REKAP
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


      <div
        id="recapFormContainer"
      ></div>


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
     PILIH KATEGORI
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
     TAMBAH REKAP
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
     LOAD KATEGORI AWAL
     ======================================== */

  loadRecapList(
    selectedCategory
  );

}


/* ============================================
   PILIHAN TRACKING
   ============================================ */

function getTrackingOptions(
  category
) {

  /* ----------------------------------------
     TREASURE INA
     ---------------------------------------- */

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


  /* ----------------------------------------
     TRUZ
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE KR
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE JP
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE CH
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE THAI
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE ALBUM
     ---------------------------------------- */

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


  /* ----------------------------------------
     DEFAULT
     ---------------------------------------- */

  return [

    "Co Web / Seller",

    "Shipping INA",

    "Arrived WH INA",

    "Arrived Admin",

    "Goods Arrive at Customer"

  ];

}


/* ============================================
   FORM TAMBAH REKAP BATCH
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


        <!-- ==================================
             KATEGORI
             ================================== -->

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


        <!-- ==================================
             KODE BATCH
             ================================== -->

        <label>
          Kode Batch
        </label>

        <input
          id="batchCode"
          type="text"
          placeholder="Contoh: CH-169"
          required
        >


        <!-- ==================================
             NAMA BARANG
             ================================== -->

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
          Tambahkan versi, member, atau
          character sesuai kebutuhan batch.
        </p>


        <div
          id="batchItemsContainer"
        ></div>


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
     TAMBAH BARIS VERSI / MEMBER
     ======================================== */

  function addBatchItem() {

    itemNumber++;


    const trackingOptions =
      getTrackingOptions(
        document
          .getElementById(
            "batchCategory"
          )
          .value
      );


    const item =
      document.createElement(
        "div"
      );


    item.className =
      "batch-item";


    item.dataset.item =
      itemNumber;


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
       HAPUS BARIS
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
     BARIS PERTAMA
     ======================================== */

  addBatchItem();


  /* ========================================
     TAMBAH BARIS
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
     PERUBAHAN KATEGORI
     ======================================== */

  document
    .getElementById(
      "batchCategory"
    )
    .addEventListener(
      "change",
      function() {

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
     SUBMIT
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
   SIMPAN BATCH KE SUPABASE
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

async function loadRecapList(
  category
) {

  const container =
    document.getElementById(
      "recapListContainer"
    );


  if (!container) {
    return;
  }


  container.innerHTML = `

    <div class="panel">

      <p>
        Memuat rekap...
      </p>

    </div>

  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select("*")
        .eq(
          "category",
          category
        )
        .order(
          "batch_code",
          {
            ascending: true
          }
        )
        .order(
          "id",
          {
            ascending: true
          }
        );


    if (error) {

      throw error;

    }


    if (
      !data ||
      data.length === 0
    ) {

      container.innerHTML = `

        <div class="panel">

          <h3>
            Belum ada rekap
          </h3>

          <p>
            Belum terdapat data pada kategori
            ${category}.
          </p>

        </div>

      `;

      return;

    }


    /* ========================================
       GROUPING BERDASARKAN KODE BATCH
       ======================================== */

    const grouped = {};


    data.forEach(
      function(item) {

        const batchCode =
          item.batch_code ||
          "Tanpa Kode Batch";


        if (
          !grouped[batchCode]
        ) {

          grouped[batchCode] = [];

        }


        grouped[batchCode].push(
          item
        );

      }
    );


    /* ========================================
       FORMAT RUPIAH
       ======================================== */

    function formatRupiah(
      value
    ) {

      return (
        "Rp" +
        Number(
          value || 0
        ).toLocaleString(
          "id-ID"
        )
      );

    }


    /* ========================================
       STATUS DP
       ======================================== */

    function dpStatusHTML(
      status
    ) {

      if (
        status === "paid"
      ) {

        return `

          <span
            class="status-badge success"
          >
            ✓ Sudah Dibayar
          </span>

        `;

      }


      return `

        <span
          class="status-badge warning"
        >
          Belum Dibayar
        </span>

      `;

    }


    /* ========================================
       STATUS PELUNASAN
       ======================================== */

    function paymentStatusHTML(
      status
    ) {

      if (
        status === "paid"
      ) {

        return `

          <span
            class="status-badge success"
          >
            ✓ Sudah Lunas
          </span>

        `;

      }


      return `

        <span
          class="status-badge warning"
        >
          Belum Lunas
        </span>

      `;

    }


    /* ========================================
       TRACKING
       ======================================== */

    function trackingHTML(
      status
    ) {

      if (!status) {

        return "—";

      }


      return `

        <span
          class="tracking-badge"
        >
          ${status}
        </span>

      `;

    }


    /* ========================================
       TANGGAL
       ======================================== */

    function formatDate(
      value
    ) {

      if (!value) {

        return "—";

      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return value;

      }


      return date.toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      );

    }


    /* ========================================
       BUAT TAMPILAN SETIAP BATCH
       ======================================== */

    const batchHTML =
      Object.entries(
        grouped
      )
      .map(
        function(
          [
            batchCode,
            items
          ]
        ) {

          const firstItem =
            items[0];


          return `

            <div
              class="recap-batch-card"
            >

              <!-- ==========================
                   HEADER BATCH
                   ========================== -->

              <div
                class="recap-batch-header"
              >

                <div>

                  <div
                    class="recap-batch-code"
                  >
                    ${batchCode}
                  </div>


                  <div
                    class="recap-batch-name"
                  >
                    ${
                      firstItem.item_name ||
                      "—"
                    }
                  </div>

                </div>


                <div
                  class="recap-batch-count"
                >
                  ${items.length}
                  data
                </div>

              </div>


              <!-- ==========================
                   TABEL BATCH
                   ========================== -->

              <div
                class="product-table-wrapper"
              >

                <table
                  class="product-table recap-table"
                >

                  <thead>

                    <tr>

                      <th>
                        Versi / Member
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Qty
                      </th>

                      <th>
                        Harga Barang
                      </th>

                      <th>
                        DP
                      </th>

                      <th>
                        Status DP
                      </th>

                      <th>
                        Pelunasan
                      </th>

                      <th>
                        Status Pelunasan
                      </th>

                      <th>
                        Tracking
                      </th>

                      <th>
                        Note
                      </th>

                      <th>
                        Batas CO
                      </th>

                      <th>
                        Aksi
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    ${items.map(
                      function(item) {

                        const version =
                          item.version ||
                          "AVAILABLE";


                        const customer =
                          item.customer_name ||
                          "AVAILABLE";


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


                        const dpStatus =
                          dpStatusHTML(
                            item.dp_status
                          );


                        const paymentStatus =
                          paymentStatusHTML(
                            item.payment_status
                          );


                        const tracking =
                          trackingHTML(
                            item.tracking_status
                          );


                        const deadline =
                          formatDate(
                            item.co_deadline
                          );


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
                              ${formatRupiah(
                                item.item_price
                              )}
                            </td>


                            <td>
                              ${formatRupiah(
                                item.dp_amount
                              )}
                            </td>


                            <td>
                              ${dpStatus}
                            </td>


                            <td>
                              ${formatRupiah(
                                item.remaining_amount
                              )}
                            </td>


                            <td>
                              ${paymentStatus}
                            </td>


                            <td>
                              ${tracking}
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

                            <td>
                             <button
                              type="button"
                              class="edit-recap-button"
                              data-id="${item.id}"
                           >
                               ✏️ Edit
                              </button>

                              <button
                               type="button"
                               class="delete-recap-button"
                               data-id="${item.id}"
                           >
                               🗑️ Hapus
                              </button>
                           </td>

                          </tr>

                        `;

                      }
                    ).join("")}

                  </tbody>

                </table>

              </div>

            </div>

          `;

        }
      )
      .join("");


    /* ========================================
       TAMPILKAN KE HALAMAN
       ======================================== */

    container.innerHTML = `

      <div
        class="recap-list"
      >

        <div
          class="recap-list-header"
        >

        <div class="recap-search">

        <input
          type="text"
          id="recapSearchInput"
          placeholder="🔍 Cari kode batch, customer, barang, member..."
        />

        <div
          id="recapSearchResult"
          class="recap-search-result"
        ></div>

      </div>

      <button
       type="button"
       id="exportRecapButton"
       class="export-recap-button"
      >
       📥 Export Excel
   </button>
      
          <div>

            <h2>
              ${category}
            </h2>

            <p>
              ${data.length}
              data pembelian dari
              ${Object.keys(grouped).length}
              kode batch
            </p>

          </div>

        </div>


        ${batchHTML}

      </div>

    `;

         container
      .querySelectorAll(".edit-recap-button")
      .forEach(function(button) {

        button.addEventListener(
          "click",
          function() {

            const id =
              this.getAttribute("data-id");

            editRecap(id);

          }
        );

      });

     container
        .querySelectorAll(".delete-recap-button")
        .forEach(function(button) {

          button.addEventListener(
            "click",
            function() {

              const id =
                this.getAttribute("data-id");

              deleteRecap(id, category);

            }
          );

      });

  const searchInput =
     container.querySelector("#recapSearchInput");

  if (searchInput) {

     searchInput.addEventListener(
       "input",
       function() {

      const keyword =
        this.value
          .toLowerCase()
          .trim();

      const batchCards =
        container.querySelectorAll(
          ".recap-batch-card"
        );

      const resultInfo =
        container.querySelector("#recapSearchResult");

      let matchCount = 0;

      batchCards.forEach(
        function(card) {

          const text =
            card.innerText
              .toLowerCase();

          if (
            keyword === "" ||
            text.includes(keyword)
          ) {

            card.style.display = "";
            matchCount++;

         } else {

           card.style.display = "none";

         }
        }
      );

   if (resultInfo) {

       if (keyword === "") {

          resultInfo.textContent = "";

        } else if (matchCount === 0) {

          resultInfo.textContent =
            `🔎 Tidak ditemukan data yang cocok dengan "${this.value}"`;

        } else {

          resultInfo.textContent =
            `🔎 Menampilkan ${matchCount} batch yang cocok dengan "${this.value}"`;

        }

      }

    }
  );

}

     const exportButton =
  container.querySelector("#exportRecapButton");

if (exportButton) {

  exportButton.addEventListener(
    "click",
    function() {

      if (
        !data ||
        data.length === 0
      ) {

        alert(
          "Tidak ada data Rekap GO untuk diexport."
        );

        return;
      }

      const exportData =
        data.map(function(item) {

          return {

            "Kategori":
              item.category || "—",

            "Kode Batch":
              item.batch_code || "—",

            "Nama Barang":
              item.item_name || "—",

            "Customer":
              item.customer_name || "—",

            "Versi / Member":
              item.version || "—",

            "Quantity":
              item.quantity || 0,

            "Harga":
              item.item_price || 0,

            "DP":
              item.dp_amount || 0,

            "Status DP":
              item.dp_status || "—",

            "Sisa Pembayaran":
              item.remaining_amount || 0,

            "Status Pembayaran":
              item.payment_status || "—",

            "Tracking":
              item.tracking_status || "—",

            "Catatan":
              item.note || "—",

            "Deadline CO":
              item.co_deadline || "—"

          };

        });

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportData
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Rekap GO"
      );

      const safeCategory =
        category
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "");

      XLSX.writeFile(
        workbook,
        `Rekap-GO-${safeCategory}.xlsx`
      );

    }
  );

}

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
   EDIT REKAP GO - TAHAP 2
   ============================================ */

async function editRecap(id) {

  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("purchase_recap")
      .select("*")
      .eq("id", id)
      .single();


    if (error) {
      throw error;
    }


    if (!data) {
      alert("Data rekap tidak ditemukan.");
      return;
    }


    const container =
      document.getElementById(
        "recapListContainer"
      );


    if (!container) {
      return;
    }


    container.innerHTML = `

      <div class="panel">

        <h2>
          ✏️ Edit Rekap GO
        </h2>

        <p>
          Batch: <strong>
            ${data.batch_code || "—"}
          </strong>
        </p>


        <div class="form-grid">

          <div class="form-group">

            <label>
              Nama Barang
            </label>

            <input
              type="text"
              id="editItemName"
              value="${data.item_name || ""}"
            >

          </div>


          <div class="form-group">

            <label>
              Versi / Member
            </label>

            <input
              type="text"
              id="editVersion"
              value="${data.version || ""}"
            >

          </div>


          <div class="form-group">

            <label>
              Customer
            </label>

            <input
              type="text"
              id="editCustomerName"
              value="${data.customer_name || ""}"
            >

          </div>


          <div class="form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              id="editQuantity"
              value="${data.quantity || 1}"
              min="1"
            >

          </div>


          <div class="form-group">

            <label>
              Harga Barang
            </label>

            <input
              type="number"
              id="editItemPrice"
              value="${data.item_price || 0}"
              min="0"
            >

          </div>


          <div class="form-group">

            <label>
              DP
            </label>

            <input
              type="number"
              id="editDpAmount"
              value="${data.dp_amount || 0}"
              min="0"
            >

          </div>


          <div class="form-group">

            <label>
              Status DP
            </label>

            <select id="editDpStatus">

              <option
                value="unpaid"
                ${data.dp_status === "unpaid" ? "selected" : ""}
              >
                Belum Dibayar
              </option>

              <option
                value="paid"
                ${data.dp_status === "paid" ? "selected" : ""}
              >
                Sudah Dibayar
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Pelunasan
            </label>

            <input
              type="number"
              id="editRemainingAmount"
              value="${data.remaining_amount || 0}"
              min="0"
            >

          </div>


          <div class="form-group">

            <label>
              Status Pelunasan
            </label>

            <select id="editPaymentStatus">

              <option
                value="unpaid"
                ${data.payment_status === "unpaid" ? "selected" : ""}
              >
                Belum Lunas
              </option>

              <option
                value="paid"
                ${data.payment_status === "paid" ? "selected" : ""}
              >
                Sudah Lunas
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Tracking
            </label>

            <input
              type="text"
              id="editTrackingStatus"
              value="${data.tracking_status || ""}"
            >

          </div>


          <div class="form-group">

            <label>
              Batas CO
            </label>

            <input
              type="date"
              id="editCoDeadline"
              value="${
                data.co_deadline
                  ? data.co_deadline.substring(0, 10)
                  : ""
              }"
            >

          </div>


          <div class="form-group">

            <label>
              Note
            </label>

            <textarea
              id="editNote"
              rows="3"
            >${data.note || ""}</textarea>

          </div>

        </div>


        <div class="form-actions">

          <button
            type="button"
            class="secondary-button"
            onclick="loadRecap()"
          >
            ← Kembali
          </button>

          <button
           type="button"
           class="primary-button"
           onclick="saveEditedRecap('${data.id}', '${data.category}')"
         >
           Simpan Perubahan
         </button>
         
        </div>

      </div>

    `;

  } catch (error) {

    console.error(
      "Kesalahan editRecap:",
      error
    );

    alert(
      "Gagal membuka data: " +
      error.message
    );

  }

}

/* ============================================
   SIMPAN EDIT REKAP GO
   ============================================ */

async function saveEditedRecap(id, category) {

  try {

    const updatedData = {

      item_name:
        document
          .getElementById("editItemName")
          .value
          .trim(),

      version:
        document
          .getElementById("editVersion")
          .value
          .trim(),

      customer_name:
        document
          .getElementById("editCustomerName")
          .value
          .trim(),

      quantity:
        Number(
          document
            .getElementById("editQuantity")
            .value
        ) || 1,

      item_price:
        Number(
          document
            .getElementById("editItemPrice")
            .value
        ) || 0,

      dp_amount:
        Number(
          document
            .getElementById("editDpAmount")
            .value
        ) || 0,

      dp_status:
        document
          .getElementById("editDpStatus")
          .value,

      remaining_amount:
        Number(
          document
            .getElementById("editRemainingAmount")
            .value
        ) || 0,

      payment_status:
        document
          .getElementById("editPaymentStatus")
          .value,

      tracking_status:
        document
          .getElementById("editTrackingStatus")
          .value
          .trim(),

      co_deadline:
        document
          .getElementById("editCoDeadline")
          .value || null,

      note:
        document
          .getElementById("editNote")
          .value
          .trim() || null

    };


    const {
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .update(updatedData)
        .eq("id", id);


    if (error) {

      console.error(
        "ERROR UPDATE REKAP:",
        error
      );

      alert(
        "Gagal menyimpan perubahan: " +
        error.message
      );

      return;

    }


    alert(
      "Perubahan berhasil disimpan. ♥"
    );


    await loadRecapList(category);

  } catch (error) {

    console.error(
      "ERROR SAVE EDIT REKAP:",
      error
    );

    alert(
      "Terjadi kesalahan: " +
      error.message
    );

  }

}

/* ============================================
   HAPUS REKAP GO
   ============================================ */

async function deleteRecap(id, category) {
  const confirmDelete = confirm(
    "Yakin ingin menghapus data Rekap GO ini?"
  );

  if (!confirmDelete) return;

  try {
    const { data: deletedRows, error } =
      await supabaseClient
        .from("purchase_recap")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {
      console.error("ERROR DELETE REKAP:", error);
      alert("Gagal menghapus data: " + error.message);
      return;
    }

    if (!deletedRows || deletedRows.length === 0) {
      alert(
        "Data tidak terhapus. Kemungkinan izin DELETE di Supabase belum tersedia."
      );
      return;
    }

    alert("Data Rekap GO berhasil dihapus. ♥");

    await loadRecapList(category);

  } catch (error) {
    console.error("ERROR DELETE REKAP:", error);
    alert("Terjadi kesalahan: " + error.message);
  }
}

/* ============================================
   PESANAN / PO
   ============================================ */

async function loadOrders() {

  pageTitle.textContent =
    "Pesanan";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Pesanan / PO
          </h2>

          <p>
            Kelola posting PO
            Dear Nadiya.
          </p>

        </div>


        <button
          type="button"
          class="primary-button"
          id="addPOButton"
        >
          ➕ Tambah PO
        </button>

      </div>


      <div
        id="poFormContainer"
      ></div>


      <div
        id="ordersContainer"
      >

        <p>
          Memuat PO...
        </p>

      </div>

    </div>

  `;


  const container =
    document.getElementById(
      "ordersContainer"
    );


  const addPOButton =
    document.getElementById(
      "addPOButton"
    );


  const poFormContainer =
    document.getElementById(
      "poFormContainer"
    );


  if (!container) {
    return;
  }


  /* ============================================
     TOMBOL TAMBAH PO
     ============================================ */

  addPOButton.addEventListener(
    "click",
    function () {

      poFormContainer.innerHTML = `

        <div class="panel">

          <h3>
            ➕ Tambah PO
          </h3>


          <form
            id="poForm"
            class="product-form"
          >

            <label>
              Foto Barang / Foto PO
            </label>

            <input
              id="poImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            >


            <label>
              Judul PO
            </label>

            <input
              id="poTitle"
              type="text"
              placeholder="Contoh: Sharing FS Makestar Hongkong New Way (A Ver)"
              required
            >


            <label>
              Harga
            </label>

            <input
              id="poPrice"
              type="text"
              placeholder="Contoh: Set 200k / Sharing 24k"
            >


            <label>
              DP
            </label>

            <input
              id="poDP"
              type="text"
              placeholder="Contoh: Set 120k / Sharing 12k"
            >


            <label>
              Close PO
            </label>

            <input
              id="poCloseDate"
              type="date"
            >


            <label>
              Last DP
            </label>

            <input
              id="poLastDP"
              type="date"
            >


            <label>
              Status PO
            </label>

            <select id="poStatus">

              <option value="active">
                Aktif
              </option>

              <option value="closed">
                Closed
              </option>

              <option value="completed">
                Selesai
              </option>

            </select>


            <label>
              Keterangan
            </label>

            <textarea
              id="poDescription"
              rows="6"
              placeholder="Tulis keterangan PO di sini..."
            ></textarea>

            <label>
  Data Batch / Item / Customer
</label>

<div
  id="poBatchContainer"
  style="
    margin-top:10px;
  "
></div>

<button
  type="button"
  class="secondary-button"
  id="addBatchButton"
  style="
    margin-top:12px;
  "
>
  ➕ Tambah Batch
</button>

            <div
              style="
                display:flex;
                gap:10px;
                margin-top:20px;
                flex-wrap:wrap;
              "
            >

              <button
                type="submit"
                class="primary-button"
              >
                💾 Simpan PO
              </button>


              <button
                type="button"
                class="secondary-button"
                id="cancelPOButton"
              >
                Batal
              </button>

            </div>


            <div
              id="poFormMessage"
              style="
                margin-top:15px;
              "
            ></div>

          </form>

        </div>

      `;


      const poForm =
        document.getElementById(
          "poForm"
        );


      const cancelPOButton =
        document.getElementById(
          "cancelPOButton"
        );


      const poFormMessage =
        document.getElementById(
          "poFormMessage"
        );

       const poBatchContainer =
  document.getElementById(
    "poBatchContainer"
  );

const addBatchButton =
  document.getElementById(
    "addBatchButton"
  );


let batchCounter = 0;


function addBatch() {

  batchCounter++;

  const batchId =
    "batch-" +
    batchCounter;


  const batchDiv =
    document.createElement(
      "div"
    );


  batchDiv.className =
    "panel";


  batchDiv.style.marginTop =
    "15px";


  batchDiv.innerHTML = `

    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        margin-bottom:15px;
      "
    >

      <h3
        style="
          margin:0;
        "
      >
        Batch ${batchCounter}
      </h3>


      <button
        type="button"
        class="secondary-button"
        data-remove-batch="${batchId}"
      >
        🗑️ Hapus Batch
      </button>

    </div>


    <label>
      Nama Batch
    </label>

    <input
      type="text"
      class="batch-name"
      placeholder="Contoh: Batch 1"
      value="Batch ${batchCounter}"
    >


    <label
      style="
        margin-top:15px;
        display:block;
      "
    >
      Item / Member / Version
    </label>

    <div
      class="batch-items"
    ></div>


    <button
      type="button"
      class="secondary-button add-item-button"
      style="
        margin-top:12px;
      "
    >
      ➕ Tambah Item
    </button>

  `;


  poBatchContainer.appendChild(
    batchDiv
  );


  const itemsContainer =
    batchDiv.querySelector(
      ".batch-items"
    );


  const addItemButton =
    batchDiv.querySelector(
      ".add-item-button"
    );


  function addItem() {

    const itemDiv =
      document.createElement(
        "div"
      );


    itemDiv.style.display =
      "grid";

    itemDiv.style.gridTemplateColumns =
      "1fr 1fr 100px auto";

    itemDiv.style.gap =
      "8px";

    itemDiv.style.marginTop =
      "10px";


    itemDiv.innerHTML = `

      <input
        type="text"
        class="po-item-name"
        placeholder="Item / Member / Version"
      >


      <input
        type="text"
        class="po-customer-name"
        placeholder="Nama Customer"
      >


      <input
        type="number"
        class="po-item-qty"
        min="1"
        value="1"
        placeholder="Qty"
      >


      <button
        type="button"
        class="secondary-button remove-item-button"
      >
        ✕
      </button>

    `;


    itemsContainer.appendChild(
      itemDiv
    );


    itemDiv
      .querySelector(
        ".remove-item-button"
      )
      .addEventListener(
        "click",
        function() {

          itemDiv.remove();

        }
      );

  }


  addItemButton.addEventListener(
    "click",
    addItem
  );


  batchDiv
    .querySelector(
      `[data-remove-batch="${batchId}"]`
    )
    .addEventListener(
      "click",
      function() {

        batchDiv.remove();

      }
    );


  /* Baris pertama otomatis */

  addItem();

}


/* Tambah Batch */

addBatchButton.addEventListener(
  "click",
  addBatch
);


/* Batch pertama otomatis */

addBatch();

      /* ============================================
         BATAL
         ============================================ */

      cancelPOButton.addEventListener(
        "click",
        function () {

          poFormContainer.innerHTML =
            "";

        }
      );


      /* ============================================
         SIMPAN PO
         ============================================ */

      poForm.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          const imageFile =
            document.getElementById(
              "poImage"
            ).files[0];


          const title =
            document.getElementById(
              "poTitle"
            ).value.trim();


          const priceText =
            document.getElementById(
              "poPrice"
            ).value.trim();


          const dpText =
            document.getElementById(
              "poDP"
            ).value.trim();


          const closeDate =
            document.getElementById(
              "poCloseDate"
            ).value || null;


          const lastDPDate =
            document.getElementById(
              "poLastDP"
            ).value || null;


          const status =
            document.getElementById(
              "poStatus"
            ).value;


          const description =
            document.getElementById(
              "poDescription"
            ).value.trim();


          const listText =
            document.getElementById(
              "poList"
            ).value;


          if (!imageFile) {

            poFormMessage.innerHTML = `
              <p style="color:#a83232;">
                Foto PO wajib dipilih.
              </p>
            `;

            return;

          }


          if (!title) {

            poFormMessage.innerHTML = `
              <p style="color:#a83232;">
                Judul PO wajib diisi.
              </p>
            `;

            return;

          }


          poFormMessage.innerHTML = `
            <p>
              ⏳ Menyimpan PO...
            </p>
          `;


          const submitButton =
            poForm.querySelector(
              'button[type="submit"]'
            );


          submitButton.disabled = true;


          let uploadedPath =
            null;


          try {

            /* ============================================
               UPLOAD FOTO
               ============================================ */

            const safeFileName =
              imageFile.name
                .replace(
                  /[^a-zA-Z0-9._-]/g,
                  "-"
                );


            const filePath =
              "po/" +
              Date.now() +
              "-" +
              safeFileName;


            const {
              error: uploadError
            } =
              await supabaseClient
                .storage
                .from("po-images")
                .upload(
                  filePath,
                  imageFile,
                  {
                    cacheControl:
                      "3600",
                    upsert: false
                  }
                );


            if (uploadError) {
              throw uploadError;
            }


            uploadedPath =
              filePath;


            /* ============================================
               AMBIL URL FOTO
               ============================================ */

            const {
              data: publicURLData
            } =
              supabaseClient
                .storage
                .from("po-images")
                .getPublicUrl(
                  filePath
                );


            const imageURL =
              publicURLData
                .publicUrl;


            /* ============================================
               SIMPAN LIST SEBAGAI DATA FLEKSIBEL
               ============================================ */

            const listData =
              listText
                .split("\n")
                .map(
                  function(line) {
                    return line.trim();
                  }
                )
                .filter(
                  function(line) {
                    return line !== "";
                  }
                )
                .map(
                  function(line) {
                    return {
                      text: line
                    };
                  }
                );


            /* ============================================
               SIMPAN DATA PO
               ============================================ */

            const {
              error: insertError
            } =
              await supabaseClient
                .from("po_posts")
                .insert([
                  {
                    title:
                      title,

                    image_url:
                      imageURL,

                    price_text:
                      priceText,

                    dp_text:
                      dpText,

                    close_date:
                      closeDate,

                    last_dp_date:
                      lastDPDate,

                    description:
                      description,

                    list_data:
                      listData,

                    status:
                      status
                  }
                ]);


            if (insertError) {

              /* Hapus foto jika
                 database gagal */

              await supabaseClient
                .storage
                .from("po-images")
                .remove([
                  uploadedPath
                ]);

              throw insertError;

            }


            poFormMessage.innerHTML = `
              <p
                style="
                  color:#236b43;
                  font-weight:600;
                "
              >
                ✅ PO berhasil disimpan.
              </p>
            `;


            poForm.reset();


            setTimeout(
              function() {

                loadOrders();

              },
              700
            );


          } catch (error) {

            console.error(
              "ERROR SAVE PO:",
              error
            );


            poFormMessage.innerHTML = `
              <p
                style="
                  color:#a83232;
                "
              >
                ❌ Gagal menyimpan PO:
                ${error.message}
              </p>
            `;


            submitButton.disabled =
              false;

          }

        }
      );

    }
  );


  /* ============================================
     AMBIL DATA PO
     ============================================ */

  const {
    data,
    error
  } =
    await supabaseClient
      .from("po_posts")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD PO:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat PO
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

    return;

  }


  /* ============================================
     BELUM ADA PO
     ============================================ */

  if (
    !data ||
    data.length === 0
  ) {

    container.innerHTML = `

      <div class="panel">

        <h3>
          Belum ada PO
        </h3>

        <p>
          Klik "Tambah PO" untuk
          membuat posting PO baru.
        </p>

      </div>

    `;

    return;

  }


  /* ============================================
     TAMPILKAN PO
     ============================================ */

  container.innerHTML = `

    <div class="po-list">

      ${data.map(
        function(po) {

          const listHTML =
            Array.isArray(
              po.list_data
            )
              ? po.list_data
                  .map(
                    function(item) {

                      return `
                        <div>
                          ${item.text || ""}
                        </div>
                      `;

                    }
                  )
                  .join("")
              : "";


          return `

            <div
              class="panel po-card"
              style="
                margin-bottom:20px;
              "
            >

              ${
                po.image_url
                  ? `
                    <img
                      src="${po.image_url}"
                      alt="${po.title || "Foto PO"}"
                      style="
                        width:100%;
                        max-height:400px;
                        object-fit:contain;
                        border-radius:15px;
                        margin-bottom:20px;
                      "
                    >
                  `
                  : ""
              }


              <h2>
                ${po.title || "Tanpa Judul"}
              </h2>


              ${
                po.price_text
                  ? `
                    <p>
                      💸
                      <strong>Harga:</strong>
                      ${po.price_text}
                    </p>
                  `
                  : ""
              }


              ${
                po.dp_text
                  ? `
                    <p>
                      💰
                      <strong>DP:</strong>
                      ${po.dp_text}
                    </p>
                  `
                  : ""
              }


              ${
                po.close_date
                  ? `
                    <p>
                      📅
                      <strong>Close PO:</strong>
                      ${new Date(
                        po.close_date +
                        "T00:00:00"
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  `
                  : ""
              }


              ${
                po.last_dp_date
                  ? `
                    <p>
                      💳
                      <strong>Last DP:</strong>
                      ${new Date(
                        po.last_dp_date +
                        "T00:00:00"
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  `
                  : ""
              }


              ${
                po.description
                  ? `
                    <div
                      style="
                        margin-top:15px;
                        white-space:pre-line;
                      "
                    >
                      ${po.description}
                    </div>
                  `
                  : ""
              }


              ${
                listHTML
                  ? `
                    <div
                      style="
                        margin-top:20px;
                        padding-top:15px;
                        border-top:1px solid #eee;
                        line-height:1.7;
                      "
                    >

                      <strong>
                        📋 List
                      </strong>

                      <div
                        style="
                          margin-top:10px;
                        "
                      >
                        ${listHTML}
                      </div>

                    </div>
                  `
                  : ""
              }


              <p
                style="
                  margin-top:20px;
                "
              >
                Status:
                <strong>
                  ${po.status || "—"}
                </strong>
              </p>

            </div>

          `;

        }
      ).join("")}

    </div>

  `;

}

/* ============================================
   PEMBAYARAN
   ============================================ */

async function loadPayments() {

  pageTitle.textContent =
    "Pembayaran";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Pembayaran
          </h2>

          <p>
            Kelola bukti pembayaran customer.
          </p>

        </div>

      </div>


      <div
        id="paymentsContainer"
      >

        <p>
          Memuat pembayaran...
        </p>

      </div>

    </div>

  `;


  const container =
    document.getElementById(
      "paymentsContainer"
    );


  if (!container) {
    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient

      .from(
        "dn_payment_submissions"
      )

      .select("*")

      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD PAYMENTS:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat pembayaran
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
          Belum ada pembayaran
        </h3>

      </div>

    `;

    return;
  }


  container.innerHTML = `

    <div
      class="product-table-wrapper"
    >

      <table
        class="product-table"
      >

        <thead>

          <tr>

            <th>
              ID
            </th>

            <th>
              Customer
            </th>

            <th>
              WhatsApp
            </th>

            <th>
              Kode Produk
            </th>

            <th>
              Versi
            </th>

            <th>
              Nominal
            </th>

            <th>
              Tanggal Transfer
            </th>

            <th>
              Bukti
            </th>

            <th>
              Status
            </th>

            <th>
              Aksi
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(payment) {

              return `

                <tr>

                  <td>
                    ${
                      payment.id ||
                      "—"
                    }
                  </td>


                  <td>
                    ${
                      payment.customer_name ||
                      "—"
                    }
                  </td>


                  <td>
                    ${
                      payment.whatsapp_last4 ||
                      "—"
                    }
                  </td>


                  <td>
                    ${
                      payment.product_code ||
                      "—"
                    }
                  </td>


                  <td>
                    ${
                      payment.product_version ||
                      "—"
                    }
                  </td>


                  <td>
                    Rp${Number(
                      payment.amount ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>


                  <td>
                    ${
                      payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleDateString(
                            "id-ID"
                          )
                        : "—"
                    }
                  </td>


                  <td>

                   ${
  payment.proof_path
    ? `
      <button
        type="button"
        class="primary-button"
        onclick='viewPaymentProof(${JSON.stringify(
          payment.proof_path
        )})'
      >
        👁️ Lihat Bukti
      </button>
    `
    : "—"
}

                  </td>


                  <td>

  <span
    class="status"
  >

    ${
      payment.status ||
      "—"
    }

  </span>

</td>

<td>

  ${
    payment.status === "pending"
      ? `

        <button
          type="button"
          class="primary-button"
          onclick="
            if (
              confirm(
                'Konfirmasi pembayaran ini?'
              )
            ) {
              updatePaymentStatus(
                ${payment.id},
                'confirmed'
              );
            }
          "
        >
          ✓ Konfirmasi
        </button>


        <button
          type="button"
          class="delete-button"
          onclick="
            if (
              confirm(
                'Tolak pembayaran ini?'
              )
            ) {
              updatePaymentStatus(
                ${payment.id},
                'rejected'
              );
            }
          "
        >
          ✕ Tolak
        </button>

      `
      : payment.status === "confirmed"
        ? "✓ Pembayaran dikonfirmasi"
        : payment.status === "rejected"
          ? "✕ Pembayaran ditolak"
          : "—"
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
   REFRESH
   ============================================ */

if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    async function () {

      const activeButton =
        document.querySelector(
          ".menu-button.active"
        );


      const currentPage =
        activeButton?.dataset?.page;


      if (
        currentPage ===
        "dashboard"
      ) {

        loadDashboard();

      }


      else if (
        currentPage ===
        "products"
      ) {

        loadProducts();

      }


      else if (
        currentPage ===
        "orders"
      ) {

        loadOrders();

      }


      else if (
        currentPage ===
        "payments"
      ) {

        loadPayments();

      }


      else if (
        currentPage ===
        "recap"
      ) {

        loadRecap();

      }

    }
  );

}


/* ============================================
   MULAI APLIKASI
   ============================================ */

checkGoogleSession();
