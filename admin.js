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

function loadRecap() {

  pageTitle.textContent = "Rekap GO";

  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>
          <h2>Rekap Pembelian</h2>

          <p>
            Kelola seluruh rekapan pembelian Dear Nadiya.
          </p>
        </div>

      </div>


      <!-- ================================
           TOMBOL KATEGORI
           ================================ -->

      <div class="recap-category-buttons">

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


      <!-- ================================
           FORM
           ================================ -->

      <div id="recapFormContainer"></div>


      <!-- ================================
           LIST
           ================================ -->

      <div id="recapListContainer">

        <p>
          Memuat rekap...
        </p>

      </div>

    </div>

  `;


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


  let selectedCategory = "Truz";


  /* ========================================
     KONFIGURASI TRACKING
     ======================================== */

  function getTrackingOptions(
    category
  ) {

    /* ==============================
       TRUZ
       ============================== */

    if (
      category === "Truz"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH KR">
          Arrived WH KR
        </option>

        <option value="Arrived WH JP">
          Arrived WH JP
        </option>

        <option value="Arrived WH CH">
          Arrived WH CH
        </option>

        <option value="Arrived WH Thai">
          Arrived WH Thai
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE KR
       ============================== */

    if (
      category === "Treasure KR"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH KR">
          Arrived WH KR
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE JP
       ============================== */

    if (
      category === "Treasure JP"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH JP">
          Arrived WH JP
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE CH
       ============================== */

    if (
      category === "Treasure CH"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH CH">
          Arrived WH CH
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE THAI
       ============================== */

    if (
      category === "Treasure Thai"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH Thai">
          Arrived WH Thai
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE ALBUM
       ============================== */

    if (
      category === "Treasure Album"
    ) {

      return `

        <option value="Co Web / Seller">
          Co Web / Seller
        </option>

        <option value="Arrived WH KR">
          Arrived WH KR
        </option>

        <option value="Arrived WH JP">
          Arrived WH JP
        </option>

        <option value="Arrived WH CH">
          Arrived WH CH
        </option>

        <option value="Arrived WH Thai">
          Arrived WH Thai
        </option>

        <option value="Shipping INA">
          Shipping INA
        </option>

        <option value="Arrived WH INA">
          Arrived WH INA
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    /* ==============================
       TREASURE INA
       ============================== */

    if (
      category === "Treasure INA"
    ) {

      return `

        <option value="Co Seller">
          Co Seller
        </option>

        <option value="Arrived Admin">
          Arrived Admin
        </option>

        <option value="Goods Arrive at Customer">
          Goods Arrive at Customer
        </option>

      `;

    }


    return "";

  }


  /* ========================================
     TAMPILKAN FORM
     ======================================== */

  function showRecapForm(
    category
  ) {

    recapFormContainer.innerHTML = `

      <div class="panel recap-form">

        <h3>
          Tambah Rekap Pembelian
        </h3>


        <form id="recapForm">


          <!-- ==========================
               KATEGORI
               ========================== -->

          <label>
            Kategori
          </label>

          <select
            id="recapCategory"
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
               BATCH
               ========================== -->

          <label>
            Kode Batch
          </label>

          <input
            id="recapBatch"
            type="text"
            placeholder="Contoh: CH-001 / BATCH 1"
            required
          >


          <!-- ==========================
               NAMA BARANG
               ========================== -->

          <label>
            Nama Barang
          </label>

          <input
            id="recapItemName"
            type="text"
            placeholder="Contoh: FS Knppops"
            required
          >


          <!-- ==========================
               CUSTOMER
               ========================== -->

          <label>
            Customer
          </label>

          <input
            id="recapCustomer"
            type="text"
            placeholder="Nama Customer (4 nomor terakhir WA)"
          >


          <!-- ==========================
               VERSION / MEMBER
               ========================== -->

          <label>
            Versi / Member / Character
          </label>

          <input
            id="recapVersion"
            type="text"
            placeholder="Contoh: Hyunsuk / Version A / RURU"
          >


          <!-- ==========================
               QTY
               ========================== -->

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


          <!-- ==========================
               HARGA
               ========================== -->

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


          <!-- ==========================
               DP
               ========================== -->

          <label>
            DP
          </label>

          <input
            id="recapDP"
            type="number"
            min="0"
            value="0"
          >


          <!-- ==========================
               STATUS DP
               ========================== -->

          <label>
            Status DP
          </label>

          <select
            id="recapDPStatus"
          >

            <option value="unpaid">
              Belum Dibayar
            </option>

            <option value="paid">
              Sudah Dibayar
            </option>

          </select>


          <!-- ==========================
               PELUNASAN
               ========================== -->

          <label>
            Pelunasan / Sisa Pembayaran
          </label>

          <input
            id="recapRemaining"
            type="number"
            min="0"
            value="0"
          >


          <!-- ==========================
               STATUS PELUNASAN
               ========================== -->

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


          <!-- ==========================
               TRACKING
               ========================== -->

          <label>
            Tracking
          </label>

          <select
            id="recapTracking"
          >

            ${getTrackingOptions(category)}

          </select>


          <!-- ==========================
               NOTE
               ========================== -->

          <label>
            Note
          </label>

          <textarea
            id="recapNote"
            rows="4"
            placeholder="Catatan..."
          ></textarea>


          <!-- ==========================
               BATAS CO
               ========================== -->

          <label>
            Batas CO / Checkout
          </label>

          <input
            id="recapCODedline"
            type="date"
          >


          <!-- ==========================
               BUTTON
               ========================== -->

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


    /* ======================================
       GANTI KATEGORI DARI DALAM FORM
       ====================================== */

    document
      .getElementById("recapCategory")
      .addEventListener(
        "change",
        function() {

          selectedCategory =
            this.value;

          showRecapForm(
            selectedCategory
          );

        }
      );


    /* ======================================
       BATAL
       ====================================== */

    document
      .getElementById("cancelRecapButton")
      .addEventListener(
        "click",
        function() {

          recapFormContainer.innerHTML =
            "";

        }
      );


    /* ======================================
       SUBMIT
       ====================================== */

    document
      .getElementById("recapForm")
      .addEventListener(
        "submit",
        saveRecap
      );

  }


  /* ========================================
     TOMBOL KATEGORI
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


          /*
             Form selalu tersedia
             untuk SEMUA kategori.
          */

          showRecapForm(
            selectedCategory
          );


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

  const addRecapButton =
    document.createElement(
      "button"
    );


  addRecapButton.type =
    "button";


  addRecapButton.className =
    "primary-button";


  addRecapButton.textContent =
    "＋ Tambah Rekap";


  addRecapButton.style.marginBottom =
    "15px";


  addRecapButton.addEventListener(
    "click",
    function() {

      showRecapForm(
        selectedCategory
      );

    }
  );


  /*
     Masukkan tombol setelah
     panel-header.
  */

  const panelHeader =
    pageContent.querySelector(
      ".panel-header"
    );


  panelHeader.insertAdjacentElement(
    "afterend",
    addRecapButton
  );


  /* ========================================
     TAMPILKAN FORM AWAL
     ======================================== */

  showRecapForm(
    selectedCategory
  );


  /* ========================================
     LOAD DATA AWAL
     ======================================== */

  loadRecapList(
    selectedCategory
  );

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


  /* ========================================
     AMBIL DATA FORM
     ======================================== */

  const category =
    document
      .getElementById("recapCategory")
      .value;


  const batchCode =
    document
      .getElementById("recapBatch")
      .value
      .trim();


  const itemName =
    document
      .getElementById("recapItemName")
      .value
      .trim();


  const customerName =
    document
      .getElementById("recapCustomer")
      .value
      .trim();


  const version =
    document
      .getElementById("recapVersion")
      .value
      .trim();


  const quantity =
    Number(
      document
        .getElementById("recapQty")
        .value
    );


  const itemPrice =
    Number(
      document
        .getElementById("recapPrice")
        .value
    );


  const dpAmount =
    Number(
      document
        .getElementById("recapDP")
        .value
    );


  const dpStatus =
    document
      .getElementById("recapDPStatus")
      .value;


  const remainingAmount =
    Number(
      document
        .getElementById("recapRemaining")
        .value
    );


  const paymentStatus =
    document
      .getElementById("recapPaymentStatus")
      .value;


  const trackingStatus =
    document
      .getElementById("recapTracking")
      .value;


  const note =
    document
      .getElementById("recapNote")
      .value
      .trim();


  const coDeadline =
    document
      .getElementById("recapCODedline")
      .value || null;


  /* ========================================
     DATA REKAP
     ======================================== */

  const recap = {

    category:
      category,

    batch_code:
      batchCode,

    item_name:
      itemName,

    customer_name:
      customerName || "AVAILABLE",

    version:
      version || "AVAILABLE",

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


  /* ============================================
   SIMPAN KE SUPABASE
   ============================================ */

async function saveRecap(event) {

  event.preventDefault();

  const message =
    document.getElementById(
      "recapFormMessage"
    );

  message.textContent =
    "Menyimpan rekap...";


  /* ========================================
     AMBIL DATA FORM
     ======================================== */

  const category =
    document
      .getElementById("recapCategory")
      .value;


  const batchCode =
    document
      .getElementById("recapBatch")
      .value
      .trim();


  const itemName =
    document
      .getElementById("recapItemName")
      .value
      .trim();


  const customerName =
    document
      .getElementById("recapCustomer")
      .value
      .trim();


  const version =
    document
      .getElementById("recapVersion")
      .value
      .trim();


  const quantity =
    Number(
      document
        .getElementById("recapQty")
        .value
    );


  const itemPrice =
    Number(
      document
        .getElementById("recapPrice")
        .value
    );


  const dpAmount =
    Number(
      document
        .getElementById("recapDP")
        .value
    );


  const dpStatus =
    document
      .getElementById("recapDPStatus")
      .value;


  const remainingAmount =
    Number(
      document
        .getElementById("recapRemaining")
        .value
    );


  const paymentStatus =
    document
      .getElementById("recapPaymentStatus")
      .value;


  const trackingStatus =
    document
      .getElementById("recapTracking")
      .value;


  const note =
    document
      .getElementById("recapNote")
      .value
      .trim();


  const coDeadline =
    document
      .getElementById("recapCODedline")
      .value || null;


  /* ========================================
     VALIDASI
     ======================================== */

  if (!category) {

    message.textContent =
      "Kategori belum dipilih.";

    return;

  }


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


  /* ========================================
     DATA REKAP
     ======================================== */

  /*
     Customer TIDAK menggunakan
     tabel customers.

     Cukup simpan:
     Nama + 4 nomor terakhir WA.

     Contoh:
     Euis (1234)

     Jika kosong:
     AVAILABLE
  */

  const recap = {

    category:
      category,

    batch_code:
      batchCode,

    item_name:
      itemName,

    customer_name:
      customerName || "AVAILABLE",

    version:
      version || "AVAILABLE",

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
    "DATA YANG AKAN DISIMPAN:",
    recap
  );


  /* ========================================
     SIMPAN KE SUPABASE
     ======================================== */

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
    "HASIL INSERT:",
    data
  );


  console.log(
    "ERROR INSERT:",
    error
  );


  /* ========================================
     JIKA ERROR
     ======================================== */

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


  /* ========================================
     BERHASIL
     ======================================== */

  message.textContent =
    "Rekap berhasil disimpan. ♥";


  /* ========================================
     REFRESH DATA
     ======================================== */

  await loadRecapList(
    category
  );


  /* ========================================
     KOSONGKAN FORM
     ======================================== */

  document
    .getElementById(
      "recapForm"
    )
    .reset();


  /*
     Kategori tetap menggunakan
     kategori yang sedang dipilih.
  */

  document
    .getElementById(
      "recapCategory"
    )
    .value =
      category;


  /*
     Qty kembali menjadi 1.
  */

  document
    .getElementById(
      "recapQty"
    )
    .value = 1;


  /*
     Tracking kembali ke
     pilihan pertama.
  */

  const trackingSelect =
    document.getElementById(
      "recapTracking"
    );


  if (
    trackingSelect &&
    trackingSelect.options.length > 0
  ) {

    trackingSelect.value =
      trackingSelect
        .options[0]
        .value;

  }

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

    console.error(
      "recapListContainer tidak ditemukan."
    );

    return;

  }


  container.innerHTML =
    "<p>Memuat rekap...</p>";


  try {

    /*
       TIDAK ADA JOIN KE CUSTOMERS.

       Customer langsung diambil dari
       purchase_recap.customer_name.
    */

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
      "DATA REKAP:",
      data
    );


    console.log(
      "ERROR REKAP:",
      error
    );


    /* ======================================
       ERROR
       ====================================== */

    if (error) {

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


    /* ======================================
       BELUM ADA DATA
       ====================================== */

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


    /* ======================================
       TABEL REKAP
       ====================================== */

    container.innerHTML = `

      <div class="product-table-wrapper">

        <table class="product-table recap-table">

          <thead>

            <tr>

              <th>
                Batch
              </th>

              <th>
                Nama Barang
              </th>

              <th>
                Customer
              </th>

              <th>
                Versi / Member / Character
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

                const price =
                  Number(
                    item.item_price || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                const dp =
                  Number(
                    item.dp_amount || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                const remaining =
                  Number(
                    item.remaining_amount || 0
                  ).toLocaleString(
                    "id-ID"
                  );


                /* ==========================
                   CUSTOMER
                   ========================== */

                const customer =
                  item.customer_name ||
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


                /* ==========================
                   VERSION / MEMBER
                   ========================== */

                const version =
                  item.version ||
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


                /* ==========================
                   STATUS DP
                   ========================== */

                const dpStatus =
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


                /* ==========================
                   STATUS PELUNASAN
                   ========================== */

                const paymentStatus =
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


                /* ==========================
                   TRACKING
                   ========================== */

                const tracking =
                  item.tracking_status ||
                  "—";


                const trackingHTML =
                  tracking ===
                  "Goods Arrive at Customer"

                    ? `

                      <span
                        class="status-delivered"
                      >
                        Goods Arrive at Customer
                      </span>

                    `

                    : tracking;


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
                   BARIS
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
                      Rp${price}
                    </td>


                    <td>
                      Rp${dp}
                    </td>


                    <td>
                      ${dpStatus}
                    </td>


                    <td>
                      Rp${remaining}
                    </td>


                    <td>
                      ${paymentStatus}
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
   SESSION CHECK
   ============================================ */

checkGoogleSession();
