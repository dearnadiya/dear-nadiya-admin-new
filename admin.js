/* ============================================
   DEAR NADIYA ADMIN
   LOGIN + NAVIGASI + REKAP PEMBELIAN
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
  document.getElementById(
    "googleLoginButton"
  );


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
          "Login Google gagal:",
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
   ADMIN EMAIL
   ============================================ */

const ADMIN_EMAILS = [

  "dearnadiya6@gmail.com"

];


/* ============================================
   CEK SESSION + AKSES ADMIN
   ============================================ */

async function checkGoogleSession() {

  try {

    const {
      data: {
        session
      }
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
        .map(
          email =>
            email
              .toLowerCase()
              .trim()
        )
        .includes(userEmail);


    if (isAdmin) {

      showAdmin();

    } else {

      await supabaseClient.auth.signOut();


      if (loginError) {

        loginError.textContent =
          "Akun Google ini tidak memiliki akses Admin.";

      }


      showLogin();

    }

  } catch (error) {

    console.error(
      "Session check error:",
      error
    );

    showLogin();

  }

}


/* ============================================
   LOGOUT GOOGLE
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
        .map(
          email =>
            email
              .toLowerCase()
              .trim()
        )
        .includes(userEmail);


    if (isAdmin) {

      showAdmin();

    } else {

      await supabaseClient.auth.signOut();


      if (loginError) {

        loginError.textContent =
          "Akun Google ini tidak memiliki akses Admin.";

      }


      showLogin();

    }

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

async function loadDashboard() {

  pageTitle.textContent =
    "Dashboard";


  pageContent.innerHTML = `

    <div class="dashboard-stats">

      <div class="stat-card">

        <p>
          Total Pesanan
        </p>

        <h2 id="dashboardOrderCount">
          ...
        </h2>

      </div>


      <div class="stat-card">

        <p>
          Total Pembayaran
        </p>

        <h2 id="dashboardPaymentTotal">
          ...
        </h2>

      </div>


      <div class="stat-card">

        <p>
          GO Aktif
        </p>

        <h2 id="dashboardActiveCount">
          ...
        </h2>

      </div>

    </div>


    <div class="welcome-card">

      <h2>
        Selamat datang di Dear Nadiya Admin ♥
      </h2>

      <p>
        Kelola rekapan pembelian,
        pembayaran, tracking barang,
        dan Group Order dari satu dashboard.
      </p>

    </div>


    <div class="panel">

      <h3>
        Sistem Rekap Dear Nadiya
      </h3>

      <p>
        Pemesanan barang dan war photocard
        tetap dilakukan melalui WhatsApp.
      </p>

      <p>
        Website digunakan untuk melihat
        rekapan pembelian, pembayaran,
        tracking barang, dan hasil war
        photocard.
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
        .select(
          "id, payment_status, remaining_amount, tracking_status"
        );


    if (error) {

      console.error(
        "Dashboard error:",
        error
      );

      return;

    }


    const totalOrders =
      data?.length || 0;


    const totalRemaining =
      (data || []).reduce(
        function (
          total,
          item
        ) {

          return (
            total +
            Number(
              item.remaining_amount || 0
            )
          );

        },
        0
      );


    const activeStatuses = [

      "CO Web / Seller",
      "CO Seller",
      "Arrived WH KR",
      "Arrived WH JP",
      "Arrived WH CH",
      "Arrived WH Thai",
      "Shipping to INA",
      "Arrived WH INA",
      "Arrived Admin"

    ];


    const activeCount =
      (data || []).filter(
        item =>
          activeStatuses.includes(
            item.tracking_status
          )
      ).length;


    const orderCountElement =
      document.getElementById(
        "dashboardOrderCount"
      );


    const paymentTotalElement =
      document.getElementById(
        "dashboardPaymentTotal"
      );


    const activeCountElement =
      document.getElementById(
        "dashboardActiveCount"
      );


    if (orderCountElement) {

      orderCountElement.textContent =
        totalOrders;

    }


    if (paymentTotalElement) {

      paymentTotalElement.textContent =
        "Rp" +
        totalRemaining.toLocaleString(
          "id-ID"
        );

    }


    if (activeCountElement) {

      activeCountElement.textContent =
        activeCount;

    }

  } catch (error) {

    console.error(
      "Dashboard exception:",
      error
    );

  }

}


/* ============================================
   PRODUK & GO
   ============================================ */

/*
   SISTEM FINAL:
   Admin tidak perlu membuat master produk
   satu per satu.

   Rekap pembelian diinput manual melalui
   menu Rekap GO berdasarkan kategori.

   Halaman Produk & GO tetap dipertahankan
   agar navigasi lama tidak rusak.
*/

function loadProducts() {

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
            Rekap pembelian dikelola secara
            manual berdasarkan kategori.
          </p>

        </div>

      </div>


      <div class="dashboard-stats">

        <div class="stat-card">

          <p>
            Truz
          </p>

          <h2>
            1
          </h2>

          <small>
            Kategori Doll / Character
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure KR
          </p>

          <h2>
            2
          </h2>

          <small>
            Pembelian Korea
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure JP
          </p>

          <h2>
            3
          </h2>

          <small>
            Pembelian Jepang
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure CH
          </p>

          <h2>
            4
          </h2>

          <small>
            Pembelian China
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure Thai
          </p>

          <h2>
            5
          </h2>

          <small>
            Pembelian Thailand
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure Album
          </p>

          <h2>
            6
          </h2>

          <small>
            Album Treasure
          </small>

        </div>


        <div class="stat-card">

          <p>
            Treasure INA
          </p>

          <h2>
            7
          </h2>

          <small>
            Pembelian Indonesia
          </small>

        </div>

      </div>


      <div class="panel">

        <h3>
          Cara Penggunaan
        </h3>

        <p>
          Gunakan menu
          <strong>Rekap GO</strong>
          untuk memasukkan setiap pembelian.
        </p>

        <p>
          Pemesanan barang tetap dilakukan
          melalui WhatsApp.
        </p>

        <p>
          War photocard juga tetap dilakukan
          melalui WhatsApp. Hasil war kemudian
          dimasukkan ke dalam rekapan pembelian.
        </p>

        <button
          type="button"
          class="primary-button"
          id="openRecapFromProducts"
        >
          Buka Rekap GO
        </button>

      </div>

    </div>

  `;


  const openButton =
    document.getElementById(
      "openRecapFromProducts"
    );


  if (openButton) {

    openButton.addEventListener(
      "click",
      function () {

        loadRecap();

      }
    );

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
        Pemesanan barang tetap dilakukan
        melalui WhatsApp.
      </p>

      <p>
        Data pembelian yang sedang berjalan
        dikelola melalui menu
        <strong>Rekap GO</strong>.
      </p>

      <button
        type="button"
        class="primary-button"
        id="openRecapOrders"
      >
        Buka Rekap GO
      </button>

    </div>

  `;


  const button =
    document.getElementById(
      "openRecapOrders"
    );


  if (button) {

    button.addEventListener(
      "click",
      loadRecap
    );

  }

}


/* ============================================
   PEMBAYARAN
   ============================================ */

async function loadPayments() {

  pageTitle.textContent =
    "Pembayaran";


  pageContent.innerHTML = `

    <div class="panel">

      <h2>
        Pembayaran
      </h2>

      <p>
        Data pembayaran berdasarkan
        rekapan pembelian.
      </p>


      <div
        id="paymentListContainer"
      >

        <p>
          Memuat data pembayaran...
        </p>

      </div>

    </div>

  `;


  const container =
    document.getElementById(
      "paymentListContainer"
    );


  try {

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
            whatsapp_last4
          )
        `)
        .order(
          "id",
          {
            ascending: false
          }
        );


    if (error) {

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
            Belum ada data pembayaran
          </h3>

        </div>

      `;

      return;

    }


    const unpaid =
      data.filter(
        item =>
          item.payment_status !== "paid"
      );


    container.innerHTML = `

      <div class="dashboard-stats">

        <div class="stat-card">

          <p>
            Belum Lunas
          </p>

          <h2>
            ${unpaid.length}
          </h2>

        </div>


        <div class="stat-card">

          <p>
            Total Sisa Pembayaran
          </p>

          <h2>

            Rp${unpaid
              .reduce(
                (total, item) =>
                  total +
                  Number(
                    item.remaining_amount || 0
                  ),
                0
              )
              .toLocaleString("id-ID")}

          </h2>

        </div>

      </div>


      <div class="product-table-wrapper">

        <table class="product-table">

          <thead>

            <tr>

              <th>Batch</th>

              <th>Customer</th>

              <th>Barang</th>

              <th>Versi</th>

              <th>DP</th>

              <th>Status DP</th>

              <th>Sisa</th>

              <th>Status</th>

              <th>Tracking</th>

            </tr>

          </thead>


          <tbody>

            ${data.map(
              function(item) {

                const customer =
                  item.customers;


                const customerName =
                  customer
                    ? customer.name
                    : "AVAILABLE";


                const last4 =
                  customer &&
                  customer.whatsapp_last4
                    ? ` (••••${customer.whatsapp_last4})`
                    : "";


                return `

                  <tr>

                    <td>
                      ${item.batch_code || "—"}
                    </td>

                    <td>
                      ${customerName}${last4}
                    </td>

                    <td>
                      ${item.item_name || "—"}
                    </td>

                    <td>
                      ${item.version || "—"}
                    </td>

                    <td>
                      Rp${Number(
                        item.dp_amount || 0
                      ).toLocaleString("id-ID")}
                    </td>

                    <td>
                      ${
                        item.dp_status === "paid"
                          ? "✓ Sudah Bayar"
                          : "Belum Bayar"
                      }
                    </td>

                    <td>
                      Rp${Number(
                        item.remaining_amount || 0
                      ).toLocaleString("id-ID")}
                    </td>

                    <td>
                      ${
                        item.payment_status === "paid"
                          ? "✓ Lunas"
                          : "Belum Lunas"
                      }
                    </td>

                    <td>
                      ${item.tracking_status || "—"}
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
      "Payment error:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Terjadi kesalahan
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

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


      <!-- ==================================
           KATEGORI REKAP
           ================================== -->

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


      <!-- ==================================
           FORM TAMBAH REKAP
           ================================== -->

      <div
        id="recapFormContainer"
      ></div>


      <!-- ==================================
           DAFTAR REKAP
           ================================== -->

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
     PILIHAN TRACKING
     ============================================ */

  function getTrackingOptions(
    category
  ) {


    /* ==================================
       TREASURE INA
       ================================== */

    if (
      category === "Treasure INA"
    ) {

      return [

        "CO Seller",

        "Arrived Admin",

        "Delivered"

      ];

    }


    /* ==================================
       TREASURE KR
       ================================== */

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


    /* ==================================
       TREASURE JP
       ================================== */

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


    /* ==================================
       TREASURE CH
       ================================== */

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


    /* ==================================
       TREASURE THAI
       ================================== */

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


    /* ==================================
       TRUZ
       ================================== */

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


    /* ==================================
       TREASURE ALBUM
       ================================== */

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
     TOMBOL TAMBAH REKAP
     ============================================ */

  addRecapButton.addEventListener(
    "click",
    function() {

      showRecapForm(
        selectedCategory
      );

    }
  );


  /* ============================================
     FORM TAMBAH REKAP
     ============================================ */

  function showRecapForm(
    category
  ) {

    const trackingOptions =
      getTrackingOptions(
        category
      );


    recapFormContainer.innerHTML = `

      <div class="panel product-form">

        <h3>
          Tambah Rekap Pembelian
        </h3>


        <form id="recapForm">


          <!-- KATEGORI -->

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


          <!-- KODE BATCH -->

          <label>
            Kode Batch
          </label>

          <input
            id="recapBatchCode"
            type="text"
            placeholder="Contoh: CH-001 / BATCH 1"
            required
          >


          <!-- NAMA BARANG -->

          <label>
            Nama Barang
          </label>

          <input
            id="recapItemName"
            type="text"
            placeholder="Contoh: FS Knpops"
            required
          >


          <!-- CUSTOMER -->

          <label>
            Customer
          </label>

          <select
            id="recapCustomer"
          >

            <option value="">
              AVAILABLE / Belum ada customer
            </option>

          </select>


          <!-- VERSI / MEMBER -->

          <label>
            Versi / Member / Character
          </label>

          <input
            id="recapVersion"
            type="text"
            placeholder="Contoh: Hyunsuk / RURU / Version A"
          >


          <!-- QTY -->

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


          <!-- HARGA -->

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


          <!-- DP -->

          <label>
            DP
          </label>

          <input
            id="recapDp"
            type="number"
            min="0"
            value="0"
          >


          <!-- STATUS DP -->

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


          <!-- PELUNASAN -->

          <label>
            Pelunasan / Sisa Pembayaran
          </label>

          <input
            id="recapRemaining"
            type="number"
            min="0"
            value="0"
          >


          <!-- STATUS PELUNASAN -->

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


          <!-- TRACKING -->

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

                  <option
                    value="${option}"
                  >
                    ${option}
                  </option>

                `;

              }
            ).join("")}

          </select>


          <!-- NOTE -->

          <label>
            Note
          </label>

          <textarea
            id="recapNote"
            rows="3"
            placeholder="Catatan..."
          ></textarea>


          <!-- BATAS CO -->

          <label>
            Batas CO / Checkout
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
      category;


    /* ==================================
       GANTI KATEGORI DI FORM
       ================================== */

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


    /* ==================================
       BATAL
       ================================== */

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


    /* ==================================
       SUBMIT
       ================================== */

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


    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from("customers")
          .select(
            "id, name, whatsapp_last4"
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


      (data || []).forEach(
        function(customer) {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            customer.id;


          const lastFour =
            customer.whatsapp_last4 || "";


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

    } catch (error) {

      console.error(
        "Customer exception:",
        error
      );

    }

  }


  /* ============================================
     SIMPAN REKAP
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


    try {

      const recap = {

        category:
          document.getElementById(
            "recapCategory"
          ).value,


        batch_code:
          document.getElementById(
            "recapBatchCode"
          ).value.trim(),


        item_name:
          document.getElementById(
            "recapItemName"
          ).value.trim(),


        customer_id:
          document.getElementById(
            "recapCustomer"
          ).value
            ? Number(
                document.getElementById(
                  "recapCustomer"
                ).value
              )
            : null,


        version:
          document.getElementById(
            "recapVersion"
          ).value.trim(),


        /*
          Setiap member photocard
          menggunakan Qty 1.
        */

        quantity:
          Number(
            document.getElementById(
              "recapQuantity"
            ).value
          ) || 1,


        item_price:
          Number(
            document.getElementById(
              "recapPrice"
            ).value
          ) || 0,


        dp_amount:
          Number(
            document.getElementById(
              "recapDp"
            ).value
          ) || 0,


        dp_status:
          document.getElementById(
            "recapDpStatus"
          ).value,


        remaining_amount:
          Number(
            document.getElementById(
              "recapRemaining"
            ).value
          ) || 0,


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
          .insert(
            recap
          );


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


    } catch (error) {

      console.error(
        "Save recap exception:",
        error
      );


      message.textContent =
        "Terjadi kesalahan: " +
        error.message;

    }

  }


  /* ============================================
     FORMAT CUSTOMER
     ============================================ */

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


    const lastFour =
      customer.whatsapp_last4 || "";


    return `

      <span class="customer-name">

        ${customer.name || "—"}

        ${
          lastFour
            ? `<small>(••••${lastFour})</small>`
            : ""
        }

      </span>

    `;

  }


  /* ============================================
     FORMAT MEMBER / VERSION
     ============================================ */

  function formatVersion(
    version
  ) {

    if (!version) {

      return "—";

    }


    if (
      typeof version === "string" &&
      version
        .toLowerCase()
        .trim() === "available"
    ) {

      return `

        <span class="available-member">
          available
        </span>

      `;

    }


    return version;

  }


  /* ============================================
     FORMAT TRACKING
     ============================================ */

  function formatTracking(
    tracking
  ) {

    if (!tracking) {

      return "—";

    }


    /*
      Tidak menggunakan "Sudah CO".

      Status terakhir:
      Delivered
      = barang sudah sampai/customer.
    */

    if (
      tracking === "Delivered"
    ) {

      return `

        <span class="status-delivered">
          Goods Arrive at Customer
        </span>

      `;

    }


    return tracking;

  }


/* ============================================
   TAMPILKAN DAFTAR REKAP
   ============================================ */

async function loadRecapList(
  category
) {

  recapListContainer.innerHTML =
    "<p>Memuat rekap...</p>";


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select(`
          *,
          customers (
            id,
            name,
            whatsapp_last4
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


    console.log(
      "DATA REKAP:",
      data
    );


    console.log(
      "ERROR REKAP:",
      error
    );


    /* ========================================
       JIKA ERROR
       ======================================== */

    if (error) {

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


    /* ========================================
       JIKA BELUM ADA DATA
       ======================================== */

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
            <strong>
              ${category}
            </strong>.
          </p>

        </div>

      `;

      return;

    }


    /* ========================================
       FORMAT CUSTOMER
       ======================================== */

    function formatCustomer(
      customer
    ) {

      /* CUSTOMER KOSONG */

      if (!customer) {

        return `

          <span class="available">
            AVAILABLE
          </span>

        `;

      }


      const name =
        customer.name || "—";


      const lastFour =
        customer.whatsapp_last4 || "";


      return `

        <span class="customer-name">

          ${name}

          ${
            lastFour
              ? `
                <small>
                  (••••${lastFour})
                </small>
              `
              : ""
          }

        </span>

      `;

    }


    /* ========================================
       FORMAT MEMBER / VERSION
       ======================================== */

    function formatVersion(
      version
    ) {

      if (!version) {

        return "—";

      }


      if (
        typeof version === "string" &&
        version
          .toLowerCase()
          .trim() === "available"
      ) {

        return `

          <span class="available-member">
            available
          </span>

        `;

      }


      return version;

    }


    /* ========================================
       FORMAT TRACKING
       ======================================== */

    function formatTracking(
      tracking
    ) {

      if (!tracking) {

        return "—";

      }


      /*
        Status terakhir tidak menggunakan
        "Sudah di CO".

        Delivered ditampilkan sebagai:
        Goods Arrive at Customer
      */

      if (
        tracking === "Delivered"
      ) {

        return `

          <span class="status-delivered">
            Goods Arrive at Customer
          </span>

        `;

      }


      return tracking;

    }


    /* ========================================
       TABEL REKAP
       ======================================== */

    recapListContainer.innerHTML = `

      <div class="product-table-wrapper">

        <table class="product-table recap-table">

          <thead>

            <tr>

              <th>
                Kode Batch
              </th>

              <th>
                Nama Barang
              </th>

              <th>
                Customer
              </th>

              <th>
                Versi / Member
              </th>

              <th>
                Qty
              </th>

              <th>
                Harga
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

            </tr>

          </thead>


          <tbody>

            ${data.map(
              function(item) {

                /* ==========================
                   HARGA
                   ========================== */

                const harga =
                  Number(
                    item.item_price || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                /* ==========================
                   DP
                   ========================== */

                const dp =
                  Number(
                    item.dp_amount || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                /* ==========================
                   PELUNASAN
                   ========================== */

                const pelunasan =
                  Number(
                    item.remaining_amount || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                /* ==========================
                   STATUS DP
                   ========================== */

                const statusDP =
                  item.dp_status === "paid"

                    ? `

                      <span class="status-paid">
                        ✓ Sudah Bayar
                      </span>

                    `

                    : `

                      <span class="status-unpaid">
                        Belum Bayar
                      </span>

                    `;


                /* ==========================
                   STATUS PELUNASAN
                   ========================== */

                const statusPelunasan =
                  item.payment_status === "paid"

                    ? `

                      <span class="status-paid">
                        ✓ Lunas
                      </span>

                    `

                    : `

                      <span class="status-unpaid">
                        Belum Lunas
                      </span>

                    `;


                /* ==========================
                   CUSTOMER
                   ========================== */

                const customerHTML =
                  formatCustomer(
                    item.customers
                  );


                /* ==========================
                   VERSION / MEMBER
                   ========================== */

                const versionHTML =
                  formatVersion(
                    item.version
                  );


                /* ==========================
                   TRACKING
                   ========================== */

                const trackingHTML =
                  formatTracking(
                    item.tracking_status
                  );


                /* ==========================
                   BATAS CO
                   ========================== */

                const coDeadline =
                  item.co_deadline

                    ? new Date(
                        item.co_deadline
                      ).toLocaleDateString(
                        "id-ID"
                      )

                    : "—";


                /* ==========================
                   BARIS DATA
                   ========================== */

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
                      ${trackingHTML}
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


  } catch (error) {

    /* ========================================
       ERROR SISTEM
       ======================================== */

    console.error(
      "Kesalahan loadRecapList:",
      error
    );


    recapListContainer.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat rekap
        </h3>

        <p>
          Terjadi kesalahan saat mengambil
          data rekap pembelian.
        </p>

        <p>
          ${error.message || ""}
        </p>

      </div>

    `;

  }

}


/* ============================================
   MUAT DATA REKAP AWAL
   ============================================ */

await loadRecapList(
  selectedCategory
);

}


/* ============================================
   RINGKASAN REKAP
   ============================================ */

async function loadRecapSummary() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select(`
          category,
          item_price,
          dp_amount,
          remaining_amount,
          payment_status,
          tracking_status
        `);


    if (error) {

      console.error(
        "Gagal memuat ringkasan:",
        error
      );

      return null;

    }


    const summary = {};


    (data || []).forEach(
      function(item) {

        const category =
          item.category || "Lainnya";


        if (
          !summary[category]
        ) {

          summary[category] = {

            quantity: 0,

            totalPrice: 0,

            totalDP: 0,

            totalRemaining: 0,

            unpaid: 0,

            delivered: 0

          };

        }


        summary[category].quantity += 1;


        summary[category].totalPrice +=
          Number(
            item.item_price || 0
          );


        summary[category].totalDP +=
          Number(
            item.dp_amount || 0
          );


        summary[category].totalRemaining +=
          Number(
            item.remaining_amount || 0
          );


        if (
          item.payment_status !== "paid"
        ) {

          summary[category].unpaid += 1;

        }


        if (
          item.tracking_status ===
          "Delivered"
        ) {

          summary[category].delivered += 1;

        }

      }
    );


    return summary;


  } catch (error) {

    console.error(
      "Summary exception:",
      error
    );


    return null;

  }

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
   SESSION CHECK
   ============================================ */

checkGoogleSession();
