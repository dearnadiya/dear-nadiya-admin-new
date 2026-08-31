/* ============================================
   DEAR NADIYA ADMIN
   ADMIN.JS
   VERSI BARU
   ============================================ */


/* ============================================
   KONFIGURASI SUPABASE
   ============================================ */

const SUPABASE_URL =
  "https://cwwzsbqfznzwfclajwnw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ADa_gyMfyBZ1ZcdUO8FRfw_iELzOmbQ";


const db =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* ============================================
   KONFIGURASI LOGIN ADMIN
   ============================================ */

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "180322";


/* ============================================
   ELEMENT UTAMA
   ============================================ */

const loginPage =
  document.getElementById("loginPage");


const adminApp =
  document.getElementById("adminApp");


const loginForm =
  document.getElementById("loginForm");


const loginError =
  document.getElementById("loginError");


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
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
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


  showPage(
    "dashboard"
  );

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
   CEK SESSION
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


/* ============================================
   LOGOUT
   ============================================ */

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    function () {

      sessionStorage.removeItem(
        "dearNadiyaAdmin"
      );


      showLogin();

    }
  );


/* ============================================
   NAVIGASI SIDEBAR
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


        showPage(page);

      }
    );

  }
);


/* ============================================
   REFRESH
   ============================================ */

document
  .getElementById("refreshButton")
  .addEventListener(
    "click",
    function () {

      const active =
        document.querySelector(
          ".menu-button.active"
        );


      if (
        active &&
        active.dataset.page
      ) {

        showPage(
          active.dataset.page
        );

      }

    }
  );


/* ============================================
   FUNGSI PINDAH HALAMAN
   ============================================ */

function showPage(
  page
) {

  menuButtons.forEach(
    function (button) {

      button.classList.toggle(
        "active",
        button.dataset.page === page
      );

    }
  );


  if (
    pageTitle
  ) {

    const titles = {

      dashboard:
        "Dashboard",

      products:
        "Produk & GO",

      orders:
        "Pesanan",

      payments:
        "Pembayaran",

      recap:
        "Rekap GO"

    };


    pageTitle.textContent =
      titles[page] ||
      "Dashboard";

  }


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
   HELPER RUPIAH
   ============================================ */

function rupiah(
  value
) {

  const number =
    Number(value || 0);


  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(number);

}


/* ============================================
   HELPER HTML
   ============================================ */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* ============================================
   ERROR
   ============================================ */

function showError(
  error
) {

  console.error(
    "Dear Nadiya Admin:",
    error
  );


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Terjadi kesalahan
      </h2>

      <p>
        Data belum dapat dimuat.
      </p>

      <p>
        ${escapeHtml(
          error.message ||
          String(error)
        )}
      </p>

    </div>

  `;

}

/* ============================================
   DASHBOARD
   ============================================ */

async function loadDashboard() {

  pageContent.innerHTML = `

    <div class="dashboard-stats">

      <div class="stat-card">

        <p>
          Total Pesanan
        </p>

        <h2 id="dashboardOrders">
          ...
        </h2>

      </div>


      <div class="stat-card">

        <p>
          Total Pembayaran
        </p>

        <h2 id="dashboardPayments">
          ...
        </h2>

      </div>


      <div class="stat-card">

        <p>
          Pembayaran Menunggu
        </p>

        <h2 id="dashboardPending">
          ...
        </h2>

      </div>

    </div>


    <div class="welcome-card">

      <h2>
        Selamat datang di Dear Nadiya Admin ♥
      </h2>

      <p>
        Kelola produk, Group Order, pesanan,
        pembayaran, dan rekap dari satu dashboard.
      </p>

    </div>

  `;


  try {

    const ordersResult =
      await db
        .from("go_rekap_public")
        .select("*");


    if (
      ordersResult.error
    ) {

      throw ordersResult.error;

    }


    const paymentsResult =
      await db
        .from("dn_payment_submissions")
        .select("amount,status");


    if (
      paymentsResult.error
    ) {

      throw paymentsResult.error;

    }


    const orders =
      ordersResult.data || [];


    const payments =
      paymentsResult.data || [];


    const totalPayment =
      payments.reduce(
        function (
          total,
          payment
        ) {

          return total +
            Number(
              payment.amount || 0
            );

        },
        0
      );


    const pending =
      payments.filter(
        function (
          payment
        ) {

          return String(
            payment.status ||
            "pending"
          ).toLowerCase() ===
            "pending";

        }
      ).length;


    const orderElement =
      document.getElementById(
        "dashboardOrders"
      );


    const paymentElement =
      document.getElementById(
        "dashboardPayments"
      );


    const pendingElement =
      document.getElementById(
        "dashboardPending"
      );


    if (orderElement) {

      orderElement.textContent =
        orders.length;

    }


    if (paymentElement) {

      paymentElement.textContent =
        rupiah(
          totalPayment
        );

    }


    if (pendingElement) {

      pendingElement.textContent =
        pending;

    }


  } catch (
    error
  ) {

    showError(
      error
    );

  }

}


/* ============================================
   PRODUK & GROUP ORDER
   ============================================ */

async function loadProducts() {

  pageContent.innerHTML = `

    <div class="toolbar">

      <div>

        <h2>
          Produk & GO
        </h2>

        <p>
          Kelola produk dan Group Order
          Dear Nadiya.
        </p>

      </div>


      <button
        type="button"
        class="btn"
        id="addProductButton"
      >
        ➕ Tambah Produk
      </button>

    </div>


    <div
      id="productFormArea"
    ></div>


    <div
      id="productList"
      class="product-list"
    >

      <div class="loading-state">
        Memuat produk...
      </div>

    </div>

  `;


  document
    .getElementById(
      "addProductButton"
    )
    .addEventListener(
      "click",
      function () {

        showProductForm();

      }
    );


  /*
    Untuk tahap fondasi,
    data produk sementara disimpan
    di browser.

    Setelah semua halaman stabil,
    kita hubungkan produk langsung
    ke Supabase.
  */


  renderProducts();

}


/* ============================================
   DATA PRODUK SEMENTARA
   ============================================ */

function getProducts() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "dearNadiyaProducts"
      ) || "[]"
    );

  } catch (
    error
  ) {

    console.error(
      error
    );

    return [];

  }

}


function saveProducts(
  products
) {

  localStorage.setItem(
    "dearNadiyaProducts",
    JSON.stringify(
      products
    )
  );

}

/* ============================================
   FORM TAMBAH PRODUK
   ============================================ */

function showProductForm() {

  const area =
    document.getElementById(
      "productFormArea"
    );


  if (!area) {
    return;
  }


  area.innerHTML = `

    <div
      class="panel"
      style="margin-bottom:20px"
    >

      <h2>
        Tambah Produk / GO
      </h2>


      <form
        id="productForm"
      >

        <div class="form-grid">


          <div class="form-group">

            <label>
              Kode Produk
            </label>

            <input
              id="productCode"
              type="text"
              placeholder="Contoh: TRS-001"
              required
            >

          </div>


          <div class="form-group">

            <label>
              Nama Produk / GO
            </label>

            <input
              id="productName"
              type="text"
              placeholder="Contoh: TREASURE Album Baru"
              required
            >

          </div>


          <div class="form-group">

            <label>
              Jenis
            </label>

            <select
              id="productType"
            >

              <option value="Group Order">
                Group Order
              </option>

              <option value="Pre Order">
                Pre Order
              </option>

              <option value="Ready Stock">
                Ready Stock
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Harga
            </label>

            <input
              id="productPrice"
              type="number"
              min="0"
              placeholder="Contoh: 350000"
              required
            >

          </div>


          <div class="form-group">

            <label>
              DP
            </label>

            <input
              id="productDp"
              type="number"
              min="0"
              placeholder="Contoh: 100000"
              value="0"
            >

          </div>


          <div class="form-group">

            <label>
              Status GO
            </label>

            <select
              id="productStatus"
            >

              <option value="Open">
                Open
              </option>

              <option value="Closed">
                Closed
              </option>

              <option value="Selesai">
                Selesai
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Deadline List
            </label>

            <input
              id="productDeadlineList"
              type="date"
            >

          </div>


          <div class="form-group">

            <label>
              Deadline Pembayaran
            </label>

            <input
              id="productDeadlinePayment"
              type="date"
            >

          </div>


        </div>


        <label
          class="website-check"
        >

          <input
            id="productShowWebsite"
            type="checkbox"
            checked
          >

          Tampilkan produk di Website Customer

        </label>


        <div
          class="form-actions"
        >

          <button
            type="submit"
            class="btn"
          >
            💾 Simpan Produk
          </button>


          <button
            type="button"
            class="btn-secondary"
            id="cancelProductButton"
          >
            Batal
          </button>

        </div>


      </form>

    </div>

  `;


  /* ==========================================
     TOMBOL BATAL
     ========================================== */

  const cancelButton =
    document.getElementById(
      "cancelProductButton"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        area.innerHTML = "";

      }
    );

  }


  /* ==========================================
     SUBMIT FORM
     ========================================== */

  const form =
    document.getElementById(
      "productForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        addProduct();

      }
    );

  }

}


/* ============================================
   TAMBAH PRODUK
   ============================================ */

function addProduct() {

  const code =
    document
      .getElementById(
        "productCode"
      )
      .value
      .trim();


  const name =
    document
      .getElementById(
        "productName"
      )
      .value
      .trim();


  const type =
    document
      .getElementById(
        "productType"
      )
      .value;


  const price =
    Number(
      document
        .getElementById(
          "productPrice"
        )
        .value
    );


  const dp =
    Number(
      document
        .getElementById(
          "productDp"
        )
        .value ||
        0
    );


  const status =
    document
      .getElementById(
        "productStatus"
      )
      .value;


  const deadlineList =
    document
      .getElementById(
        "productDeadlineList"
      )
      .value;


  const deadlinePayment =
    document
      .getElementById(
        "productDeadlinePayment"
      )
      .value;


  const showWebsite =
    document
      .getElementById(
        "productShowWebsite"
      )
      .checked;


  /* ==========================================
     VALIDASI
     ========================================== */

  if (
    !code ||
    !name ||
    !price
  ) {

    alert(
      "Kode produk, nama produk, dan harga wajib diisi."
    );

    return;

  }


  /* ==========================================
     AMBIL DATA
     ========================================== */

  const products =
    getProducts();


  /* ==========================================
     CEK KODE PRODUK
     ========================================== */

  const duplicate =
    products.some(
      function (product) {

        return String(
          product.code || ""
        ).toLowerCase() ===
          code.toLowerCase();

      }
    );


  if (duplicate) {

    alert(
      "Kode produk tersebut sudah digunakan."
    );

    return;

  }


  /* ==========================================
     DATA PRODUK BARU
     ========================================== */

  const newProduct = {

    id:
      Date.now(),

    code:
      code,

    name:
      name,

    type:
      type,

    price:
      price,

    dp:
      dp,

    status:
      status,

    deadlineList:
      deadlineList,

    deadlinePayment:
      deadlinePayment,

    showWebsite:
      showWebsite

  };


  /* ==========================================
     SIMPAN
     ========================================== */

  products.push(
    newProduct
  );


  saveProducts(
    products
  );


  /* ==========================================
     REFRESH TAMPILAN
     ========================================== */

  renderProducts();


  const area =
    document.getElementById(
      "productFormArea"
    );


  if (area) {

    area.innerHTML = "";

  }


  alert(
    "Produk berhasil ditambahkan."
  );

}


/* ============================================
   TAMPILKAN DAFTAR PRODUK
   ============================================ */

function renderProducts() {

  const list =
    document.getElementById(
      "productList"
    );


  if (!list) {
    return;
  }


  const products =
    getProducts();


  /* ==========================================
     BELUM ADA PRODUK
     ========================================== */

  if (
    products.length === 0
  ) {

    list.innerHTML = `

      <div
        class="panel empty-state"
      >

        <h3>
          Belum ada produk
        </h3>

        <p>
          Klik
          <b>Tambah Produk</b>
          untuk membuat Group Order baru.
        </p>

      </div>

    `;

    return;

  }

/* ============================================
   RENDER PRODUK
   ============================================ */

function renderProducts() {

  const list =
    document.getElementById("productList");

  if (!list) {
    return;
  }


  const products =
    getProducts();


  /* ==========================================
     BELUM ADA PRODUK
     ========================================== */

  if (products.length === 0) {

    list.innerHTML = `

      <div class="panel empty-state">

        <h3>
          Belum ada produk
        </h3>

        <p>
          Klik
          <b>Tambah Produk</b>
          untuk membuat Group Order baru.
        </p>

      </div>

    `;

    return;
  }


  /* ==========================================
     TAMPILKAN PRODUK
     ========================================== */

  list.innerHTML =
    products
      .map(function (product) {

        return `

          <div class="product-card">

            <div>

              <h3>
                ${escapeHtml(
                  product.name || "-"
                )}
              </h3>


              <p>
                📌 Kode Produk:
                <b>
                  ${escapeHtml(
                    product.code || "-"
                  )}
                </b>
              </p>


              <p>
                📦 Jenis:
                <b>
                  ${escapeHtml(
                    product.type || "-"
                  )}
                </b>
              </p>


              <p>
                💰 Harga:
                <b>
                  ${rupiah(
                    product.price
                  )}
                </b>
              </p>


              <p>
                💵 DP:
                <b>
                  ${rupiah(
                    product.dp
                  )}
                </b>
              </p>


              <p>
                📊 Status GO:
                <b>
                  ${escapeHtml(
                    product.status || "-"
                  )}
                </b>
              </p>


              <p>
                📅 Deadline List:
                <b>
                  ${escapeHtml(
                    product.deadlineList || "-"
                  )}
                </b>
              </p>


              <p>
                💳 Deadline Pembayaran:
                <b>
                  ${escapeHtml(
                    product.deadlinePayment || "-"
                  )}
                </b>
              </p>


              <p>
                🌐 Website Customer:
                <b>
                  ${
                    product.showWebsite
                      ? "Tampil"
                      : "Tidak tampil"
                  }
                </b>
              </p>

            </div>


            <div class="product-actions">

              <button
                type="button"
                class="btn-edit-product"
                data-id="${product.id}"
              >
                ✏️ Edit
              </button>


              <button
                type="button"
                class="btn-delete-product"
                data-id="${product.id}"
              >
                🗑️ Hapus
              </button>

            </div>

          </div>

        `;

      })
      .join("");


  /* ==========================================
     TOMBOL EDIT
     ========================================== */

  document
    .querySelectorAll(
      ".btn-edit-product"
    )
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const id =
            Number(
              button.dataset.id
            );

          editProduct(id);

        }
      );

    });


  /* ==========================================
     TOMBOL HAPUS
     ========================================== */

  document
    .querySelectorAll(
      ".btn-delete-product"
    )
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const id =
            Number(
              button.dataset.id
            );

          deleteProduct(id);

        }
      );

    });

}


/* ============================================
   EDIT PRODUK
   ============================================ */

function editProduct(id) {

  const products =
    getProducts();


  const product =
    products.find(function (item) {

      return item.id === id;

    });


  if (!product) {

    alert(
      "Produk tidak ditemukan."
    );

    return;

  }


  const area =
    document.getElementById(
      "productFormArea"
    );


  if (!area) {
    return;
  }


  area.innerHTML = `

    <div
      class="panel"
      style="margin-bottom:20px"
    >

      <h2>
        Edit Produk / GO
      </h2>


      <form
        id="editProductForm"
      >


        <div class="form-grid">


          <div class="form-group">

            <label>
              Kode Produk
            </label>

            <input
              id="editProductCode"
              type="text"
              value="${escapeHtml(
                product.code || ""
              )}"
              required
            >

          </div>


          <div class="form-group">

            <label>
              Nama Produk / GO
            </label>

            <input
              id="editProductName"
              type="text"
              value="${escapeHtml(
                product.name || ""
              )}"
              required
            >

          </div>


          <div class="form-group">

            <label>
              Jenis
            </label>

            <select
              id="editProductType"
            >

              <option value="Group Order">
                Group Order
              </option>

              <option value="Pre Order">
                Pre Order
              </option>

              <option value="Ready Stock">
                Ready Stock
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Harga
            </label>

            <input
              id="editProductPrice"
              type="number"
              min="0"
              value="${Number(
                product.price || 0
              )}"
              required
            >

          </div>


          <div class="form-group">

            <label>
              DP
            </label>

            <input
              id="editProductDp"
              type="number"
              min="0"
              value="${Number(
                product.dp || 0
              )}"
            >

          </div>


          <div class="form-group">

            <label>
              Status GO
            </label>

            <select
              id="editProductStatus"
            >

              <option value="Open">
                Open
              </option>

              <option value="Closed">
                Closed
              </option>

              <option value="Selesai">
                Selesai
              </option>

            </select>

          </div>


          <div class="form-group">

            <label>
              Deadline List
            </label>

            <input
              id="editProductDeadlineList"
              type="date"
              value="${escapeHtml(
                product.deadlineList || ""
              )}"
            >

          </div>


          <div class="form-group">

            <label>
              Deadline Pembayaran
            </label>

            <input
              id="editProductDeadlinePayment"
              type="date"
              value="${escapeHtml(
                product.deadlinePayment || ""
              )}"
            >

          </div>


        </div>


        <label class="website-check">

          <input
            id="editProductShowWebsite"
            type="checkbox"
            ${
              product.showWebsite
                ? "checked"
                : ""
            }
          >

          Tampilkan produk di Website Customer

        </label>


        <div class="form-actions">

          <button
            type="submit"
            class="btn"
          >
            💾 Simpan Perubahan
          </button>


          <button
            type="button"
            class="btn-secondary"
            id="cancelEditProduct"
          >
            Batal
          </button>

        </div>


      </form>

    </div>

  `;


  /* ==========================================
     SET VALUE SELECT
     ========================================== */

  const typeSelect =
    document.getElementById(
      "editProductType"
    );


  const statusSelect =
    document.getElementById(
      "editProductStatus"
    );


  if (typeSelect) {

    typeSelect.value =
      product.type ||
      "Group Order";

  }


  if (statusSelect) {

    statusSelect.value =
      product.status ||
      "Open";

  }


  /* ==========================================
     BATAL EDIT
     ========================================== */

  document
    .getElementById(
      "cancelEditProduct"
    )
    .addEventListener(
      "click",
      function () {

        area.innerHTML = "";

      }
    );


  /* ==========================================
     SIMPAN EDIT
     ========================================== */

  document
    .getElementById(
      "editProductForm"
    )
    .addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        saveEditedProduct(
          id
        );

      }
    );

}


/* ============================================
   SIMPAN EDIT PRODUK
   ============================================ */

function saveEditedProduct(id) {

  const products =
    getProducts();


  const product =
    products.find(function (item) {

      return item.id === id;

    });


  if (!product) {

    alert(
      "Produk tidak ditemukan."
    );

    return;

  }


  const code =
    document
      .getElementById(
        "editProductCode"
      )
      .value
      .trim();


  const name =
    document
      .getElementById(
        "editProductName"
      )
      .value
      .trim();


  const type =
    document
      .getElementById(
        "editProductType"
      )
      .value;


  const price =
    Number(
      document
        .getElementById(
          "editProductPrice"
        )
        .value
    );


  const dp =
    Number(
      document
        .getElementById(
          "editProductDp"
        )
        .value ||
        0
    );


  const status =
    document
      .getElementById(
        "editProductStatus"
      )
      .value;


  const deadlineList =
    document
      .getElementById(
        "editProductDeadlineList"
      )
      .value;


  const deadlinePayment =
    document
      .getElementById(
        "editProductDeadlinePayment"
      )
      .value;


  const showWebsite =
    document
      .getElementById(
        "editProductShowWebsite"
      )
      .checked;


  if (
    !code ||
    !name ||
    !price
  ) {

    alert(
      "Kode produk, nama produk, dan harga wajib diisi."
    );

    return;

  }


  /* ==========================================
     CEK KODE DUPLIKAT
     ========================================== */

  const duplicate =
    products.some(
      function (item) {

        return (
          item.id !== id &&
          String(
            item.code || ""
          ).toLowerCase() ===
          code.toLowerCase()
        );

      }
    );


  if (duplicate) {

    alert(
      "Kode produk tersebut sudah digunakan."
    );

    return;

  }


  /* ==========================================
     UPDATE DATA
     ========================================== */

  product.code =
    code;

  product.name =
    name;

  product.type =
    type;

  product.price =
    price;

  product.dp =
    dp;

  product.status =
    status;

  product.deadlineList =
    deadlineList;

  product.deadlinePayment =
    deadlinePayment;

  product.showWebsite =
    showWebsite;


  saveProducts(
    products
  );


  const area =
    document.getElementById(
      "productFormArea"
    );


  if (area) {

    area.innerHTML = "";

  }


  renderProducts();


  alert(
    "Produk berhasil diperbarui."
  );

}


/* ============================================
   HAPUS PRODUK
   ============================================ */

function deleteProduct(id) {

  const products =
    getProducts();


  const product =
    products.find(function (item) {

      return item.id === id;

    });


  if (!product) {

    alert(
      "Produk tidak ditemukan."
    );

    return;

  }


  const confirmed =
    confirm(
      `Hapus produk "${product.name}"?`
    );


  if (!confirmed) {
    return;
  }


  const updatedProducts =
    products.filter(
      function (item) {

        return item.id !== id;

      }
    );


  saveProducts(
    updatedProducts
  );


  renderProducts();

}


/* ============================================
   PESANAN
   ============================================ */

async function loadOrders() {

  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Pesanan
      </h2>

      <p>
        Data pesanan Group Order
        Dear Nadiya.
      </p>


      <div
        id="ordersArea"
        class="loading-state"
      >
        Memuat data pesanan...
      </div>

    </div>

  `;


  try {

    const result =
      await db
        .from(
          "go_rekap_public"
        )
        .select("*");


    if (result.error) {

      throw result.error;

    }


    const rows =
      result.data || [];


    const area =
      document.getElementById(
        "ordersArea"
      );


    if (!rows.length) {

      area.innerHTML = `

        <div class="empty-state">

          Belum ada pesanan.

        </div>

      `;

      return;

    }


    area.innerHTML = `

      <div class="table-wrapper">

        <table class="data-table">

          <thead>

            <tr>

              <th>
                Kode Produk
              </th>

              <th>
                Nama Produk
              </th>

              <th>
                Customer
              </th>

              <th>
                Versi
              </th>

              <th>
                Harga
              </th>

              <th>
                DP
              </th>

              <th>
                Pelunasan
              </th>

              <th>
                Status Barang
              </th>

            </tr>

          </thead>


          <tbody>

            ${rows.map(
              function (row) {

                return `

                  <tr>

                    <td>
                      ${escapeHtml(
                        row.product_code ||
                        "-"
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        row.product_name ||
                        "-"
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        row.customer_name ||
                        "-"
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        row.product_version ||
                        "-"
                      )}
                    </td>

                    <td>
                      ${rupiah(
                        row.price
                      )}
                    </td>

                    <td>
                      ${rupiah(
                        row.dp
                      )}
                    </td>

                    <td>
                      ${rupiah(
                        row.pelunasan
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        row.item_status ||
                        "-"
                      )}
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

    showError(
      error
    );

  }

}

/* ============================================
   PEMBAYARAN
   ============================================ */

async function loadPayments() {

  pageContent.innerHTML = `

    <div class="toolbar">

      <div>

        <h2>
          Pembayaran
        </h2>

        <p>
          Bukti pembayaran dari Customer Portal.
        </p>

      </div>

    </div>


    <div id="paymentsArea">

      <div class="panel loading-state">
        Memuat pembayaran...
      </div>

    </div>

  `;


  try {

    const result =
      await db
        .from("dn_payment_submissions")
        .select("*")
        .order("id", {
          ascending: false
        });


    if (result.error) {
      throw result.error;
    }


    const rows =
      result.data || [];


    const area =
      document.getElementById("paymentsArea");


    /* ========================================
       BELUM ADA PEMBAYARAN
       ======================================== */

    if (rows.length === 0) {

      area.innerHTML = `

        <div class="panel empty-state">

          <h3>
            Belum ada pembayaran
          </h3>

          <p>
            Bukti pembayaran dari Customer
            akan muncul di sini.
          </p>

        </div>

      `;

      return;
    }


    /* ========================================
       TABEL PEMBAYARAN
       ======================================== */

    area.innerHTML = `

      <div class="table-wrapper">

        <table class="data-table">

          <thead>

            <tr>

              <th>
                Customer
              </th>

              <th>
                4 Digit WhatsApp
              </th>

              <th>
                Kode Produk
              </th>

              <th>
                Versi Produk
              </th>

              <th>
                Nominal
              </th>

              <th>
                Tanggal Transfer
              </th>

              <th>
                Status
              </th>

              <th>
                Bukti Pembayaran
              </th>

              <th>
                Aksi
              </th>

            </tr>

          </thead>


          <tbody>

            ${rows.map(function (row) {

              const status =
                String(
                  row.status || "pending"
                ).toLowerCase();


              let statusClass =
                "status-pending";


              let statusText =
                "Menunggu";


              if (
                status === "verified" ||
                status === "approved"
              ) {

                statusClass =
                  "status-approved";

                statusText =
                  "Disetujui";

              }


              if (
                status === "rejected"
              ) {

                statusClass =
                  "status-rejected";

                statusText =
                  "Ditolak";

              }


              return `

                <tr>

                  <td>
                    ${escapeHtml(
                      row.customer_name || "-"
                    )}
                  </td>


                  <td>
                    ${escapeHtml(
                      row.whatsapp_last4 || "-"
                    )}
                  </td>


                  <td>
                    ${escapeHtml(
                      row.product_code || "-"
                    )}
                  </td>


                  <td>
                    ${escapeHtml(
                      row.product_version || "-"
                    )}
                  </td>


                  <td>
                    ${rupiah(
                      row.amount
                    )}
                  </td>


                  <td>
                    ${escapeHtml(
                      row.payment_date || "-"
                    )}
                  </td>


                  <td>

                    <span
                      class="status ${statusClass}"
                    >
                      ${statusText}
                    </span>

                  </td>


                  <td>

                    <button
                      type="button"
                      class="btn-secondary"
                      data-proof-path="${escapeHtml(
                        row.proof_path || ""
                      )}"
                    >
                      👁 Lihat Bukti
                    </button>

                  </td>


                  <td>

                    ${
                      status === "pending"
                        ? `

                          <div
                            class="product-actions"
                          >

                            <button
                              type="button"
                              class="btn-edit-product"
                              data-verify-id="${row.id}"
                            >
                              ✅ Setujui
                            </button>


                            <button
                              type="button"
                              class="btn-delete-product"
                              data-reject-id="${row.id}"
                            >
                              ❌ Tolak
                            </button>

                          </div>

                        `
                        : `

                          <span>
                            -
                          </span>

                        `
                    }

                  </td>

                </tr>

              `;

            }).join("")}

          </tbody>

        </table>

      </div>

    `;


    /* ========================================
       TOMBOL LIHAT BUKTI
       ======================================== */

    document
      .querySelectorAll(
        "[data-proof-path]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            openPaymentProof(
              button.dataset.proofPath
            );

          }
        );

      });


    /* ========================================
       TOMBOL SETUJUI
       ======================================== */

    document
      .querySelectorAll(
        "[data-verify-id]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(
                button.dataset.verifyId
              );


            updatePaymentStatus(
              id,
              "verified"
            );

          }
        );

      });


    /* ========================================
       TOMBOL TOLAK
       ======================================== */

    document
      .querySelectorAll(
        "[data-reject-id]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(
                button.dataset.rejectId
              );


            updatePaymentStatus(
              id,
              "rejected"
            );

          }
        );

      });


  } catch (error) {

    console.error(
      "Gagal memuat pembayaran:",
      error
    );


    pageContent.innerHTML = `

      <div class="panel">

        <h2>
          Gagal Memuat Pembayaran
        </h2>

        <p>
          ${escapeHtml(
            error.message ||
            String(error)
          )}
        </p>

      </div>

    `;

  }

}


/* ============================================
   BUKA BUKTI PEMBAYARAN
   ============================================ */

async function openPaymentProof(
  path
) {

  if (!path) {

    alert(
      "Bukti pembayaran tidak tersedia."
    );

    return;

  }


  try {

    const result =
      await db.storage
        .from("payment-proofs")
        .createSignedUrl(
          path,
          600
        );


    if (result.error) {
      throw result.error;
    }


    const signedUrl =
      result.data?.signedUrl;


    if (!signedUrl) {

      throw new Error(
        "URL bukti pembayaran tidak tersedia."
      );

    }


    window.open(
      signedUrl,
      "_blank"
    );


  } catch (error) {

    console.error(
      "Gagal membuka bukti:",
      error
    );


    alert(
      "Gagal membuka bukti pembayaran:\n\n" +
      error.message
    );

  }

}


/* ============================================
   UPDATE STATUS PEMBAYARAN
   ============================================ */

async function updatePaymentStatus(
  id,
  newStatus
) {

  const isVerified =
    newStatus === "verified";


  const question =
    isVerified
      ? "Apakah pembayaran ini sudah benar dan ingin disetujui?"
      : "Apakah kamu yakin ingin menolak pembayaran ini?";


  if (
    !confirm(question)
  ) {

    return;

  }


  try {

    const result =
      await db
        .from("dn_payment_submissions")
        .update({

          status:
            newStatus

        })
        .eq(
          "id",
          id
        );


    if (result.error) {
      throw result.error;
    }


    alert(
      isVerified
        ? "✅ Pembayaran berhasil disetujui."
        : "❌ Pembayaran berhasil ditolak."
    );


    await loadPayments();


  } catch (error) {

    console.error(
      "Gagal mengubah status pembayaran:",
      error
    );


    alert(
      "Gagal mengubah status pembayaran:\n\n" +
      error.message
    );

  }

}


/* ============================================
   REKAP GO
   ============================================ */

async function loadRecap() {

  pageContent.innerHTML = `

    <div class="toolbar">

      <div>

        <h2>
          Rekap GO
        </h2>

        <p>
          Rekap keseluruhan pesanan
          Group Order Dear Nadiya.
        </p>

      </div>

    </div>


    <div id="recapArea">

      <div class="panel loading-state">
        Memuat rekap...
      </div>

    </div>

  `;


  try {

    const result =
      await db
        .from("go_rekap_public")
        .select("*");


    if (result.error) {
      throw result.error;
    }


    const rows =
      result.data || [];


    const area =
      document.getElementById(
        "recapArea"
      );


    /* ========================================
       KOSONG
       ======================================== */

    if (rows.length === 0) {

      area.innerHTML = `

        <div class="panel empty-state">

          <h3>
            Belum ada data rekap
          </h3>

          <p>
            Data pesanan akan muncul
            di sini setelah tersedia.
          </p>

        </div>

      `;

      return;

    }

  /* ========================================
   TABEL REKAP
   ======================================== */

area.innerHTML = `

  <div class="table-wrapper">

    <table class="data-table">

      <thead>

        <tr>

          <th>
            Kode Produk
          </th>

          <th>
            Nama Produk
          </th>

          <th>
            Customer
          </th>

          <th>
            Versi
          </th>

          <th>
            Harga
          </th>

          <th>
            DP
          </th>

          <th>
            Pelunasan
          </th>

          <th>
            Status Barang
          </th>

        </tr>

      </thead>


      <tbody>

        ${rows.map(function (row) {

          return `

            <tr>

              <td>
                ${escapeHtml(
                  row.product_code || "-"
                )}
              </td>


              <td>
                ${escapeHtml(
                  row.product_name || "-"
                )}
              </td>


              <td>
                ${escapeHtml(
                  row.customer_name || "-"
                )}
              </td>


              <td>
                ${escapeHtml(
                  row.product_version || "-"
                )}
              </td>


              <td>
                ${rupiah(
                  row.price
                )}
              </td>


              <td>
                ${rupiah(
                  row.dp
                )}
              </td>


              <td>
                ${rupiah(
                  row.pelunasan
                )}
              </td>


              <td>
                ${escapeHtml(
                  row.item_status || "-"
                )}
              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  </div>

`;


/* ============================================
   SELESAI
   ============================================ */
