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
            Kelola seluruh rekapan pembelian
            Dear Nadiya.
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


      <div
        class="recap-category-buttons"
        id="recapCategoryButtons"
      >

        <button
          type="button"
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


  const categoryButtons =
    document.querySelectorAll(
      "#recapCategoryButtons button"
    );


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


          const category =
            button.dataset.category;


          loadRecapList(
            category
          );

        }
      );

    }
  );


  document
    .getElementById(
      "addRecapButton"
    )
    .addEventListener(
      "click",
      function() {

        showRecapForm();

      }
    );

}


/* ============================================
   PILIHAN TRACKING
   ============================================ */

function getTrackingOptions(
  category
) {

  if (
    category ===
    "Treasure INA"
  ) {

    return [

      {
        value:
          "Co Seller",

        label:
          "Co Seller"

      },

      {
        value:
          "Arrived Admin",

        label:
          "Arrived Admin"

      },

      {
        value:
          "Delivered",

        label:
          "Delivered"

      }

    ];

  }


  if (
    category ===
    "Truz"
  ) {

    return [

      {
        value:
          "Co Web / Seller",

        label:
          "Co Web / Seller"

      },

      {
        value:
          "Arrived WH KR",

        label:
          "Arrived WH KR"

      },

      {
        value:
          "Arrived WH JP",

        label:
          "Arrived WH JP"

      },

      {
        value:
          "Arrived WH CH",

        label:
          "Arrived WH CH"

      },

      {
        value:
          "Arrived WH Thai",

        label:
          "Arrived WH Thai"

      },

      {
        value:
          "Shipping INA",

        label:
          "Shipping INA"

      },

      {
        value:
          "Arrived Admin",

        label:
          "Arrived Admin"

      },

      {
        value:
          "Goods Arrive at Customer",

        label:
          "Goods Arrive at Customer"

      }

    ];

  }


  let warehouse =
    "KR";


  if (
    category ===
    "Treasure JP"
  ) {

    warehouse =
      "JP";

  }


  if (
    category ===
    "Treasure CH"
  ) {

    warehouse =
      "CH";

  }


  if (
    category ===
    "Treasure Thai"
  ) {

    warehouse =
      "Thai";

  }


  return [

    {
      value:
        "Co Web / Seller",

      label:
        "Co Web / Seller"

    },

    {
      value:
        "Arrived WH " +
        warehouse,

      label:
        "Arrived WH " +
        warehouse

    },

    {
      value:
        "Shipping INA",

      label:
        "Shipping INA"

    },

    {
      value:
        "Arrived Admin",

      label:
        "Arrived Admin"

    },

    {
      value:
        "Goods Arrive at Customer",

      label:
        "Goods Arrive at Customer"

    }

  ];

}


/* ============================================
   TAMPILKAN FORM REKAP
   ============================================ */

function showRecapForm() {

  const container =
    document.getElementById(
      "recapFormContainer"
    );


  container.innerHTML = `

    <div class="panel">

      <h3>
        Tambah Rekap Pembelian
      </h3>


      <form id="recapForm">

        <label>
          Kategori
        </label>

        <select
          id="recapCategory"
          required
        >

          <option value="Truz">
            Truz
          </option>

          <option value="Treasure KR">
            Treasure KR
          </option>

          <option value="Treasure JP">
            Treasure JP
          </option>

          <option value="Treasure CH">
            Treasure CH
          </option>

          <option value="Treasure Thai">
            Treasure Thai
          </option>

          <option value="Treasure Album">
            Treasure Album
          </option>

          <option value="Treasure INA">
            Treasure INA
          </option>

        </select>


        <label>
          Kode Batch
        </label>

        <input
          id="recapBatch"
          type="text"
          placeholder="Contoh: CH-001 / BATCH 1"
          required
        >


        <label>
          Nama Barang
        </label>

        <input
          id="recapItemName"
          type="text"
          placeholder="Contoh: FS KnPops"
          required
        >


        <label>
          Customer
        </label>

        <input
          id="recapCustomer"
          type="text"
          placeholder="Nama customer (4 nomor terakhir WA)"
        >


        <label>
          Versi / Member / Character
        </label>

        <input
          id="recapVersion"
          type="text"
          placeholder="Contoh: Hyunsuk / Version A / RURU"
        >


        <label>
          Qty
        </label>

        <input
          id="recapQty"
          type="number"
          min="1"
          value="1"
          required
        >


        <label>
          Harga Barang
        </label>

        <input
          id="recapPrice"
          type="number"
          min="0"
          value="0"
          required
        >


        <label>
          DP
        </label>

        <input
          id="recapDP"
          type="number"
          min="0"
          value="0"
        >


        <label>
          Status DP
        </label>

        <select id="recapDPStatus">

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
          id="recapRemaining"
          type="number"
          min="0"
          value="0"
        >


        <label>
          Status Pelunasan
        </label>

        <select id="recapPaymentStatus">

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
          id="recapTracking"
        ></select>


        <label>
          Note
        </label>

        <textarea
          id="recapNote"
          rows="4"
          placeholder="Catatan..."
        ></textarea>


        <label>
          Batas CO / Checkout
        </label>

        <input
          id="recapCODedline"
          type="date"
        >


        <div class="form-actions">

          <button
            type="submit"
            class="primary-button"
          >
            Simpan Rekap
          </button>


          <button
            type="button"
            id="cancelRecapButton"
          >
            Batal
          </button>

        </div>


        <p
          id="recapFormMessage"
          class="login-error"
        ></p>

      </form>

    </div>

  `;


  const categorySelect =
    document.getElementById(
      "recapCategory"
    );

  const trackingSelect =
    document.getElementById(
      "recapTracking"
    );


  function updateTracking() {

    const category =
      categorySelect.value;


    const options =
      getTrackingOptions(
        category
      );


    trackingSelect.innerHTML =
      options.map(
        function(option) {

          return `

            <option
              value="${option.value}"
            >
              ${option.label}
            </option>

          `;

        }
      ).join("");

  }


  categorySelect.addEventListener(
    "change",
    updateTracking
  );


  updateTracking();


  document
    .getElementById(
      "cancelRecapButton"
    )
    .addEventListener(
      "click",
      function() {

        container.innerHTML =
          "";

      }
    );


  document
    .getElementById(
      "recapForm"
    )
    .addEventListener(
      "submit",
      saveRecap
    );

}


/* ============================================
   SIMPAN REKAP KE SUPABASE
   ============================================ */

async function saveRecap(
  event
) {

  event.preventDefault();


  const message =
    document.getElementById(
      "recapFormMessage"
    );


  message.textContent =
    "Menyimpan rekap...";


  const category =
    document
      .getElementById(
        "recapCategory"
      )
      .value;


  const batchCode =
    document
      .getElementById(
        "recapBatch"
      )
      .value
      .trim();


  const itemName =
    document
      .getElementById(
        "recapItemName"
      )
      .value
      .trim();


  const customerName =
    document
      .getElementById(
        "recapCustomer"
      )
      .value
      .trim();


  const version =
    document
      .getElementById(
        "recapVersion"
      )
      .value
      .trim();


  const quantity =
    Number(
      document
        .getElementById(
          "recapQty"
        )
        .value
    );


  const itemPrice =
    Number(
      document
        .getElementById(
          "recapPrice"
        )
        .value
    );


  const dpAmount =
    Number(
      document
        .getElementById(
          "recapDP"
        )
        .value
    );


  const dpStatus =
    document
      .getElementById(
        "recapDPStatus"
      )
      .value;


  const remainingAmount =
    Number(
      document
        .getElementById(
          "recapRemaining"
        )
        .value
    );


  const paymentStatus =
    document
      .getElementById(
        "recapPaymentStatus"
      )
      .value;


  const trackingStatus =
    document
      .getElementById(
        "recapTracking"
      )
      .value;


  const note =
    document
      .getElementById(
        "recapNote"
      )
      .value
      .trim();


  const coDeadline =
    document
      .getElementById(
        "recapCODedline"
      )
      .value || null;


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


  const recap = {

    category:
      category,

    batch_code:
      batchCode,

    item_name:
      itemName,

    customer_name:
      customerName ||
      "AVAILABLE",

    version:
      version ||
      "AVAILABLE",

    quantity:
      quantity || 1,

    item_price:
      itemPrice || 0,

    dp_amount:
      dpAmount || 0,

    dp_status:
      dpStatus,

    remaining_amount:
      remainingAmount || 0,

    payment_status:
      paymentStatus,

    tracking_status:
      trackingStatus,

    note:
      note || null,

    co_deadline:
      coDeadline

  };


  console.log(
    "DATA REKAP:",
    recap
  );


  const {
    data,
    error
  } =
    await supabaseClient
      .from("purchase_recap")
      .insert(
        recap
      )
      .select();


  console.log(
    "HASIL:",
    data
  );


  if (error) {

    console.error(
      "ERROR SIMPAN REKAP:",
      error
    );


    message.textContent =
      "Gagal menyimpan rekap: " +
      error.message;

    return;

  }


  message.textContent =
    "Rekap berhasil disimpan. ♥";


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
    500
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


  container.innerHTML =
    "<p>Memuat rekap...</p>";


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
        "id",
        {
          ascending: true
        }
      );


  console.log(
    "REKAP " +
      category +
      ":",
    data
  );


  if (error) {

    console.error(
      "ERROR REKAP:",
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

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    container.innerHTML = `

      <div class="panel">

        <h3>
          Belum ada data
        </h3>

        <p>
          Belum ada rekapan untuk
          <strong>
            ${category}
          </strong>.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="product-table-wrapper">

      <table class="product-table recap-table">

        <thead>

          <tr>

            <th>Batch</th>

            <th>Nama Barang</th>

            <th>Customer</th>

            <th>
              Versi / Member / Character
            </th>

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


              const isAvailable =
                customer
                  .toUpperCase()
                  .trim() ===
                  "AVAILABLE";


              const isVersionAvailable =
                version
                  .toUpperCase()
                  .trim() ===
                  "AVAILABLE";


              const customerHTML =
                isAvailable

                  ? `

                    <span
                      class="available-member"
                    >
                      AVAILABLE
                    </span>

                  `

                  : customer;


              const versionHTML =
                isVersionAvailable

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


              const tracking =
                item.tracking_status ||
                "—";


              const coDeadline =
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
                    ${customerHTML}
                  </td>


                  <td>
                    ${versionHTML}
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
                    ${tracking}
                  </td>


                  <td>
                    ${item.note || "—"}
                  </td>


                  <td>
                    ${coDeadline}
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
