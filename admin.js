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
    adminApp.style.display = "none";
  }

  if (loginPage) {
    loginPage.classList.remove("hidden");
    loginPage.style.display = "flex";
  }

  if (loginError) {
    loginError.textContent =
      message || "";
  }

}


function showAdmin(session) {

  if (loginPage) {
    loginPage.classList.add("hidden");
    loginPage.style.display = "none";
  }

  if (adminApp) {
    adminApp.classList.remove("hidden");
    adminApp.style.display = "block";
  }

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

  if (userName) {
    userName.textContent =
      session?.user?.user_metadata
        ?.full_name ||
      session?.user?.user_metadata
        ?.name ||
      "Admin";
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
        loginError.textContent =
          "";
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

    showAdmin(
      session
    );

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
      "ERROR LOAD PRODUCTS:",
      error
    );

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

        <p>
          Belum ada produk.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    data
      .map(
        function (product) {

          return `

            <div
              class="product-card"
            >

              <div>

                <h3>
                  ${escapeHTML(
                    product.name
                  )}
                </h3>

                <p>
                  Kode:
                  ${escapeHTML(
                    product.product_code
                  )}
                </p>

                <p>
                  Jenis:
                  ${escapeHTML(
                    product.type
                  )}
                </p>

              </div>


              <div>

                <strong>
                  ${formatRupiah(
                    product.price
                  )}
                </strong>

                <p>
                  DP:
                  ${formatRupiah(
                    product.dp
                  )}
                </p>

              </div>

            </div>

          `;

        }
      )
      .join("");

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


  const addButton =
    document.getElementById(
      "addRecapButton"
    );


  if (addButton) {

    addButton.addEventListener(
      "click",
      function () {

        showRecapForm(
          selectedCategory
        );

      }
    );

  }


  loadRecapList(
    selectedCategory
  );

}


/* ============================================
   FORM REKAP GO - MULTI MEMBER
   ============================================ */

function showRecapForm(category) {

  const container =
    document.getElementById("recapFormContainer");

  if (!container) return;

  container.innerHTML = `

    <div class="panel recap-form">

      <h3>➕ Tambah Rekap GO</h3>

      <p>
        Kategori:
        <strong>${escapeHTML(category)}</strong>
      </p>

      <form id="batchRecapForm">

        <input
          type="hidden"
          id="batchCategory"
          value="${escapeHTML(category)}"
        >

        <label>Kode Batch</label>

        <input
          id="batchCode"
          type="text"
          placeholder="Contoh: TRUZ-001"
          required
        >

        <label>Nama Barang</label>

        <input
          id="batchItemName"
          type="text"
          placeholder="Contoh: Truz Friend Sale"
          required
        >

        <label>Tipe Harga</label>

        <select id="batchPriceMode">

          <option value="same">
            Harga Sama untuk Semua Member
          </option>

          <option value="different">
            Harga Berbeda per Member
          </option>

        </select>


        <!-- =====================================
             HARGA SAMA UNTUK SEMUA MEMBER
             ===================================== -->

        <div id="batchCommonFields">

          <hr>

          <h3>Harga Batch</h3>

          <label>Harga Barang</label>

          <input
            id="batchCommonPrice"
            type="number"
            min="0"
            value="0"
          >

          <label>DP</label>

          <input
            id="batchCommonDp"
            type="number"
            min="0"
            value="0"
          >

        </div>


        <hr>

        <h3>Versi / Member</h3>

        <p>
          Tambahkan customer dan member yang
          termasuk dalam batch ini.
        </p>

        <div id="batchItemsContainer"></div>


        <button
          type="button"
          id="addBatchItemButton"
          class="primary-button"
        >
          ＋ Tambah Member / Versi
        </button>


        <hr>

        <h3>Pengaturan Batch</h3>

        <label>Tracking Batch</label>

        <select id="batchTrackingStatus">

          ${getTrackingOptions(category)
            .map(function(option) {

              return `
                <option value="${escapeHTML(option)}">
                  ${escapeHTML(option)}
                </option>
              `;

            })
            .join("")
          }

        </select>


        <label>Deadline CO</label>

        <input
          id="batchCoDeadline"
          type="date"
        >


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


  /* ==========================================
     TAMBAH CUSTOMER
     ========================================== */

  function addBatchItem() {

    itemNumber++;


    const item =
      document.createElement("div");

    item.className = "batch-item";


    item.innerHTML = `

      <div class="batch-item-header">

        <strong>
          Member / Customer ${itemNumber}
        </strong>

        <button
          type="button"
          class="delete-button remove-batch-item"
        >
          🗑️ Hapus
        </button>

      </div>


      <label>Customer</label>

      <input
        type="text"
        class="batch-customer"
        placeholder="Nama customer"
      >


      <label>Versi / Member</label>

      <input
        type="text"
        class="batch-version"
        placeholder="Contoh: Hyunsuk"
      >


      <label>Quantity</label>

      <input
        type="number"
        class="batch-quantity"
        min="1"
        value="1"
      >


      <!-- ====================================
           HARGA PER CUSTOMER
           HANYA UNTUK MODE BERBEDA
           ==================================== -->

      <div class="different-price-fields">

        <label>Harga Barang</label>

        <input
          type="number"
          class="batch-price"
          min="0"
          value="0"
        >

        <label>DP</label>

        <input
          type="number"
          class="batch-dp"
          min="0"
          value="0"
        >

      </div>


      <!-- ====================================
           PEMBAYARAN CUSTOMER
           SELALU PER CUSTOMER
           ==================================== -->

      <div class="batch-payment-fields">

        <label>Status DP</label>

        <select class="batch-dp-status">

          <option value="unpaid">
            Belum Dibayar
          </option>

          <option value="paid">
            Sudah Dibayar
          </option>

        </select>


        <label>Sisa Pembayaran</label>

        <input
          type="number"
          class="batch-remaining"
          min="0"
          value="0"
        >


        <label>Status Pembayaran</label>

        <select class="batch-payment-status">

          <option value="unpaid">
            Belum Lunas
          </option>

          <option value="paid">
            Lunas
          </option>

        </select>

      </div>


      <label>Catatan</label>

      <textarea
        class="batch-note"
        rows="2"
        placeholder="Catatan..."
      ></textarea>

    `;


    itemsContainer.appendChild(item);


    item
      .querySelector(".remove-batch-item")
      .addEventListener(
        "click",
        function() {

          item.remove();

        }
      );


    updatePriceMode();

  }


  /* ==========================================
     ATUR MODE HARGA
     ========================================== */

  function updatePriceMode() {

    const mode =
      document.getElementById(
        "batchPriceMode"
      ).value;


    const commonFields =
      document.getElementById(
        "batchCommonFields"
      );


    const differentFields =
      document.querySelectorAll(
        ".different-price-fields"
      );


    if (mode === "same") {

      /*
       * Harga + DP bersama
       */

      commonFields.style.display =
        "block";


      differentFields.forEach(
        function(fields) {

          fields.style.display =
            "none";

        }
      );

    }

    else {

      /*
       * Harga + DP per customer
       */

      commonFields.style.display =
        "none";


      differentFields.forEach(
        function(fields) {

          fields.style.display =
            "block";

        }
      );

    }

  }


  /* ==========================================
     CUSTOMER PERTAMA
     ========================================== */

  addBatchItem();


  /* ==========================================
     TAMBAH CUSTOMER
     ========================================== */

  document
    .getElementById("addBatchItemButton")
    .addEventListener(
      "click",
      addBatchItem
    );


  /* ==========================================
     GANTI MODE HARGA
     ========================================== */

  document
    .getElementById("batchPriceMode")
    .addEventListener(
      "change",
      updatePriceMode
    );


  /* ==========================================
     BATAL
     ========================================== */

  document
    .getElementById("cancelBatchButton")
    .addEventListener(
      "click",
      function() {

        container.innerHTML = "";

      }
    );


  /* ==========================================
     SIMPAN
     ========================================== */

  document
    .getElementById("batchRecapForm")
    .addEventListener(
      "submit",
      saveBatchRecap
    );

}

/* ============================================
   SIMPAN REKAP GO
   ============================================ */

async function saveRecap(
  event,
  category
) {

  event.preventDefault();


  const message =
    document.getElementById(
      "recapFormMessage"
    );


  message.textContent =
    "Menyimpan rekap...";


  const itemPrice =
    Number(
      document.getElementById(
        "recapItemPrice"
      ).value
    ) || 0;


  const dpAmount =
    Number(
      document.getElementById(
        "recapDpAmount"
      ).value
    ) || 0;


  const quantity =
    Number(
      document.getElementById(
        "recapQuantity"
      ).value
    ) || 1;


  const remainingAmount =
    Number(
      document.getElementById(
        "recapRemainingAmount"
      ).value
    ) || 0;


  const recap = {

    category:
      category,

    batch_code:
      document
        .getElementById(
          "recapBatchCode"
        )
        .value
        .trim(),

    item_name:
      document
        .getElementById(
          "recapItemName"
        )
        .value
        .trim(),

    customer_name:
      document
        .getElementById(
          "recapCustomerName"
        )
        .value
        .trim(),

    version:
      document
        .getElementById(
          "recapVersion"
        )
        .value
        .trim(),

    quantity:
      quantity,

    item_price:
      itemPrice,

    dp_amount:
      dpAmount,

    dp_status:
      document
        .getElementById(
          "recapDpStatus"
        )
        .value,

    remaining_amount:
      remainingAmount,

    payment_status:
      document
        .getElementById(
          "recapPaymentStatus"
        )
        .value,

    tracking_status:
      document
        .getElementById(
          "recapTrackingStatus"
        )
        .value,

    note:
      document
        .getElementById(
          "recapNote"
        )
        .value
        .trim(),

    co_deadline:
      document
        .getElementById(
          "recapCoDeadline"
        )
        .value ||
      null

  };


  const {
    error
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .insert(
        recap
      );


  if (error) {

    console.error(
      "ERROR SAVE RECAP:",
      error
    );


    message.textContent =
      "Gagal menyimpan rekap: " +
      error.message;

    return;

  }


  message.textContent =
    "Rekap berhasil disimpan. ♥";


  document
    .getElementById(
      "recapFormContainer"
    )
    .innerHTML =
      "";


  await loadRecapList(
    category
  );

}


/* ============================================
   DAFTAR REKAP
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
      .from(
        "purchase_recap"
      )
      .select("*")
      .eq(
        "category",
        category
      )
      .order(
        "id",
        {
          ascending:
            false
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
          Belum ada data Rekap GO
        </h3>

        <p>
          Belum ada data untuk kategori
          ${escapeHTML(
            category
          )}.
        </p>

      </div>

    `;

    return;

  }


  /* ==========================================
     KELOMPOKKAN BERDASARKAN BATCH
     ========================================== */

  const batches = {};


  data.forEach(
    function (item) {

      const batch =
        item.batch_code ||
        "Tanpa Batch";


      if (!batches[batch]) {
        batches[batch] = [];
      }


      batches[batch].push(
        item
      );

    }
  );


  let html = `

    <div class="recap-search">

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


    <div
      class="recap-actions"
    >

      <button
        type="button"
        class="primary-button"
        id="exportRecapButton"
      >
        📊 Export Excel
      </button>

    </div>

  `;


  Object.keys(
    batches
  ).forEach(
    function (batchCode) {

      const rows =
        batches[batchCode];


      html += `

        <div
          class="recap-batch-card"
          data-search="${escapeHTML(
            (
              batchCode +
              " " +
              rows
                .map(
                  function (row) {

                    return (
                      (row.item_name || "") +
                      " " +
                      (row.customer_name || "") +
                      " " +
                      (row.version || "")
                    );

                  }
                )
                .join(" ")
            ).toLowerCase()
          )}"
        >

          <div
  class="recap-batch-header"
>

  <div>

    <h3>
      ${escapeHTML(
        batchCode
      )}
    </h3>

    <p>
      ${escapeHTML(
        rows[0]?.item_name ||
        "Nama barang belum tersedia"
      )}
    </p>

    <p>
      ${rows.length}
      customer
    </p>

  </div>


  <div
    class="batch-tracking"
  >

    <small>
      TRACKING BATCH
    </small>

    <select
      class="batch-tracking-select"
      data-batch-code="${escapeHTML(
        batchCode
      )}"
    >

      ${getTrackingOptions(
        category
      ).map(
        function (option) {

          const currentTracking =
            rows.find(
              function (row) {
                return (
                  row.batch_tracking_status
                );
              }
            )?.batch_tracking_status ||
            rows.find(
              function (row) {
                return row.tracking_status;
              }
            )?.tracking_status ||
            "";

          return `
            <option
              value="${escapeHTML(
                option
              )}"
              ${
                currentTracking ===
                option
                  ? "selected"
                  : ""
              }
            >
              ${escapeHTML(
                option
              )}
            </option>
          `;

        }
      ).join("")}

    </select>


    <button
      type="button"
      class="primary-button save-batch-tracking-button"
      data-batch-code="${escapeHTML(
        batchCode
      )}"
    >
      💾 Simpan
    </button>

  </div>

</div>

          <div
            class="product-table-wrapper"
          >

            <table
              class="product-table"
            >

              <thead>

                <tr>

                  <th>
                    Barang
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
                    Sisa
                  </th>

                  <th>
                    Pembayaran
                  </th>

                  <th>
                    Status Customer
                  </th>

                  <th>
                    Catatan
                  </th>

                  <th>
                    Aksi
                  </th>
                  
                </tr>

              </thead>


              <tbody>

                ${rows.map(
                  function (row) {

                    return `

                      <tr>

                        <td>
                          ${escapeHTML(
                            row.item_name ||
                            "—"
                          )}
                        </td>


                        <td>
                          ${escapeHTML(
                            row.customer_name ||
                            "—"
                          )}
                        </td>


                        <td>
                          ${escapeHTML(
                            row.version ||
                            "—"
                          )}
                        </td>


                        <td>
                          ${
                            row.quantity ||
                            0
                          }
                        </td>


                        <td>
                          ${formatRupiah(
                            row.item_price
                          )}
                        </td>


                       <td>
  ${formatRupiah(
    row.dp_amount
  )}
</td>


<td>
  ${
    row.dp_status === "paid"
      ? "✓ Sudah Dibayar"
      : "⏳ Belum Dibayar"
  }
</td>


<td>
  ${formatRupiah(
    row.remaining_amount
  )}
</td>

                        <td>
  ${
    row.payment_status === "paid"
      ? "✓ Lunas"
      : "⏳ Belum Lunas"
  }
</td>

                        <td>
                          ${escapeHTML(
                            row.customer_status ||
                            "Belum Checkout Shopee"
                          )}
                        </td>


                        <td>
                          ${
                            row.note
                              ? `📝 ${escapeHTML(row.note)}`
                              : "—"
                        }
                        </td>

                        <td>

                          <button
                            type="button"
                            class="primary-button edit-recap-button"
                            data-id="${escapeHTML(String(row.id))}"
                          >
                            ✏️ Edit
                          </button>


                          <button
                            type="button"
                            class="delete-button delete-recap-button"
                            data-id="${row.id}"
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
  );


  container.innerHTML =
    html;

   /* ==========================================
   SIMPAN TRACKING BATCH
   ========================================== */

const batchTrackingButtons =
  container.querySelectorAll(
    ".save-batch-tracking-button"
  );


batchTrackingButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      async function () {

        const batchCode =
          this.dataset.batchCode;


        const select =
          container.querySelector(
            `.batch-tracking-select[data-batch-code="${CSS.escape(
              batchCode
            )}"]`
          );


        if (!select) {
          return;
        }


        const trackingStatus =
          select.value;


        this.disabled =
          true;

        this.textContent =
          "Menyimpan...";


        const {
          error
        } =
          await supabaseClient
            .from(
              "purchase_recap"
            )
            .update({
              batch_tracking_status:
                trackingStatus
            })
            .eq(
              "category",
              category
            )
            .eq(
              "batch_code",
              batchCode
            );


        if (error) {

          console.error(
            "ERROR UPDATE BATCH TRACKING:",
            error
          );


          alert(
            "Gagal menyimpan tracking batch: " +
            error.message
          );


          this.disabled =
            false;

          this.textContent =
            "💾 Simpan";

          return;

        }


        alert(
          "Tracking batch berhasil diperbarui."
        );


        await loadRecapList(
          category
        );

      }
    );

  }
);


  /* ==========================================
     SEARCH REKAP
     ========================================== */

  const searchInput =
    container.querySelector(
      "#recapSearchInput"
    );


  const resultInfo =
    container.querySelector(
      "#recapSearchResult"
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


        let matchCount =
          0;


        cards.forEach(
          function (card) {

            const text =
              card.dataset.search ||
              "";


            const matched =
              !keyword ||
              text.includes(
                keyword
              );


            card.style.display =
              matched
                ? ""
                : "none";


            if (matched) {
              matchCount++;
            }

          }
        );


        if (!keyword) {

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


  /* ==========================================
     TOMBOL EDIT
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
     TOMBOL HAPUS
     ========================================== */

  container
    .querySelectorAll(
      ".delete-recap-button"
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
                "Yakin ingin menghapus data Rekap GO ini?"
              )
            ) {

              return;

            }


            const {
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
                );


            if (error) {

              console.error(
                "ERROR DELETE RECAP:",
                error
              );


              alert(
                "Gagal menghapus data: " +
                error.message
              );

              return;

            }


            alert(
              "Data Rekap GO berhasil dihapus."
            );


            await loadRecapList(
              category
            );

          }
        );

      }
    );

}

/* ============================================
   BAGIAN 3
   LANJUTAN REKAP GO
   ============================================ */


/* ============================================
   SIMPAN DATA BATCH
   ============================================ */

async function saveBatchRecap(event) {

  event.preventDefault();


  /* ==========================================
     PESAN FORM
     ========================================== */

  const message =
    document.getElementById(
      "batchFormMessage"
    );


  if (message) {

    message.textContent =
      "Menyimpan batch...";

  }


  /* ==========================================
     DATA BATCH
     ========================================== */

  const category =
    document.getElementById(
      "batchCategory"
    ).value;


  const batchCode =
    document.getElementById(
      "batchCode"
    ).value.trim();


  const itemName =
    document.getElementById(
      "batchItemName"
    ).value.trim();


  const priceMode =
    document.getElementById(
      "batchPriceMode"
    ).value;


  const batchTracking =
    document.getElementById(
      "batchTrackingStatus"
    ).value;


  const batchCoDeadline =
    document.getElementById(
      "batchCoDeadline"
    ).value || null;


  /* ==========================================
     VALIDASI DATA BATCH
     ========================================== */

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


  /* ==========================================
     HARGA & DP BERSAMA
     KHUSUS MODE HARGA SAMA
     ========================================== */

  let commonPrice = 0;
  let commonDp = 0;


  if (
    priceMode === "same"
  ) {

    commonPrice =
      Number(
        document.getElementById(
          "batchCommonPrice"
        ).value
      ) || 0;


    commonDp =
      Number(
        document.getElementById(
          "batchCommonDp"
        ).value
      ) || 0;

  }


  /* ==========================================
     AMBIL SEMUA CUSTOMER
     ========================================== */

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


  /* ==========================================
     BENTUK DATA SETIAP CUSTOMER
     ========================================== */

  itemElements.forEach(
    function(item) {


      /* ======================================
         CUSTOMER
         ====================================== */

      const customer =
        item
          .querySelector(
            ".batch-customer"
          )
          .value
          .trim();


      /* ======================================
         VERSI / MEMBER
         ====================================== */

      const version =
        item
          .querySelector(
            ".batch-version"
          )
          .value
          .trim();


      /* ======================================
         QUANTITY
         ====================================== */

      const quantity =
        Number(
          item
            .querySelector(
              ".batch-quantity"
            )
            .value
        ) || 1;


      /* ======================================
         HARGA
         ====================================== */

      let price = 0;


      if (
        priceMode === "same"
      ) {

        /*
         * Harga sama untuk semua customer
         */

        price =
          commonPrice;

      }

      else {

        /*
         * Harga berbeda per customer
         */

        price =
          Number(
            item
              .querySelector(
                ".batch-price"
              )
              .value
          ) || 0;

      }


      /* ======================================
         DP
         ====================================== */

      let dp = 0;


      if (
        priceMode === "same"
      ) {

        /*
         * DP sama untuk semua customer
         */

        dp =
          commonDp;

      }

      else {

        /*
         * DP berbeda per customer
         */

        dp =
          Number(
            item
              .querySelector(
                ".batch-dp"
              )
              .value
          ) || 0;

      }


      /* ======================================
         STATUS DP
         SELALU PER CUSTOMER
         ====================================== */

      const dpStatus =
        item
          .querySelector(
            ".batch-dp-status"
          )
          .value;


      /* ======================================
         SISA PEMBAYARAN
         SELALU PER CUSTOMER
         ====================================== */

      const remaining =
        Number(
          item
            .querySelector(
              ".batch-remaining"
            )
            .value
        ) || 0;


      /* ======================================
         STATUS PEMBAYARAN
         SELALU PER CUSTOMER
         ====================================== */

      const paymentStatus =
        item
          .querySelector(
            ".batch-payment-status"
          )
          .value;


      /* ======================================
         CATATAN
         ====================================== */

      const note =
        item
          .querySelector(
            ".batch-note"
          )
          .value
          .trim();


      /* ======================================
         MASUKKAN KE RECORD
         ====================================== */

      records.push({

        category:
          category,

        batch_code:
          batchCode,

        item_name:
          itemName,

        customer_name:
          customer,

        version:
          version,

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
          batchTracking,

        batch_tracking_status:
          batchTracking,

        customer_status:
          "Belum Checkout Shopee",

        note:
          note,

        co_deadline:
          batchCoDeadline

      });

    }
  );


  /* ==========================================
     CEK CUSTOMER / MEMBER KOSONG
     ========================================== */

  const incomplete =
    records.find(
      function(record) {

        return (
          !record.customer_name ||
          !record.version
        );

      }
    );


  if (incomplete) {

    message.textContent =
      "Customer dan Versi / Member wajib diisi.";

    return;

  }


  /* ==========================================
     CEK DUPLIKAT MEMBER / VERSI
     DALAM SATU BATCH
     ========================================== */

  const versions =
    records
      .map(
        function(item) {

          return item.version
            .toLowerCase()
            .trim();

        }
      )
      .filter(
        function(value) {

          return value !== "";

        }
      );


  const duplicateVersion =
    versions.some(
      function(
        value,
        index
      ) {

        return (
          versions.indexOf(
            value
          ) !== index
        );

      }
    );


  if (duplicateVersion) {

    message.textContent =
      "Versi / member yang sama tidak boleh dimasukkan dua kali dalam batch yang sama.";

    return;

  }


  /* ==========================================
     CEK MEMBER / VERSI YANG SUDAH ADA
     ========================================== */

  const {
    data: existingData,
    error: existingError
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .select(
        "version"
      )
      .eq(
        "batch_code",
        batchCode
      );


  if (existingError) {

    console.error(
      "ERROR CHECK EXISTING BATCH:",
      existingError
    );


    message.textContent =
      "Gagal memeriksa batch: " +
      existingError.message;

    return;

  }


  const existingVersions =
    (existingData || [])
      .map(
        function(item) {

          return (
            item.version ||
            ""
          )
            .toLowerCase()
            .trim();

        }
      )
      .filter(
        function(value) {

          return value !== "";

        }
      );


  const conflict =
    records.find(
      function(record) {

        const version =
          record.version
            .toLowerCase()
            .trim();


        return (
          version &&
          existingVersions.includes(
            version
          )
        );

      }
    );


  if (conflict) {

    message.textContent =
      `Member / versi "${conflict.version}" sudah memiliki customer dalam batch ${batchCode}.`;

    return;

  }


  /* ==========================================
     SIMPAN SEMUA CUSTOMER SEKALIGUS
     ========================================== */

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
      "ERROR SAVE BATCH:",
      error
    );


    message.textContent =
      "Gagal menyimpan batch: " +
      error.message;

    return;

  }


  /* ==========================================
     BERHASIL
     ========================================== */

  message.textContent =
    "Batch berhasil disimpan. ♥";


  alert(
    "Batch berhasil disimpan."
  );


  document
    .getElementById(
      "recapFormContainer"
    )
    .innerHTML =
      "";


  await loadRecapList(
    category
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
   EDIT REKAP
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
      "ERROR LOAD RECAP FOR EDIT:",
      error
    );


    alert(
      "Gagal mengambil data: " +
      error.message
    );

    return;

  }


  const container =
    document.getElementById(
      "recapFormContainer"
    );


  if (!container) {
    return;
  }


  const trackingOptions =
    getTrackingOptions(
      data.category
    );


  container.innerHTML = `

    <div
      class="panel recap-form"
    >

      <h3>
        ✏️ Edit Rekap GO
      </h3>


      <form
        id="editRecapForm"
      >

        <label>
          Kategori
        </label>

        <input
          type="text"
          value="${escapeHTML(
            data.category ||
            ""
          )}"
          disabled
        >


        <label>
          Kode Batch
        </label>

        <input
          id="editBatchCode"
          type="text"
          value="${escapeHTML(
            data.batch_code ||
            ""
          )}"
          required
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
          required
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
          required
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
          required
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


        <label>
          Sisa Pembayaran
        </label>

        <input
          id="editRemaining"
          type="number"
          min="0"
          value="${
            data.remaining_amount ||
            0
          }"
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

        <label>
  Status Customer
</label>

<select
  id="editCustomerStatus"
>

  <option
    value="Belum Checkout Shopee"
    ${
      data.customer_status ===
      "Belum Checkout Shopee"
        ? "selected"
        : ""
    }
  >
    ⏳ Belum Checkout Shopee
  </option>

  <option
    value="Sudah Checkout Shopee"
    ${
      data.customer_status ===
      "Sudah Checkout Shopee"
        ? "selected"
        : ""
    }
  >
    🛒 Sudah Checkout Shopee
  </option>

  <option
    value="Sudah Menerima Barang"
    ${
      data.customer_status ===
      "Sudah Menerima Barang"
        ? "selected"
        : ""
    }
  >
    📦 Sudah Menerima Barang
  </option>

</select>

        <label>
          Catatan
        </label>

        <textarea
          id="editNote"
          rows="3"
        >${escapeHTML(
          data.note ||
          ""
        )}</textarea>


        <label>
          Batas CO
        </label>

        <input
          id="editCoDeadline"
          type="date"
          value="${
            data.co_deadline ||
            ""
          }"
        >


        <div
          class="form-actions"
        >

          <button
            type="submit"
            class="primary-button"
          >
            💾 Simpan Perubahan
          </button>


          <button
            type="button"
            id="cancelEditRecap"
          >
            Batal
          </button>

        </div>


        <p
          id="editRecapMessage"
          class="login-error"
        ></p>

      </form>

    </div>

  `;


  document
    .getElementById(
      "cancelEditRecap"
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
      "editRecapForm"
    )
    .addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const message =
          document.getElementById(
            "editRecapMessage"
          );


        message.textContent =
          "Menyimpan perubahan...";


        const updatedData = {

          batch_code:
            document
              .getElementById(
                "editBatchCode"
              )
              .value
              .trim(),

          item_name:
            document
              .getElementById(
                "editItemName"
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

          version:
            document
              .getElementById(
                "editVersion"
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
                  "editRemaining"
                )
                .value
            ) || 0,

          payment_status:
            document
              .getElementById(
                "editPaymentStatus"
              )
              .value,

          customer_status:
  document
    .getElementById(
      "editCustomerStatus"
    )
    .value,
           
          note:
            document
              .getElementById(
                "editNote"
              )
              .value
              .trim(),

          co_deadline:
            document
              .getElementById(
                "editCoDeadline"
              )
              .value ||
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
            "ERROR UPDATE RECAP:",
            error
          );


          message.textContent =
            "Gagal mengubah data: " +
            error.message;

          return;

        }


        alert(
          "Data Rekap GO berhasil diperbarui."
        );


        container.innerHTML =
          "";


        await loadRecapList(
          data.category
        );

      }
    );

}

/* ============================================
   BAGIAN 4
   PESANAN / PO
   ============================================ */


/* ============================================
   LOAD PESANAN
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


      <div
        id="poFormContainer"
      ></div>


      <div
        id="poListContainer"
      >

        <p>
          Memuat PO...
        </p>

      </div>

    </div>

  `;


  const addPOButton =
    document.getElementById(
      "addPOButton"
    );


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

function showPOForm(
  existingPO = null
) {

  const container =
    document.getElementById(
      "poFormContainer"
    );


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
        Array.isArray(
          po.list_data
        )
          ? po.list_data
          : JSON.parse(
              po.list_data
            );

    } catch (error) {

      console.error(
        "Gagal membaca list_data:",
        error
      );

      existingRows = [];

    }

  }


  container.innerHTML = `

    <div
      class="panel po-form-panel"
    >

      <div
        class="panel-header"
      >

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


      <form
        id="poForm"
      >

        <div
          class="form-grid"
        >


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

                  <div
                    style="margin-top:12px;"
                  >

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
                  po.po_type ===
                  "war"
                    ? "selected"
                    : ""
                }
              >
                War / Member
              </option>


              <option
                value="general"
                ${
                  po.po_type ===
                    "general" ||
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

          <div
            class="form-group"
          >

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

          <div
            class="form-group"
          >

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

          <div
            class="form-group"
          >

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

          <div
            class="form-group"
          >

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
              rows="5"
              placeholder="Tulis detail barang, ketentuan PO, catatan, dan informasi lainnya..."
            >${escapeHTML(
              po.description || ""
            )}</textarea>

          </div>


          <!-- LIST MEMBER -->

          <div
            class="form-group"
            style="grid-column:1 / -1;"
          >

            <label>
              List Member / Versi / Customer
            </label>


            <p
              style="
                margin-top:4px;
                margin-bottom:12px;
              "
            >

              Untuk tipe
              <strong>
                War / Member
              </strong>,
              setiap member dalam satu batch
              hanya dapat diberikan kepada
              satu customer.

            </p>


            <div
              id="poRowsContainer"
            ></div>


            <button
              type="button"
              class="primary-button"
              id="addPORowButton"
            >
              ＋ Tambah Member / Versi
            </button>

          </div>


        </div>


        <div
          class="form-actions"
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


  const rowsContainer =
    document.getElementById(
      "poRowsContainer"
    );


  let rowNumber = 0;


  function addPORow(
    rowData = {}
  ) {

    rowNumber++;


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "po-item-row";


    row.innerHTML = `

      <div
        class="po-row-header"
      >

        <strong>
          Item ${rowNumber}
        </strong>


        <button
          type="button"
          class="remove-po-row"
        >
          ✕ Hapus
        </button>

      </div>


      <div
        class="form-grid"
      >

        <div
          class="form-group"
        >

          <label>
            Member / Versi
          </label>


          <input
            type="text"
            class="po-row-member"
            placeholder="Contoh: Hyunsuk"
            value="${escapeHTML(
              rowData.member ||
              rowData.version ||
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
            type="text"
            class="po-row-customer"
            placeholder="Nama Customer"
            value="${escapeHTML(
              rowData.customer ||
              ""
            )}"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Qty
          </label>


          <input
            type="number"
            class="po-row-quantity"
            min="1"
            value="${
              rowData.quantity ||
              1
            }"
          >

        </div>


        <div
          class="form-group"
        >

          <label>
            Catatan
          </label>


          <input
            type="text"
            class="po-row-note"
            placeholder="Opsional"
            value="${escapeHTML(
              rowData.note ||
              ""
            )}"
          >

        </div>

      </div>

    `;


    rowsContainer.appendChild(
      row
    );


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


  if (
    existingRows.length > 0
  ) {

    existingRows.forEach(
      function (row) {

        addPORow(row);

      }
    );

  } else {

    addPORow();

  }


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


  document
    .getElementById(
      "poForm"
    )
    .addEventListener(
      "submit",
      function (event) {

        savePO(
          event,
          existingPO
        );

      }
    );

}


/* ============================================
   SIMPAN PO
   ============================================ */

async function savePO(
  event,
  existingPO = null
) {

  event.preventDefault();


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


  const description =
    document
      .getElementById(
        "poDescription"
      )
      .value
      .trim();


  if (!title) {

    message.textContent =
      "Judul PO wajib diisi.";

    return;

  }


  const rowElements =
    document.querySelectorAll(
      "#poRowsContainer .po-item-row"
    );


  const listData = [];


  rowElements.forEach(
    function (row) {

      const member =
        row
          .querySelector(
            ".po-row-member"
          )
          .value
          .trim();


      const customer =
        row
          .querySelector(
            ".po-row-customer"
          )
          .value
          .trim();


      const quantity =
        Number(
          row
            .querySelector(
              ".po-row-quantity"
            )
            .value
        ) || 1;


      const note =
        row
          .querySelector(
            ".po-row-note"
          )
          .value
          .trim();


      if (
        member ||
        customer
      ) {

        listData.push({

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
     CEK DUPLIKAT MEMBER
     UNTUK TIPE WAR
     ========================================== */

  if (
    poType ===
    "war"
  ) {

    const memberNames =
      listData
        .map(
          function (item) {

            return (
              item.member ||
              ""
            )
              .toLowerCase()
              .trim();

          }
        )
        .filter(
          function (value) {

            return value !== "";

          }
        );


    const duplicate =
      memberNames.some(
        function (
          value,
          index
        ) {

          return (
            memberNames.indexOf(
              value
            ) !== index
          );

        }
      );


    if (duplicate) {

      message.textContent =
        "Member yang sama tidak boleh dimasukkan dua kali dalam satu batch.";

      return;

    }

  }


  /* ==========================================
     FOTO
     ========================================== */

  let imageURL =
    existingPO?.image_url ||
    null;


  const imageInput =
    document.getElementById(
      "poImage"
    );


  const imageFile =
    imageInput?.files?.[0];


  if (imageFile) {

    if (
      !imageFile.type.startsWith(
        "image/"
      )
    ) {

      message.textContent =
        "File foto harus berupa gambar.";

      return;

    }


    const extension =
      imageFile.name
        .split(".")
        .pop()
        .toLowerCase();


    const fileName =
      `po-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;


    const filePath =
      fileName;


    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from(
          "po-images"
        )
        .upload(
          filePath,
          imageFile,
          {
            cacheControl:
              "3600",
            upsert:
              false
          }
        );


    if (uploadError) {

      console.error(
        "ERROR UPLOAD PO IMAGE:",
        uploadError
      );


      message.textContent =
        "Gagal upload foto PO: " +
        uploadError.message;

      return;

    }


    const {
      data: publicURLData
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
      publicURLData
        ?.publicUrl ||
      null;

  }


  const poData = {

    title:
      title,

    image_url:
      imageURL,

    po_type:
      poType,

    price_text:
      priceText,

    dp_text:
      dpText,

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
      description,

    list_data:
      listData,

    status:
      "active"

  };


  let result;


  if (
    existingPO
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


  if (result.error) {

    console.error(
      "ERROR SAVE PO:",
      result.error
    );


    message.textContent =
      "Gagal menyimpan PO: " +
      result.error.message;

    return;

  }


  alert(
    existingPO
      ? "PO berhasil diperbarui. ♥"
      : "PO berhasil dibuat. ♥"
  );


  document
    .getElementById(
      "poFormContainer"
    )
    .innerHTML =
      "";


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

    <div
      class="panel"
    >

      <p>
        Memuat daftar PO...
      </p>

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
        "created_at",
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

      <div
        class="panel"
      >

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

      <div
        class="panel"
      >

        <h3>
          Belum ada PO
        </h3>

        <p>
          Belum ada postingan PO.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div
      class="po-list"
    >

      ${data.map(
        function (po) {

          let listData = [];

          try {

            listData =
              Array.isArray(
                po.list_data
              )
                ? po.list_data
                : JSON.parse(
                    po.list_data ||
                    "[]"
                  );

          } catch (
            error
          ) {

            listData = [];

          }


          const statusText =
            po.status ===
            "active"
              ? "Aktif"
              : po.status ===
                "closed"
                ? "Ditutup"
                : "Selesai";


          const statusClass =
            po.status ===
            "active"
              ? "success"
              : po.status ===
                "closed"
                ? "warning"
                : "muted";


          return `

            <div
              class="panel po-card"
            >

              <div
                class="po-card-content"
              >


                ${
                  po.image_url
                    ? `

                      <div
                        class="po-card-image"
                      >

                        <img
                          src="${escapeHTML(
                            po.image_url
                          )}"
                          alt="${escapeHTML(
                            po.title ||
                            "Foto PO"
                          )}"
                        >

                      </div>

                    `
                    : ""

                }


                <div
                  class="po-card-info"
                >

                  <div
                    class="po-card-header"
                  >

                    <div>

                      <h3>
                        ${escapeHTML(
                          po.title ||
                          "Tanpa Judul"
                        )}
                      </h3>


                      <span
                        class="status-badge ${statusClass}"
                      >
                        ${statusText}
                      </span>

                    </div>


                    <div
                      class="po-card-actions"
                    >

                      <button
                        type="button"
                        class="edit-po-button"
                        data-id="${po.id}"
                      >
                        ✏️ Edit
                      </button>


                      <button
                        type="button"
                        class="delete-po-button"
                        data-id="${po.id}"
                      >
                        🗑️ Hapus
                      </button>

                    </div>

                  </div>


                  <div
                    class="po-meta"
                  >

                    ${
                      po.price_text
                        ? `
                          <div>
                            <strong>
                              Harga:
                            </strong>
                            ${escapeHTML(
                              po.price_text
                            )}
                          </div>
                        `
                        : ""
                    }


                    ${
                      po.dp_text
                        ? `
                          <div>
                            <strong>
                              DP:
                            </strong>
                            ${escapeHTML(
                              po.dp_text
                            )}
                          </div>
                        `
                        : ""
                    }


                    ${
                      po.close_date
                        ? `
                          <div>
                            <strong>
                              Batas PO:
                            </strong>
                            ${formatDateTime(
                              po.close_date
                            )}
                          </div>
                        `
                        : ""
                    }


                    ${
                      po.last_dp_date
                        ? `
                          <div>
                            <strong>
                              Batas DP:
                            </strong>
                            ${formatDateTime(
                              po.last_dp_date
                            )}
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

                          ${escapeHTML(
                            po.description
                          )}

                        </div>

                      `
                      : ""
                  }


                  ${
                    listData.length
                      ? `

                        <div
                          class="po-result-section"
                        >

                          <h4>
                            Hasil / Daftar Barang
                          </h4>


                          <div
                            class="product-table-wrapper"
                          >

                            <table
                              class="product-table"
                            >

                              <thead>

                                <tr>

                                  <th>
                                    Batch
                                  </th>

                                  <th>
                                    Member / Barang
                                  </th>

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

                                ${listData.map(
                                  function (
                                    item
                                  ) {

                                    return `

                                      <tr>

                                        <td>
                                          ${escapeHTML(
                                            item.batch ||
                                            "—"
                                          )}
                                        </td>

                                        <td>
                                          ${escapeHTML(
                                            item.member ||
                                            "—"
                                          )}
                                        </td>

                                        <td>
                                          ${escapeHTML(
                                            item.customer ||
                                            "—"
                                          )}
                                        </td>

                                        <td>
                                          ${
                                            item.quantity ||
                                            1
                                          }
                                        </td>

                                        <td>
                                          ${escapeHTML(
                                            item.note ||
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

                        </div>

                      `
                      : `

                        <div
                          class="po-empty-result"
                        >

                          Belum ada hasil war / daftar customer.

                        </div>

                      `
                  }

                </div>

              </div>

            </div>

          `;

        }
      ).join("")}

    </div>

  `;


  /* ==========================================
     EDIT PO
     ========================================== */

  container
    .querySelectorAll(
      ".edit-po-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          async function () {

            const id =
              this.dataset.id;


            await editPO(
              id
            );

          }
        );

      }
    );


  /* ==========================================
     DELETE PO
     ========================================== */

  container
    .querySelectorAll(
      ".delete-po-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          async function () {

            const id =
              this.dataset.id;


            await deletePO(
              id
            );

          }
        );

      }
    );

}


/* ============================================
   FORMAT TANGGAL & WAKTU
   ============================================ */

function formatDateTime(
  value
) {

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

    return "—";

  }


  return date.toLocaleString(
    "id-ID",
    {
      day:
        "2-digit",
      month:
        "2-digit",
      year:
        "numeric",
      hour:
        "2-digit",
      minute:
        "2-digit"
    }
  );

}

/* ============================================
   BAGIAN 6
   FINAL INITIALIZATION
   ============================================ */


/* ============================================
   INITIALIZATION
   ============================================ */

async function initializeAdmin() {

  console.log(
    "DEAR NADIYA ADMIN INITIALIZING..."
  );


  /* ------------------------------------------
     Cek session yang sudah ada
     ------------------------------------------ */

  await checkGoogleSession();

}


/* ============================================
   JALANKAN ADMIN
   ============================================ */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
  );

} else {

  initializeAdmin();

}


/* ============================================
   GLOBAL ERROR HANDLER
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
   AKHIR ADMIN.JS
   ============================================ */
