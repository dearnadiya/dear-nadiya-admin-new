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

      console.error(
        "Gagal menyimpan produk:",
        error
      );

      message.textContent =
        "Gagal menyimpan produk: " +
        error.message;

      return;

    }


    message.textContent =
      "Produk berhasil disimpan. ♥";


    productFormContainer.innerHTML = "";


    /* Muat ulang daftar produk */

    await loadProductList();

  }


  /* ============================================
     TAMPILKAN DAFTAR PRODUK
     ============================================ */

  async function loadProductList() {

    productListContainer.innerHTML =
      "<p>Memuat produk...</p>";


    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from("products")
          .select("*")
          .order("id", {
            ascending: false
          });


      console.log(
        "DATA PRODUCTS:",
        data
      );

      console.log(
        "ERROR PRODUCTS:",
        error
      );


      if (error) {

        productListContainer.innerHTML = `

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

        productListContainer.innerHTML = `

          <div class="panel">

            <h3>
              Belum ada produk
            </h3>

            <p>
              Belum ada produk yang tersimpan.
            </p>

          </div>

        `;

        return;

      }


      productListContainer.innerHTML = `

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
                        ).toLocaleString("id-ID")}
                      </td>

                      <td>
                        Rp${Number(
                          product.dp || 0
                        ).toLocaleString("id-ID")}
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

    } catch (error) {

      console.error(
        "Kesalahan loadProductList:",
        error
      );


      productListContainer.innerHTML = `

        <div class="panel">

          <h3>
            Gagal memuat produk
          </h3>

          <p>
            ${error.message}
          </p>

        </div>

      `;

    }

  }


  /* ============================================
     PENTING:
     MUAT DATA PRODUK SAAT HALAMAN DIBUKA
     ============================================ */

  await loadProductList();

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
   REKAP GO
   ============================================ */

async function loadRecap() {

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
            Kelola seluruh rekapan pembelian Dear Nadiya.
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


      <!-- KATEGORI -->

      <div
        id="recapCategoryButtons"
        class="recap-category-buttons"
      >

        <button
          type="button"
          class="recap-category-button active"
          data-category="Truz"
        >
          Truz
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure KR"
        >
          Treasure KR
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure JP"
        >
          Treasure JP
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure CH"
        >
          Treasure CH
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure Thai"
        >
          Treasure Thai
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure Album"
        >
          Treasure Album
        </button>

        <button
          type="button"
          class="recap-category-button"
          data-category="Treasure INA"
        >
          Treasure INA
        </button>

      </div>


      <!-- FORM -->

      <div
        id="recapFormContainer"
      ></div>


      <!-- LIST -->

      <div
        id="recapListContainer"
      >

        <p>
          Memuat rekap...
        </p>

      </div>

    </div>

  `;


  const addRecapButton =
    document.getElementById(
      "addRecapButton"
    );


  const recapFormContainer =
    document.getElementById(
      "recapFormContainer"
    );


  const recapListContainer =
    document.getElementById(
      "recapListContainer"
    );


  const categoryButtons =
    document.querySelectorAll(
      ".recap-category-button"
    );


  let selectedCategory =
    "Truz";


  /* ============================================
     PILIH KATEGORI
     ============================================ */

  categoryButtons.forEach(
    function(button) {

      button.addEventListener(
        "click",
        async function() {

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


          recapFormContainer.innerHTML =
            "";


          await loadRecapList(
            selectedCategory
          );

        }
      );

    }
  );


  /* ============================================
     TRACKING SESUAI KATEGORI
     ============================================ */

  function getTrackingOptions(
    category
  ) {

    if (
      category === "Treasure INA"
    ) {

      return [

        "CO Seller",

        "Arrived Admin",

        "Delivered"

      ];

    }


    if (
      category === "Treasure KR"
    ) {

      return [

        "CO Web / Seller",

        "Arrived WH KR",

        "Shipping to INA",

        "Arrived WH INA",

        "Arrived Admin",

        "Delivered"

      ];

    }


    if (
      category === "Treasure JP"
    ) {

      return [

        "CO Web / Seller",

        "Arrived WH JP",

        "Shipping to INA",

        "Arrived WH INA",

        "Arrived Admin",

        "Delivered"

      ];

    }


    if (
      category === "Treasure CH"
    ) {

      return [

        "CO Web / Seller",

        "Arrived WH CH",

        "Shipping to INA",

        "Arrived WH INA",

        "Arrived Admin",

        "Delivered"

      ];

    }


    if (
      category === "Treasure Thai"
    ) {

      return [

        "CO Web / Seller",

        "Arrived WH Thai",

        "Shipping to INA",

        "Arrived WH INA",

        "Arrived Admin",

        "Delivered"

      ];

    }


    if (
      category === "Truz"
    ) {

      return [

        "CO Web / Seller",

        "Arrived WH KR",

        "Arrived WH JP",

        "Arrived WH CH",

        "Arrived WH Thai",

        "Shipping to INA",

        "Arrived WH INA",

        "Arrived Admin",

        "Delivered"

      ];

    }


    /* Treasure Album */

    return [

      "CO Web / Seller",

      "Arrived WH KR",

      "Arrived WH JP",

      "Arrived WH CH",

      "Arrived WH Thai",

      "Shipping to INA",

      "Arrived WH INA",

      "Arrived Admin",

      "Delivered"

    ];

  }


  /* ============================================
     TAMBAH REKAP
     ============================================ */

  addRecapButton.addEventListener(
    "click",
    function() {

      const trackingOptions =
        getTrackingOptions(
          selectedCategory
        );


      recapFormContainer.innerHTML = `

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
              id="recapBatchCode"
              type="text"
              placeholder="Contoh: CH-001"
              required
            >


            <label>
              Nama Barang
            </label>

            <input
              id="recapItemName"
              type="text"
              placeholder="Contoh: FS Knpops"
              required
            >


            <label>
              Customer
            </label>

            <select
              id="recapCustomer"
            >

              <option value="">
                -- Belum ada customer / AVAILABLE --
              </option>

            </select>


            <label>
              Versi / Member / Character
            </label>

            <input
              id="recapVersion"
              type="text"
              placeholder="Contoh: Hyunsuk / RURU / Version A"
            >


            <label>
              Qty
            </label>

            <input
              id="recapQuantity"
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
              id="recapDp"
              type="number"
              min="0"
              value="0"
            >


            <label>
              Status DP
            </label>

            <select
              id="recapDpStatus"
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
              id="recapRemaining"
              type="number"
              min="0"
              value="0"
            >


            <label>
              Status Pelunasan
            </label>

            <select
              id="recapPaymentStatus"
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
              id="recapTracking"
              required
            >

              ${trackingOptions.map(
                function(option) {

                  return `

                    <option value="${option}">
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
              id="recapNote"
              rows="3"
              placeholder="Catatan..."
            ></textarea>


            <label>
              Batas CO
            </label>

            <input
              id="recapCoDeadline"
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


      loadRecapCustomers();


      const recapCategory =
        document.getElementById(
          "recapCategory"
        );


      recapCategory.value =
        selectedCategory;


      recapCategory.addEventListener(
        "change",
        function() {

          selectedCategory =
            this.value;


          const trackingSelect =
            document.getElementById(
              "recapTracking"
            );


          const options =
            getTrackingOptions(
              selectedCategory
            );


          trackingSelect.innerHTML =
            options.map(
              function(option) {

                return `

                  <option value="${option}">
                    ${option}
                  </option>

                `;

              }
            ).join("");

        }
      );


      document
        .getElementById(
          "cancelRecapButton"
        )
        .addEventListener(
          "click",
          function() {

            recapFormContainer.innerHTML =
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
  );


  /* ============================================
     CUSTOMER
     ============================================ */

  async function loadRecapCustomers() {

    const customerSelect =
      document.getElementById(
        "recapCustomer"
      );


    if (!customerSelect) {
      return;
    }


    const {
      data,
      error
    } =
      await supabaseClient
        .from("customers")
        .select(
          "id, name, whatsapp"
        )
        .order(
          "name",
          {
            ascending: true
          }
        );


    if (error) {

      console.error(
        "Gagal memuat customer:",
        error
      );

      return;

    }


    data.forEach(
      function(customer) {

        const whatsapp =
          customer.whatsapp || "";


        const lastFour =
          whatsapp
            .replace(/\D/g, "")
            .slice(-4);


        const option =
          document.createElement(
            "option"
          );


        option.value =
          customer.id;


        option.textContent =
          customer.name +
          (
            lastFour
              ? " (••••" + lastFour + ")"
              : ""
          );


        customerSelect.appendChild(
          option
        );

      }
    );

  }


  /* ============================================
     SIMPAN REKAP
     ============================================ */

  async function saveRecap(event) {

    event.preventDefault();


    const message =
      document.getElementById(
        "recapFormMessage"
      );


    message.textContent =
      "Menyimpan rekap...";


    const category =
      document.getElementById(
        "recapCategory"
      ).value;


    const batchCode =
      document.getElementById(
        "recapBatchCode"
      ).value.trim();


    const itemName =
      document.getElementById(
        "recapItemName"
      ).value.trim();


    const customerId =
      document.getElementById(
        "recapCustomer"
      ).value;


    const quantity =
      Number(
        document.getElementById(
          "recapQuantity"
        ).value
      );


    const price =
      Number(
        document.getElementById(
          "recapPrice"
        ).value
      );


    const dp =
      Number(
        document.getElementById(
          "recapDp"
        ).value
      );


    const remaining =
      Number(
        document.getElementById(
          "recapRemaining"
        ).value
      );


    const recap = {

      category:
        category,

      batch_code:
        batchCode,

      item_name:
        itemName,

      customer_id:
        customerId
          ? Number(customerId)
          : null,

      version:
        document.getElementById(
          "recapVersion"
        ).value.trim(),

      quantity:
        quantity,

      item_price:
        price,

      dp_amount:
        dp,

      dp_status:
        document.getElementById(
          "recapDpStatus"
        ).value,

      remaining_amount:
        remaining,

      payment_status:
        document.getElementById(
          "recapPaymentStatus"
        ).value,

      tracking_status:
        document.getElementById(
          "recapTracking"
        ).value,

      note:
        document.getElementById(
          "recapNote"
        ).value.trim(),

      co_deadline:
        document.getElementById(
          "recapCoDeadline"
        ).value || null

    };


    const {
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .insert(recap);


    if (error) {

      console.error(
        "Gagal menyimpan rekap:",
        error
      );


      message.textContent =
        "Gagal menyimpan rekap: " +
        error.message;


      return;

    }


    message.textContent =
      "Rekap berhasil disimpan. ♥";


    recapFormContainer.innerHTML =
      "";


    await loadRecapList(
      selectedCategory
    );

  }


  /* ============================================
     TAMPILKAN REKAP
     ============================================ */

  async function loadRecapList(
    category
  ) {

    recapListContainer.innerHTML =
      "<p>Memuat rekap...</p>";


    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select(`
          *,
          customers (
            name,
            whatsapp
          )
        `)
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

      console.error(
        "Gagal memuat rekap:",
        error
      );


      recapListContainer.innerHTML = `

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

      recapListContainer.innerHTML = `

        <div class="panel">

          <h3>
            Belum ada data
          </h3>

          <p>
            Belum ada rekapan untuk kategori
            <strong>${category}</strong>.
          </p>

        </div>

      `;


      return;

    }


    /* ========================================
       FORMAT NOMOR WA
       ======================================== */

    function formatCustomer(
      customer
    ) {

      if (!customer) {

        return `
          <span class="available">
            AVAILABLE
          </span>
        `;

      }


      const whatsapp =
        (
          customer.whatsapp || ""
        )
          .replace(
            /\D/g,
            ""
          );


      const lastFour =
        whatsapp.slice(-4);


      return `

        <span class="customer-name">

          ${customer.name}

          ${
            lastFour
              ? `<small>(••••${lastFour})</small>`
              : ""
          }

        </span>

      `;

    }

/* ============================================
   TABEL REKAP PEMBELIAN
   ============================================ */

container.innerHTML = `

  <div class="product-table-wrapper">

    <table class="product-table">

      <thead>

        <tr>

          <th>Batch</th>

          <th>Nama Barang</th>

          <th>Customer</th>

          <th>Versi</th>

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

        ${data.map(function(item) {

          const harga =
            Number(
              item.item_price || 0
            ).toLocaleString("id-ID");


          const dp =
            Number(
              item.dp_amount || 0
            ).toLocaleString("id-ID");


          const pelunasan =
            Number(
              item.remaining_amount || 0
            ).toLocaleString("id-ID");


          /* ================================
             STATUS DP
             ================================ */

          const statusDP =
            item.dp_status === "paid"
              ? "✓ Sudah Bayar"
              : "Belum Bayar";


          /* ================================
             STATUS PELUNASAN
             ================================ */

          const statusPelunasan =
            item.payment_status === "paid"
              ? "✓ Lunas"
              : "Belum Lunas";


          /* ================================
             CUSTOMER
             ================================ */

          let customerName = "—";

          if (item.customer) {

            customerName =
              item.customer.name || "—";

            if (
              item.customer.whatsapp_last4
            ) {

              customerName +=
                ` (${item.customer.whatsapp_last4})`;

            }

          }


          /* ================================
             AVAILABLE
             ================================ */

          let versionHTML =
            item.version || "—";


          if (
            typeof item.version === "string" &&
            item.version.toLowerCase() ===
            "available"
          ) {

            versionHTML = `
              <span class="available-member">
                available
              </span>
            `;

          }


          /* ================================
             TRACKING
             ================================ */

          let trackingText =
            item.tracking_status || "—";


          return `

            <tr>

              <td>
                ${item.batch_code || "—"}
              </td>


              <td>
                ${item.item_name || "—"}
              </td>


              <td>
                ${customerName}
              </td>


              <td>
                ${versionHTML}
              </td>


              <td>
                ${item.quantity || 1}
              </td>


              <td>
                Rp${harga}
              </td>


              <td>
                Rp${dp}
              </td>


              <td>
                ${statusDP}
              </td>


              <td>
                Rp${pelunasan}
              </td>


              <td>
                ${statusPelunasan}
              </td>


              <td>
                ${trackingText}
              </td>


              <td>
                ${item.note || "—"}
              </td>


              <td>
                ${
                  item.co_deadline
                    ? new Date(
                        item.co_deadline
                      ).toLocaleDateString(
                        "id-ID"
                      )
                    : "—"
                }
              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  </div>

`;
   

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
