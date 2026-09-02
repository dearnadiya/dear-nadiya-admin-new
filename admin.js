/* ============================================
   DEAR NADIYA ADMIN
   CLEAN VERSION

   Login
   Dashboard
   Produk & GO
   Pesanan / PO
   Pembayaran
   Rekap GO
   ============================================ */


/* ============================================
   ELEMENT
   ============================================ */

const loginPage =
  document.getElementById("loginPage");

const adminApp =
  document.getElementById("adminApp");

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
   UTILITAS
   ============================================ */

function showLogin(message = "") {

  if (adminApp) {
    adminApp.classList.add("hidden");
  }

  if (loginPage) {
    loginPage.classList.remove("hidden");
  }

  if (loginError) {
    loginError.textContent = message;
  }

}


function showAdmin() {

  if (loginPage) {
    loginPage.classList.add("hidden");
  }

  if (adminApp) {
    adminApp.classList.remove("hidden");
  }

  loadDashboard();

}


function formatRupiah(value) {

  return (
    "Rp" +
    Number(value || 0)
      .toLocaleString("id-ID")
  );

}


function formatDate(value) {

  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

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


function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


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
        await supabaseClient
          .auth
          .signInWithOAuth({

            provider:
              "google",

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
   CEK ADMIN
   ============================================ */

async function checkAdminAccess(
  session
) {

  const email =
    session
      ?.user
      ?.email
      ?.toLowerCase()
      ?.trim();

  const allowed =
    ADMIN_EMAILS.some(
      function (item) {

        return (
          item
            .toLowerCase()
            .trim() ===
          email
        );

      }
    );

  if (allowed) {

    showAdmin();

    return true;

  }


  await supabaseClient
    .auth
    .signOut();


  showLogin(
    "Akun Google ini tidak memiliki akses Admin."
  );

  return false;

}


/* ============================================
   CEK SESSION
   ============================================ */

async function checkGoogleSession() {

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getSession();


  if (error) {

    console.error(
      "SESSION ERROR:",
      error
    );

    showLogin(
      "Gagal memeriksa sesi: " +
      error.message
    );

    return;

  }


  if (!data?.session) {

    showLogin();

    return;

  }


  await checkAdminAccess(
    data.session
  );

}


/* ============================================
   LOGOUT
   ============================================ */

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    async function () {

      await supabaseClient
        .auth
        .signOut();

      showLogin();

    }
  );

}


/* ============================================
   SESSION BERUBAH
   ============================================ */

supabaseClient
  .auth
  .onAuthStateChange(
    function (
      event,
      session
    ) {

      if (!session) {

        showLogin();

        return;

      }

      checkAdminAccess(
        session
      );

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


        showPage(page);

      }
    );

  }
);


/* ============================================
   PINDAH HALAMAN
   ============================================ */

function showPage(page) {

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
          —
        </h2>

      </div>


      <div class="stat-card">

        <p>
          Total Pembayaran
        </p>

        <h2>
          —
        </h2>

      </div>


      <div class="stat-card">

        <p>
          GO Aktif
        </p>

        <h2>
          —
        </h2>

      </div>

    </div>


    <div class="welcome-card">

      <h2>
        Selamat datang di
        Dear Nadiya Admin ♥
      </h2>

      <p>
        Kelola produk,
        Group Order,
        pesanan,
        pembayaran,
        dan rekap
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
            Kelola produk dan
            Group Order Dear Nadiya.
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


  document
    .getElementById(
      "addProductButton"
    )
    .addEventListener(
      "click",
      showProductForm
    );


  await loadProductList();

}


/* ============================================
   FORM PRODUK
   ============================================ */

function showProductForm() {

  const container =
    document.getElementById(
      "productFormContainer"
    );


  if (!container) {
    return;
  }


  container.innerHTML = `

    <div
      class="panel product-form"
    >

      <h3>
        Tambah Produk / GO
      </h3>


      <form
        id="productForm"
      >

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

        <select
          id="productType"
        >

          <option
            value="GO"
          >
            Group Order
          </option>

          <option
            value="Pre Order"
          >
            Pre Order
          </option>

          <option
            value="Ready Stock"
          >
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

        <select
          id="productStatus"
        >

          <option
            value="active"
          >
            Active
          </option>

          <option
            value="closed"
          >
            Closed
          </option>

          <option
            value="completed"
          >
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


        <label
          class="checkbox-label"
        >

          <input
            id="showWebsite"
            type="checkbox"
            checked
          >

          Tampilkan di website customer

        </label>


        <div
          class="form-actions"
        >

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

        container.innerHTML =
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
      ) || 0,

    dp:
      Number(
        document
          .getElementById(
            "productDp"
          )
          .value
      ) || 0,

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
      ) || 0,

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
      "ERROR SAVE PRODUCT:",
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
   DAFTAR PRODUK
   ============================================ */

async function loadProductList() {

  const container =
    document.getElementById(
      "productListContainer"
    );


  if (!container) {
    return;
  }


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
          ascending:
            false
        }
      );


  if (error) {

    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat produk
        </h3>

        <p>
          ${escapeHTML(
            error.message
          )}
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
          Tambahkan produk atau
          Group Order pertama Anda.
        </p>

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
            function (item) {

              return `

                <tr>

                  <td>
                    ${escapeHTML(
                      item.product_code ||
                      "—"
                    )}
                  </td>

                  <td>
                    ${escapeHTML(
                      item.name ||
                      "—"
                    )}
                  </td>

                  <td>
                    ${escapeHTML(
                      item.type ||
                      "—"
                    )}
                  </td>

                  <td>
                    ${formatRupiah(
                      item.price
                    )}
                  </td>

                  <td>
                    ${formatRupiah(
                      item.dp
                    )}
                  </td>

                  <td>
                    ${escapeHTML(
                      item.status ||
                      "—"
                    )}
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
   BAGIAN 2
   PEMBAYARAN + REKAP GO
   ============================================ */


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


      <div id="paymentsContainer">

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
          ascending:
            false
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
          ${escapeHTML(
            error.message
          )}
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
            function (
              payment
            ) {

              return `

                <tr>

                  <td>
                    ${
                      payment.id ||
                      "—"
                    }
                  </td>


                  <td>
                    ${escapeHTML(
                      payment.customer_name ||
                      "—"
                    )}
                  </td>


                  <td>
                    ${escapeHTML(
                      payment.whatsapp_last4 ||
                      "—"
                    )}
                  </td>


                  <td>
                    ${escapeHTML(
                      payment.product_code ||
                      "—"
                    )}
                  </td>


                  <td>
                    ${escapeHTML(
                      payment.product_version ||
                      "—"
                    )}
                  </td>


                  <td>
                    ${formatRupiah(
                      payment.amount
                    )}
                  </td>


                  <td>
                    ${
                      payment.payment_date
                        ? formatDate(
                            payment.payment_date
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
                            class="primary-button payment-proof-button"
                            data-proof="${escapeHTML(
                              payment.proof_path
                            )}"
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
                      ${escapeHTML(
                        payment.status ||
                        "—"
                      )}
                    </span>

                  </td>


                  <td>

                    ${
                      payment.status ===
                      "pending"

                        ? `

                          <button
                            type="button"
                            class="primary-button confirm-payment-button"
                            data-id="${payment.id}"
                          >
                            ✓ Konfirmasi
                          </button>


                          <button
                            type="button"
                            class="delete-button reject-payment-button"
                            data-id="${payment.id}"
                          >
                            ✕ Tolak
                          </button>

                        `

                        : payment.status ===
                          "confirmed"

                          ? "✓ Pembayaran dikonfirmasi"

                          : payment.status ===
                            "rejected"

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


  /* ==========================================
     TOMBOL LIHAT BUKTI
     ========================================== */

  container
    .querySelectorAll(
      ".payment-proof-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const path =
              this.dataset.proof;

            viewPaymentProof(
              path
            );

          }
        );

      }
    );


  /* ==========================================
     TOMBOL KONFIRMASI
     ========================================== */

  container
    .querySelectorAll(
      ".confirm-payment-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          async function () {

            const id =
              this.dataset.id;

            if (
              !confirm(
                "Konfirmasi pembayaran ini?"
              )
            ) {
              return;
            }

            await updatePaymentStatus(
              id,
              "confirmed"
            );

          }
        );

      }
    );


  /* ==========================================
     TOMBOL TOLAK
     ========================================== */

  container
    .querySelectorAll(
      ".reject-payment-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          async function () {

            const id =
              this.dataset.id;

            if (
              !confirm(
                "Tolak pembayaran ini?"
              )
            ) {
              return;
            }

            await updatePaymentStatus(
              id,
              "rejected"
            );

          }
        );

      }
    );

}


/* ============================================
   UPDATE STATUS PEMBAYARAN
   ============================================ */

async function updatePaymentStatus(
  id,
  newStatus
) {

  const {
    error
  } =
    await supabaseClient
      .from(
        "dn_payment_submissions"
      )
      .update({
        status:
          newStatus
      })
      .eq(
        "id",
        id
      );


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
    newStatus ===
      "confirmed"

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
      .from(
        "payment-proofs"
      )
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
            Kelola rekapan pembelian
            berdasarkan kategori
            dan kode batch.
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
          Memuat rekap...
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


  categoryButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          categoryButtons.forEach(
            function (item) {

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


  document
    .getElementById(
      "addRecapButton"
    )
    .addEventListener(
      "click",
      function () {

        showRecapBatchForm(
          selectedCategory
        );

      }
    );


  loadRecapList(
    selectedCategory
  );

}


/* ============================================
   TRACKING OPTIONS
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
   FORM TAMBAH REKAP
   ============================================ */

function showRecapBatchForm(
  category
) {

  const container =
    document.getElementById(
      "recapFormContainer"
    );


  container.innerHTML = `

    <div
      class="panel recap-form"
    >

      <h3>
        Tambah Rekap Pembelian
      </h3>


      <form
        id="recapBatchForm"
      >

        <label>
          Kategori
        </label>

        <select
          id="batchCategory"
          required
        >

          <option
            value="Truz"
            ${category === "Truz"
              ? "selected"
              : ""}
          >
            Truz
          </option>


          <option
            value="Treasure KR"
            ${category === "Treasure KR"
              ? "selected"
              : ""}
          >
            Treasure KR
          </option>


          <option
            value="Treasure JP"
            ${category === "Treasure JP"
              ? "selected"
              : ""}
          >
            Treasure JP
          </option>


          <option
            value="Treasure CH"
            ${category === "Treasure CH"
              ? "selected"
              : ""}
          >
            Treasure CH
          </option>


          <option
            value="Treasure Thai"
            ${category === "Treasure Thai"
              ? "selected"
              : ""}
          >
            Treasure Thai
          </option>


          <option
            value="Treasure Album"
            ${category === "Treasure Album"
              ? "selected"
              : ""}
          >
            Treasure Album
          </option>


          <option
            value="Treasure INA"
            ${category === "Treasure INA"
              ? "selected"
              : ""}
          >
            Treasure INA
          </option>

        </select>


        <label>
          Kode Batch
        </label>

        <input
          id="batchCode"
          type="text"
          placeholder="Contoh: CH-169"
          required
        >


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
          Tambahkan versi,
          member, atau character
          sesuai kebutuhan batch.
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


        <div
          class="form-actions"
        >

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


  let itemNumber =
    0;


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


    item.innerHTML = `

      <div
        class="batch-item-header"
      >

        <h4>
          Versi / Member
          ${itemNumber}
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
          function (
            option
          ) {

            return `

              <option
                value="${escapeHTML(
                  option
                )}"
              >
                ${escapeHTML(
                  option
                )}
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

    `;


    itemsContainer.appendChild(
      item
    );


    item
      .querySelector(
        ".remove-batch-item"
      )
      .addEventListener(
        "click",
        function () {

          item.remove();

        }
      );

  }


  addBatchItem();


  document
    .getElementById(
      "addBatchItemButton"
    )
    .addEventListener(
      "click",
      addBatchItem
    );


  document
    .getElementById(
      "batchCategory"
    )
    .addEventListener(
      "change",
      function () {

        const options =
          getTrackingOptions(
            this.value
          );


        document
          .querySelectorAll(
            ".batch-tracking"
          )
          .forEach(
            function (
              select
            ) {

              select.innerHTML =
                options.map(
                  function (
                    option
                  ) {

                    return `

                      <option
                        value="${escapeHTML(
                          option
                        )}"
                      >
                        ${escapeHTML(
                          option
                        )}
                      </option>

                    `;

                  }
                ).join("");

            }
          );

      }
    );


  document
    .getElementById(
      "cancelBatchButton"
    )
    .addEventListener(
      "click",
      function () {

        container.innerHTML =
          "";

      }
    );


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
    function (item) {

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


  const {
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .insert(
        records
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
    function () {

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
   LOAD REKAP
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


  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .select("*")
      .eq(
        "category",
        category
      )
      .order(
        "batch_code",
        {
          ascending:
            true
        }
      )
      .order(
        "id",
        {
          ascending:
            true
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD RECAP:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat rekap
        </h3>

        <p>
          ${escapeHTML(
            error.message
          )}
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
          Belum ada rekap
        </h3>

        <p>
          Belum terdapat data
          pada kategori
          ${escapeHTML(
            category
          )}.
        </p>

      </div>

    `;

    return;

  }


  const grouped = {};


  data.forEach(
    function (item) {

      const code =
        item.batch_code ||
        "Tanpa Kode Batch";


      if (
        !grouped[code]
      ) {

        grouped[code] = [];

      }


      grouped[code].push(
        item
      );

    }
  );


  function dpStatusHTML(
    status
  ) {

    if (
      status ===
      "paid"
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


  function paymentStatusHTML(
    status
  ) {

    if (
      status ===
      "paid"
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
        ${escapeHTML(
          status
        )}
      </span>

    `;

  }


  const batchHTML =
    Object.entries(
      grouped
    )
    .map(
      function ([
        batchCode,
        items
      ]) {

        const firstItem =
          items[0];


        return `

          <div
            class="recap-batch-card"
          >

            <div
              class="recap-batch-header"
            >

              <div>

                <div
                  class="recap-batch-code"
                >
                  ${escapeHTML(
                    batchCode
                  )}
                </div>


                <div
                  class="recap-batch-name"
                >
                  ${escapeHTML(
                    firstItem.item_name ||
                    "—"
                  )}
                </div>

              </div>


              <div
                class="recap-batch-count"
              >
                ${items.length}
                data
              </div>

            </div>


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
                      Sisa
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
                    function (
                      item
                    ) {

                      const version =
                        item.version ||
                        "AVAILABLE";


                      const customer =
                        item.customer_name ||
                        "AVAILABLE";


                      return `

                        <tr>

                          <td>
                            ${escapeHTML(
                              version
                            )}
                          </td>


                          <td>
                            ${escapeHTML(
                              customer
                            )}
                          </td>


                          <td>
                            ${
                              item.quantity ||
                              1
                            }
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
                            ${dpStatusHTML(
                              item.dp_status
                            )}
                          </td>


                          <td>
                            ${formatRupiah(
                              item.remaining_amount
                            )}
                          </td>


                          <td>
                            ${paymentStatusHTML(
                              item.payment_status
                            )}
                          </td>


                          <td>
                            ${trackingHTML(
                              item.tracking_status
                            )}
                          </td>


                          <td>
                            ${escapeHTML(
                              item.note ||
                              "—"
                            )}
                          </td>


                          <td>
                            ${formatDate(
                              item.co_deadline
                            )}
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


  container.innerHTML = `

    <div
      class="recap-list"
    >

      <div
        class="recap-list-header"
      >

        <div>

          <h2>
            ${escapeHTML(
              category
            )}
          </h2>

          <p>
            ${data.length}
            data pembelian dari
            ${
              Object.keys(
                grouped
              ).length
            }
            kode batch
          </p>

        </div>


        <div
          class="recap-search"
        >

          <input
            type="text"
            id="recapSearchInput"
            placeholder="🔍 Cari kode batch, customer, barang, member..."
          >

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

      </div>


      ${batchHTML}

    </div>

  `;


  /* ==========================================
     EDIT
     ========================================== */

  container
    .querySelectorAll(
      ".edit-recap-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            editRecap(
              this.dataset.id
            );

          }
        );

      }
    );


  /* ==========================================
     DELETE
     ========================================== */

  container
    .querySelectorAll(
      ".delete-recap-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            deleteRecap(
              this.dataset.id,
              category
            );

          }
        );

      }
    );


  /* ==========================================
     SEARCH
     ========================================== */

  const searchInput =
    container.querySelector(
      "#recapSearchInput"
    );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        const keyword =
          this.value
            .toLowerCase()
            .trim();


        const cards =
          container.querySelectorAll(
            ".recap-batch-card"
          );


        const resultInfo =
          container.querySelector(
            "#recapSearchResult"
          );


        let matchCount =
          0;


        cards.forEach(
          function (card) {

            const text =
              card.innerText
                .toLowerCase();


            if (
              keyword === "" ||
              text.includes(
                keyword
              )
            ) {

              card.style.display =
                "";

              matchCount++;

            } else {

              card.style.display =
                "none";

            }

          }
        );


        if (!resultInfo) {
          return;
        }


        if (
          keyword === ""
        ) {

          resultInfo.textContent =
            "";

        } else if (
          matchCount === 0
        ) {

          resultInfo.textContent =
            `🔎 Tidak ditemukan data yang cocok dengan "${this.value}"`;

        } else {

          resultInfo.textContent =
            `🔎 Menampilkan ${matchCount} batch yang cocok dengan "${this.value}"`;

        }

      }
    );

  }


  /* ==========================================
     EXPORT EXCEL
     ========================================== */

  const exportButton =
    container.querySelector(
      "#exportRecapButton"
    );


  if (exportButton) {

    exportButton.addEventListener(
      "click",
      function () {

        if (
          typeof XLSX ===
          "undefined"
        ) {

          alert(
            "Library Excel belum tersedia."
          );

          return;

        }


        const exportData =
          data.map(
            function (
              item
            ) {

              return {

                "Kategori":
                  item.category ||
                  "—",

                "Kode Batch":
                  item.batch_code ||
                  "—",

                "Nama Barang":
                  item.item_name ||
                  "—",

                "Customer":
                  item.customer_name ||
                  "—",

                "Versi / Member":
                  item.version ||
                  "—",

                "Quantity":
                  item.quantity ||
                  0,

                "Harga":
                  item.item_price ||
                  0,

                "DP":
                  item.dp_amount ||
                  0,

                "Status DP":
                  item.dp_status ||
                  "—",

                "Sisa Pembayaran":
                  item.remaining_amount ||
                  0,

                "Status Pembayaran":
                  item.payment_status ||
                  "—",

                "Tracking":
                  item.tracking_status ||
                  "—",

                "Catatan":
                  item.note ||
                  "—",

                "Deadline CO":
                  item.co_deadline ||
                  "—"

              };

            }
          );


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
            .replace(
              /[^a-z0-9]+/gi,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            );


        XLSX.writeFile(
          workbook,
          `Rekap-GO-${safeCategory}.xlsx`
        );

      }
    );

  }

}


/* ============================================
   EDIT REKAP GO
   ============================================ */

async function editRecap(
  id
) {

  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .select("*")
      .eq(
        "id",
        id
      )
      .single();


  if (error) {

    console.error(
      "ERROR EDIT REKAP:",
      error
    );


    alert(
      "Gagal membuka data: " +
      error.message
    );

    return;

  }


  if (!data) {

    alert(
      "Data rekap tidak ditemukan."
    );

    return;

  }


  const container =
    document.getElementById(
      "recapListContainer"
    );


  container.innerHTML = `

    <div class="panel">

      <h2>
        ✏️ Edit Rekap GO
      </h2>


      <p>
        Batch:
        <strong>
          ${escapeHTML(
            data.batch_code ||
            "—"
          )}
        </strong>
      </p>


      <div
        class="form-grid"
      >

        <div
          class="form-group"
        >

          <label>
            Nama Barang
          </label>

          <input
            id="editItemName"
            type="text"
            value="${escapeHTML(
              data.item_name ||
              ""
            )}"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Versi / Member
          </label>

          <input
            id="editVersion"
            type="text"
            value="${escapeHTML(
              data.version ||
              ""
            )}"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Customer
          </label>

          <input
            id="editCustomerName"
            type="text"
            value="${escapeHTML(
              data.customer_name ||
              ""
            )}"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Quantity
          </label>

          <input
            id="editQuantity"
            type="number"
            min="1"
            value="${
              data.quantity ||
              1
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Harga Barang
          </label>

          <input
            id="editItemPrice"
            type="number"
            min="0"
            value="${
              data.item_price ||
              0
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            DP
          </label>

          <input
            id="editDpAmount"
            type="number"
            min="0"
            value="${
              data.dp_amount ||
              0
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Status DP
          </label>

          <select
            id="editDpStatus"
          >

            <option
              value="unpaid"
              ${
                data.dp_status ===
                "unpaid"
                  ? "selected"
                  : ""
              }
            >
              Belum Dibayar
            </option>


            <option
              value="paid"
              ${
                data.dp_status ===
                "paid"
                  ? "selected"
                  : ""
              }
            >
              Sudah Dibayar
            </option>

          </select>

        </div>


        <div
          class="form-group"
        >

          <label>
            Pelunasan
          </label>

          <input
            id="editRemainingAmount"
            type="number"
            min="0"
            value="${
              data.remaining_amount ||
              0
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Status Pelunasan
          </label>

          <select
            id="editPaymentStatus"
          >

            <option
              value="unpaid"
              ${
                data.payment_status ===
                "unpaid"
                  ? "selected"
                  : ""
              }
            >
              Belum Lunas
            </option>


            <option
              value="paid"
              ${
                data.payment_status ===
                "paid"
                  ? "selected"
                  : ""
              }
            >
              Sudah Lunas
            </option>

          </select>

        </div>


        <div
          class="form-group"
        >

          <label>
            Tracking
          </label>

          <input
            id="editTrackingStatus"
            type="text"
            value="${escapeHTML(
              data.tracking_status ||
              ""
            )}"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Batas CO
          </label>

          <input
            id="editCoDeadline"
            type="date"
            value="${
              data.co_deadline
                ? data.co_deadline.substring(
                    0,
                    10
                  )
                : ""
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Note
          </label>

          <textarea
            id="editNote"
            rows="3"
          >${escapeHTML(
            data.note ||
            ""
          )}</textarea>

        </div>

      </div>


      <div
        class="form-actions"
      >

        <button
          type="button"
          class="secondary-button"
          id="backFromEditButton"
        >
          ← Kembali
        </button>


        <button
          type="button"
          class="primary-button"
          id="saveEditRecapButton"
        >
          Simpan Perubahan
        </button>

      </div>

    </div>

  `;


  document
    .getElementById(
      "backFromEditButton"
    )
    .addEventListener(
      "click",
      function () {

        loadRecap();

      }
    );


  document
    .getElementById(
      "saveEditRecapButton"
    )
    .addEventListener(
      "click",
      function () {

        saveEditedRecap(
          id,
          data.category
        );

      }
    );

}


/* ============================================
   SIMPAN EDIT REKAP
   ============================================ */

async function saveEditedRecap(
  id,
  category
) {

  const updatedData = {

    item_name:
      document
        .getElementById(
          "editItemName"
        )
        .value
        .trim(),

    version:
      document
        .getElementById(
          "editVersion"
        )
        .value
        .trim(),

    customer_name:
      document
        .getElementById(
          "editCustomerName"
        )
        .value
        .trim(),

    quantity:
      Number(
        document
          .getElementById(
            "editQuantity"
          )
          .value
      ) || 1,

    item_price:
      Number(
        document
          .getElementById(
            "editItemPrice"
          )
          .value
      ) || 0,

    dp_amount:
      Number(
        document
          .getElementById(
            "editDpAmount"
          )
          .value
      ) || 0,

    dp_status:
      document
        .getElementById(
          "editDpStatus"
        )
        .value,

    remaining_amount:
      Number(
        document
          .getElementById(
            "editRemainingAmount"
          )
          .value
      ) || 0,

    payment_status:
      document
        .getElementById(
          "editPaymentStatus"
        )
        .value,

    tracking_status:
      document
        .getElementById(
          "editTrackingStatus"
        )
        .value
        .trim(),

    co_deadline:
      document
        .getElementById(
          "editCoDeadline"
        )
        .value ||
      null,

    note:
      document
        .getElementById(
          "editNote"
        )
        .value
        .trim() ||
      null

  };


  const {
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .update(
        updatedData
      )
      .eq(
        "id",
        id
      );


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


  await loadRecapList(
    category
  );

}


/* ============================================
   HAPUS REKAP
   ============================================ */

async function deleteRecap(
  id,
  category
) {

  if (
    !confirm(
      "Yakin ingin menghapus data Rekap GO ini?"
    )
  ) {
    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .delete()
      .eq(
        "id",
        id
      )
      .select(
        "id"
      );


  if (error) {

    console.error(
      "ERROR DELETE REKAP:",
      error
    );


    alert(
      "Gagal menghapus data: " +
      error.message
    );

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    alert(
      "Data tidak terhapus. Periksa izin DELETE di Supabase."
    );

    return;

  }


  alert(
    "Data Rekap GO berhasil dihapus. ♥"
  );


  await loadRecapList(
    category
  );

}

/* ============================================
   BAGIAN 3/4
   PESANAN / PO
   ============================================ */


/* ============================================
   LOAD PESANAN
   ============================================ */

async function loadOrders() {

  pageTitle.textContent = "Pesanan";

  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>
          <h2>Pesanan / PO</h2>

          <p>
            Kelola postingan PO dan hasil
            pembagian barang kepada customer.
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

      <div id="poFormContainer"></div>

      <div id="poListContainer">
        <p>Memuat PO...</p>
      </div>

    </div>

  `;

  const addPOButton =
    document.getElementById("addPOButton");

  if (addPOButton) {

    addPOButton.addEventListener(
      "click",
      function () {

        showPOForm();

      }
    );

  }

  await loadPOList();

}


/* ============================================
   FORM PO
   ============================================ */

function showPOForm(existingPO = null) {

  const container =
    document.getElementById("poFormContainer");

  if (!container) {
    return;
  }

  const isEdit =
    Boolean(existingPO);

  const po =
    existingPO || {};

  let existingRows = [];

  if (po.list_data) {

    try {

      existingRows =
        Array.isArray(po.list_data)
          ? po.list_data
          : JSON.parse(po.list_data);

    } catch (error) {

      console.error(
        "Gagal membaca list_data:",
        error
      );

      existingRows = [];

    }

  }


  container.innerHTML = `

    <div class="panel po-form-panel">

      <div class="panel-header">

        <div>

          <h2>
            ${
              isEdit
                ? "✏️ Edit PO"
                : "➕ Tambah PO"
            }
          </h2>

          <p>
            Buat postingan PO untuk customer.
          </p>

        </div>

      </div>


      <form id="poForm">

        <div class="form-grid">


          <!-- FOTO -->

          <div
            class="form-group"
            style="grid-column:1 / -1;"
          >

            <label>
              Foto Barang / Foto PO
            </label>

            <input
              type="file"
              id="poImage"
              accept="image/*"
              ${
                isEdit
                  ? ""
                  : "required"
              }
            >

            ${
              po.image_url
                ? `

                  <div style="margin-top:12px;">

                    <p>
                      Foto saat ini:
                    </p>

                    <img
                      src="${escapeHTML(
                        po.image_url
                      )}"
                      alt="Foto PO"
                      style="
                        width:220px;
                        max-width:100%;
                        max-height:260px;
                        object-fit:contain;
                        border-radius:12px;
                      "
                    >

                  </div>

                `
                : ""
            }

          </div>


          <!-- JUDUL -->

          <div
            class="form-group"
            style="grid-column:1 / -1;"
          >

            <label>
              Judul PO
            </label>

            <input
              type="text"
              id="poTitle"
              placeholder="Contoh: FS Knpops Batch 1"
              value="${escapeHTML(
                po.title || ""
              )}"
              required
            >

          </div>


          <!-- TIPE PO -->

          <div
            class="form-group"
            style="grid-column:1 / -1;"
          >

            <label>
              Tipe PO
            </label>

            <select
              id="poType"
            >

              <option
                value="war"
                ${
                  po.po_type === "war"
                    ? "selected"
                    : ""
                }
              >
                War / Member
              </option>

              <option
                value="general"
                ${
                  po.po_type === "general" ||
                  !po.po_type
                    ? "selected"
                    : ""
                }
              >
                General PO
              </option>

            </select>


            <small>

              <strong>
                War / Member:
              </strong>
              satu member dalam satu batch
              hanya boleh dimiliki satu customer.

              <br><br>

              <strong>
                General PO:
              </strong>
              satu barang dapat dimiliki
              banyak customer.

            </small>

          </div>


          <!-- HARGA -->

          <div class="form-group">

            <label>
              Harga
            </label>

            <input
              type="text"
              id="poPrice"
              placeholder="Contoh: Rp150.000"
              value="${escapeHTML(
                po.price_text || ""
              )}"
            >

          </div>


          <!-- DP -->

          <div class="form-group">

            <label>
              DP
            </label>

            <input
              type="text"
              id="poDP"
              placeholder="Contoh: Rp50.000"
              value="${escapeHTML(
                po.dp_text || ""
              )}"
            >

          </div>


          <!-- DEADLINE -->

          <div class="form-group">

            <label>
              Batas Waktu PO
            </label>

            <input
              type="datetime-local"
              id="poCloseDate"
              value="${
                po.close_date
                  ? formatDateTimeLocal(
                      po.close_date
                    )
                  : ""
              }"
            >

          </div>


          <!-- DEADLINE DP -->

          <div class="form-group">

            <label>
              Batas Pembayaran DP
            </label>

            <input
              type="datetime-local"
              id="poLastDPDate"
              value="${
                po.last_dp_date
                  ? formatDateTimeLocal(
                      po.last_dp_date
                    )
                  : ""
              }"
            >

          </div>


          <!-- STATUS -->

          <div class="form-group">

            <label>
              Status
            </label>

            <select id="poStatus">

              <option
                value="active"
                ${
                  po.status === "active" ||
                  !po.status
                    ? "selected"
                    : ""
                }
              >
                Aktif
              </option>

              <option
                value="closed"
                ${
                  po.status === "closed"
                    ? "selected"
                    : ""
                }
              >
                Ditutup
              </option>

              <option
                value="completed"
                ${
                  po.status === "completed"
                    ? "selected"
                    : ""
                }
              >
                Selesai
              </option>

            </select>

          </div>


          <!-- DESKRIPSI -->

          <div
            class="form-group"
            style="grid-column:1 / -1;"
          >

            <label>
              Deskripsi Barang
            </label>

            <textarea
              id="poDescription"
              rows="6"
              placeholder="Tulis detail barang dan ketentuan PO..."
            >${escapeHTML(
              po.description || ""
            )}</textarea>

          </div>

        </div>


        <hr>


        <div>

          <h3>
            Data Barang / Hasil War
          </h3>

          <p id="poTypeDescription"></p>

          <div
            id="poRowsContainer"
          ></div>

          <button
            type="button"
            class="primary-button"
            id="addPORowButton"
          >
            ➕ Tambah Baris
          </button>

        </div>


        <div
          class="form-actions"
          style="margin-top:20px;"
        >

          <button
            type="submit"
            class="primary-button"
          >
            ${
              isEdit
                ? "💾 Simpan Perubahan"
                : "💾 Simpan PO"
            }
          </button>

          <button
            type="button"
            id="cancelPOButton"
            class="secondary-button"
          >
            Batal
          </button>

        </div>


        <p
          id="poFormMessage"
          class="login-error"
        ></p>

      </form>

    </div>

  `;


  const typeSelect =
    document.getElementById("poType");

  const rowsContainer =
    document.getElementById(
      "poRowsContainer"
    );

  const typeDescription =
    document.getElementById(
      "poTypeDescription"
    );


  let rowNumber = 0;


  /* ==========================================
     DESKRIPSI TIPE
     ========================================== */

  function updatePOTypeDescription() {

    if (
      typeSelect.value === "war"
    ) {

      typeDescription.innerHTML = `

        <strong>Mode War / Member</strong>

        <br>

        Contoh:
        Batch 1 → Hyunsuk → Euis.

        <br>

        Dalam batch yang sama,
        member yang sama tidak boleh
        dimiliki customer lain.

      `;

    } else {

      typeDescription.innerHTML = `

        <strong>Mode General PO</strong>

        <br>

        Contoh:
        Album → Euis × 2,
        Nadiya × 1,
        Rina × 3.

        <br>

        Barang yang sama boleh dimiliki
        banyak customer.

      `;

    }

  }


  /* ==========================================
     TAMBAH BARIS
     ========================================== */

  function addPORow(rowData = {}) {

    rowNumber++;

    const row =
      document.createElement("div");

    row.className =
      "batch-item po-row";

    row.innerHTML = `

      <div
        class="batch-item-header"
      >

        <h4>
          ${
            typeSelect.value === "war"
              ? "Member"
              : "Barang"
          }
          ${rowNumber}
        </h4>

        <button
          type="button"
          class="remove-po-row"
        >
          ✕ Hapus
        </button>

      </div>


      ${
        typeSelect.value === "war"

          ? `

            <label>
              Batch
            </label>

            <input
              type="text"
              class="po-row-batch"
              placeholder="Contoh: Batch 1"
              value="${escapeHTML(
                rowData.batch || ""
              )}"
            >


            <label>
              Member / Version
            </label>

            <input
              type="text"
              class="po-row-member"
              placeholder="Contoh: Hyunsuk"
              value="${escapeHTML(
                rowData.member || ""
              )}"
            >


            <label>
              Customer
            </label>

            <input
              type="text"
              class="po-row-customer"
              placeholder="Nama customer"
              value="${escapeHTML(
                rowData.customer || ""
              )}"
            >


            <label>
              Quantity
            </label>

            <input
              type="number"
              class="po-row-quantity"
              min="1"
              value="${
                rowData.quantity || 1
              }"
            >

          `

          : `

            <label>
              Nama Barang
            </label>

            <input
              type="text"
              class="po-row-member"
              placeholder="Contoh: Album TREASURE"
              value="${escapeHTML(
                rowData.member || ""
              )}"
            >


            <label>
              Customer
            </label>

            <input
              type="text"
              class="po-row-customer"
              placeholder="Nama customer"
              value="${escapeHTML(
                rowData.customer || ""
              )}"
            >


            <label>
              Quantity
            </label>

            <input
              type="number"
              class="po-row-quantity"
              min="1"
              value="${
                rowData.quantity || 1
              }"
            >

          `
      }


      <label>
        Catatan
      </label>

      <textarea
        class="po-row-note"
        rows="2"
        placeholder="Catatan..."
      >${escapeHTML(
        rowData.note || ""
      )}</textarea>

    `;


    rowsContainer.appendChild(row);


    row
      .querySelector(
        ".remove-po-row"
      )
      .addEventListener(
        "click",
        function () {

          row.remove();

        }
      );

  }


  /* ==========================================
     RENDER BARIS ULANG SAAT TIPE BERUBAH
     ========================================== */

  function renderRows() {

    const currentRows = [];

    rowsContainer
      .querySelectorAll(
        ".po-row"
      )
      .forEach(
        function (row) {

          currentRows.push({

            batch:
              row.querySelector(
                ".po-row-batch"
              )?.value.trim() || "",

            member:
              row.querySelector(
                ".po-row-member"
              )?.value.trim() || "",

            customer:
              row.querySelector(
                ".po-row-customer"
              )?.value.trim() || "",

            quantity:
              Number(
                row.querySelector(
                  ".po-row-quantity"
                )?.value
              ) || 1,

            note:
              row.querySelector(
                ".po-row-note"
              )?.value.trim() || ""

          });

        }
      );


    rowsContainer.innerHTML =
      "";

    rowNumber = 0;


    if (
      currentRows.length
    ) {

      currentRows.forEach(
        function (rowData) {

          addPORow(
            rowData
          );

        }
      );

    } else {

      addPORow();

    }

  }


  typeSelect.addEventListener(
    "change",
    function () {

      updatePOTypeDescription();

      renderRows();

    }
  );


  /* ==========================================
     BARIS AWAL
     ========================================== */

  updatePOTypeDescription();


  if (
    existingRows.length
  ) {

    existingRows.forEach(
      function (rowData) {

        addPORow(
          rowData
        );

      }
    );

  } else {

    addPORow();

  }


  /* ==========================================
     TAMBAH BARIS
     ========================================== */

  document
    .getElementById(
      "addPORowButton"
    )
    .addEventListener(
      "click",
      function () {

        addPORow();

      }
    );


  /* ==========================================
     BATAL
     ========================================== */

  document
    .getElementById(
      "cancelPOButton"
    )
    .addEventListener(
      "click",
      function () {

        container.innerHTML =
          "";

      }
    );


  /* ==========================================
     SUBMIT
     ========================================== */

  document
    .getElementById(
      "poForm"
    )
    .addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

        await savePO(
          existingPO
        );

      }
    );

}


/* ============================================
   FORMAT DATETIME
   ============================================ */

function formatDateTimeLocal(
  value
) {

  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const hours =
    String(
      date.getHours()
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes()
    ).padStart(2, "0");

  return (
    `${year}-${month}-${day}` +
    `T${hours}:${minutes}`
  );

}


/* ============================================
   SIMPAN PO
   ============================================ */

async function savePO(
  existingPO
) {

  const message =
    document.getElementById(
      "poFormMessage"
    );

  if (message) {

    message.textContent =
      "Menyimpan PO...";

  }


  const title =
    document
      .getElementById(
        "poTitle"
      )
      .value
      .trim();


  const poType =
    document
      .getElementById(
        "poType"
      )
      .value;


  const priceText =
    document
      .getElementById(
        "poPrice"
      )
      .value
      .trim();


  const dpText =
    document
      .getElementById(
        "poDP"
      )
      .value
      .trim();


  const closeDate =
    document
      .getElementById(
        "poCloseDate"
      )
      .value;


  const lastDPDate =
    document
      .getElementById(
        "poLastDPDate"
      )
      .value;


  const status =
    document
      .getElementById(
        "poStatus"
      )
      .value;


  const description =
    document
      .getElementById(
        "poDescription"
      )
      .value
      .trim();


  if (!title) {

    if (message) {

      message.textContent =
        "Judul PO wajib diisi.";

    }

    return;

  }


  /* ==========================================
     AMBIL SEMUA BARIS
     ========================================== */

  const rows =
    document.querySelectorAll(
      "#poRowsContainer .po-row"
    );


  const listData = [];


  rows.forEach(
    function (row) {

      const batch =
        row.querySelector(
          ".po-row-batch"
        )?.value
          .trim() || "";


      const member =
        row.querySelector(
          ".po-row-member"
        )?.value
          .trim() || "";


      const customer =
        row.querySelector(
          ".po-row-customer"
        )?.value
          .trim() || "";


      const quantity =
        Number(
          row.querySelector(
            ".po-row-quantity"
          )?.value
        ) || 1;


      const note =
        row.querySelector(
          ".po-row-note"
        )?.value
          .trim() || "";


      if (
        member ||
        customer ||
        batch
      ) {

        listData.push({

          batch:
            batch,

          member:
            member,

          customer:
            customer,

          quantity:
            quantity,

          note:
            note

        });

      }

    }
  );


  /* ==========================================
     VALIDASI WAR
     ========================================== */

  if (
    poType === "war"
  ) {

    const usedSlots =
      new Map();


    for (
      const row
      of listData
    ) {

      const batch =
        row.batch
          .toLowerCase()
          .trim();


      const member =
        row.member
          .toLowerCase()
          .trim();


      if (
        !batch ||
        !member
      ) {

        continue;

      }


      const key =
        `${batch}|||${member}`;


      if (
        usedSlots.has(key)
      ) {

        const previousCustomer =
          usedSlots.get(key);


        if (
          previousCustomer &&
          row.customer &&
          previousCustomer
            .toLowerCase()
            !==
          row.customer
            .toLowerCase()
        ) {

          if (message) {

            message.textContent =
              `Member ${row.member} pada ${row.batch} sudah dimiliki oleh ${previousCustomer}.`;

          }

          alert(
            `Tidak dapat menyimpan.\n\n${row.member} pada ${row.batch} hanya boleh dimiliki 1 customer.`
          );

          return;

        }

      } else {

        usedSlots.set(
          key,
          row.customer
        );

      }

    }

  }


  /* ==========================================
     FOTO
     ========================================== */

  let imageURL =
    existingPO
      ? existingPO.image_url ||
        null
      : null;


  const imageInput =
    document.getElementById(
      "poImage"
    );


  if (
    imageInput &&
    imageInput.files &&
    imageInput.files.length
  ) {

    const file =
      imageInput.files[0];


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      if (message) {

        message.textContent =
          "File harus berupa gambar.";

      }

      return;

    }


    if (
      file.size >
      8 * 1024 * 1024
    ) {

      if (message) {

        message.textContent =
          "Ukuran gambar maksimal 8 MB.";

      }

      return;

    }


    const extension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();


    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${extension}`;


    const filePath =
      `po/${fileName}`;


    const {
      error:
        uploadError
    } =
      await supabaseClient
        .storage
        .from(
          "po-images"
        )
        .upload(
          filePath,
          file,
          {
            upsert:
              false
          }
        );


    if (
      uploadError
    ) {

      console.error(
        "ERROR UPLOAD PO IMAGE:",
        uploadError
      );


      if (message) {

        message.textContent =
          "Gagal upload foto: " +
          uploadError.message;

      }

      return;

    }


    const {
      data:
        publicData
    } =
      supabaseClient
        .storage
        .from(
          "po-images"
        )
        .getPublicUrl(
          filePath
        );


    imageURL =
      publicData?.publicUrl ||
      null;

  }


  /* ==========================================
     DATA
     ========================================== */

  const poData = {

    title:
      title,

    po_type:
      poType,

    image_url:
      imageURL,

    price_text:
      priceText ||
      null,

    dp_text:
      dpText ||
      null,

    close_date:
      closeDate
        ? new Date(
            closeDate
          ).toISOString()
        : null,

    last_dp_date:
      lastDPDate
        ? new Date(
            lastDPDate
          ).toISOString()
        : null,

    description:
      description ||
      null,

    list_data:
      listData,

    status:
      status

  };


  /* ==========================================
     INSERT / UPDATE
     ========================================== */

  let result;


  if (
    existingPO &&
    existingPO.id
  ) {

    result =
      await supabaseClient
        .from(
          "po_posts"
        )
        .update(
          poData
        )
        .eq(
          "id",
          existingPO.id
        );

  } else {

    result =
      await supabaseClient
        .from(
          "po_posts"
        )
        .insert(
          poData
        );

  }


  if (
    result.error
  ) {

    console.error(
      "ERROR SAVE PO:",
      result.error
    );


    if (message) {

      message.textContent =
        "Gagal menyimpan PO: " +
        result.error.message;

    }

    return;

  }


  alert(
    existingPO
      ? "PO berhasil diperbarui. ♥"
      : "PO berhasil dibuat. ♥"
  );


  const formContainer =
    document.getElementById(
      "poFormContainer"
    );


  if (formContainer) {

    formContainer.innerHTML =
      "";

  }


  await loadPOList();

}


/* ============================================
   LOAD DAFTAR PO
   ============================================ */

async function loadPOList() {

  const container =
    document.getElementById(
      "poListContainer"
    );

  if (!container) {
    return;
  }


  container.innerHTML = `

    <div class="panel">
      <p>Memuat PO...</p>
    </div>

  `;


  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "po_posts"
      )
      .select("*")
      .order(
        "id",
        {
          ascending:
            false
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
          ${escapeHTML(
            error.message
          )}
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
          Belum ada PO
        </h3>

        <p>
          Klik "Tambah PO"
          untuk membuat PO baru.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="po-admin-list">

      ${data.map(
        function (po) {

          let rows = [];


          if (
            Array.isArray(
              po.list_data
            )
          ) {

            rows =
              po.list_data;

          } else if (
            po.list_data
          ) {

            try {

              rows =
                typeof po.list_data ===
                "string"

                  ? JSON.parse(
                      po.list_data
                    )

                  : [];

            } catch (
              error
            ) {

              rows = [];

            }

          }


          const isWar =
            po.po_type === "war";


          return `

            <div
              class="panel po-admin-card"
            >

              <div
                class="po-admin-header"
              >

                <div>

                  <h2>
                    ${escapeHTML(
                      po.title ||
                      "Tanpa Judul"
                    )}
                  </h2>


                  <div
                    style="margin-top:6px;"
                  >

                    <span
                      class="status-badge"
                    >
                      ${
                        isWar
                          ? "WAR / MEMBER"
                          : "GENERAL PO"
                      }
                    </span>


                    <span
                      class="status-badge"
                    >
                      ${escapeHTML(
                        po.status ||
                        "active"
                      )}
                    </span>

                  </div>

                </div>


                <div>

                  <button
                    type="button"
                    class="edit-po-button primary-button"
                    data-id="${po.id}"
                  >
                    ✏️ Edit
                  </button>


                  <button
                    type="button"
                    class="delete-po-button delete-button"
                    data-id="${po.id}"
                  >
                    🗑️ Hapus
                  </button>

                </div>

              </div>


              ${
                po.image_url
                  ? `

                    <div
                      style="margin:15px 0;"
                    >

                      <img
                        src="${escapeHTML(
                          po.image_url
                        )}"
                        alt="Foto PO"
                        style="
                          width:220px;
                          max-width:100%;
                          max-height:260px;
                          object-fit:contain;
                          border-radius:14px;
                        "
                      >

                    </div>

                  `
                  : ""
              }


              <div
                class="po-info-grid"
              >

                ${
                  po.price_text
                    ? `

                      <div>

                        <strong>
                          Harga
                        </strong>

                        <p>
                          ${escapeHTML(
                            po.price_text
                          )}
                        </p>

                      </div>

                    `
                    : ""
                }


                ${
                  po.dp_text
                    ? `

                      <div>

                        <strong>
                          DP
                        </strong>

                        <p>
                          ${escapeHTML(
                            po.dp_text
                          )}
                        </p>

                      </div>

                    `
                    : ""
                }


                ${
                  po.close_date
                    ? `

                      <div>

                        <strong>
                          Batas PO
                        </strong>

                        <p>
                          ${formatDate(
                            po.close_date
                          )}
                        </p>

                      </div>

                    `
                    : ""
                }


                ${
                  po.last_dp_date
                    ? `

                      <div>

                        <strong>
                          Batas DP
                        </strong>

                        <p>
                          ${formatDate(
                            po.last_dp_date
                          )}
                        </p>

                      </div>

                    `
                    : ""
                }

              </div>


              ${
                po.description
                  ? `

                    <div
                      class="po-description"
                    >

                      <strong>
                        Deskripsi
                      </strong>

                      <p>
                        ${escapeHTML(
                          po.description
                        ).replace(
                          /\n/g,
                          "<br>"
                        )}
                      </p>

                    </div>

                  `
                  : ""
              }


              <div
                class="po-member-list"
              >

                <h3>
                  ${
                    isWar
                      ? "Hasil War / Member"
                      : "Daftar Pesanan"
                  }
                </h3>


                ${
                  rows.length
                    ? `

                      <div
                        class="product-table-wrapper"
                      >

                        <table
                          class="product-table"
                        >

                          <thead>

                            <tr>

                              ${
                                isWar
                                  ? `

                                    <th>
                                      Batch
                                    </th>

                                    <th>
                                      Member
                                    </th>

                                  `
                                  : `

                                    <th>
                                      Barang
                                    </th>

                                  `
                              }

                              <th>
                                Customer
                              </th>

                              <th>
                                Qty
                              </th>

                              <th>
                                Catatan
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            ${rows.map(
                              function (
                                row
                              ) {

                                return `

                                  <tr>

                                    ${
                                      isWar
                                        ? `

                                          <td>
                                            ${escapeHTML(
                                              row.batch ||
                                              "—"
                                            )}
                                          </td>

                                        `
                                        : ""
                                    }


                                    <td>
                                      ${escapeHTML(
                                        row.member ||
                                        "—"
                                      )}
                                    </td>


                                    <td>
                                      ${
                                        row.customer
                                          ? escapeHTML(
                                              row.customer
                                            )
                                          : `

                                            <span
                                              class="status-badge warning"
                                            >
                                              AVAILABLE
                                            </span>

                                          `
                                      }
                                    </td>


                                    <td>
                                      ${
                                        row.quantity ||
                                        1
                                      }
                                    </td>


                                    <td>
                                      ${escapeHTML(
                                        row.note ||
                                        "—"
                                      )}
                                    </td>

                                  </tr>

                                `;

                              }
                            ).join("")}

                          </tbody>

                        </table>

                      </div>

                    `
                    : `

                      <p>
                        Belum ada data.
                      </p>

                    `
                }

              </div>

            </div>

          `;

        }
      ).join("")}

    </div>

  `;


  /* ==========================================
     EDIT
     ========================================== */

  container
    .querySelectorAll(
      ".edit-po-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              this.dataset.id;


            const selectedPO =
              data.find(
                function (po) {

                  return String(
                    po.id
                  ) === String(
                    id
                  );

                }
              );


            if (
              selectedPO
            ) {

              showPOForm(
                selectedPO
              );

            }

          }
        );

      }
    );


  /* ==========================================
     DELETE
     ========================================== */

  container
    .querySelectorAll(
      ".delete-po-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            deletePO(
              this.dataset.id
            );

          }
        );

      }
    );

}


/* ============================================
   DELETE PO
   ============================================ */

async function deletePO(
  id
) {

  if (
    !confirm(
      "Yakin ingin menghapus PO ini?"
    )
  ) {

    return;

  }


  const {
    error
  } =
    await supabaseClient
      .from(
        "po_posts"
      )
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "ERROR DELETE PO:",
      error
    );


    alert(
      "Gagal menghapus PO: " +
      error.message
    );

    return;

  }


  alert(
    "PO berhasil dihapus."
  );


  await loadPOList();

}

/* ============================================
   BAGIAN 4/4
   NAVIGASI + SESSION + INITIALIZATION
   ============================================ */


/* ============================================
   NAVIGASI SIDEBAR
   ============================================ */

function showPage(page) {

  /* ------------------------------------------
     Dashboard
     ------------------------------------------ */

  if (
    page === "dashboard"
  ) {

    loadDashboard();

    return;

  }


  /* ------------------------------------------
     Produk & GO
     ------------------------------------------ */

  if (
    page === "products"
  ) {

    loadProducts();

    return;

  }


  /* ------------------------------------------
     Pesanan / PO
     ------------------------------------------ */

  if (
    page === "orders"
  ) {

    loadOrders();

    return;

  }


  /* ------------------------------------------
     Pembayaran
     ------------------------------------------ */

  if (
    page === "payments"
  ) {

    loadPayments();

    return;

  }


  /* ------------------------------------------
     Rekap GO
     ------------------------------------------ */

  if (
    page === "recap"
  ) {

    loadRecap();

    return;

  }

}


/* ============================================
   PASANG EVENT SIDEBAR
   ============================================ */

function setupNavigation() {

  const navItems =
    document.querySelectorAll(
      "[data-page]"
    );


  navItems.forEach(
    function (item) {

      item.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          const page =
            this.dataset.page;


          /* ------------------------------
             ACTIVE MENU
             ------------------------------ */

          navItems.forEach(
            function (nav) {

              nav.classList.remove(
                "active"
              );

            }
          );


          this.classList.add(
            "active"
          );


          /* ------------------------------
             LOAD PAGE
             ------------------------------ */

          showPage(
            page
          );

        }
      );

    }
  );

}


/* ============================================
   LOGOUT
   ============================================ */

async function logoutAdmin() {

  try {

    const {
      error
    } =
      await supabaseClient
        .auth
        .signOut();


    if (error) {

      console.error(
        "Logout error:",
        error
      );

      alert(
        "Gagal logout: " +
        error.message
      );

      return;

    }


    showLogin();

  } catch (
    error
  ) {

    console.error(
      "Logout exception:",
      error
    );

    alert(
      "Terjadi kesalahan saat logout."
    );

  }

}


/* ============================================
   PASANG BUTTON LOGOUT
   ============================================ */

function setupLogout() {

  const logoutButtons =
    document.querySelectorAll(
      "#logoutButton, .logout-button"
    );


  logoutButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          logoutAdmin();

        }
      );

    }
  );

}


/* ============================================
   CEK SESSION GOOGLE
   ============================================ */

async function checkGoogleSession() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getSession();


    if (error) {

      console.error(
        "Session error:",
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

  } catch (
    error
  ) {

    console.error(
      "Check session error:",
      error
    );

    showLogin();

  }

}


/* ============================================
   CEK ADMIN ACCESS
   ============================================ */

async function checkAdminAccess(
  session
) {

  if (
    !session ||
    !session.user
  ) {

    showLogin();

    return false;

  }


  const email =
    session.user.email
      ?.toLowerCase()
      .trim();


  if (
    !email
  ) {

    showLogin();

    return false;

  }


  const allowed =
    ADMIN_EMAILS
      .map(
        function (
          item
        ) {

          return item
            .toLowerCase()
            .trim();

        }
      )
      .includes(
        email
      );


  if (!allowed) {

    alert(
      "Akun Google ini tidak memiliki akses Admin."
    );


    await supabaseClient
      .auth
      .signOut();


    showLogin();

    return false;

  }


  showAdmin(
    session
  );


  return true;

}


/* ============================================
   TAMPILKAN LOGIN
   ============================================ */

function showLogin() {

  const loginPage =
    document.getElementById(
      "loginPage"
    );


  const adminPage =
    document.getElementById(
      "adminPage"
    );


  if (loginPage) {

    loginPage.style.display =
      "flex";

  }


  if (adminPage) {

    adminPage.style.display =
      "none";

  }

}


/* ============================================
   TAMPILKAN ADMIN
   ============================================ */

function showAdmin(
  session
) {

  const loginPage =
    document.getElementById(
      "loginPage"
    );


  const adminPage =
    document.getElementById(
      "adminPage"
    );


  if (loginPage) {

    loginPage.style.display =
      "none";

  }


  if (adminPage) {

    adminPage.style.display =
      "block";

  }


  /* ------------------------------------------
     INFO USER
     ------------------------------------------ */

  const userEmail =
    document.getElementById(
      "adminEmail"
    );


  if (
    userEmail &&
    session?.user?.email
  ) {

    userEmail.textContent =
      session.user.email;

  }


  const userName =
    document.getElementById(
      "adminName"
    );


  if (
    userName
  ) {

    userName.textContent =
      session?.user?.user_metadata
        ?.full_name ||
      session?.user?.user_metadata
        ?.name ||
      "Admin";

  }


  /* ------------------------------------------
     LOAD DASHBOARD
     ------------------------------------------ */

  loadDashboard();

}


/* ============================================
   LOGIN GOOGLE
   ============================================ */

async function loginWithGoogle() {

  try {

    const {
      error
    } =
      await supabaseClient
        .auth
        .signInWithOAuth({

          provider:
            "google",

          options: {

            redirectTo:
              "https://dearnadiya.github.io/dear-nadiya-admin-new/"

          }

        });


    if (error) {

      console.error(
        "Google login error:",
        error
      );


      alert(
        "Gagal login Google: " +
        error.message
      );

    }

  } catch (
    error
  ) {

    console.error(
      "Google login exception:",
      error
    );


    alert(
      "Terjadi kesalahan saat login."
    );

  }

}


/* ============================================
   PASANG BUTTON LOGIN GOOGLE
   ============================================ */

function setupGoogleLogin() {

  const buttons =
    document.querySelectorAll(
      "#googleLoginButton, .google-login-button"
    );


  buttons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          loginWithGoogle();

        }
      );

    }
  );

}


/* ============================================
   AUTH STATE CHANGE
   ============================================ */

supabaseClient
  .auth
  .onAuthStateChange(
    async function (
      event,
      session
    ) {

      console.log(
        "Auth event:",
        event
      );


      if (
        session
      ) {

        await checkAdminAccess(
          session
        );

      } else {

        showLogin();

      }

    }
  );


/* ============================================
   ERROR HANDLER
   ============================================ */

window.addEventListener(
  "error",
  function (event) {

    console.error(
      "Global JavaScript error:",
      event.error ||
      event.message
    );

  }
);


/* ============================================
   UNHANDLED PROMISE
   ============================================ */

window.addEventListener(
  "unhandledrejection",
  function (event) {

    console.error(
      "Unhandled Promise:",
      event.reason
    );

  }
);


/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    console.log(
      "Dear Nadiya Admin initializing..."
    );


    /* ------------------------------------------
       NAVIGATION
       ------------------------------------------ */

    setupNavigation();


    /* ------------------------------------------
       GOOGLE LOGIN
       ------------------------------------------ */

    setupGoogleLogin();


    /* ------------------------------------------
       LOGOUT
       ------------------------------------------ */

    setupLogout();


    /* ------------------------------------------
       DEFAULT LOGIN
       ------------------------------------------ */

    showLogin();


    /* ------------------------------------------
       CHECK SESSION
       ------------------------------------------ */

    await checkGoogleSession();

  }
);


/* ============================================
   AKHIR ADMIN.JS
   ============================================ */
