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

  const loginPage =
    document.getElementById(
      "loginPage"
    );

  const adminApp =
    document.getElementById(
      "adminApp"
    );


  if (loginPage) {
    loginPage.classList.add(
      "hidden"
    );

    loginPage.style.display =
      "none";
  }


  if (adminApp) {
    adminApp.classList.remove(
      "hidden"
    );

    adminApp.style.display =
      "block";
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


  const savedPage =
    localStorage.getItem(
      "dearNadiyaAdminPage"
    ) || "dashboard";


    showPage(
    savedPage
  );

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
      .refreshSession();


  if (error) {

    console.error(
      "SESSION REFRESH ERROR:",
      error
    );

    showLogin(
      "Sesi login sudah berakhir. Silakan login kembali."
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

         saveCurrentPODraft();

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


        /* SIMPAN HALAMAN TERAKHIR */

        localStorage.setItem(
          "dearNadiyaAdminPage",
          page
        );


        /* TAMPILKAN HALAMAN */

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
  "members"
) {
  loadMembers();
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

   if (
  page ===
  "co-report"
) {

  loadCOReport();

  return;

}

   if (
  page ===
  "co-archive"
) {
  loadCOArchive();
  return;
}

}


/* ============================================
   DASHBOARD
   ============================================ */

async function loadDashboard() {
  pageTitle.textContent = "Dashboard";

  pageContent.innerHTML = `
    <div class="dashboard-stats">
      <div class="stat-card">
        <p>Total Customer</p>
        <h2 id="dashboardTotalCustomer">—</h2>
      </div>

      <div class="stat-card">
        <p>Total GO Aktif</p>
        <h2 id="dashboardTotalGO">—</h2>
      </div>
    </div>

    <div class="welcome-card">
      <h3>💰 Customer Jatuh Tempo DP</h3>

      <div id="dashboardDpList">
        <p>Memuat data...</p>
      </div>
    </div>

    <div class="welcome-card">
      <h3>💳 Customer Jatuh Tempo Pelunasan</h3>

      <div id="dashboardPaymentList">
        <p>Memuat data...</p>
      </div>
    </div>

    <div class="welcome-card">
      <h3>🛒 Customer Mendekati Batas Akhir CO</h3>

      <div id="dashboardCoDeadlineList">
        <p>Memuat data...</p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await supabaseClient
      .from("purchase_recap")
      .select(`
        customer_name,
        batch_code,
        item_name,
        version,
        quantity,
        dp_amount,
        remaining_amount,
        dp_status,
        payment_status,
        customer_status,
batch_tracking_status,
dp_deadline,
payment_deadline,
co_deadline
      `);

    if (error) {
      console.error(
        "ERROR LOAD DASHBOARD:",
        error
      );

      document.getElementById(
        "dashboardDpList"
      ).innerHTML = `
        <p>Gagal memuat data.</p>
      `;

      document.getElementById(
        "dashboardPaymentList"
      ).innerHTML = `
        <p>Gagal memuat data.</p>
      `;

      document.getElementById(
        "dashboardCoDeadlineList"
      ).innerHTML = `
        <p>Gagal memuat data.</p>
      `;

      return;
    }

    const rows = data || [];


    /* =====================================
       HELPER
    ===================================== */

    function normalizeDate(value) {
      if (!value) return "";

      return String(value).substring(0, 10);
    }


    function getTodayISO() {
      const today = new Date();

      return `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`;
    }


    function getDateAfterDays(days) {
      const date = new Date();

      date.setHours(
        0,
        0,
        0,
        0
      );

      date.setDate(
        date.getDate() + days
      );

      return `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }


    function formatRupiah(value) {
      const number =
        Number(value) || 0;

      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
        }
      ).format(number);
    }


    const todayISO =
      getTodayISO();

    const h7ISO =
      getDateAfterDays(7);


    /* =====================================
       TOTAL CUSTOMER
    ===================================== */

    const uniqueCustomers =
      new Set(
        rows
          .map(row =>
            String(
              row.customer_name || ""
            ).trim()
          )
          .filter(Boolean)
      );

    document.getElementById(
      "dashboardTotalCustomer"
    ).textContent =
      uniqueCustomers.size;


    /* =====================================
       TOTAL GO AKTIF
    ===================================== */

    const activeGO =
  new Set(
    rows
      .filter(row => {
        const batchCode =
          String(
            row.batch_code || ""
          ).trim();

        const tracking =
          String(
            row.batch_tracking_status || ""
          ).trim();

        if (!batchCode) {
          return false;
        }

        return (
          tracking !==
          "Goods Arrive at Customer"
        );
      })
      .map(row =>
        String(
          row.batch_code || ""
        ).trim()
      )
      .filter(Boolean)
  );

document.getElementById(
  "dashboardTotalGO"
).textContent =
  activeGO.size;


    /* =====================================
       GROUP DATA PER CUSTOMER
    ===================================== */

    function groupCustomers(
      sourceRows
    ) {
      const grouped = {};

      sourceRows.forEach(row => {

        const customerName =
          String(
            row.customer_name || ""
          ).trim();

        if (!customerName) {
          return;
        }

        if (!grouped[customerName]) {
          grouped[customerName] = [];
        }

        grouped[customerName].push(row);
      });

      return grouped;
    }


    /* =====================================
       DP
       
       Muncul:
       - tepat pada deadline
       - atau setelah deadline jika belum lunas
       
       Tidak muncul sebelum deadline.
    ===================================== */

    const dpRows =
      rows.filter(row => {

        const deadline =
          normalizeDate(
            row.dp_deadline
          );

        const status =
          String(
            row.dp_status || ""
          ).trim();

        if (!deadline) {
          return false;
        }

        if (
          status === "paid"
        ) {
          return false;
        }

        return deadline <= todayISO;
      });


    const dpGrouped =
      groupCustomers(
        dpRows
      );


    const dpCustomerNames =
      Object.keys(
        dpGrouped
      );


    const dpList =
      document.getElementById(
        "dashboardDpList"
      );


    if (
      dpCustomerNames.length === 0
    ) {

      dpList.innerHTML = `
        <p>
          Tidak ada customer yang
          jatuh tempo DP hari ini.
        </p>
      `;

    } else {

      dpList.innerHTML =
        dpCustomerNames
          .map(customerName => {

            const customerRows =
              dpGrouped[
                customerName
              ];

            let totalDP = 0;

             const paymentHeader = `
  <div class="dashboard-payment-header">
    <span>Kode Batch</span>
    <span>Nama Barang</span>
    <span>Versi / Member</span>
    <span>Deadline</span>
    <span>Tagihan DP</span>
  </div>
`;

            const itemsHTML =
              customerRows
                .map(row => {

                  const dpAmount =
                    Number(
                      row.dp_amount
                    ) || 0;

                  totalDP +=
                    dpAmount;

                  return `
  <div class="dashboard-payment-item">

    <strong>
      ${row.batch_code || "—"}
    </strong>

    <span>
      ${row.item_name || "—"}
    </span>

    <span>
  ${row.version || "—"}
</span>

<span>
  ${
    row.dp_deadline
      ? String(row.dp_deadline).substring(0, 10)
      : "—"
  }
</span>

<span class="dashboard-payment-amount">
  ${formatRupiah(dpAmount)}
</span>
  </div>
`;
                })
                .join("");


            return `
              <div class="dashboard-customer-card">

                <h4>
                  ${customerName}
                </h4>

                ${paymentHeader}
${itemsHTML}
                <div class="dashboard-payment-total">
                  <strong>
                    Total Tagihan DP:
                  </strong>

                  <strong>
                    ${formatRupiah(
                      totalDP
                    )}
                  </strong>
                </div>

              </div>
            `;

          })
          .join("");
    }


    /* =====================================
       PELUNASAN
       
       Muncul:
       - tepat pada deadline
       - atau setelah deadline jika belum lunas
       
       Tidak muncul sebelum deadline.
    ===================================== */

    const paymentRows =
      rows.filter(row => {

        const deadline =
          normalizeDate(
            row.payment_deadline
          );

        const status =
          String(
            row.payment_status || ""
          ).trim();

        if (!deadline) {
          return false;
        }

        if (
          status === "paid"
        ) {
          return false;
        }

        return deadline <= todayISO;
      });


    const paymentGrouped =
      groupCustomers(
        paymentRows
      );


    const paymentCustomerNames =
      Object.keys(
        paymentGrouped
      );


    const paymentList =
      document.getElementById(
        "dashboardPaymentList"
      );


    if (
      paymentCustomerNames.length === 0
    ) {

      paymentList.innerHTML = `
        <p>
          Tidak ada customer yang
          jatuh tempo pelunasan hari ini.
        </p>
      `;

    } else {

      paymentList.innerHTML =
        paymentCustomerNames
          .map(customerName => {

            const customerRows =
              paymentGrouped[
                customerName
              ];

            let totalPayment = 0;

             const paymentHeader = `
  <div class="dashboard-payment-header">
    <span>Kode Batch</span>
    <span>Nama Barang</span>
    <span>Versi / Member</span>
    <span>Deadline</span>
    <span>Tagihan Pelunasan</span>
  </div>
`;

            const itemsHTML =
  customerRows
    .map(row => {

      const remaining =
        Number(
          row.remaining_amount
        ) || 0;

      totalPayment +=
        remaining;

      return `
  <div class="dashboard-payment-item">

    <strong>
      ${row.batch_code || "—"}
    </strong>

    <span>
      ${row.item_name || "—"}
    </span>

    <span>
      ${row.version || "—"}
    </span>

    <span>
      ${row.payment_deadline || "—"}
    </span>

    <span class="dashboard-payment-amount">
      ${formatRupiah(remaining)}
    </span>

  </div>
`;
                })
                .join("");


            return `
              <div class="dashboard-customer-card">

                <h4>
                  ${customerName}
                </h4>

                ${paymentHeader}
${itemsHTML}
                <div class="dashboard-payment-total">
                  <strong>
                    Total Tagihan Pelunasan:
                  </strong>

                  <strong>
                    ${formatRupiah(
                      totalPayment
                    )}
                  </strong>
                </div>

              </div>
            `;

          })
          .join("");
    }


    /* =====================================
   CO

   Muncul H-7 sampai deadline.

   Yang sudah checkout tidak muncul.
===================================== */

const coRows =
  rows.filter(row => {

    const customerName =
      String(
        row.customer_name || ""
      ).trim();

    const status =
      String(
        row.customer_status || ""
      ).trim();

    const deadline =
      normalizeDate(
        row.co_deadline
      );

    if (
      !customerName ||
      !deadline
    ) {
      return false;
    }

    if (
      status ===
      "Sudah Checkout Shopee"
    ) {
      return false;
    }

    return (
      deadline >= todayISO &&
      deadline <= h7ISO
    );
  });


const coCustomers = [
  ...new Map(
    coRows
      .map(row => {

        const name =
          String(
            row.customer_name || ""
          ).trim();

        const deadline =
          normalizeDate(
            row.co_deadline
          );

        if (
          !name ||
          !deadline
        ) {
          return null;
        }

        return [
          name,
          {
            name,
            deadline
          }
        ];

      })
      .filter(Boolean)
  ).values()
];


const coList =
  document.getElementById(
    "dashboardCoDeadlineList"
  );


if (
  coCustomers.length === 0
) {

  coList.innerHTML = `
    <p>
      Tidak ada customer yang
      mendekati batas akhir CO.
    </p>
  `;

} else {

  coList.innerHTML = `
    <div class="dashboard-co-list">

      <div class="dashboard-co-header">
        <span>Customer</span>
        <span>Deadline CO</span>
        <span>Hitung Mundur</span>
      </div>

      ${coCustomers
        .map(customer => `
          <div
            class="dashboard-co-item"
            data-co-deadline="${customer.deadline}"
          >

            <span class="dashboard-co-name">
              ${customer.name}
            </span>

            <span class="dashboard-co-deadline">
              ${customer.deadline}
            </span>

            <span class="dashboard-co-countdown">
              —
            </span>

          </div>
        `)
        .join("")
      }

    </div>
  `;
}

/* =====================================
   COUNTDOWN DEADLINE CO
===================================== */

function updateCODashboardCountdown() {

  document
    .querySelectorAll(
      ".dashboard-co-item"
    )
    .forEach(item => {

      const deadline =
        item.dataset.coDeadline;

      const countdown =
        item.querySelector(
          ".dashboard-co-countdown"
        );

      if (
        !deadline ||
        !countdown
      ) {
        return;
      }

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const target =
        new Date(
          deadline + "T00:00:00"
        );

      target.setHours(
        0,
        0,
        0,
        0
      );

      const diff =
        Math.ceil(
          (
            target - today
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );

      if (
        diff < 0
      ) {

        countdown.textContent =
          "🔴 CO sudah lewat";

      } else if (
        diff === 0
      ) {

        countdown.textContent =
          "⏳ Hari ini";

      } else if (
        diff === 1
      ) {

        countdown.textContent =
          "⏳ 1 hari lagi";

      } else {

        countdown.textContent =
          `⏳ ${diff} hari lagi`;

      }

    });
}


updateCODashboardCountdown();

setInterval(
  updateCODashboardCountdown,
  60 * 1000
);
     
  } catch (err) {

    console.error(
      "ERROR DASHBOARD:",
      err
    );

    const dpList =
      document.getElementById(
        "dashboardDpList"
      );

    const paymentList =
      document.getElementById(
        "dashboardPaymentList"
      );

    const coList =
      document.getElementById(
        "dashboardCoDeadlineList"
      );

    if (dpList) {
      dpList.innerHTML = `
        <p>Gagal memuat data.</p>
      `;
    }

    if (paymentList) {
      paymentList.innerHTML = `
        <p>Gagal memuat data.</p>
      `;
    }

    if (coList) {
      coList.innerHTML = `
        <p>Gagal memuat data.</p>
      `;
    }
  }
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


    <!-- =====================================
         PEMBAYARAN AKTIF
         ===================================== -->

    <div class="payment-section">

      <div class="payment-section-header">

        <h3>
          🟡 Pembayaran Aktif
        </h3>

        <p>
          Pembayaran yang belum diproses.
        </p>

      </div>


      <div id="paymentsContainer">

        <p>
          Memuat pembayaran...
        </p>

      </div>

    </div>


    <!-- =====================================
         ARSIP PEMBAYARAN
         ===================================== -->

    <div class="payment-section payment-archive-section">

      <div class="payment-section-header">

        <h3>
          📁 Arsip Pembayaran
        </h3>

        <p>
          Pembayaran yang sudah dikonfirmasi atau ditolak.
        </p>

      </div>


      <div id="paymentArchiveContainer">

        <p>
          Memuat arsip pembayaran...
        </p>

      </div>

    </div>

      </div>


    <!-- =====================================
         POPUP DETAIL PEMBAYARAN
         ===================================== -->

    <div
      id="paymentDetailModal"
      class="payment-detail-modal"
      style="display: none;"
    >

      <div class="payment-detail-overlay"></div>

      <div class="payment-detail-box">

        <div class="payment-detail-header">

          <h3>
            🔎 Detail Pembayaran
          </h3>

          <button
            type="button"
            id="closePaymentDetail"
            class="payment-detail-close"
          >
            ✕
          </button>

        </div>


        <div
          id="paymentDetailContent"
          class="payment-detail-content"
        >
        </div>


        <div class="payment-detail-footer">

          <button
            type="button"
            id="closePaymentDetailButton"
            class="payment-detail-close-button"
          >
            Tutup
          </button>

        </div>

      </div>

    </div>

  </div>

`;
     loadPaymentArchive();

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
    .eq(
      "status",
      "pending"
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
        class="primary-button detail-payment-button"
        data-id="${payment.id}"
      >
        🔎 Detail
      </button>


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
     TOMBOL DETAIL PEMBAYARAN
     ========================================== */

  container
    .querySelectorAll(
      ".detail-payment-button"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              this.dataset.id;

            const payment =
              data.find(
                function (item) {
                  return String(item.id) ===
                    String(id);
                }
              );

            if (!payment) {
              return;
            }

            alert(
              "Detail Pembayaran\n\n" +

              "Customer: " +
              (payment.customer_name || "—") +

              "\nWhatsApp: " +
              (payment.whatsapp_last4 || "—") +

              "\nKode Produk: " +
              (payment.product_code || "—") +

              "\nVersi: " +
              (payment.product_version || "—") +

              "\nNominal: " +
              formatRupiah(payment.amount) +

              "\nTanggal Transfer: " +
              (
                payment.payment_date
                  ? formatDate(payment.payment_date)
                  : "—"
              ) +

              "\nStatus: " +
              (payment.status || "—")
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

          await openPaymentAllocation(
            id
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
   ARSIP PEMBAYARAN
   ============================================ */

async function loadPaymentArchive() {

  const archiveContainer =
    document.getElementById(
      "paymentArchiveContainer"
    );

  if (!archiveContainer) {
    return;
  }


  archiveContainer.innerHTML = `
    <p>
      Memuat arsip pembayaran...
    </p>
  `;


  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "dn_payment_submissions"
      )
      .select("*")
      .in(
        "status",
        [
          "confirmed",
          "rejected"
        ]
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
      "ERROR LOAD PAYMENT ARCHIVE:",
      error
    );

    archiveContainer.innerHTML = `
      <div class="panel">

        <h3>
          Gagal memuat arsip pembayaran
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


  /* ==========================================
     TIDAK ADA ARSIP
     ========================================== */

  if (
    !data ||
    data.length === 0
  ) {

    archiveContainer.innerHTML = `
      <div class="payment-archive-empty">

        Belum ada arsip pembayaran.

      </div>
    `;

    return;
  }


  /* ==========================================
     TOMBOL ARSIP
     ========================================== */

  archiveContainer.innerHTML = `

    <button
      type="button"
      class="payment-archive-toggle"
      id="paymentArchiveToggle"
    >
      📁 Arsip
    </button>


    <div
      id="paymentArchiveContent"
      class="payment-archive-content"
      style="display: none;"
    >

<div class="payment-archive-filter">

  <input
    type="text"
    id="paymentArchiveSearch"
    placeholder="🔎 Cari customer / kode produk..."
    autocomplete="off"
  >


  <label for="paymentArchiveFilter">
    Status
  </label>

  <select id="paymentArchiveFilter">

    <option value="all">
      Semua
    </option>

    <option value="confirmed">
      ✅ Diterima
    </option>

    <option value="rejected">
      ❌ Ditolak
    </option>

  </select>

</div>

      <div class="product-table-wrapper">

        <table class="product-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Customer</th>

              <th>WhatsApp</th>

              <th>Kode Produk</th>

              <th>Versi</th>

              <th>Nominal</th>

              <th>Tanggal Transfer</th>

              <th>Bukti</th>

              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            ${data.map(
              function (
                payment
              ) {

                return `

                  <tr data-payment-status="${payment.status}">
                  
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
                              👁 Lihat Bukti
                            </button>
                          `
                          : "—"
                      }

                    </td>


                    <td>

                      ${
                        payment.status ===
                        "confirmed"

                          ? `
                            <span>
                              ✅ Diterima
                            </span>
                          `

                          : payment.status ===
                            "rejected"

                            ? `
                              <span>
                                ❌ Ditolak
                              </span>
                            `

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

    </div>

  `;


  /* ==========================================
     BUKA / TUTUP ARSIP
     ========================================== */

  const archiveToggle =
    document.getElementById(
      "paymentArchiveToggle"
    );

  const archiveContent =
    document.getElementById(
      "paymentArchiveContent"
    );


  if (
    archiveToggle &&
    archiveContent
  ) {

    archiveToggle.addEventListener(
      "click",
      function () {

        const isHidden =
          archiveContent.style.display ===
          "none";


        archiveContent.style.display =
          isHidden
            ? "block"
            : "none";


        archiveToggle.innerHTML =
          isHidden
            ? "📂 Tutup Arsip"
            : "📁 Arsip";

      }
    );

  }

   /* ==========================================
   FILTER & PENCARIAN ARSIP PEMBAYARAN
   ========================================== */

const archiveFilter =
  document.getElementById(
    "paymentArchiveFilter"
  );

const archiveSearch =
  document.getElementById(
    "paymentArchiveSearch"
  );


function filterPaymentArchive() {

  const selectedStatus =
    archiveFilter
      ? archiveFilter.value
      : "all";

  const searchText =
    archiveSearch
      ? archiveSearch.value
          .trim()
          .toLowerCase()
      : "";


  const rows =
    archiveContainer.querySelectorAll(
      "tbody tr[data-payment-status]"
    );


  rows.forEach(
    function (row) {

      const rowStatus =
        row.dataset.paymentStatus;


      const rowText =
        row.textContent
          .toLowerCase();


      const statusMatch =
        selectedStatus === "all" ||
        rowStatus ===
          selectedStatus;


      const searchMatch =
        !searchText ||
        rowText.includes(
          searchText
        );


      row.style.display =
        statusMatch &&
        searchMatch
          ? ""
          : "none";

    }
  );

}


if (archiveFilter) {

  archiveFilter.addEventListener(
    "change",
    filterPaymentArchive
  );

}


if (archiveSearch) {

  archiveSearch.addEventListener(
    "input",
    filterPaymentArchive
  );

}

  /* ==========================================
     TOMBOL LIHAT BUKTI
     ========================================== */

  archiveContainer
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

}

  /* ==========================================
     TOMBOL LIHAT BUKTI ARSIP
     ========================================== */
const archiveContainer =
    document.getElementById(
        "paymentArchiveContainer"
    );

if (archiveContainer) {

  archiveContainer
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

}

/* ============================================
   ALOKASI PEMBAYARAN
   ============================================ */

async function openPaymentAllocation(
  paymentId
) {

  /* ================================
     AMBIL DATA PEMBAYARAN
     ================================ */

  const {
    data: payment,
    error: paymentError
  } =
    await supabaseClient
      .from(
        "dn_payment_submissions"
      )
      .select("*")
      .eq(
        "id",
        paymentId
      )
      .single();


  if (paymentError) {

    console.error(
      "ERROR LOAD PAYMENT:",
      paymentError
    );

    alert(
      "Gagal mengambil data pembayaran: " +
      paymentError.message
    );

    return;

  }


  /* ================================
     PARSE BARANG
     ================================ */

  const productCodes =
    String(
      payment.product_code ||
      ""
    )
      .split(",")
      .map(function(value) {
        return value.trim();
      })
      .filter(Boolean);


  const productVersions =
    String(
      payment.product_version ||
      ""
    )
      .split(",")
      .map(function(value) {
        return value.trim();
      })
      .filter(Boolean);


  /* ================================
     AMBIL REKAP CUSTOMER
     ================================ */

  /* ================================
   AMBIL REKAP BARANG PEMBAYARAN
   ================================ */

const {
  data: recapData,
  error: recapError
} =
  await supabaseClient
    .from(
      "purchase_recap"
    )
    .select("*")
    .in(
      "batch_code",
      productCodes
    );

  if (recapError) {

    console.error(
      "ERROR LOAD RECAP FOR PAYMENT:",
      recapError
    );

    alert(
      "Gagal mengambil data barang: " +
      recapError.message
    );

    return;

  }


  /* ================================
     CARI BARANG YANG TERKAIT
     ================================ */

  const selectedItems = [];


  productCodes.forEach(
    function(
      productCode,
      index
    ) {

      const productVersion =
        productVersions[index] ||
        "";


      const item =
        (recapData || []).find(
          function(row) {

            const rowCode =
              String(
                row.batch_code ||
                row.product_code ||
                ""
              )
                .trim()
                .toLowerCase();


            const rowVersion =
              String(
                row.version ||
                row.product_version ||
                ""
              )
                .trim()
                .toLowerCase();


            return (
              rowCode ===
                productCode
                  .trim()
                  .toLowerCase()
              &&
              rowVersion ===
                productVersion
                  .trim()
                  .toLowerCase()
            );

          }
        );


      if (item) {

        selectedItems.push(
          item
        );

      }

    }
  );


  /* ================================
     MODAL
     ================================ */

  const oldModal =
    document.getElementById(
      "paymentAllocationModal"
    );


  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "paymentAllocationModal";


  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  `;


  const itemsHTML =
  selectedItems.length
    ? selectedItems
        .map(
          function(item) {

            const price =
              Number(
                item.item_price ||
                item.price ||
                0
              );

            const minimumDp =
  Number(
    item.minimum_dp_amount ||
    0
  );

const dpPaid =
  Number(
    item.dp_amount ||
    0
  );

const remaining =
  Number(
    item.remaining_amount ||
    0
  );

const total =
  minimumDp +
  remaining;
             
            return `
              <div
                class="payment-allocation-item"
                style="
                  border:1px solid var(--line);
                  border-radius:12px;
                  padding:14px;
                  margin-top:10px;
                  background:#fff;
                "
              >

                <div
                  style="
                    font-weight:700;
                    color:#604752;
                    margin-bottom:6px;
                  "
                >
                  ${escapeHTML(
                    item.item_name ||
                    item.product_name ||
                    "Barang"
                  )}
                </div>


                <div
                  style="
                    font-size:11px;
                    color:#888;
                    line-height:1.6;
                  "
                >
                  Batch:
                  ${escapeHTML(
                    item.batch_code ||
                    item.product_code ||
                    "—"
                  )}

                  <br>

                  Versi:
                  ${escapeHTML(
                    item.version ||
                    item.product_version ||
                    "—"
                  )}
                </div>


                <div
                  style="
                    margin-top:9px;
                    padding:9px 10px;
                    border-radius:9px;
                    background:#faf7f9;
                    font-size:11px;
                    color:#666;
                    line-height:1.7;
                  "
                >

                  Harga:
                  <strong>
                    ${formatRupiah(
                      price
                    )}
                  </strong>

                  <br>

                  DP:
<strong>
  ${formatRupiah(
    minimumDp
  )}
</strong>

<br>

DP Terbayar:
<strong>
  ${formatRupiah(
    dpPaid
  )}
</strong>

                  <br>

                  Sisa Pelunasan:
                  <strong>
                    ${formatRupiah(
                      remaining
                    )}
                  </strong>

                  <br>

                  Total:
                  <strong>
                    ${formatRupiah(
                      total
                    )}
                  </strong>

                </div>


                <!-- JENIS PEMBAYARAN -->

                <div
                  style="
                    margin-top:12px;
                  "
                >

                  <label
                    style="
                      display:block;
                      margin-bottom:5px;
                      font-size:11px;
                      font-weight:600;
                      color:#604752;
                    "
                  >
                    Bagian pembayaran
                  </label>

                  <select
  class="payment-allocation-part"
  data-recap-id="${item.id}"
  data-price="${price}"
  data-dp="${dpPaid}"
data-minimum-dp="${minimumDp}"
data-minimum-dp="${item.minimum_dp_amount || minimumDp}"
data-remaining="${remaining}"
  
                    style="
                      width:100%;
                      box-sizing:border-box;
                      padding:10px;
                      border:1px solid var(--line);
                      border-radius:9px;
                      background:#fff;
                      font-family:inherit;
                      font-size:12px;
                    "
                  >

                    <option
  value="dp"
  ${item.dp_status === "paid" ? "disabled" : ""}
>
  DP
  ${item.dp_status === "paid" ? "✓ Sudah Dibayar" : ""}
</option>
                    <option value="pelunasan">
                      Pelunasan
                    </option>

                    <option value="both">
                      DP + Pelunasan
                    </option>

                  </select>

                </div>


                <!-- NOMINAL -->

                <div
                  style="
                    margin-top:10px;
                  "
                >

                  <label
                    style="
                      display:block;
                      margin-bottom:5px;
                      font-size:11px;
                      font-weight:600;
                      color:#604752;
                    "
                  >
                    Nominal yang dialokasikan
                  </label>

                  <input
  type="number"
  min="0"
  step="1000"
  value="0"
  class="payment-allocation-input"
  data-recap-id="${item.id}"
  data-price="${price}"
  data-dp="${minimumDp}"
data-minimum-dp="${item.minimum_dp_amount || minimumDp}"
data-remaining="${remaining}"
  style="
    width:100%;
    box-sizing:border-box;
    padding:10px;
    border:1px solid var(--line);
    border-radius:9px;
    font-family:inherit;
    font-size:12px;
  "
>
                </div>


                <!-- STATUS -->

                <div
                  class="payment-allocation-status"
                  data-recap-id="${item.id}"
                  style="
                    margin-top:8px;
                    font-size:11px;
                    font-weight:600;
                    color:#999;
                  "
                >
                  ⚪ Belum dialokasikan
                </div>

              </div>
            `;

          }
        )
        .join("")
    : `
        <div
          style="
            padding:18px;
            text-align:center;
            color:#999;
            border:1px dashed var(--line);
            border-radius:12px;
          "
        >
          Barang pembayaran tidak ditemukan.
        </div>
      `;

  modal.innerHTML = `
    <div
      style="
        width:100%;
        max-width:560px;
        max-height:90vh;
        overflow-y:auto;
        background:#fff;
        border-radius:16px;
        padding:20px;
        box-sizing:border-box;
        box-shadow:0 20px 60px rgba(0,0,0,.18);
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:15px;
        "
      >

        <div>

          <div
            style="
              font-size:10px;
              color:#999;
              margin-bottom:4px;
            "
          >
            KONFIRMASI PEMBAYARAN
          </div>

          <h3
            style="
              margin:0;
              color:#604752;
            "
          >
            Pembayaran #${payment.id}
          </h3>

        </div>


        <button
          type="button"
          id="closePaymentAllocation"
          style="
            border:0;
            background:transparent;
            font-size:20px;
            cursor:pointer;
            color:#888;
          "
        >
          ×
        </button>

      </div>


      <div
        style="
          margin-top:15px;
          padding:12px;
          border-radius:10px;
          background:#fff8fb;
          font-size:12px;
          line-height:1.7;
        "
      >

        <strong>
          ${escapeHTML(
            payment.customer_name ||
            "—"
          )}
        </strong>

        <br>

        WhatsApp:
        ••••${escapeHTML(
          payment.whatsapp_last4 ||
          "—"
        )}

        <br>

        Jenis pembayaran:
        <strong>
          ${escapeHTML(
            payment.payment_type ||
            "—"
          )}
        </strong>

        <br>

        Total pembayaran dari customer:
<strong
  style="
    color:#8d526d;
    font-size:14px;
  "
>
  ${formatRupiah(
    payment.amount
  )}
</strong>

<br>

<div
  style="
    margin-top:10px;
  "
>
  <label
    style="
      display:block;
      margin-bottom:5px;
      font-size:11px;
      font-weight:600;
      color:#604752;
    "
  >
    Nominal pembayaran yang diterima Admin
  </label>

  <input
    type="number"
    id="paymentVerifiedAmount"
    min="0"
    step="1000"
    value="${Number(payment.verified_amount ?? payment.amount) || 0}"
    style="
      width:100%;
      box-sizing:border-box;
      padding:10px;
      border:1px solid var(--line);
      border-radius:9px;
      background:#fff;
      font-family:inherit;
      font-size:13px;
      font-weight:600;
    "
  >

  <div
    style="
      margin-top:5px;
      font-size:10px;
      color:#888;
      line-height:1.5;
    "
  >
    Nominal ini yang akan digunakan sebagai dasar alokasi pembayaran.
  </div>
</div>
      </div>


      <div
        style="
          margin-top:18px;
          font-size:12px;
          font-weight:700;
          color:#604752;
        "
      >
        Alokasi ke Barang
      </div>


      <div>
        ${itemsHTML}
      </div>


      <div
        style="
          margin-top:15px;
          padding:12px;
          border-top:1px solid var(--line);
          font-size:12px;
          line-height:1.8;
        "
      >

        Total pembayaran:
<strong id="paymentVerifiedDisplay">
  ${formatRupiah(
    Number(
      payment.verified_amount ?? payment.amount
    ) || 0
  )}
</strong>
        <br>

        Total alokasi:
        <strong
          id="paymentAllocationTotal"
        >
          Rp0
        </strong>

        <br>

        Sisa belum dialokasikan:
        <strong
          id="paymentAllocationRemaining"
        >
          ${formatRupiah(
            payment.amount
          )}
        </strong>

      </div>


      <div
        style="
          display:flex;
          justify-content:flex-end;
          gap:8px;
          margin-top:10px;
        "
      >

        <button
          type="button"
          id="cancelPaymentAllocation"
          class="delete-button"
        >
          Batal
        </button>


        <button
          type="button"
          id="savePaymentAllocation"
          class="primary-button"
        >
          Lanjutkan
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    modal
  );

   /* ================================
   STATUS ALOKASI PER BARANG
   ================================ */

function updateItemAllocationStatus(
  recapId
) {

  const select =
    modal.querySelector(
      `.payment-allocation-part[data-recap-id="${recapId}"]`
    );

  const input =
    modal.querySelector(
      `.payment-allocation-input[data-recap-id="${recapId}"]`
    );

  const status =
    modal.querySelector(
      `.payment-allocation-status[data-recap-id="${recapId}"]`
    );

  if (
    !select ||
    !input ||
    !status
  ) {
    return;
  }


  const price =
    Number(
      input.dataset.price
    ) || 0;


  const dp =
    Number(
      input.dataset.dp
    ) || 0;

   const minimumDp =
  Number(
    input.dataset.minimumDp ||
    input.dataset.dp
  ) || 0;
  const amount =
    Number(
      input.value
    ) || 0;


  let target = 0;


  /* ================================
     DP
     ================================ */

  if (
  select.value ===
  "dp"
) {

  target =
    minimumDp;
}

  /* ================================
     PELUNASAN
     ================================ */

  else if (
    select.value ===
    "pelunasan"
  ) {

    target =
      price -
      dp;

  }


  /* ================================
     DP + PELUNASAN
     ================================ */

  else if (
    select.value ===
    "both"
  ) {

    target =
      price;

  }


  /* ================================
     BELUM ADA NOMINAL
     ================================ */

  if (
    amount <= 0
  ) {

    status.textContent =
      "⚪ Belum dialokasikan";

    status.style.color =
      "#999";

    return;

  }


  /* ================================
     NOMINAL CUKUP
     ================================ */

  if (
    amount >= target &&
    target > 0
  ) {

    status.textContent =
      "✓ Lunas";

    status.style.color =
      "#2f8a57";

    return;

  }


  /* ================================
     NOMINAL KURANG
     ================================ */

  if (
  amount < target
) {

  const kurang =
    target -
    amount;

  if (
    select.value ===
    "dp"
  ) {

    status.textContent =
      "⚠ DP Belum Mencukupi • " +
      formatRupiah(
        kurang
      );

  } else {

    status.textContent =
      "⚠ Pembayaran Kurang • " +
      formatRupiah(
        kurang
      );
  }

  status.style.color =
    "#b06b00";

  return;
}

  status.textContent =
    "⚪ Belum dialokasikan";

  status.style.color =
    "#999";

}

  /* ================================
     HITUNG TOTAL ALOKASI
     ================================ */

  function updateAllocationTotal() {
  let total = 0;

  modal
    .querySelectorAll(
      ".payment-allocation-input"
    )
    .forEach(
      function(input) {
        total +=
          Number(
            input.value
          ) || 0;
      }
    );

  const verifiedAmountElement =
  document.getElementById(
    "paymentVerifiedAmount"
  );

const paymentAmount =
  verifiedAmountElement
    ? Number(
        verifiedAmountElement.value
      ) || 0
    : Number(
        payment.amount
      ) || 0;

     const paymentVerifiedDisplay =
  document.getElementById(
    "paymentVerifiedDisplay"
  );

if (paymentVerifiedDisplay) {
  paymentVerifiedDisplay.textContent =
    formatRupiah(
      paymentAmount
    );
}
     
  const remaining =
    paymentAmount -
    total;

  const totalElement =
    document.getElementById(
      "paymentAllocationTotal"
    );

  const remainingElement =
    document.getElementById(
      "paymentAllocationRemaining"
    );

  if (totalElement) {
    totalElement.textContent =
      formatRupiah(
        total
      );
  }

  if (remainingElement) {
    remainingElement.textContent =
      formatRupiah(
        remaining
      );

    remainingElement.style.color =
      remaining < 0
        ? "#c0392b"
        : "";
  }
}

modal
  .querySelectorAll(
    ".payment-allocation-part"
  )
  .forEach(
    function(select) {

      select.addEventListener(
        "change",
        function() {

          updateItemAllocationStatus(
            this.dataset.recapId
          );

        }
      );

    }
  );

   modal
  .querySelectorAll(
    ".payment-allocation-input"
  )
  .forEach(
    function(input) {

      input.addEventListener(
        "input",
        function() {

          updateItemAllocationStatus(
            this.dataset.recapId
          );

          updateAllocationTotal();

        }
      );

    }
  );
   
  /* ================================
     TUTUP MODAL
     ================================ */

  document
    .getElementById(
      "closePaymentAllocation"
    )
    ?.addEventListener(
      "click",
      function() {

        modal.remove();

      }
    );


  document
    .getElementById(
      "cancelPaymentAllocation"
    )
    ?.addEventListener(
      "click",
      function() {

        modal.remove();

      }
    );


  /* ================================
   TOMBOL LANJUT
   ================================ */

document
  .getElementById(
    "savePaymentAllocation"
  )
  ?.addEventListener(
    "click",
    async function() {

      console.log(
        "TOMBOL LANJUT DIKLIK"
      );

      alert(
        "Tombol Lanjutkan berhasil diklik."
      );
      const button = this;

      const verifiedAmountElement =
  document.getElementById(
    "paymentVerifiedAmount"
  );

const paymentAmount =
  verifiedAmountElement
    ? Number(
        verifiedAmountElement.value
      ) || 0
    : Number(
        payment.amount
      ) || 0;
      const inputs =
        modal.querySelectorAll(
          ".payment-allocation-input"
        );

      let totalAllocated = 0;

      const allocations = [];

      inputs.forEach(
        function(input) {

          const amount =
            Number(
              input.value
            ) || 0;

          if (amount <= 0) {
            return;
          }

          const recapId =
            input.dataset.recapId;

          const select =
            modal.querySelector(
              `.payment-allocation-part[data-recap-id="${recapId}"]`
            );

          const part =
            select
              ? select.value
              : "dp";

          const price =
            Number(
              input.dataset.price
            ) || 0;

          const dp =
            Number(
              input.dataset.dp
            ) || 0;

          let target = 0;

          if (
            part === "dp"
          ) {

            target =
              dp;

          } else if (
            part === "pelunasan"
          ) {

            target =
              price - dp;

          } else if (
            part === "both"
          ) {

            target =
              price;

          }

          const allocationStatus =
            amount >= target &&
            target > 0
              ? "lunas"
              : "pembayaran_kurang";

          totalAllocated +=
            amount;

          allocations.push({
            recap_id:
              recapId,
            allocated_amount:
              amount,
            payment_part:
              part,
            allocation_status:
              allocationStatus
          });

        }
      );


      /* ================================
         VALIDASI TOTAL
      ================================ */

      if (
        totalAllocated >
        paymentAmount
      ) {

        alert(
          "Total alokasi tidak boleh melebihi total pembayaran."
        );

        return;
      }


      if (
        allocations.length === 0
      ) {

        alert(
          "Silakan alokasikan nominal pembayaran ke minimal satu barang."
        );

        return;
      }


      /* ================================
         SIMPAN ALOKASI
      ================================ */

      button.disabled =
        true;

      button.textContent =
        "Menyimpan...";


      const allocationRows =
        allocations.map(
          function(item) {

            return {
              payment_submission_id:
                payment.id,

              recap_id:
                item.recap_id,

              allocated_amount:
                item.allocated_amount,

              payment_part:
                item.payment_part,

              allocation_status:
                item.allocation_status
            };

          }
        );


      const {
        error:
          allocationError
      } =
        await supabaseClient
          .from(
            "dn_payment_allocations"
          )
          .upsert(
            allocationRows,
            {
              onConflict:
                "payment_submission_id,recap_id"
            }
          );


      if (
        allocationError
      ) {

        console.error(
          "ERROR SAVE PAYMENT ALLOCATION:",
          allocationError
        );

        alert(
          "Gagal menyimpan alokasi pembayaran: " +
          allocationError.message
        );

        button.disabled =
          false;

        button.textContent =
          "Lanjutkan";

        return;
      }


      /* ================================
         UPDATE STATUS PEMBAYARAN
      ================================ */

      const {
        error:
          paymentError
      } =
        await supabaseClient
          .from(
            "dn_payment_submissions"
          )
          .update({
  status:
    "confirmed",
  verified_amount:
    paymentAmount
})
          .eq(
            "id",
            payment.id
          );


      if (
        paymentError
      ) {

        console.error(
          "ERROR CONFIRM PAYMENT:",
          paymentError
        );

        alert(
          "Alokasi tersimpan, tetapi pembayaran gagal dikonfirmasi: " +
          paymentError.message
        );

        button.disabled =
          false;

        button.textContent =
          "Lanjutkan";

        return;
      }


      /* ================================
   UPDATE REKAP GO
   DP KUMULATIF
================================ */

const processedRecapIds =
  new Set();

for (
  const allocation
  of allocations
) {

  if (
    processedRecapIds.has(
      allocation.recap_id
    )
  ) {
    continue;
  }

  processedRecapIds.add(
    allocation.recap_id
  );


  /* ================================
     AMBIL DATA REKAP TERBARU
  ================================ */

  const {
    data: recapItem,
    error: recapFetchError
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .select(
        "id, item_price, dp_amount, minimum_dp_amount, remaining_amount, dp_status, payment_status"
      )
      .eq(
        "id",
        allocation.recap_id
      )
      .single();


  if (
    recapFetchError ||
    !recapItem
  ) {

    console.error(
      "ERROR FETCH RECAP:",
      recapFetchError
    );

    alert(
      "Pembayaran sudah dikonfirmasi, tetapi data Rekap GO gagal dibaca: " +
      (
        recapFetchError?.message ||
        "Data tidak ditemukan."
      )
    );

    button.disabled =
      false;

    button.textContent =
      "Lanjutkan";

    return;
  }


  /* ================================
     AMBIL SEMUA RIWAYAT ALOKASI
  ================================ */

  const {
    data: historyAllocations,
    error: historyError
  } =
    await supabaseClient
      .from(
        "dn_payment_allocations"
      )
      .select(
        "allocated_amount, payment_part, allocation_status, created_at"
      )
      .eq(
        "recap_id",
        allocation.recap_id
      )
      .order(
        "created_at",
        {
          ascending: true
        }
      );


  if (
    historyError
  ) {

    console.error(
      "ERROR FETCH PAYMENT HISTORY:",
      historyError
    );

    alert(
      "Pembayaran sudah dikonfirmasi, tetapi riwayat alokasi gagal dibaca: " +
      historyError.message
    );

    button.disabled =
      false;

    button.textContent =
      "Lanjutkan";

    return;
  }


  /* ================================
     HITUNG DP KUMULATIF
  ================================ */

  const minimumDp =
    Number(
      recapItem.minimum_dp_amount
    ) || 0;

  const price =
    Number(
      recapItem.item_price
    ) || 0;

  let totalDpPaid =
    0;

  let totalPelunasanPaid =
    0;


  (
    historyAllocations ||
    []
  ).forEach(
    function(history) {

      const amount =
        Number(
          history.allocated_amount
        ) || 0;

      if (
        amount <= 0
      ) {
        return;
      }


      /* ==========================
         DP
      ========================== */

      if (
        history.payment_part ===
        "dp"
      ) {

        totalDpPaid +=
          amount;

        return;
      }


      /* ==========================
         PELUNASAN
      ========================== */

      if (
        history.payment_part ===
        "pelunasan"
      ) {

        totalPelunasanPaid +=
          amount;

        return;
      }


      /* ==========================
         DP + PELUNASAN
      ========================== */

      if (
        history.payment_part ===
        "both"
      ) {

        const dpNeeded =
          Math.max(
            minimumDp -
            totalDpPaid,
            0
          );

        const dpPortion =
          Math.min(
            amount,
            dpNeeded
          );

        const pelunasanPortion =
          Math.max(
            amount -
            dpPortion,
            0
          );

        totalDpPaid +=
          dpPortion;

        totalPelunasanPaid +=
          pelunasanPortion;
      }

    }
  );


  /* ================================
     STATUS DP
  ================================ */

  let dpStatus =
    "unpaid";

  if (
    totalDpPaid > 0
  ) {

    if (
      minimumDp <= 0 ||
      totalDpPaid >= minimumDp
    ) {

      dpStatus =
        "paid";

    } else {

      dpStatus =
        "insufficient";

    }

  }


  /* ================================
     HITUNG SISA PELUNASAN
  ================================ */

  let remainingAmount =
    0;

  if (
    dpStatus ===
    "paid"
  ) {

    remainingAmount =
      Math.max(
        price -
        totalDpPaid -
        totalPelunasanPaid,
        0
      );

  }


  /* ================================
     STATUS PELUNASAN
  ================================ */

  const paymentStatus =
    dpStatus === "paid" &&
    remainingAmount <= 0 &&
    price > 0
      ? "paid"
      : "unpaid";


  /* ================================
     UPDATE PURCHASE RECAP
  ================================ */

  const {
    error: recapUpdateError
  } =
    await supabaseClient
      .from(
        "purchase_recap"
      )
      .update({

        dp_amount:
          totalDpPaid,

        dp_status:
          dpStatus,

        remaining_amount:
          remainingAmount,

        payment_status:
          paymentStatus

      })
      .eq(
        "id",
        allocation.recap_id
      );


  if (
    recapUpdateError
  ) {

    console.error(
      "ERROR UPDATE RECAP:",
      recapUpdateError
    );

    alert(
      "Pembayaran sudah dikonfirmasi, tetapi Rekap GO gagal diperbarui: " +
      recapUpdateError.message
    );

    button.disabled =
      false;

    button.textContent =
      "Lanjutkan";

    return;
  }

}

      /* ================================
         SELESAI
      ================================ */

      alert(
        "Pembayaran berhasil dikonfirmasi dan alokasi pembayaran tersimpan. ♥"
      );


      modal.remove();


      if (
        typeof loadPayments ===
        "function"
      ) {

        await loadPayments();

      }

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

  /* ==========================================
     1. AMBIL DATA PEMBAYARAN
     ========================================== */

  const {
    data: payment,
    error: paymentFetchError
  } =
    await supabaseClient
      .from("dn_payment_submissions")
      .select("*")
      .eq("id", id)
      .single();


  if (paymentFetchError) {

    console.error(
      "ERROR GET PAYMENT:",
      paymentFetchError
    );

    alert(
      "Gagal mengambil data pembayaran: " +
      paymentFetchError.message
    );

    return;

  }


  /* ==========================================
     2. UPDATE STATUS PEMBAYARAN
     ========================================== */

  const {
    error: paymentUpdateError
  } =
    await supabaseClient
      .from("dn_payment_submissions")
      .update({
        status: newStatus
      })
      .eq("id", id);


  if (paymentUpdateError) {

    console.error(
      "ERROR UPDATE PAYMENT:",
      paymentUpdateError
    );

    alert(
      "Gagal mengubah status pembayaran: " +
      paymentUpdateError.message
    );

    return;

  }


  /* ==========================================
     3. JIKA DITOLAK
     ========================================== */

  if (
    newStatus === "rejected"
  ) {

    alert(
      "Pembayaran ditolak."
    );

    await loadPayments();

    return;

  }


  /* ==========================================
     4. JIKA DIKONFIRMASI
     CARI REKAP GO
     ========================================== */

  if (
    newStatus === "confirmed"
  ) {

   const productCodes = payment.product_code
  .split(",")
  .map(code => code.trim())
  .filter(Boolean);

const productVersions = payment.product_version
  .split(",")
  .map(version => version.trim())
  .filter(Boolean);

let recapRows = [];
let recapFetchError = null;

for (let i = 0; i < productCodes.length; i++) {

  const code = productCodes[i];
  const version = productVersions[i] || "";

  const {
    data,
    error
  } = await supabaseClient
    .from("purchase_recap")
    .select("*")
    .ilike(
  "customer_name",
  `${payment.customer_name}%`
)
    .ilike(
      "batch_code",
      code
    )
    .ilike(
  "version",
  version
);
   
  if (error) {
    recapFetchError = error;
    break;
  }

  if (data && data.length > 0) {
    recapRows.push(...data);
  }
}
console.log(
  "HASIL CARI REKAP CUSTOMER + BATCH:",
  recapRows
);
     
     console.log("DATA PEMBAYARAN:", {
  customer_name: payment.customer_name,
  product_code: payment.product_code,
  product_version: payment.product_version,
  payment_type: payment.payment_type
});

console.log("HASIL CARI REKAP:", recapRows);

    if (recapFetchError) {

      console.error(
        "ERROR FIND RECAP:",
        recapFetchError
      );

      alert(
        "Pembayaran berhasil dikonfirmasi, tetapi Rekap GO gagal diperbarui: " +
        recapFetchError.message
      );

      await loadPayments();

      return;

    }


    /* ========================================
       5. CEK APAKAH REKAP DITEMUKAN
       ======================================== */

    if (
      !recapRows ||
      recapRows.length === 0
    ) {

      alert(
        "Pembayaran berhasil dikonfirmasi, tetapi data Rekap GO yang sesuai tidak ditemukan."
      );

      await loadPayments();

      return;

    }

    /* ========================================
       8. SELESAI
       ======================================== */

    alert(
      "Pembayaran berhasil dikonfirmasi dan Rekap GO berhasil diperbarui."
    );

  }


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
   LAPORAN CO
   ============================================ */

async function loadCOReport() {

  pageTitle.textContent =
    "Laporan CO";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            🛒 Laporan CO
          </h2>

          <p>
            Customer yang sudah Checkout Shopee
            dan belum dikonfirmasi packing.
          </p>

        </div>

      </div>


      <div class="dashboard-stats">

        <div class="stat-card">

          <p>
            🛒 Total Customer Sudah CO & Belum Dikonfirmasi Packing
          </p>

          <h2 id="coReportTotal">
            —
          </h2>

        </div>

      </div>


      <div
        id="coReportContainer"
        class="welcome-card"
      >

        <p>
          Memuat data...
        </p>

      </div>

    </div>

  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select(`
          id,
          customer_name,
          customer_status,
          packing_status,
          batch_code,
          item_name,
          version,
          quantity,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: true
          }
        );


    if (error) {

      console.error(
        "ERROR LOAD CO REPORT:",
        error
      );

      document.getElementById(
        "coReportContainer"
      ).innerHTML = `
        <p>
          Gagal memuat laporan CO.
        </p>
      `;

      return;

    }


    const rows =
      data || [];


    /*
      Hanya ambil barang yang:

      1. Sudah Checkout Shopee
      2. Belum dikonfirmasi packing
    */

    const coRows =
      rows.filter(
        function(row) {

          const customerName =
            String(
              row.customer_name || ""
            ).trim();

          const customerStatus =
            String(
              row.customer_status || ""
            ).trim();

          const packingStatus =
            String(
              row.packing_status || ""
            ).trim();


          return (
            customerName &&
            customerStatus ===
              "Sudah Checkout Shopee" &&
            packingStatus !==
              "Sudah Dikonfirmasi"
          );

        }
      );


    /*
      KELOMPOKKAN BERDASARKAN CUSTOMER
    */

    const customerGroups = {};


    coRows.forEach(
      function(row) {

        const customerName =
          String(
            row.customer_name || ""
          ).trim();


        if (
          !customerGroups[
            customerName
          ]
        ) {

          customerGroups[
            customerName
          ] = [];

        }


        customerGroups[
          customerName
        ].push(
          row
        );

      }
    );


    /*
      URUTKAN CUSTOMER BERDASARKAN
      DATA YANG PERTAMA KALI MASUK
    */

    const customerList =
      Object.keys(
        customerGroups
      ).map(
        function(customerName) {

          const items =
            customerGroups[
              customerName
            ];

          const firstItem =
            items.reduce(
              function(first, item) {

                if (!first) {
                  return item;
                }

                if (
                  new Date(
                    item.created_at
                  ) <
                  new Date(
                    first.created_at
                  )
                ) {
                  return item;
                }

                return first;

              },
              null
            );


          return {
            customerName:
              customerName,

            items:
              items,

            firstCreatedAt:
              firstItem
                ? firstItem.created_at
                : null
          };

        }
      );


    customerList.sort(
      function(a, b) {

        const dateA =
          a.firstCreatedAt
            ? new Date(
                a.firstCreatedAt
              ).getTime()
            : Infinity;

        const dateB =
          b.firstCreatedAt
            ? new Date(
                b.firstCreatedAt
              ).getTime()
            : Infinity;


        return dateA - dateB;

      }
    );


    /*
      TOTAL CUSTOMER
    */

    const totalElement =
      document.getElementById(
        "coReportTotal"
      );


    if (totalElement) {

      totalElement.textContent =
        customerList.length;

    }


    const container =
      document.getElementById(
        "coReportContainer"
      );


    /*
      TIDAK ADA CUSTOMER
    */

    if (
      customerList.length === 0
    ) {

      container.innerHTML = `
        <p>
          Tidak ada customer yang
          menunggu konfirmasi packing.
        </p>
      `;

      return;

    }


    /*
      TAMPILKAN DAFTAR CUSTOMER
    */

    function renderCustomerList() {

      container.innerHTML = `

        <h3>
          🛒 Customer Menunggu Packing
        </h3>

        <p>
          ${customerList.length}
          customer sudah CO dan belum
          dikonfirmasi packing.
        </p>


        <div
          style="
            margin-top:20px;
            display:flex;
            flex-direction:column;
            gap:10px;
          "
        >

          ${customerList
            .map(
              function(customer, index) {

                return `

                  <button
                    type="button"
                    class="co-customer-button"
                    data-customer-index="${index}"
                    style="
                      width:100%;
                      text-align:left;
                      padding:14px 16px;
                      border:1px solid #eee;
                      border-radius:10px;
                      background:#fff;
                      cursor:pointer;
                      display:flex;
                      align-items:center;
                      justify-content:space-between;
                      gap:15px;
                    "
                  >

                    <div
                      style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        min-width:0;
                      "
                    >

                      <strong
                        style="
                          min-width:28px;
                        "
                      >
                        ${index + 1}.
                      </strong>

                      <strong>
                        ${customer.customerName}
                      </strong>

                    </div>


                    <span
                      style="
                        font-size:12px;
                        color:#777;
                        white-space:nowrap;
                      "
                    >
                      ${customer.items.length}
                      barang →
                    </span>

                  </button>

                `;

              }
            )
            .join("")}

        </div>

      `;


      /*
        EVENT PILIH CUSTOMER
      */

      container
        .querySelectorAll(
          ".co-customer-button"
        )
        .forEach(
          function(button) {

            button.addEventListener(
              "click",
              function() {

                const index =
                  Number(
                    this.dataset.customerIndex
                  );

                const customer =
                  customerList[
                    index
                  ];


                renderCustomerDetail(
                  customer
                );

              }
            );

          }
        );

    }


    /*
      DETAIL CUSTOMER
    */

    function renderCustomerDetail(
      customer
    ) {

      const customerItems =
        customer.items;


      container.innerHTML = `

        <div
          style="
            margin-bottom:18px;
          "
        >

          <button
            type="button"
            id="coBackToCustomers"
            style="
              border:none;
              background:none;
              padding:0;
              cursor:pointer;
              font-size:14px;
              font-weight:600;
            "
          >
            ← Kembali ke Daftar Customer
          </button>

        </div>


        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:15px;
            margin-bottom:18px;
          "
        >

          <div>

            <h3
              style="
                margin:0 0 5px 0;
              "
            >
              ${customer.customerName}
            </h3>

            <p
              style="
                margin:0;
                color:#777;
              "
            >
              ${customerItems.length}
              barang sudah CO
            </p>

          </div>


          <label
            style="
              display:flex;
              align-items:center;
              gap:7px;
              cursor:pointer;
              font-size:13px;
              font-weight:600;
              white-space:nowrap;
            "
          >

            <input
              type="checkbox"
              id="coCheckAll"
            >

            Konfirmasi Semua

          </label>

        </div>


        <div
          style="
            display:flex;
            flex-direction:column;
            gap:10px;
          "
        >

          ${customerItems
            .map(
              function(item) {

                return `

                  <label
                    style="
                      display:flex;
                      align-items:flex-start;
                      gap:10px;
                      padding:12px;
                      border:1px solid #eee;
                      border-radius:9px;
                      background:#fafafa;
                      cursor:pointer;
                    "
                  >

                    <input
                      type="checkbox"
                      class="co-item-checkbox"
                      data-recap-id="${item.id}"
                      style="
                        margin-top:3px;
                      "
                    >


                    <div
                      style="
                        display:flex;
                        flex-direction:column;
                        gap:3px;
                        min-width:0;
                      "
                    >

                      <strong>
                        ${item.item_name || "-"}
                      </strong>


                      <span
                        style="
                          font-size:12px;
                          color:#777;
                        "
                      >
                        Batch:
                        ${item.batch_code || "-"}
                        ${
                          item.version
                            ? ` • ${item.version}`
                            : ""
                        }
                        ${
                          item.quantity
                            ? ` • Qty ${item.quantity}`
                            : ""
                        }
                      </span>


                      <span
                        style="
                          font-size:12px;
                          color:#b06b00;
                        "
                      >
                        ⏳ Belum Dikonfirmasi
                      </span>

                    </div>

                  </label>

                `;

              }
            )
            .join("")}

                </div>


        <div
  style="
    margin-top:18px;
    display:flex;
    justify-content:flex-end;
    gap:10px;
    flex-wrap:wrap;
  "
>

  <button
    type="button"
    id="coConfirmPackingButton"
    class="btn-primary"
  >
    ✓ Konfirmasi Pesanan
  </button>


  <button
    type="button"
    id="coRejectPackingButton"
    style="
      border:1px solid #d66;
      background:#fff;
      color:#b33;
      padding:10px 15px;
      border-radius:8px;
      cursor:pointer;
      font-weight:600;
    "
  >
    ✕ Tidak Dikonfirmasi
  </button>

</div>
      `;

                   /*
        PROSES HASIL PACKING
      */

      async function processPackingResult(
        result
      ) {

        const selectedCheckboxes =
          Array.from(
            container.querySelectorAll(
              ".co-item-checkbox:checked"
            )
          );


        /*
          Tidak ada barang dipilih
        */

        if (
          selectedCheckboxes.length === 0
        ) {

          alert(
            "Pilih minimal satu barang terlebih dahulu."
          );

          return;

        }


        /*
          Ambil ID barang
        */

        const recapIds =
          selectedCheckboxes
            .map(
              function(checkbox) {

                return Number(
                  checkbox.dataset.recapId
                );

              }
            )
            .filter(
              function(id) {

                return Number.isFinite(
                  id
                );

              }
            );


        if (
          recapIds.length === 0
        ) {

          alert(
            "Data barang tidak ditemukan."
          );

          return;

        }


        /*
          Konfirmasi tindakan
        */

        let confirmationMessage;


        if (
          result ===
          "Dikonfirmasi"
        ) {

          confirmationMessage =
            "Konfirmasi " +
            recapIds.length +
            " barang sebagai pesanan yang siap dipacking?";

        } else {

          confirmationMessage =
            "Tandai " +
            recapIds.length +
            " barang sebagai TIDAK DIKONFIRMASI?";

        }


        const confirmed =
          confirm(
            confirmationMessage
          );


        if (!confirmed) {

          return;

        }


        /*
          Panggil RPC
        */

        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "process_checkout_packing",
            {
              p_recap_ids:
                recapIds,

              p_result:
                result
            }
          );


        if (error) {

          console.error(
            "ERROR PROCESS PACKING:",
            error
          );

          alert(
            "Gagal memproses hasil packing."
          );

          return;

        }


        /*
          Berhasil
        */

        if (
          result ===
          "Dikonfirmasi"
        ) {

          alert(
            "Berhasil mengonfirmasi " +
            recapIds.length +
            " barang."
          );

        } else {

          alert(
            "Berhasil menyimpan " +
            recapIds.length +
            " barang sebagai tidak dikonfirmasi."
          );

        }


        /*
          Kembali ke laporan CO
          agar total dan daftar
          langsung diperbarui
        */

        loadCOReport();

      }


      /*
        TOMBOL KONFIRMASI
      */

      const confirmPackingButton =
        document.getElementById(
          "coConfirmPackingButton"
        );


      if (
        confirmPackingButton
      ) {

        confirmPackingButton.addEventListener(
          "click",
          function() {

            processPackingResult(
              "Dikonfirmasi"
            );

          }
        );

      }


      /*
        TOMBOL TIDAK DIKONFIRMASI
      */

      const rejectPackingButton =
        document.getElementById(
          "coRejectPackingButton"
        );


      if (
        rejectPackingButton
      ) {

        rejectPackingButton.addEventListener(
          "click",
          function() {

            processPackingResult(
              "Tidak Dikonfirmasi"
            );

          }
        );

      }
       
      /*
        KEMBALI KE DAFTAR CUSTOMER
      */

      const backButton =
        document.getElementById(
          "coBackToCustomers"
        );


      if (backButton) {

        backButton.addEventListener(
          "click",
          function() {

            renderCustomerList();

          }
        );

      }


      /*
        KONFIRMASI SEMUA
        BARU MENGUBAH CHECKBOX,
        BELUM MENGUBAH DATABASE
      */

      const checkAll =
        document.getElementById(
          "coCheckAll"
        );


      if (checkAll) {

        checkAll.addEventListener(
          "change",
          function() {

            container
              .querySelectorAll(
                ".co-item-checkbox"
              )
              .forEach(
                function(itemCheckbox) {

                  itemCheckbox.checked =
                    checkAll.checked;

                }
              );

          }
        );

      }

    }


    /*
      TAMPILKAN DAFTAR CUSTOMER
    */

    renderCustomerList();


  } catch (err) {

    console.error(
      "ERROR CO REPORT:",
      err
    );

  }

}

/* ============================================
   ARSIP CO TIDAK DIKONFIRMASI
   ============================================ */

async function loadCOArchive() {

  pageTitle.textContent =
    "Arsip CO";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            📦 Arsip CO Tidak Dikonfirmasi
          </h2>

          <p>
            Riwayat barang yang pernah CO
            tetapi tidak dikonfirmasi packing.
          </p>

        </div>

      </div>


      <div
        id="coArchiveContainer"
        class="welcome-card"
      >

        <p>
          Memuat arsip...
        </p>

      </div>

    </div>

  `;


  try {

    /*
      AMBIL HISTORI CO
    */

    const {
      data: historyData,
      error: historyError
    } =
      await supabaseClient
        .from("checkout_history")
        .select(`
          id,
          recap_id,
          customer_name,
          checkout_at,
          checkout_result,
          created_at
        `)
        .eq(
          "checkout_result",
          "Tidak Dikonfirmasi"
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (historyError) {

      console.error(
        "ERROR LOAD CO ARCHIVE:",
        historyError
      );

      document.getElementById(
        "coArchiveContainer"
      ).innerHTML = `
        <p>
          Gagal memuat arsip CO.
        </p>
      `;

      return;

    }


    const historyRows =
      historyData || [];


    const container =
      document.getElementById(
        "coArchiveContainer"
      );


    /*
      TIDAK ADA ARSIP
    */

    if (
      historyRows.length === 0
    ) {

      container.innerHTML = `
        <p>
          Belum ada arsip CO yang
          tidak dikonfirmasi.
        </p>
      `;

      return;

    }


    /*
      AMBIL RECAP ID
    */

    const recapIds =
      Array.from(
        new Set(
          historyRows
            .map(
              function(row) {

                return Number(
                  row.recap_id
                );

              }
            )
            .filter(
              function(id) {

                return Number.isFinite(
                  id
                );

              }
            )
        )
      );


    /*
      AMBIL DETAIL BARANG
      DARI PURCHASE RECAP
    */

    let recapRows = [];


    if (
      recapIds.length > 0
    ) {

      const {
        data: recapData,
        error: recapError
      } =
        await supabaseClient
          .from("purchase_recap")
          .select(`
            id,
            batch_code,
            item_name,
            version,
            quantity
          `)
          .in(
            "id",
            recapIds
          );


      if (recapError) {

        console.error(
          "ERROR LOAD RECAP DETAIL:",
          recapError
        );

        container.innerHTML = `
          <p>
            Gagal memuat detail barang.
          </p>
        `;

        return;

      }


      recapRows =
        recapData || [];

    }


    /*
      GABUNGKAN HISTORI DENGAN
      DETAIL BARANG
    */

    const recapMap = {};


    recapRows.forEach(
      function(row) {

        recapMap[
          String(row.id)
        ] = row;

      }
    );


    /*
      HITUNG URUTAN CO
      PER BARANG
    */

    const historyCountMap = {};


    const historyForNumbering =
      [...historyRows].sort(
        function(a, b) {

          const dateA =
            a.checkout_at
              ? new Date(
                  a.checkout_at
                ).getTime()
              : new Date(
                  a.created_at
                ).getTime();

          const dateB =
            b.checkout_at
              ? new Date(
                  b.checkout_at
                ).getTime()
              : new Date(
                  b.created_at
                ).getTime();

          return dateA - dateB;

        }
      );


    const historyNumberMap = {};


    historyForNumbering.forEach(
      function(row) {

        const recapId =
          String(
            row.recap_id
          );


        if (
          !historyCountMap[
            recapId
          ]
        ) {

          historyCountMap[
            recapId
          ] = 0;

        }


        historyCountMap[
          recapId
        ] += 1;


        historyNumberMap[
          String(row.id)
        ] =
          historyCountMap[
            recapId
          ];

      }
    );


    /*
      TAMPILKAN JUMLAH ARSIP
    */

    container.innerHTML = `

      <div
        style="
          margin-bottom:18px;
        "
      >

        <h3>
          📦 ${historyRows.length}
          Riwayat CO Tidak Dikonfirmasi
        </h3>

        <p
          style="
            margin-top:5px;
            color:#777;
          "
        >
          Seluruh histori tetap disimpan
          meskipun barang dapat di-CO kembali.
        </p>

      </div>


      <div
        style="
          overflow-x:auto;
          width:100%;
        "
      >

        <table
          style="
            width:100%;
            min-width:1050px;
            border-collapse:collapse;
          "
        >

          <thead>

            <tr>

              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                No
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Customer
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Nama Barang
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Batch
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Version / Member
              </th>


              <th
                style="
                  text-align:center;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Qty
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Tanggal CO
              </th>


              <th
                style="
                  text-align:center;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                CO Ke-
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Status
              </th>


              <th
                style="
                  text-align:left;
                  padding:10px;
                  border-bottom:1px solid #eee;
                  white-space:nowrap;
                "
              >
                Tanggal Arsip
              </th>

            </tr>

          </thead>


          <tbody>

            ${historyRows
              .map(
                function(row, index) {

                  const item =
                    recapMap[
                      String(
                        row.recap_id
                      )
                    ] || {};


                  const checkoutDate =
                    row.checkout_at
                      ? new Date(
                          row.checkout_at
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day:
                              "2-digit",
                            month:
                              "2-digit",
                            year:
                              "numeric"
                          }
                        )
                      : "-";


                  const archiveDate =
                    row.created_at
                      ? new Date(
                          row.created_at
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day:
                              "2-digit",
                            month:
                              "2-digit",
                            year:
                              "numeric"
                          }
                        )
                      : "-";


                  return `

                    <tr>

                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        ${index + 1}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        <strong>
                          ${row.customer_name || "-"}
                        </strong>
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                        "
                      >
                        <strong>
                          ${item.item_name || "-"}
                        </strong>
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        ${item.batch_code || "-"}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        ${item.version || "-"}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          text-align:center;
                        "
                      >
                        ${item.quantity || 0}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        ${checkoutDate}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          text-align:center;
                          font-weight:600;
                        "
                      >
                        #${historyNumberMap[
                          String(row.id)
                        ] || 1}
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        <span
                          style="
                            color:#b33;
                            font-weight:600;
                          "
                        >
                          ✕ Tidak Dikonfirmasi
                        </span>
                      </td>


                      <td
                        style="
                          padding:10px;
                          border-bottom:1px solid #f1f1f1;
                          white-space:nowrap;
                        "
                      >
                        ${archiveDate}
                      </td>

                    </tr>

                  `;

                }
              )
              .join("")}

          </tbody>

        </table>

      </div>

    `;

  } catch (err) {

    console.error(
      "ERROR CO ARCHIVE:",
      err
    );

  }

}

/* ============================================
   REKAP GO
   ============================================ */

let dearNadiyaSelectedRecapCategory = "";

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
            Pilih jenis rekap yang ingin dikelola.
          </p>

        </div>


        <button
          type="button"
          class="primary-button"
          id="addRecapButton"
          style="display:none;"
        >
          ➕ Tambah Rekap
        </button>

      </div>


      <!-- =====================================
           TYPE REKAP
           ===================================== -->

      <div
        class="recap-category-buttons"
        id="recapTypeButtons"
      >

        <button
          type="button"
          class="active"
          data-recap-type="Treasure"
        >
          💎 Rekap Treasure
        </button>


        <button
          type="button"
          data-recap-type="Multi Group"
        >
          👥 Rekap Multi Group
        </button>


        <button
          type="button"
          data-recap-type="Tabungan"
        >
          💰 Rekap Tabungan
        </button>


        <button
          type="button"
          data-recap-type="Jastip"
        >
          📦 Rekap Jastip
        </button>

      </div>


      <!-- =====================================
           KATEGORI
           ===================================== -->

      <div
        id="recapCategoryContainer"
        style="display:none;"
      ></div>


      <div
        id="recapFormContainer"
      ></div>


      <!-- =====================================
           DAFTAR BATCH
           ===================================== -->

      <div
        id="recapListContainer"
        style="display:none;"
      ></div>

    </div>

  `;


  let selectedRecapType =
  "Treasure";

let selectedRecapCategory = "";
   
  const typeButtons =
    document.querySelectorAll(
      "#recapTypeButtons button"
    );


  /* =====================================
     TYPE REKAP
     ===================================== */

  typeButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          typeButtons.forEach(
            function (item) {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


         selectedRecapType =
  button.dataset.recapType;


showRecapCategories(
  selectedRecapType
);
        }
      );

    }
  );


  /* =====================================
     TOMBOL TAMBAH REKAP
     ===================================== */

  const addButton =
    document.getElementById(
      "addRecapButton"
    );


  if (addButton) {
  addButton.addEventListener(
    "click",
    function () {

      if (!selectedRecapCategory) {

        alert(
          "Pilih kategori terlebih dahulu."
        );

        return;
      }

      showRecapForm(
        selectedRecapCategory
      );

    }
  );
}

  /* =====================================
     AWALNYA HANYA TYPE REKAP
     ===================================== */

  showRecapTypeSelection();

}

/* ============================================
   KEMBALI KE TYPE REKAP
   ============================================ */

function showRecapTypeSelection() {

  const typeContainer =
    document.getElementById(
      "recapTypeButtons"
    );

  const categoryContainer =
    document.getElementById(
      "recapCategoryContainer"
    );

  const listContainer =
    document.getElementById(
      "recapListContainer"
    );

  const formContainer =
    document.getElementById(
      "recapFormContainer"
    );

  const addButton =
    document.getElementById(
      "addRecapButton"
    );


  if (typeContainer) {

    typeContainer.style.display =
      "flex";

  }


  if (categoryContainer) {

    categoryContainer.style.display =
      "none";

    categoryContainer.innerHTML =
      "";

  }


  if (listContainer) {

    listContainer.style.display =
      "none";

    listContainer.innerHTML =
      "";

  }


  if (formContainer) {

    formContainer.innerHTML =
      "";

    formContainer.style.display =
      "none";

  }


  if (addButton) {

    addButton.style.display =
      "none";

  }

}

/* ============================================
   TAMPILKAN KATEGORI REKAP
   ============================================ */

function showRecapCategories(recapType) {

  const container =
    document.getElementById(
      "recapCategoryContainer"
    );

  const typeContainer =
    document.getElementById(
      "recapTypeButtons"
    );

  const listContainer =
    document.getElementById(
      "recapListContainer"
    );

  if (!container) return;


  /* ==========================================
     ATUR TAMPILAN
     ========================================== */

  container.style.display = "block";

  if (typeContainer) {
    typeContainer.style.display = "none";
  }

  if (listContainer) {
    listContainer.style.display = "none";
    listContainer.innerHTML = "";
  }


  /* ==========================================
     ICON KATEGORI
     ========================================== */

  const categoryIcons = {

    "Truz": "💎",

    "Treasure KR": "🇰🇷",
    "Treasure JP": "🇯🇵",
    "Treasure CH": "🇨🇳",
    "Treasure Thai": "🇹🇭",
    "Treasure Album": "💿",
    "Treasure INA": "🇮🇩",

    "NCT": "💚",
    "Lngshot": "🏹",
    "Cortis": "⭐",
    "Babymonster": "🖤",
    "Ateez": "🏴‍☠️",

    "Tabungan Lightstick": "💡",
    "Tabungan Album": "💿",

    "Jastip Korea": "🇰🇷",
    "Jastip Jepang": "🇯🇵",
    "Jastip Thailand": "🇹🇭",
    "Jastip China": "🇨🇳"

  };


  /* ==========================================
     LOAD KATEGORI
     ========================================== */

  loadRecapCategories(
    recapType
  ).then(function(categories) {

    if (
      !categories ||
      categories.length === 0
    ) {

      container.innerHTML = `
        <div class="recap-navigation">

          <button
            type="button"
            class="recap-back-button"
            id="recapBackType"
          >
            ← Kembali ke Type Rekap
          </button>

          <h3>
            ${escapeHTML(
              "Rekap " + recapType
            )}
          </h3>

        </div>

        <div class="welcome-card">

          <p>
            Kategori untuk
            <strong>
              Rekap ${escapeHTML(
                recapType
              )}
            </strong>
            belum dibuat.
          </p>

        </div>
      `;

      const backButton =
        document.getElementById(
          "recapBackType"
        );

      if (backButton) {

        backButton.addEventListener(
          "click",
          function() {

            container.style.display =
              "none";

            container.innerHTML =
              "";

            if (typeContainer) {
              typeContainer.style.display =
                "grid";
            }

            if (listContainer) {
              listContainer.style.display =
                "none";

              listContainer.innerHTML =
                "";
            }

          }
        );

      }

      return;
    }


    /* ==========================================
       RENDER KATEGORI
       ========================================== */

    container.innerHTML = `

      <div class="recap-navigation">

        <button
          type="button"
          class="recap-back-button"
          id="recapBackType"
        >
          ← Kembali ke Type Rekap
        </button>

        <h3 class="recap-current-title">
          ${
            recapType === "Treasure"
              ? "💎"
              : recapType === "Multi Group"
                ? "👥"
                : recapType === "Tabungan"
                  ? "💰"
                  : "📦"
          }

          Rekap ${escapeHTML(
            recapType
          )}
        </h3>

      </div>


      <div
        class="recap-category-buttons"
        id="recapCategoryButtons"
      >

        ${categories.map(
          function(category) {

            const categoryName =
              category.category_name;

            const icon =
              categoryIcons[
                categoryName
              ] || "📦";

            return `

  <div class="recap-category-wrapper">

    <button
      type="button"
      class="recap-category-card"
      data-category="${escapeHTML(
        categoryName
      )}"
    >

      <div
        class="recap-category-icon"
      >
        ${icon}
      </div>

      <div
        class="recap-category-name"
      >
        ${escapeHTML(
          categoryName
        )}
      </div>

      <div
        class="recap-category-arrow"
      >
        →
      </div>

    </button>

    <div class="recap-category-actions">

      <button
        type="button"
        class="secondary-button edit-recap-category-button"
        data-id="${category.id}"
        data-category="${escapeHTML(
          categoryName
        )}"
      >
        ✏️ Edit
      </button>

      <button
        type="button"
        class="secondary-button delete-recap-category-button"
        data-id="${category.id}"
        data-category="${escapeHTML(
          categoryName
        )}"
      >
        🗑️ Hapus
      </button>

    </div>

  </div>

`;
          }
        ).join("")}

      </div>

      <div
  style="
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  "
>
  <button
    type="button"
    class="primary-button"
    id="addRecapCategoryButton"
  >
    ➕ Tambah Kategori
  </button>
</div>

    `;


    /* ==========================================
       KEMBALI KE TYPE REKAP
       ========================================== */

    const backTypeButton =
      document.getElementById(
        "recapBackType"
      );

    if (backTypeButton) {

      backTypeButton.addEventListener(
        "click",
        function() {

          container.style.display =
            "none";

          container.innerHTML =
            "";

          if (listContainer) {
            listContainer.style.display =
              "none";

            listContainer.innerHTML =
              "";
          }

          if (typeContainer) {
            typeContainer.style.display =
              "grid";
          }

        }
      );

    }


    /* ==========================================
       KLIK KATEGORI
       ========================================== */

const categoryButtons =
  container.querySelectorAll(
    "#recapCategoryButtons > .recap-category-wrapper > .recap-category-card"
  );

    categoryButtons.forEach(
      function(button) {

        button.addEventListener(
          "click",
          function() {

           const selectedCategory =
  button.dataset.category;

selectedRecapCategory =
  selectedCategory;

             
            /* ===============================
               SEMBUNYIKAN KATEGORI
               =============================== */

            container.style.display =
              "none";


            /* ===============================
               TAMPILKAN LIST BATCH
               =============================== */

            if (listContainer) {

              listContainer.style.display =
                "block";

              listContainer.innerHTML = `

                <div class="recap-navigation">

                  <button
                    type="button"
                    class="recap-back-button"
                    id="recapBackCategory"
                  >
                    ← Kembali ke Kategori
                  </button>

                  <h3
                    class="recap-current-title"
                  >
                    ${escapeHTML(
                      selectedCategory
                    )}
                  </h3>

                </div>

                <div id="recapBatchContent">
                  <p>
                    Memuat data rekap...
                  </p>
                </div>

              `;

            }


            /* ===============================
               LOAD DATA REKAP
               =============================== */

            loadRecapList(
              selectedCategory
            );

          }
        );

      }
    );

     /* ==========================================
   TAMBAH KATEGORI
   ========================================== */

const addRecapCategoryButton =
  container.querySelector(
    "#addRecapCategoryButton"
  );

if (addRecapCategoryButton) {

  addRecapCategoryButton.addEventListener(
    "click",
    function() {

      container.innerHTML = `

        <div class="recap-navigation">

          <button
            type="button"
            class="recap-back-button"
            id="cancelAddRecapCategory"
          >
            ← Kembali ke Kategori
          </button>

          <h3 class="recap-current-title">
            ➕ Tambah Kategori
          </h3>

        </div>

        <div class="panel">

          <div class="form-group">

            <label>
              Type Rekap
            </label>

            <input
              type="text"
              value="${escapeHTML(recapType)}"
              readonly
            >

          </div>

          <div class="form-group">

            <label>
              Nama Kategori
            </label>

            <input
              type="text"
              id="newRecapCategoryName"
              placeholder="Contoh: Treasure KR"
              autocomplete="off"
            >

          </div>

          <div
            style="
              margin-top: 16px;
              display: flex;
              gap: 10px;
            "
          >

            <button
              type="button"
              class="primary-button"
              id="saveNewRecapCategory"
            >
              💾 Simpan Kategori
            </button>

            <button
              type="button"
              class="secondary-button"
              id="cancelNewRecapCategory"
            >
              Batal
            </button>

          </div>

        </div>

      `;


      /* ==========================================
         TOMBOL KEMBALI / BATAL
         ========================================== */

      const backButtons = [
        container.querySelector(
          "#cancelAddRecapCategory"
        ),
        container.querySelector(
          "#cancelNewRecapCategory"
        )
      ];

      backButtons.forEach(
        function(button) {

          if (!button) return;

          button.addEventListener(
            "click",
            function() {

              showRecapCategories(
                recapType
              );

            }
          );

        }
      );


      /* ==========================================
         SIMPAN KATEGORI BARU
         ========================================== */

      const saveNewRecapCategory =
        container.querySelector(
          "#saveNewRecapCategory"
        );

      if (saveNewRecapCategory) {

        saveNewRecapCategory.addEventListener(
          "click",
          async function() {

            const input =
              container.querySelector(
                "#newRecapCategoryName"
              );

            if (!input) return;

            const categoryName =
              input.value.trim();

            if (!categoryName) {

              alert(
                "Nama kategori belum diisi."
              );

              input.focus();

              return;
            }


            saveNewRecapCategory.disabled =
              true;

            saveNewRecapCategory.textContent =
              "Menyimpan...";


            const {
              error
            } =
              await supabaseClient
                .from("recap_categories")
                .insert([
                  {
                    recap_type:
                      recapType,

                    category_name:
                      categoryName
                  }
                ]);


            if (error) {

              console.error(
                "Gagal menyimpan kategori:",
                error
              );

              alert(
                "Gagal menyimpan kategori: " +
                error.message
              );

              saveNewRecapCategory.disabled =
                false;

              saveNewRecapCategory.textContent =
                "💾 Simpan Kategori";

              return;
            }


            alert(
              "Kategori berhasil ditambahkan. ♥"
            );


            showRecapCategories(
              recapType
            );

          }
        );

      }

    }
  );

}

         /* ==========================================
       EDIT KATEGORI
       ========================================== */

    const editCategoryButtons =
      container.querySelectorAll(
        ".edit-recap-category-button"
      );

    editCategoryButtons.forEach(
      function(button) {

        button.addEventListener(
          "click",
          function(event) {

            event.preventDefault();
            event.stopPropagation();

            const categoryId =
              this.dataset.id;

            const currentName =
              this.dataset.category;

            if (!categoryId) {
              console.error(
                "ID kategori tidak ditemukan."
              );
              return;
            }

            container.innerHTML = `

              <div class="recap-navigation">

                <button
                  type="button"
                  class="recap-back-button"
                  id="cancelEditRecapCategory"
                >
                  ← Kembali ke Kategori
                </button>

                <h3 class="recap-current-title">
                  ✏️ Edit Kategori
                </h3>

              </div>

              <div class="panel">

                <div class="form-group">

                  <label>
                    Type Rekap
                  </label>

                  <input
                    type="text"
                    value="${escapeHTML(
                      recapType
                    )}"
                    readonly
                  >

                </div>

                <div class="form-group">

                  <label>
                    Nama Kategori
                  </label>

                  <input
                    type="text"
                    id="editRecapCategoryName"
                    value="${escapeHTML(
                      currentName
                    )}"
                    autocomplete="off"
                  >

                </div>

                <div
                  style="
                    margin-top: 16px;
                    display: flex;
                    gap: 10px;
                  "
                >

                  <button
                    type="button"
                    class="primary-button"
                    id="saveEditRecapCategory"
                  >
                    💾 Simpan Perubahan
                  </button>

                  <button
                    type="button"
                    class="secondary-button"
                    id="cancelEditRecapCategoryButton"
                  >
                    Batal
                  </button>

                </div>

              </div>

            `;


            /* ======================================
               TOMBOL KEMBALI
               ====================================== */

            const cancelButtons = [
              container.querySelector(
                "#cancelEditRecapCategory"
              ),
              container.querySelector(
                "#cancelEditRecapCategoryButton"
              )
            ];

            cancelButtons.forEach(
              function(cancelButton) {

                if (!cancelButton) return;

                cancelButton.addEventListener(
                  "click",
                  function() {

                    showRecapCategories(
                      recapType
                    );

                  }
                );

              }
            );


            /* ======================================
               SIMPAN PERUBAHAN
               ====================================== */

            const saveButton =
              container.querySelector(
                "#saveEditRecapCategory"
              );

            if (saveButton) {

              saveButton.addEventListener(
                "click",
                async function() {

                  const input =
                    container.querySelector(
                      "#editRecapCategoryName"
                    );

                  if (!input) return;

                  const newName =
                    input.value.trim();

                  if (!newName) {

                    alert(
                      "Nama kategori belum diisi."
                    );

                    input.focus();

                    return;
                  }


                  saveButton.disabled =
                    true;

                  saveButton.textContent =
                    "Menyimpan...";


                  const {
                    error
                  } =
                    await supabaseClient
                      .from("recap_categories")
                      .update({
                        category_name:
                          newName
                      })
                      .eq(
                        "id",
                        categoryId
                      );


                  if (error) {

                    console.error(
                      "Gagal mengubah kategori:",
                      error
                    );

                    alert(
                      "Gagal mengubah kategori: " +
                      error.message
                    );

                    saveButton.disabled =
                      false;

                    saveButton.textContent =
                      "💾 Simpan Perubahan";

                    return;
                  }


                  alert(
                    "Kategori berhasil diubah. ♥"
                  );


                  showRecapCategories(
                    recapType
                  );

                }
              );

            }

          }
        );

      }
    );

     /* ==========================================
   HAPUS KATEGORI
   ========================================== */

const deleteCategoryButtons =
  container.querySelectorAll(
    ".delete-recap-category-button"
  );

deleteCategoryButtons.forEach(
  function(button) {

    button.addEventListener(
  "click",
  async function(event) {
     
        event.preventDefault();
        event.stopPropagation();

        const categoryId =
          this.dataset.id;

        const categoryName =
          this.dataset.category;

        if (!categoryId) {

          console.error(
            "ID kategori tidak ditemukan."
          );

          return;
        }

        const confirmed =
          confirm(
            "Yakin ingin menghapus kategori \"" +
            categoryName +
            "\"?"
          );

        if (!confirmed) {
  return;
}


/* ======================================
   HAPUS KATEGORI DARI SUPABASE
   ====================================== */

button.disabled = true;

button.textContent =
  "Menghapus...";


const {
  error
} =
  await supabaseClient
    .from("recap_categories")
    .delete()
    .eq(
      "id",
      categoryId
    );


if (error) {

  console.error(
    "Gagal menghapus kategori:",
    error
  );

  alert(
    "Gagal menghapus kategori: " +
    error.message
  );

  button.disabled = false;

  button.textContent =
    "🗑️ Hapus";

  return;
}


alert(
  "Kategori berhasil dihapus. ♥"
);


/* ======================================
   MUAT ULANG DAFTAR KATEGORI
   ====================================== */

showRecapCategories(
  recapType
);
      }
    );

  }
);
     
  }).catch(function(error) {

    console.error(
      "Error saat memuat kategori:",
      error
    );

    container.innerHTML = `

      <div class="welcome-card">

        <p>
          ❌ Gagal memuat kategori rekap.
        </p>

      </div>

    `;

  });

}

/* ==========================================
   TAMBAH MEMBER / VERSI KE BATCH EXISTING
   ========================================== */

async function showAddRecapMemberForm(
  batchCode
) {

  const container =
    document.getElementById(
      "recapFormContainer"
    );

  if (!container) {
    return;
  }

   container.style.display = "block";

  container.innerHTML = `
    <div class="panel">
      <p>Memuat data batch...</p>
    </div>
  `;

  container.style.display =
    "block";


  /* ==========================================
     AMBIL DATA BATCH
     ========================================== */

  const {
    data,
    error
  } =
    await supabaseClient
      .from("purchase_recap")
      .select("*")
      .eq(
        "batch_code",
        batchCode
      )
      .order(
        "id",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD BATCH:",
      error
    );

    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat batch
        </h3>

        <p>
          ${escapeHTML(
            error.message
          )}
        </p>

        <button
          type="button"
          class="secondary-button"
          id="cancelAddRecapMemberButton"
        >
          ← Kembali
        </button>

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
          Batch tidak ditemukan
        </h3>

        <p>
          Batch
          <strong>
            ${escapeHTML(batchCode)}
          </strong>
          tidak ditemukan.
        </p>

        <button
          type="button"
          class="secondary-button"
          id="cancelAddRecapMemberButton"
        >
          ← Kembali
        </button>

      </div>

    `;

    return;
  }


  /* ==========================================
     DATA DASAR BATCH
     ========================================== */

  const batch =
    data[0];


  const recapType =
    batch.recap_type ||
    "Treasure";


  const category =
    batch.category ||
    "";


  const itemName =
    batch.item_name ||
    "";


  const batchTracking =
    batch.batch_tracking_status ||
    batch.tracking_status ||
    "";


  /* ==========================================
     FORM TAMBAH MEMBER
     ========================================== */

  container.innerHTML = `

    <div class="panel recap-form">

      <h3>
        ➕ Tambah Member / Versi
      </h3>

      <p>
        Tambahkan customer baru ke batch:
        <strong>
          ${escapeHTML(batchCode)}
        </strong>
      </p>


      <!-- DATA BATCH -->

      <div class="form-grid">

        <div class="form-group">

          <label>
            Kategori
          </label>

          <input
            type="text"
            value="${escapeHTML(category)}"
            disabled
          >

        </div>


        <div class="form-group">

          <label>
            Nama Barang
          </label>

          <input
            type="text"
            value="${escapeHTML(itemName)}"
            disabled
          >

        </div>


        <div class="form-group">

          <label>
            Kode Batch
          </label>

          <input
            type="text"
            value="${escapeHTML(batchCode)}"
            disabled
          >

        </div>


        <div class="form-group">

          <label>
            Recap Type
          </label>

          <input
            type="text"
            value="${escapeHTML(recapType)}"
            disabled
          >

        </div>

      </div>


      <hr>


      <!-- CUSTOMER BARU -->

      <div
        id="addRecapMemberItemsContainer"
      ></div>


      <button
        type="button"
        class="primary-button"
        id="addRecapMemberItemButton"
      >
        ＋ Tambah Customer
      </button>


      <div
        class="form-actions"
      >

        <button
          type="button"
          class="secondary-button"
          id="cancelAddRecapMemberButton"
        >
          ← Batal
        </button>

        <button
          type="button"
          class="primary-button"
          id="saveAddRecapMemberButton"
        >
          💾 Simpan Member / Versi
        </button>

      </div>


      <div
        id="addRecapMemberMessage"
      ></div>

    </div>

  `;


  /* ==========================================
     TAMBAH CARD CUSTOMER
     ========================================== */

  const itemsContainer =
    document.getElementById(
      "addRecapMemberItemsContainer"
    );


  let memberNumber = 0;


  function addMemberCard() {

    memberNumber++;


    const item =
      document.createElement(
        "div"
      );


    item.className =
      "batch-item";


    item.innerHTML = `

      <div class="batch-item-header">

        <strong>
          Member / Customer ${memberNumber}
        </strong>

        <button
          type="button"
          class="delete-button remove-add-member-item"
        >
          🗑️ Hapus
        </button>

      </div>


      <label>
        Customer
      </label>

      <input
        type="text"
        class="batch-customer"
        placeholder="Nama customer"
      >


      <label>
        Versi / Member
      </label>

      <input
        type="text"
        class="batch-version"
        placeholder="Contoh: Hyunsuk"
      >


      <label>
        Quantity
      </label>

      <input
        type="number"
        class="batch-quantity"
        min="1"
        value="1"
      >


      <div class="different-price-fields">

        <label>
          Harga Barang
        </label>

        <input
          type="number"
          class="batch-price"
          min="0"
          value="${Number(
            batch.item_price || 0
          )}"
        >


        <label>
          DP
        </label>

        <input
          type="number"
          class="batch-dp"
          min="0"
          value="${Number(
            batch.minimum_dp_amount ||
            batch.dp_amount ||
            0
          )}"
        >

      </div>


      <div class="batch-payment-fields">

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
          Status Pembayaran
        </label>

        <select
          class="batch-payment-status"
        >

          <option value="unpaid">
            Belum Lunas
          </option>

          <option value="paid">
            Lunas
          </option>

        </select>

      </div>


      <label>
        Catatan
      </label>

      <textarea
        class="batch-note"
        rows="2"
        placeholder="Catatan..."
      ></textarea>

    `;


    itemsContainer.appendChild(
      item
    );


    item
      .querySelector(
        ".remove-add-member-item"
      )
      .addEventListener(
        "click",
        function() {

          item.remove();

        }
      );

  }


  /* CUSTOMER PERTAMA */

  addMemberCard();


  /* TAMBAH CUSTOMER */

  document
    .getElementById(
      "addRecapMemberItemButton"
    )
    .addEventListener(
      "click",
      addMemberCard
    );


  /* ==========================================
     BATAL
     ========================================== */

  document
    .getElementById(
      "cancelAddRecapMemberButton"
    )
    .addEventListener(
      "click",
      function() {

        container.innerHTML =
          "";

        container.style.display =
          "none";

      }
    );

  /* ==========================================
     SIMPAN MEMBER / VERSI KE BATCH EXISTING
     ========================================== */

  document
    .getElementById(
      "saveAddRecapMemberButton"
    )
    .addEventListener(
      "click",
      async function() {

        const saveButton =
          document.getElementById(
            "saveAddRecapMemberButton"
          );

        const message =
          document.getElementById(
            "addRecapMemberMessage"
          );


        /* ======================================
           VALIDASI
           ====================================== */

        if (saveButton) {

          saveButton.disabled =
            true;

          saveButton.textContent =
            "Menyimpan...";

        }

        if (message) {

          message.textContent =
            "Menyimpan member / versi...";

        }


        /* ======================================
           AMBIL SEMUA MEMBER BARU
           ====================================== */

        const memberElements =
          document.querySelectorAll(
            "#addRecapMemberItemsContainer .batch-item"
          );


        if (
          memberElements.length === 0
        ) {

          if (message) {

            message.textContent =
              "Minimal harus ada 1 customer.";

          }

          if (saveButton) {

            saveButton.disabled =
              false;

            saveButton.textContent =
              "💾 Simpan Member / Versi";

          }

          return;

        }


        const records = [];


        /* ======================================
           BENTUK DATA MEMBER BARU
           ====================================== */

        memberElements.forEach(
          function(item) {

            const customer =
              item
                .querySelector(
                  ".batch-customer"
                )
                .value
                .trim();


            const version =
              item
                .querySelector(
                  ".batch-version"
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
              Math.max(
                0,
                price - dp
              );


            const paymentStatus =
              item
                .querySelector(
                  ".batch-payment-status"
                )
                .value;


            const note =
              item
                .querySelector(
                  ".batch-note"
                )
                .value
                .trim();


            records.push({

              recap_type:
                recapType,

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

              dp_deadline:
                batch.dp_deadline ||
                null,

              co_deadline:
                null

            });

          }
        );


        /* ======================================
           CEK DATA KOSONG
           ====================================== */

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

          if (message) {

            message.textContent =
              "Customer dan Versi / Member wajib diisi.";

          }

          if (saveButton) {

            saveButton.disabled =
              false;

            saveButton.textContent =
              "💾 Simpan Member / Versi";

          }

          return;

        }


        /* ======================================
           SIMPAN KE BATCH YANG SAMA
           ====================================== */

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
            "ERROR SAVE ADD MEMBER:",
            error
          );


          if (message) {

            message.textContent =
              "Gagal menyimpan member: " +
              error.message;

          }


          if (saveButton) {

            saveButton.disabled =
              false;

            saveButton.textContent =
              "💾 Simpan Member / Versi";

          }

          return;

        }


        /* ======================================
           BERHASIL
           ====================================== */

        if (message) {

          message.textContent =
            "Member / Versi berhasil ditambahkan. ♥";

        }


        alert(
          "Member / Versi berhasil ditambahkan ke batch."
        );


        container.innerHTML =
          "";

        container.style.display =
          "none";


        await loadRecapList(
          category
        );

      }
    );
   
}

/* ============================================
   LOAD KATEGORI REKAP DARI DATABASE
   ============================================ */

async function loadRecapCategories(
  recapType
) {

  const {
    data,
    error
  } =
    await supabaseClient
      .from("recap_categories")
      .select(
        "id, recap_type, category_name"
      )
      .eq(
        "recap_type",
        recapType
      )
      .order(
        "id",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "Gagal memuat kategori rekap:",
      error
    );

    return [];

  }


  return data || [];

}

/* ============================================
   FORM REKAP GO - MULTI MEMBER
   ============================================ */

function showRecapForm(category) {

  const container =
    document.getElementById("recapFormContainer");

  if (!container) return;

   container.style.display = "block";

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

        <label>
         Deadline DP
        </label>
        <input
         type="date"
         id="batchDpDeadline"
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
  readonly
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
   UPDATE SISA PEMBAYARAN OTOMATIS
   ========================================== */

function updateBatchRemaining() {

  const mode =
    document.getElementById(
      "batchPriceMode"
    )?.value || "same";

  const items =
    document.querySelectorAll(
      "#batchItemsContainer .batch-item"
    );

  let commonPrice = 0;
  let commonDp = 0;

  if (mode === "same") {

    commonPrice =
      Number(
        document.getElementById(
          "batchCommonPrice"
        )?.value
      ) || 0;

    commonDp =
      Number(
        document.getElementById(
          "batchCommonDp"
        )?.value
      ) || 0;
  }

  items.forEach(function(item) {

    let price = commonPrice;
    let dp = commonDp;

    if (mode === "different") {

      price =
        Number(
          item
            .querySelector(
              ".batch-price"
            )?.value
        ) || 0;

      dp =
        Number(
          item
            .querySelector(
              ".batch-dp"
            )?.value
        ) || 0;
    }

    const remaining =
      Math.max(
        0,
        price - dp
      );

    const remainingInput =
      item.querySelector(
        ".batch-remaining"
      );

    if (remainingInput) {
      remainingInput.value =
        remaining;
    }

  });
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
   SISA PEMBAYARAN UPDATE OTOMATIS
   ========================================== */

document
  .getElementById("batchCommonPrice")
  ?.addEventListener(
    "input",
    updateBatchRemaining
  );

document
  .getElementById("batchCommonDp")
  ?.addEventListener(
    "input",
    updateBatchRemaining
  );

itemsContainer.addEventListener(
  "input",
  function(event) {

    if (
      event.target.matches(
        ".batch-price, .batch-dp"
      )
    ) {
      updateBatchRemaining();
    }

  }
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

     recap_type:
    "Treasure",

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

    minimum_dp_amount:
  dpAmount,

dp_amount:
  0,
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
    <div class="recap-navigation">

      <button
        type="button"
        class="recap-back-button"
        id="recapBackCategory"
      >
        ← Kembali ke Kategori
      </button>

      <h3 class="recap-current-title">
        ${escapeHTML(category)}
      </h3>

    </div>

    <div class="recap-search">

      <input
        type="text"
        id="recapSearchInput"
        placeholder="🔍 Cari batch / customer / barang / member..."
      >

      <div
        id="recapSearchResult"
        class="recap-search-result"
      ></div>

    </div>

    <div class="recap-empty-state">

      <h3>
        📦 Belum ada data Rekap GO
      </h3>

      <p>
        Belum ada batch untuk kategori
        <strong>
          ${escapeHTML(category)}
        </strong>.
      </p>

      <button
        type="button"
        class="primary-button"
        id="emptyAddRecapButton"
      >
        ➕ Tambah Batch
      </button>

    </div>
  `;

  const backButton =
    container.querySelector(
      "#recapBackCategory"
    );

  if (backButton) {
    backButton.addEventListener(
      "click",
      function() {

        container.style.display =
          "none";

        container.innerHTML =
          "";

        showRecapCategories(
          getRecapTypeFromCategory(
            category
          )
        );

      }
    );
  }

  const emptyAddButton =
    container.querySelector(
      "#emptyAddRecapButton"
    );

  if (emptyAddButton) {
    emptyAddButton.addEventListener(
      "click",
      function() {

        showRecapForm(
          category
        );

      }
    );
  }

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

  <!-- =====================================
       HEADER DAFTAR BATCH
       ===================================== -->

  <div
  class="recap-navigation-header"
>

  <button
    type="button"
    class="recap-back-category"
    id="recapBackCategory"
  >
    ← Kembali ke Kategori
  </button>


  <div
    class="recap-current-category"
  >
    ${escapeHTML(category)}
  </div>


  <button
    type="button"
    class="primary-button"
    id="addRecapBatchButton"
  >
    ➕ Tambah Batch
  </button>

</div>

  <!-- =====================================
       SEARCH
       ===================================== -->

  <div class="recap-search">

    <input
      type="text"
      id="recapSearchInput"
      placeholder="🔍 Cari batch / customer / barang / member..."
    >

    <div
      id="recapSearchResult"
      class="recap-search-result"
    ></div>

  </div>
  
<div class="recap-filters">

  <label>
    Status Customer

    <select id="recapCustomerFilter">
      <option value="">Semua</option>
      <option value="Belum Checkout Shopee">
        ⏳ Belum Checkout Shopee
      </option>
      <option value="Sudah Checkout Shopee">
        🛒 Sudah Checkout Shopee
      </option>
      <option value="Sudah Menerima Barang">
        📦 Sudah Menerima Barang
      </option>
    </select>
  </label>


  <label>
    Status DP

    <select id="recapDpFilter">
      <option value="">Semua</option>
      <option value="unpaid">
        ⏳ Belum Dibayar
      </option>
      <option value="paid">
        ✓ Sudah Dibayar
      </option>
    </select>
  </label>


  <label>
    Pembayaran

    <select id="recapPaymentFilter">
      <option value="">Semua</option>
      <option value="unpaid">
        ⏳ Belum Lunas
      </option>
      <option value="paid">
        ✓ Lunas
      </option>
    </select>
  </label>

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

     html += `
  <div class="recap-batch-scroll">

    <div class="recap-batch-table-header">

      <div class="recap-batch-table-code">
        Kode Batch
      </div>

      <div class="recap-batch-table-name">
        Nama Barang
      </div>

      <div class="recap-batch-table-edit">
        Edit
      </div>

      <div class="recap-batch-table-member">
        Tambah Member / Versi
      </div>

      <div class="recap-batch-table-arrow">
        →
      </div>

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
  class="recap-batch-card recap-batch-collapsed"
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

         <div class="recap-batch-header">

  <div>

    <h3>
      ${escapeHTML(batchCode)}
    </h3>

    <p
      style="
        display:flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
      "
    >

      <span>
        ${escapeHTML(
          rows[0]?.item_name ||
          "Nama barang belum tersedia"
        )}
      </span>

      <button
        type="button"
        class="primary-button edit-batch-header-button"
        data-batch-code="${escapeHTML(batchCode)}"
        data-category="${escapeHTML(category)}"
        style="
          padding:4px 10px;
          font-size:12px;
        "
      >
        ✏️ Edit
      </button>

    </p>

    <div class="recap-batch-customer-summary">

      <span>
        ${rows.length}
        customer
      </span>

      <button
        type="button"
        class="add-recap-member-button"
        data-batch-code="${escapeHTML(batchCode)}"
      >
        ＋ Tambah Member / Versi
      </button>

    </div>

    <div class="recap-batch-deadlines">

      <!-- PERTAHANKAN SELURUH ISI DEADLINE
           YANG SEKARANG SUDAH ADA DI FILE -->

    </div>

  </div>

</div>

<div class="batch-tracking">

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
  <select
    class="recap-status-select recap-dp-status"
    data-id="${escapeHTML(String(row.id))}"
  >
    <option
  value="unpaid"
  ${row.dp_status === "unpaid" ? "selected" : ""}
>
  🟠 ⏳ Belum Dibayar
</option>

<option
  value="paid"
  ${row.dp_status === "paid" ? "selected" : ""}
>
  🟢 ✓ Sudah Dibayar
</option>
  </select>
</td>

<td>
  ${formatRupiah(
    row.remaining_amount
  )}
</td>

                        <td>
  <select
    class="recap-status-select recap-payment-status"
    data-id="${escapeHTML(String(row.id))}"
  >
    <option
  value="unpaid"
  ${row.payment_status === "unpaid" ? "selected" : ""}
>
  🟠 ⏳ Belum Lunas
</option>

<option
  value="paid"
  ${row.payment_status === "paid" ? "selected" : ""}
>
  🟢 ✓ Lunas
</option>  
</select>
</td>

                       <td>
  <select
    class="recap-status-select recap-customer-status"
    data-id="${escapeHTML(String(row.id))}"
  >
    <option
      value="Belum Checkout Shopee"
      ${
        row.customer_status === "Belum Checkout Shopee"
          ? "selected"
          : ""
      }
    >
      ⏳ Belum Checkout Shopee
    </option>

    <option
      value="Sudah Checkout Shopee"
      ${
        row.customer_status === "Sudah Checkout Shopee"
          ? "selected"
          : ""
      }
    >
      🛒 Sudah Checkout Shopee
    </option>

    <option
      value="Sudah Menerima Barang"
      ${
        row.customer_status === "Sudah Menerima Barang"
          ? "selected"
          : ""
      }
    >
      📦 Sudah Menerima Barang
    </option>
  </select>
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

   html += `
  </div>
`;

container.innerHTML =
  html;


/* ==========================================
   KEMBALI KE KATEGORI
   ========================================== */

const backCategoryButton =
  container.querySelector(
    "#recapBackCategory"
  );

if (backCategoryButton) {

  backCategoryButton.addEventListener(
    "click",
    function() {

      const recapType =
        getRecapTypeFromCategory(
          category
        );

      container.style.display =
        "none";

      container.innerHTML =
        "";

      showRecapCategories(
        recapType
      );

    }
  );

}

/* ==========================================
   TAMBAH MEMBER / VERSI KE BATCH
   ========================================== */
   
container
  .querySelectorAll(
    ".add-recap-member-button"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function(event) {

          event.stopPropagation();

          const batchCode =
            this.dataset.batchCode;

          showAddRecapMemberForm(
            batchCode
          );

        }
      );

    }
  );

   /* ==========================================
   EDIT HEADER BATCH
   ========================================== */

container
  .querySelectorAll(
    ".edit-batch-header-button"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function(event) {

          event.preventDefault();
          event.stopPropagation();

          const batchCode =
            this.dataset.batchCode;

          const category =
            this.dataset.category;

          if (
            !batchCode ||
            !category
          ) {
            console.error(
              "Batch Code atau Category tidak ditemukan."
            );
            return;
          }

          editBatchHeader(
            batchCode,
            category
          );

        }
      );

    }
  );

   /* ==========================================
   COLLAPSE / EXPAND BATCH
   ========================================== */

container
  .querySelectorAll(
    ".recap-batch-card .recap-batch-header"
  )
  .forEach(
    function(header) {

      const card =
        header.closest(
          ".recap-batch-card"
        );

      if (!card) {
        return;
      }

      const tracking =
        card.querySelector(
          ".batch-tracking"
        );

      const tableWrapper =
        card.querySelector(
          ".product-table-wrapper"
        );

      /* Kondisi awal:
         batch tertutup */
      if (
        card.classList.contains(
          "recap-batch-collapsed"
        )
      ) {

        if (tracking) {
          tracking.style.display =
            "none";
        }

        if (tableWrapper) {
          tableWrapper.style.display =
            "none";
        }

      }

      header.addEventListener(
        "click",
        function(event) {

          /*
           * Jangan buka/tutup batch
           * ketika klik tombol atau select.
           */
          if (
            event.target.closest(
              "select, button"
            )
          ) {
            return;
          }

          const isCollapsed =
  card.classList.toggle(
    "recap-batch-collapsed"
  );

          if (isCollapsed) {

            if (tracking) {
              tracking.style.display =
                "none";
            }

            if (tableWrapper) {
              tableWrapper.style.display =
                "none";
            }

          } else {

            if (tracking) {
              tracking.style.display =
                "";
            }

            if (tableWrapper) {
              tableWrapper.style.display =
                "";
            }

          }

        }
      );

    }
  );

   /* ==========================================
   PAGINATION CUSTOMER PER BATCH
   ========================================== */

const CUSTOMER_PER_PAGE = 10;

container
  .querySelectorAll(
    ".recap-batch-card"
  )
  .forEach(
    function(card) {

      const tbody =
        card.querySelector(
          ".product-table tbody"
        );

      if (!tbody) {
        return;
      }

      const rows =
        Array.from(
          tbody.querySelectorAll("tr")
        );

      if (
        rows.length <=
        CUSTOMER_PER_PAGE
      ) {
        return;
      }

      const pagination =
        document.createElement("div");

      pagination.className =
        "recap-pagination";

      card.appendChild(
        pagination
      );

      let currentPage = 1;

      function renderPagination() {

        const visibleRows =
  rows.filter(
    function(row) {

      return (
        row.dataset.filterVisible !==
        "false"
      );

    }
  );

const totalPages =
  Math.ceil(
    visibleRows.length /
      CUSTOMER_PER_PAGE
  );

if (
  totalPages > 0 &&
  currentPage > totalPages
) {
  currentPage = totalPages;
}

rows.forEach(
  function(row) {

    row.style.display =
      "none";

  }
);

const start =
  (currentPage - 1) *
  CUSTOMER_PER_PAGE;

const pageRows =
  visibleRows.slice(
    start,
    start +
      CUSTOMER_PER_PAGE
  );

pageRows.forEach(
  function(row) {

    row.style.display =
      "";

  }
);
         
        pagination.innerHTML =
          "";

        if (
          totalPages <= 1
        ) {
          return;
        }

        const previousButton =
          document.createElement(
            "button"
          );

        previousButton.type =
          "button";

        previousButton.textContent =
          "‹";

        previousButton.disabled =
          currentPage === 1;

        previousButton.addEventListener(
          "click",
          function() {

            if (
              currentPage > 1
            ) {

              currentPage--;

              renderPagination();

            }

          }
        );

        pagination.appendChild(
          previousButton
        );


        for (
          let page = 1;
          page <= totalPages;
          page++
        ) {

          const pageButton =
            document.createElement(
              "button"
            );

          pageButton.type =
            "button";

          pageButton.textContent =
            page;

          if (
            page ===
            currentPage
          ) {

            pageButton.classList.add(
              "active"
            );

          }

          pageButton.addEventListener(
            "click",
            function() {

              currentPage =
                page;

              renderPagination();

            }
          );

          pagination.appendChild(
            pageButton
          );

        }


        const nextButton =
          document.createElement(
            "button"
          );

        nextButton.type =
          "button";

        nextButton.textContent =
          "›";

        nextButton.disabled =
          currentPage ===
          totalPages;

        nextButton.addEventListener(
          "click",
          function() {

            if (
              currentPage <
              totalPages
            ) {

              currentPage++;

              renderPagination();

            }

          }
        );

        pagination.appendChild(
          nextButton
        );


        const info =
          document.createElement(
            "span"
          );

        info.className =
          "recap-pagination-info";

        info.textContent =
          `${rows.length} customer`;

        pagination.appendChild(
          info
        );

      }

      renderPagination();

    }
  );

   /* ==========================================
   SEARCH + FILTER REKAP GO
   ========================================== */

const recapSearchInput =
  document.getElementById(
    "recapSearchInput"
  );

const recapSearchResult =
  document.getElementById(
    "recapSearchResult"
  );

const recapCustomerFilter =
  document.getElementById(
    "recapCustomerFilter"
  );

const recapDpFilter =
  document.getElementById(
    "recapDpFilter"
  );

const recapPaymentFilter =
  document.getElementById(
    "recapPaymentFilter"
  );


function applyRecapFilters() {

  const keyword =
    recapSearchInput
      ? recapSearchInput.value
          .trim()
          .toLowerCase()
      : "";

  const customerFilter =
    recapCustomerFilter
      ? recapCustomerFilter.value
      : "";

  const dpFilter =
    recapDpFilter
      ? recapDpFilter.value
      : "";

  const paymentFilter =
    recapPaymentFilter
      ? recapPaymentFilter.value
      : "";


  const batchCards =
    document.querySelectorAll(
      "#recapListContainer .recap-batch-card"
    );


  let visibleCount = 0;


  batchCards.forEach(
    function (card) {

      const searchText =
        card.dataset.search || "";


      const batchCode =
        card.querySelector(
          ".recap-batch-header h3"
        )?.textContent
        .trim()
        .toLowerCase() || "";


      const rows =
        card.querySelectorAll(
          ".product-table tbody tr"
        );


      let batchHasMatch = false;


      rows.forEach(
        function (row) {

          const rowText =
            row.textContent
              .toLowerCase();


          const matchesSearch =
            !keyword ||
            searchText.includes(
              keyword
            ) ||
            rowText.includes(
              keyword
            );


          const customerStatus =
            row.querySelector(
              ".recap-customer-status"
            )?.value || "";


          const dpStatus =
            row.querySelector(
              ".recap-dp-status"
            )?.value || "";


          const paymentStatus =
            row.querySelector(
              ".recap-payment-status"
            )?.value || "";


          const matchesCustomer =
            !customerFilter ||
            customerStatus ===
              customerFilter;


          const matchesDp =
            !dpFilter ||
            dpStatus ===
              dpFilter;


          const matchesPayment =
            !paymentFilter ||
            paymentStatus ===
              paymentFilter;


          const visible =
            matchesSearch &&
            matchesCustomer &&
            matchesDp &&
            matchesPayment;


          row.dataset.filterVisible =
  visible
    ? "true"
    : "false";


          if (visible) {
            batchHasMatch = true;
          }

        }
      );


      /*
       * Jika minimal satu customer
       * cocok, batch tetap tampil.
       */

      if (batchHasMatch) {

        card.style.display = "";

        visibleCount++;

      } else {

        card.style.display = "none";

      }

    }
  );


  if (
    !keyword &&
    !customerFilter &&
    !dpFilter &&
    !paymentFilter
  ) {

    recapSearchResult.textContent =
      "";

  } else if (
    visibleCount === 0
  ) {

    recapSearchResult.textContent =
      "Tidak ada hasil yang ditemukan.";

  } else {

    recapSearchResult.textContent =
      `${visibleCount} batch ditemukan.`;

  }

}


/* Pencarian */

if (recapSearchInput) {

  recapSearchInput.addEventListener(
    "input",
    applyRecapFilters
  );

}


/* Filter Status Customer */

if (recapCustomerFilter) {

  recapCustomerFilter.addEventListener(
    "change",
    applyRecapFilters
  );

}


/* Filter Status DP */

if (recapDpFilter) {

  recapDpFilter.addEventListener(
    "change",
    applyRecapFilters
  );

}


/* Filter Pembayaran */

if (recapPaymentFilter) {

  recapPaymentFilter.addEventListener(
    "change",
    applyRecapFilters
  );

}

   /* ==========================================
   TOMBOL EDIT REKAP GO
   LISTENER LANGSUNG
   ========================================== */

container
  .querySelectorAll(
    ".edit-recap-button"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        async function(event) {

          event.preventDefault();
          event.stopPropagation();

          const id =
            this.dataset.id;

          if (!id) {

            console.error(
              "ID Rekap GO tidak ditemukan."
            );

            return;
          }

          await editRecap(id);

        }
      );

    }
  );
   
   /* ==========================================
   AUTO SAVE STATUS REKAP GO
   ========================================== */

const recapStatusSelects =
  document.querySelectorAll(
    "#recapListContainer .recap-status-select"
  );


recapStatusSelects.forEach(
  function (select) {

    select.addEventListener(
      "change",
      async function () {

        const id =
          select.dataset.id;

        const value =
          select.value;

        if (!id) {
          return;
        }


        let updateData = {};


        if (
          select.classList.contains(
            "recap-dp-status"
          )
        ) {

          updateData = {
            dp_status: value
          };

        }


        else if (
          select.classList.contains(
            "recap-payment-status"
          )
        ) {

          updateData = {
            payment_status: value
          };

        }


        else if (
          select.classList.contains(
            "recap-customer-status"
          )
        ) {

          updateData = {
            customer_status: value
          };

        }


        const originalText =
          select.dataset.originalText ||
          select.options[
            select.selectedIndex
          ].textContent;


        select.disabled = true;


        const {
          error
        } =
          await supabaseClient
            .from(
              "purchase_recap"
            )
            .update(
              updateData
            )
            .eq(
              "id",
              id
            );


        select.disabled = false;


        if (error) {

          console.error(
            "ERROR UPDATE STATUS REKAP:",
            error
          );


          alert(
            "Gagal menyimpan perubahan status."
          );

          return;

        }


        select.dataset.originalText =
          select.options[
            select.selectedIndex
          ].textContent;

      }
    );

  }
);

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
   TAMBAH BATCH
   ========================================== */

const addRecapBatchButton =
  container.querySelector(
    "#addRecapBatchButton"
  );

if (addRecapBatchButton) {

  addRecapBatchButton.addEventListener(
    "click",
    function() {

      showRecapForm(
        category
      );

    }
  );

}

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
   DAPATKAN TIPE REKAP DARI KATEGORI 
   ============================================ */

function getRecapTypeFromCategory(category) {

  const treasureCategories = [
    "Truz",
    "Treasure KR",
    "Treasure JP",
    "Treasure CH",
    "Treasure Thai",
    "Treasure Album",
    "Treasure INA"
  ];

  const multiGroupCategories = [
    "NCT",
    "Lngshot",
    "Cortis",
    "Babymonster",
    "Ateez"
  ];

  const tabunganCategories = [
    "Tabungan Lightstick",
    "Tabungan Album"
  ];

  const jastipCategories = [
    "Jastip Korea",
    "Jastip Jepang",
    "Jastip Thailand",
    "Jastip China"
  ];


  if (
    treasureCategories.includes(
      category
    )
  ) {
    return "Treasure";
  }


  if (
    multiGroupCategories.includes(
      category
    )
  ) {
    return "Multi Group";
  }


  if (
    tabunganCategories.includes(
      category
    )
  ) {
    return "Tabungan";
  }


  if (
    jastipCategories.includes(
      category
    )
  ) {
    return "Jastip";
  }


  return null;
}

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

   const recapType =
  getRecapTypeFromCategory(
    category
  );

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


const batchDpDeadline =
  document.getElementById(
    "batchDpDeadline"
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
   OTOMATIS HARGA - DP
   ====================================== */

let remaining = 0;

if (
  priceMode === "same"
) {

  /*
   * Harga dan DP sama untuk semua customer.
   * Sisa pembayaran dihitung otomatis.
   */

  remaining =
    Math.max(
      0,
      commonPrice -
      commonDp
    );

} else {

  /*
   * Harga dan DP berbeda per customer.
   * Sisa pembayaran dihitung otomatis.
   */

  remaining =
    Math.max(
      0,
      price -
      dp
    );

}
       
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
  recap_type:
    recapType,

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

        dp_deadline:
  batchDpDeadline,

co_deadline: null

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
   EDIT HEADER BATCH
   ============================================ */

async function editBatchHeader(
  batchCode,
  category
) {

  const container =
    document.getElementById(
      "recapFormContainer"
    );

  if (!container) {
    return;
  }

  container.style.display =
    "block";

  container.innerHTML = `
    <div class="panel recap-form">

      <h3>
        ✏️ Edit Batch
      </h3>

      <p>
        Mengubah data utama batch:
        <strong>
          ${escapeHTML(batchCode)}
        </strong>
      </p>

      <div
        id="editBatchLoading"
      >
        Memuat data batch...
      </div>

    </div>
  `;


  /* ==========================================
     AMBIL SEMUA CUSTOMER DALAM BATCH
     ========================================== */

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
      .eq(
        "batch_code",
        batchCode
      )
      .order(
        "id",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD EDIT BATCH:",
      error
    );

    container.innerHTML = `
      <div class="panel">

        <h3>
          ❌ Gagal memuat batch
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
          Batch tidak ditemukan
        </h3>

        <p>
          Batch
          <strong>
            ${escapeHTML(batchCode)}
          </strong>
          tidak memiliki data.
        </p>

      </div>
    `;

    return;
  }


  /* ==========================================
     DATA UTAMA BATCH
     ========================================== */

  const firstRow =
    data[0];

  const batchPrice =
    Number(
      firstRow.item_price
    ) || 0;

  const batchDp =
    Number(
      firstRow.minimum_dp_amount ||
      firstRow.dp_amount ||
      0
    ) || 0;

  const batchRemaining =
    Math.max(
      0,
      batchPrice -
      batchDp
    );

   const isSamePriceModeHeader =
  data.length > 0 &&
  data.every(function(row) {

    const rowPrice =
      Number(
        row.item_price
      ) || 0;

    const rowDp =
      Number(
        row.minimum_dp_amount ??
        row.dp_amount ??
        0
      ) || 0;

    return (
      rowPrice === batchPrice &&
      rowDp === batchDp
    );

  });

  const batchTracking =
    firstRow.batch_tracking_status ||
    firstRow.tracking_status ||
    "";


  /* ==========================================
     FORM EDIT BATCH
     ========================================== */

  container.innerHTML = `

    <div class="panel recap-form">

      <h3>
        ✏️ Edit Batch
      </h3>

      <p>
        Batch:
        <strong>
          ${escapeHTML(batchCode)}
        </strong>
      </p>


      <form
        id="editBatchHeaderForm"
      >

        <label>
          Kategori
        </label>

        <input
          type="text"
          value="${escapeHTML(
            category
          )}"
          disabled
        >


        <label>
          Kode Batch
        </label>

        <input
          id="editBatchHeaderCode"
          type="text"
          value="${escapeHTML(
            batchCode
          )}"
          required
        >


        <label>
          Nama Barang
        </label>

        <input
          id="editBatchHeaderItemName"
          type="text"
          value="${escapeHTML(
            firstRow.item_name ||
            ""
          )}"
          required
        >


        ${
  isSamePriceModeHeader
    ? `

      <label>
        Harga Batch
      </label>

      <input
        id="editBatchHeaderPrice"
        type="number"
        min="0"
        value="${batchPrice}"
        required
      >

      <label>
        DP Batch
      </label>

      <input
        id="editBatchHeaderDp"
        type="number"
        min="0"
        value="${batchDp}"
        required
      >

      <label>
        Pelunasan / Sisa Pembayaran
      </label>

      <input
        id="editBatchHeaderRemaining"
        type="number"
        min="0"
        value="${batchRemaining}"
        readonly
      >

      <small>
        Pelunasan dihitung otomatis:
        Harga Batch − DP Batch.
      </small>

    `
    : ""
}

        <label>
          Deadline DP
        </label>

        <input
          id="editBatchHeaderDpDeadline"
          type="date"
          value="${
            firstRow.dp_deadline
              ? String(
                  firstRow.dp_deadline
                ).substring(0, 10)
              : ""
          }"
        >


        <label>
          Deadline Pelunasan
        </label>

        <input
          id="editBatchHeaderPaymentDeadline"
          type="date"
          value="${
            firstRow.payment_deadline
              ? String(
                  firstRow.payment_deadline
                ).substring(0, 10)
              : ""
          }"
        >


        <label>
          Deadline CO Shopee
        </label>

        <input
          id="editBatchHeaderCoDeadline"
          type="date"
          value="${
            firstRow.co_deadline
              ? String(
                  firstRow.co_deadline
                ).substring(0, 10)
              : ""
          }"
        >


        <label>
          Tracking Batch
        </label>

        <select
          id="editBatchHeaderTracking"
        >

          ${getTrackingOptions(
            category
          ).map(
            function(option) {

              return `
                <option
                  value="${escapeHTML(
                    option
                  )}"
                  ${
                    batchTracking ===
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


        <div
          class="form-actions"
        >

          <button
            type="submit"
            class="primary-button"
          >
            💾 Simpan Perubahan Batch
          </button>

          <button
            type="button"
            class="secondary-button"
            id="cancelEditBatchHeader"
          >
            Batal
          </button>

        </div>


        <p
          id="editBatchHeaderMessage"
          class="login-error"
        ></p>

      </form>

    </div>

  `;


  /* ==========================================
     HITUNG PELUNASAN OTOMATIS
     ========================================== */

  function updateBatchHeaderRemaining() {

    const price =
      Number(
        document
          .getElementById(
            "editBatchHeaderPrice"
          )
          .value
      ) || 0;

    const dp =
      Number(
        document
          .getElementById(
            "editBatchHeaderDp"
          )
          .value
      ) || 0;

    const remaining =
      Math.max(
        0,
        price - dp
      );

    document
      .getElementById(
        "editBatchHeaderRemaining"
      )
      .value =
      remaining;
  }


  if (isSamePriceModeHeader) {

  document
    .getElementById(
      "editBatchHeaderPrice"
    )
    .addEventListener(
      "input",
      updateBatchHeaderRemaining
    );


  document
    .getElementById(
      "editBatchHeaderDp"
    )
    .addEventListener(
      "input",
      updateBatchHeaderRemaining
    );

}

  /* ==========================================
     BATAL
     ========================================== */

  document
    .getElementById(
      "cancelEditBatchHeader"
    )
    .addEventListener(
      "click",
      function() {

        container.innerHTML =
          "";

        container.style.display =
          "none";

      }
    );


  /* ==========================================
     SIMPAN EDIT BATCH
     ========================================== */

  document
    .getElementById(
      "editBatchHeaderForm"
    )
    .addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();


        const message =
          document.getElementById(
            "editBatchHeaderMessage"
          );


        message.textContent =
          "Menyimpan perubahan batch...";


        const newBatchCode =
          document
            .getElementById(
              "editBatchHeaderCode"
            )
            .value
            .trim();


        const newItemName =
          document
            .getElementById(
              "editBatchHeaderItemName"
            )
            .value
            .trim();


        /* ======================================
   HARGA & DP
   HANYA UNTUK HARGA SAMA
   ====================================== */

let newPrice = null;
let newDp = null;
let totalDpPaid = 0;
let totalPelunasanPaid = 0;
let newDpStatus = null;
let newRemaining = null;
let newPaymentStatus = null;

if (isSamePriceModeHeader) {

  newPrice =
    Number(
      document
        .getElementById(
          "editBatchHeaderPrice"
        )
        .value
    ) || 0;


  newDp =
    Number(
      document
        .getElementById(
          "editBatchHeaderDp"
        )
        .value
    ) || 0;


  /* ======================================
     HITUNG PEMBAYARAN AKTUAL CUSTOMER
     ====================================== */

  const oldDpTarget =
    Number(
      firstRow.minimum_dp_amount ??
      firstRow.dp_amount ??
      0
    ) || 0;


  /* Ambil histori pembayaran batch */

  for (const row of data) {

    const {
      data: historyAllocations,
      error: historyError
    } =
      await supabaseClient
        .from(
          "dn_payment_allocations"
        )
        .select(
          "allocated_amount, payment_part, allocation_status, created_at"
        )
        .eq(
          "recap_id",
          row.id
        )
        .order(
          "created_at",
          {
            ascending: true
          }
        );


    if (historyError) {

      console.error(
        "ERROR FETCH PAYMENT HISTORY:",
        historyError
      );

      message.textContent =
        "Gagal mengambil histori pembayaran: " +
        historyError.message;

      return;
    }


    for (
      const history of
      historyAllocations || []
    ) {

      const amount =
        Number(
          history.allocated_amount
        ) || 0;


      if (
        history.payment_part ===
        "dp"
      ) {

        totalDpPaid +=
          amount;

        continue;
      }


      if (
        history.payment_part ===
        "pelunasan"
      ) {

        totalPelunasanPaid +=
          amount;

        continue;
      }


      if (
        history.payment_part ===
        "both"
      ) {

        const dpNeeded =
          Math.max(
            oldDpTarget -
            totalDpPaid,
            0
          );


        const dpPortion =
          Math.min(
            amount,
            dpNeeded
          );


        const pelunasanPortion =
          Math.max(
            amount -
            dpPortion,
            0
          );


        totalDpPaid +=
          dpPortion;

        totalPelunasanPaid +=
          pelunasanPortion;
      }

    }

  }


  /* ======================================
     STATUS DP
     BERDASARKAN DP TARGET BARU
     ====================================== */

  if (
    totalDpPaid <= 0
  ) {

    newDpStatus =
      "unpaid";

  } else if (
    totalDpPaid >= newDp
  ) {

    newDpStatus =
      "paid";

  } else {

    newDpStatus =
      "insufficient";

  }


  /* ======================================
     PELUNASAN BERDASARKAN PEMBAYARAN AKTUAL
     UNTUK HARGA SAMA
     ====================================== */

  const totalActualPaid =
    totalDpPaid +
    totalPelunasanPaid;


  newRemaining =
    newPrice -
    totalActualPaid;


  newPaymentStatus =
    newPrice > 0 &&
    totalActualPaid >= newPrice
      ? "paid"
      : "unpaid";

}
        
        const newDpDeadline =
          document
            .getElementById(
              "editBatchHeaderDpDeadline"
            )
            .value ||
          null;


        const newPaymentDeadline =
          document
            .getElementById(
              "editBatchHeaderPaymentDeadline"
            )
            .value ||
          null;


        const newCoDeadline =
          document
            .getElementById(
              "editBatchHeaderCoDeadline"
            )
            .value ||
          null;


        const newTracking =
          document
            .getElementById(
              "editBatchHeaderTracking"
            )
            .value;


        /* ======================================
   UPDATE SEMUA CUSTOMER DALAM BATCH
   ====================================== */

const updateData = {

  batch_code:
    newBatchCode,

  item_name:
    newItemName,

  dp_deadline:
    newDpDeadline,

  payment_deadline:
    newPaymentDeadline,

  co_deadline:
    newCoDeadline,

  tracking_status:
    newTracking,

  batch_tracking_status:
    newTracking

};

/* ======================================
   HARGA & DP
   HANYA JIKA HARGA SAMA
   ====================================== */

if (isSamePriceModeHeader) {

  updateData.item_price =
    newPrice;

  updateData.minimum_dp_amount =
    newDp;

  updateData.dp_amount =
    totalDpPaid;

  updateData.dp_status =
    newDpStatus;

  updateData.remaining_amount =
    newRemaining;

  updateData.payment_status =
    newPaymentStatus;

}

const {
  error: updateError
} =
  await supabaseClient
    .from("purchase_recap")
    .update(updateData)
    .eq("category", category)
    .eq("batch_code", batchCode);

        if (updateError) {

          console.error(
            "ERROR UPDATE BATCH:",
            updateError
          );

          message.textContent =
            "Gagal mengubah batch: " +
            updateError.message;

          return;
        }


        alert(
          "Data batch berhasil diperbarui. ♥"
        );


        container.innerHTML =
          "";

        container.style.display =
          "none";


        await loadRecapList(
          category
        );

      }
    );

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

/* TAMPILKAN FORM EDIT */
container.style.display = "block";


  const trackingOptions =
    getTrackingOptions(
      data.category
    );

   const currentTracking =
  data.batch_tracking_status ||
  data.tracking_status ||
  "";

const canSetPaymentDeadline =
  currentTracking === "Arrived WH INA" ||
  currentTracking === "Arrived Admin" ||
  currentTracking === "Goods Arrive at Customer";

const canSetCoDeadline =
  currentTracking === "Arrived Admin" ||
  currentTracking === "Goods Arrive at Customer";
   
   /* ==========================================
   DETEKSI MODE HARGA BATCH
   ========================================== */

const {
  data: batchRows,
  error: batchRowsError
} =
  await supabaseClient
    .from("purchase_recap")
    .select(`
      id,
      item_price,
      minimum_dp_amount,
      dp_amount
    `)
    .eq(
      "category",
      data.category
    )
    .eq(
      "batch_code",
      data.batch_code
    );

if (batchRowsError) {

  console.error(
    "ERROR LOAD BATCH ROWS FOR EDIT:",
    batchRowsError
  );

  alert(
    "Gagal membaca data batch: " +
    batchRowsError.message
  );

  return;
}

const rowsForMode =
  batchRows || [];

const firstBatchRow =
  rowsForMode[0] || data;

const firstBatchPrice =
  Number(
    firstBatchRow.item_price
  ) || 0;

const firstBatchDp =
  Number(
    firstBatchRow.minimum_dp_amount ??
    firstBatchRow.dp_amount ??
    0
  ) || 0;

const isSamePrice =
  rowsForMode.length > 0 &&
  rowsForMode.every(
    function(row) {

      return (
        Number(
          row.item_price
        ) || 0
      ) === firstBatchPrice;

    }
  );

const isSameDp =
  rowsForMode.length > 0 &&
  rowsForMode.every(
    function(row) {

      return (
        Number(
          row.minimum_dp_amount ??
          row.dp_amount ??
          0
        ) || 0
      ) === firstBatchDp;

    }
  );

const isSamePriceMode =
  isSamePrice &&
  isSameDp;

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

      <!-- ======================================
           KATEGORI
           ====================================== -->

      <label>
        Kategori
      </label>

      <input
        type="text"
        value="${escapeHTML(
          data.category || ""
        )}"
        disabled
      >


      <!-- ======================================
           FIELD TERSEMBUNYI
           UNTUK MENJAGA KOMPATIBILITAS
           SAVE LAMA
           ====================================== -->

      <input
        type="hidden"
        id="editBatchCode"
        value="${escapeHTML(
          data.batch_code || ""
        )}"
      >

      <input
        type="hidden"
        id="editItemName"
        value="${escapeHTML(
          data.item_name || ""
        )}"
      >

      <input
        type="hidden"
        id="editPaymentDeadline"
        value="${
          data.payment_deadline
            ? String(
                data.payment_deadline
              ).substring(0, 10)
            : ""
        }"
      >

      <input
        type="hidden"
        id="editCoDeadline"
        value="${
          data.co_deadline
            ? String(
                data.co_deadline
              ).substring(0, 10)
            : ""
        }"
      >


      <!-- ======================================
           CUSTOMER
           ====================================== -->

      <label>
        Customer
      </label>

      <input
        id="editCustomerName"
        type="text"
        value="${escapeHTML(
          data.customer_name || ""
        )}"
        required
      >


      <!-- ======================================
           VERSI / MEMBER
           ====================================== -->

      <label>
        Versi / Member
      </label>

      <input
        id="editVersion"
        type="text"
        value="${escapeHTML(
          data.version || ""
        )}"
      >


      <!-- ======================================
           QUANTITY
           ====================================== -->

      <label>
        Quantity
      </label>

      <input
        id="editQuantity"
        type="number"
        min="1"
        value="${
          data.quantity || 1
        }"
        required
      >


      <!-- ======================================
           HARGA & DP
           HANYA UNTUK HARGA BERBEDA
           ====================================== -->

      ${
        isSamePriceMode
          ? ""
          : `

            <label>
              Harga Barang
            </label>

            <input
              id="editItemPrice"
              type="number"
              min="0"
              value="${
                data.item_price || 0
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
                data.minimum_dp_amount ??
                data.dp_amount ??
                0
              }"
            >

          `
      }


      <!-- ======================================
           HIDDEN HARGA / DP
           UNTUK MODE HARGA SAMA
           ====================================== -->

      ${
        isSamePriceMode
          ? `

            <input
              type="hidden"
              id="editItemPrice"
              value="${
                data.item_price || 0
              }"
            >

            <input
              type="hidden"
              id="editDpAmount"
              value="${
                data.minimum_dp_amount ??
                data.dp_amount ??
                0
              }"
              />

          `
          : ""
      }


      <!-- ======================================
           HIDDEN STATUS DP
           AKAN OTOMATIS
           ====================================== -->

      <input
        type="hidden"
        id="editDpStatus"
        value="${
          data.dp_status || "unpaid"
        }"
      >


      <!-- ======================================
           PELUNASAN PER CUSTOMER
           ====================================== -->

      <label>
        Pelunasan
      </label>

      <input
  id="editRemaining"
  type="number"
  step="1"
  value="${
    Math.max(
      0,
      (Number(data.item_price) || 0) -
      (
        Number(
          data.minimum_dp_amount ??
          data.dp_amount ??
          0
        ) || 0
      )
    )
  }"
  readonly
>

      <small>
  Pelunasan dihitung otomatis berdasarkan
  Harga - DP Target.
</small>

      <!-- ======================================
           HIDDEN STATUS PELUNASAN
           AKAN OTOMATIS
           ====================================== -->

      <input
        type="hidden"
        id="editPaymentStatus"
        value="${
          data.payment_status || "unpaid"
        }"
      >


      <!-- ======================================
           STATUS CUSTOMER
           ====================================== -->

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


      <!-- ======================================
           CATATAN
           ====================================== -->

      <label>
        Catatan
      </label>

      <textarea
        id="editNote"
        rows="3"
      >${escapeHTML(
        data.note || ""
      )}</textarea>


      <!-- ======================================
           TOMBOL
           ====================================== -->

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

     // Otomatis scroll ke form Edit Rekap
  setTimeout(function () {
    container.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 50);

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

   /* ==========================================
   HITUNG PELUNASAN OTOMATIS
   HARGA BERBEDA
   Harga - DP Target
   ========================================== */

const editPriceInput =
  document.getElementById(
    "editItemPrice"
  );

const editDpInput =
  document.getElementById(
    "editDpAmount"
  );

const editRemainingInput =
  document.getElementById(
    "editRemaining"
  );

function updateEditRemaining() {

  // Hanya berlaku untuk Harga Berbeda
  if (isSamePriceMode) {
    return;
  }

  const price =
    Number(
      editPriceInput?.value
    ) || 0;

  const dpTarget =
    Number(
      editDpInput?.value
    ) || 0;

  const remaining =
    Math.max(
      0,
      price - dpTarget
    );

  if (editRemainingInput) {
    editRemainingInput.value =
      remaining;
  }
}

if (!isSamePriceMode) {

  editPriceInput?.addEventListener(
    "input",
    updateEditRemaining
  );

  editDpInput?.addEventListener(
    "input",
    updateEditRemaining
  );

  // Hitung nilai awal saat form dibuka
  updateEditRemaining();
}

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

          minimum_dp_amount:
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


/* ==========================================
   UPDATE DEADLINE BATCH
   ========================================== */

const paymentDeadline =
  document
    .getElementById(
      "editPaymentDeadline"
    )
    .value ||
  null;


const coDeadline =
  document
    .getElementById(
      "editCoDeadline"
    )
    .value ||
  null;

console.log(
  "CO DEADLINE YANG AKAN DISIMPAN:",
  coDeadline
);

console.log(
  "BATCH:",
  data.category,
  data.batch_code
);
         
/* ==========================================
   UPDATE DEADLINE PELUNASAN PER BATCH
   ========================================== */

const {
  error: paymentDeadlineError
} =
  await supabaseClient
    .from(
      "purchase_recap"
    )
    .update({
      payment_deadline:
        paymentDeadline
    })
    .eq(
      "category",
      data.category
    )
    .eq(
      "batch_code",
      data.batch_code
    );


if (paymentDeadlineError) {

  console.error(
    "ERROR UPDATE PAYMENT DEADLINE:",
    paymentDeadlineError
  );


  message.textContent =
    "Data customer tersimpan, tetapi Deadline Pelunasan gagal diperbarui: " +
    paymentDeadlineError.message;

  return;

}


/* ==========================================
   UPDATE DEADLINE CO SHOPEE PER BATCH
   ========================================== */

const {
  error: coDeadlineError
} =
  await supabaseClient
    .from(
      "purchase_recap"
    )
    .update({
      co_deadline:
        coDeadline
    })
    .eq(
      "category",
      data.category
    )
    .eq(
      "batch_code",
      data.batch_code
    );


if (coDeadlineError) {

  console.error(
    "ERROR UPDATE CO DEADLINE:",
    coDeadlineError
  );


  message.textContent =
    "Data tersimpan, tetapi Deadline CO Shopee gagal diperbarui: " +
    coDeadlineError.message;

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

<div class="po-running-section">
  <div class="po-running-section-header">
    <div>
      <h3>📦 PO Berjalan</h3>
      <p>PO yang sedang berlangsung</p>
    </div>
  </div>

  <div id="poRunningContainer" class="po-running-scroll">
    <p>Memuat PO berjalan...</p>
  </div>
</div>

<div class="po-running-section po-claim-section">
  <div class="po-running-section-header">
    <div>
      <h3>🎟️ Masih Bisa Claim</h3>
      <p>
        PO yang sudah melewati deadline tetapi masih memiliki
        member yang belum di-claim.
      </p>
    </div>
  </div>

  <div
    id="poClaimContainer"
    class="po-running-scroll"
  >
    <p>Memuat PO yang masih bisa di-claim...</p>
  </div>
</div>

<div class="po-running-section po-archive-section">

  <div class="po-running-section-header">
    <div>
      <h3>📦 Arsip Pesanan</h3>

      <p>
        PO yang sudah selesai dan tidak memiliki
        member yang masih bisa di-claim.
      </p>
    </div>
  </div>

  <div
    id="poArchiveContainer"
    class="po-running-scroll"
  >
    <p>
      Memuat arsip pesanan...
    </p>
  </div>

  <div
  id="poArchiveDetailContainer"
  style="display:none;"
></div>

</div>

      <div
        id="poFormContainer"
      ></div>


      <div id="poListContainer" style="display: none;">
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

  await loadPORunningList();

await loadPOClaimList();

await loadPOList();
   
   /* ==========================================
   RESTORE DRAFT PO SAAT KEMBALI KE PESANAN
========================================== */

if (
  window.dearNadiyaPODraft
) {

  const draft =
    window.dearNadiyaPODraft;

  showPOForm(
    draft.existingPO
      ? {
          ...draft.existingPO,
          ...draft
        }
      : draft
  );

}
   
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

   /* ==========================================
   SIMPAN PO YANG SEDANG DIKERJAKAN
   UNTUK RESTORE SAAT KEMBALI KE PESANAN
========================================== */

if (existingPO) {
  window.dearNadiyaEditingPO = {
    ...existingPO
  };
} else {
  window.dearNadiyaEditingPO = null;
}


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

<!-- JENIS PESANAN -->
<div
  class="form-group"
  style="grid-column:1 / -1;"
>
  <label>
    Jenis Pesanan
  </label>

  <select id="poOrderMode">
    <option
      value="manual"
      ${
        po.order_mode !== "claim"
          ? "selected"
          : ""
      }
    >
      📝 PO Manual
    </option>

    <option
      value="claim"
      ${
        po.order_mode === "claim"
          ? "selected"
          : ""
      }
    >
      🎟️ PO Claim Member
    </option>
  </select>

  <small>
    <strong>PO Manual:</strong>
    Customer diisi oleh Admin secara manual.
    <br>

    <strong>PO Claim Member:</strong>
    Member dapat dibuat tanpa customer terlebih dahulu
    dan nantinya dapat di-claim.
  </small>
</div>

          <!-- TIPE HARGA -->
<div
  class="form-group"
  style="grid-column:1 / -1;"
>
  <label>
    Penentuan Harga
  </label>

  <select id="poPriceMode">
    <option
      value="same"
      ${
        po.price_mode !== "different"
          ? "selected"
          : ""
      }
    >
      Harga sama per batch
    </option>

    <option
      value="different"
      ${
        po.price_mode === "different"
          ? "selected"
          : ""
      }
    >
      Harga berbeda per Member / Versi
    </option>
  </select>

  <small>
    <strong>Harga sama per batch:</strong>
    satu harga untuk seluruh Member / Versi.
    <br>

    <strong>Harga berbeda:</strong>
    setiap Member / Versi dapat memiliki harga sendiri.
  </small>
</div>


<!-- HARGA HEADER -->
<div
  class="form-group"
  id="poHeaderPriceGroup"
  style="grid-column:1 / -1;"
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

          <!-- TIPE DP -->
<div
  class="form-group"
  style="grid-column:1 / -1;"
>
  <label>
    Penentuan DP
  </label>

  <select id="poDPMode">
    <option
      value="same"
      ${
        po.dp_mode !== "different"
          ? "selected"
          : ""
      }
    >
      DP sama per batch
    </option>

    <option
      value="different"
      ${
        po.dp_mode === "different"
          ? "selected"
          : ""
      }
    >
      DP berbeda per Member / Versi
    </option>
  </select>

  <small>
    <strong>DP sama per batch:</strong>
    satu nominal DP untuk seluruh Member / Versi.
    <br>

    <strong>DP berbeda:</strong>
    setiap Member / Versi dapat memiliki nominal DP sendiri.
  </small>
</div>


<!-- DP HEADER -->
<div
  class="form-group"
  id="poHeaderDPGroup"
  style="grid-column:1 / -1;"
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
    ? new Date(
        po.close_date
      )
        .toISOString()
        .slice(0, 16)
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
    ? new Date(
        po.last_dp_date
      )
        .toISOString()
        .slice(0, 16)
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
  rowData = {},
  orderMode = "manual"
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
  class="po-field-group po-row-member-group"
>
  <label>
    Member / Versi
  </label>

  ${
    orderMode === "claim"
      ? `
        <select
          class="po-row-member"
        >
          <option value="">
            Pilih Member / Versi
          </option>
        </select>
      `
      : `
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
      `
  }

</div>

<div
  class="po-field-group po-row-customer-group"
>  
<label>
    Customer
  </label>

  <input
    type="text"
    class="po-row-customer"
    placeholder="Nama customer (opsional)"
    value="${escapeHTML(
      rowData.customer ||
      ""
    )}"
  >
</div>


<div
  class="po-field-group po-row-qty-group"
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
    class="po-field-group po-row-price-group"
  >

    <label>
      Harga
    </label>

    <input
      type="text"
      class="po-row-price"
      placeholder="Contoh: Rp150.000"
      value="${escapeHTML(
        rowData.price ||
        ""
      )}"
    >

  </div>


  <div
    class="po-field-group po-row-dp-group"
  >

    <label>
      DP
    </label>

    <input
      type="text"
      class="po-row-dp"
      placeholder="Contoh: Rp50.000"
      value="${escapeHTML(
        rowData.dp ||
        ""
      )}"
    >

  </div>


  <div
    class="po-field-group po-row-note-group"
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

  <div class="po-row-status">
  ${
    rowData.customer &&
    String(rowData.customer).trim()
      ? "🔵 Sudah Di-claim"
      : rowData.member &&
        String(rowData.member).trim()
        ? "🟢 Tersedia"
        : "⚪ Belum dikonfigurasi"
  }
</div>

${
  orderMode === "claim" &&
  rowData.member &&
  String(rowData.member).trim() &&
  !(
    rowData.customer &&
    String(rowData.customer).trim()
  )
    ? `
      <div class="po-row-claim-hint">
        🎟️ Member tersedia — isi nama Customer
        setelah claim melalui WhatsApp.
      </div>
    `
    : ""
}

`;


    rowsContainer.appendChild(
  row
);


/* ==========================================
   LOAD MASTER MEMBER UNTUK PO CLAIM
========================================== */

if (orderMode === "claim") {

  const memberSelect =
    row.querySelector(
      ".po-row-member"
    );

  if (memberSelect) {

    loadPOMembers()
      .then(function (members) {

        members.forEach(
          function (member) {

            const option =
              document.createElement(
                "option"
              );

            option.value =
              member.member_name;

            option.textContent =
              member.member_name +
              (
                member.group_name
                  ? " — " +
                    member.group_name
                  : ""
              );

            const currentMember =
              String(
                rowData.member ||
                rowData.version ||
                ""
              ).trim();

            if (
              currentMember &&
              currentMember ===
                String(
                  member.member_name ||
                  ""
                ).trim()
            ) {

              option.selected =
                true;

            }

            memberSelect.appendChild(
              option
            );

          }
        );

      })
      .catch(function (error) {

        console.error(
          "Gagal mengisi dropdown member:",
          error
        );

      });

  }

}


/* ==========================================
   HAPUS BARIS
========================================== */

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

     updatePOPriceAndDPMode();

  }

   /* ==========================================
   MODE HARGA & DP
========================================== */

function updatePOPriceAndDPMode() {

  const priceMode =
    document.getElementById(
      "poPriceMode"
    )?.value || "same";


  const dpMode =
    document.getElementById(
      "poDPMode"
    )?.value || "same";


  /* ==========================================
     HARGA HEADER
  ========================================== */

  const headerPriceGroup =
    document.getElementById(
      "poHeaderPriceGroup"
    );

  if (headerPriceGroup) {

    headerPriceGroup.style.display =
      priceMode === "different"
        ? "none"
        : "";

  }


  /* ==========================================
     HARGA PER MEMBER / VERSI
  ========================================== */

  document
    .querySelectorAll(
      ".po-row-price-group"
    )
    .forEach(
      function (group) {

        group.style.display =
          priceMode === "different"
            ? ""
            : "none";

      }
    );


  /* ==========================================
     DP HEADER
  ========================================== */

  const headerDPGroup =
    document.getElementById(
      "poHeaderDPGroup"
    );

  if (headerDPGroup) {

    headerDPGroup.style.display =
      dpMode === "different"
        ? "none"
        : "";

  }


  /* ==========================================
     DP PER MEMBER / VERSI
  ========================================== */

  document
    .querySelectorAll(
      ".po-row-dp-group"
    )
    .forEach(
      function (group) {

        group.style.display =
          dpMode === "different"
            ? ""
            : "none";

      }
    );

}

   /* ==========================================
   EVENT MODE HARGA
========================================== */

const poPriceMode =
  document.getElementById(
    "poPriceMode"
  );

if (poPriceMode) {

  poPriceMode.addEventListener(
    "change",
    updatePOPriceAndDPMode
  );

}


/* ==========================================
   EVENT MODE DP
========================================== */

const poDPMode =
  document.getElementById(
    "poDPMode"
  );

if (poDPMode) {

  poDPMode.addEventListener(
    "change",
    updatePOPriceAndDPMode
  );

}


/* Terapkan mode saat form pertama kali dibuka */
updatePOPriceAndDPMode();
  
   const currentOrderMode =
  document.getElementById("poOrderMode")?.value ||
  "manual";

if (existingRows.length > 0) {

  existingRows.forEach(function (row) {

    addPORow(
      row,
      currentOrderMode
    );

  });

} else {

  addPORow(
    {},
    currentOrderMode
  );

}


  document
  .getElementById(
    "addPORowButton"
  )
  .addEventListener(
    "click",
    function () {

      const currentOrderMode =
        document.getElementById(
          "poOrderMode"
        )?.value || "manual";

      addPORow(
        {},
        currentOrderMode
      );

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

   const poForm =
  document.getElementById(
    "poForm"
  );

if (poForm) {

  poForm.addEventListener(
    "input",
    function () {

      saveCurrentPODraft();

    }
  );

  poForm.addEventListener(
    "change",
    function () {

      saveCurrentPODraft();

    }
  );

}
   
}

/* ==========================================
   SIMPAN DRAFT PO DI MEMORI
   Hanya bertahan selama halaman belum di-refresh
========================================== */

function saveCurrentPODraft() {

  const form =
    document.getElementById("poForm");

  if (!form) {
    return;
  }

  const rows = [];

  document
    .querySelectorAll(
      "#poRowsContainer .po-item-row"
    )
    .forEach(function (row) {

      rows.push({

        member:
          row
            .querySelector(
              ".po-row-member"
            )
            ?.value
            ?.trim() || "",

        customer:
          row
            .querySelector(
              ".po-row-customer"
            )
            ?.value
            ?.trim() || "",

        quantity:
          Number(
            row
              .querySelector(
                ".po-row-quantity"
              )
              ?.value
          ) || 1,

        price:
          row
            .querySelector(
              ".po-row-price"
            )
            ?.value
            ?.trim() || "",

        dp:
          row
            .querySelector(
              ".po-row-dp"
            )
            ?.value
            ?.trim() || "",

        note:
          row
            .querySelector(
              ".po-row-note"
            )
            ?.value
            ?.trim() || ""

      });

    });


  window.dearNadiyaPODraft = {

    existingPO:
  window.dearNadiyaEditingPO ||
  null,
     
    title:
      document
        .getElementById("poTitle")
        ?.value
        ?.trim() || "",

    order_mode:
      document
        .getElementById("poOrderMode")
        ?.value || "manual",

    po_type:
      document
        .getElementById("poType")
        ?.value || "general",

    price_mode:
      document
        .getElementById("poPriceMode")
        ?.value || "same",

    dp_mode:
      document
        .getElementById("poDPMode")
        ?.value || "same",

    price_text:
      document
        .getElementById("poPrice")
        ?.value
        ?.trim() || "",

    dp_text:
      document
        .getElementById("poDP")
        ?.value
        ?.trim() || "",

    close_date:
      document
        .getElementById("poCloseDate")
        ?.value || "",

    last_dp_date:
      document
        .getElementById("poLastDPDate")
        ?.value || "",

    description:
      document
        .getElementById("poDescription")
        ?.value
        ?.trim() || "",

    list_data:
      rows

  };

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

   const orderMode =
  document
    .getElementById(
      "poOrderMode"
    )
    ?.value || "manual";


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


const price =
  row
    .querySelector(
      ".po-row-price"
    )?.value
    .trim() || "";


const dp =
  row
    .querySelector(
      ".po-row-dp"
    )?.value
    .trim() || "";


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

    price:
      price,

    dp:
      dp,

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

   const priceMode =
  document
    .getElementById(
      "poPriceMode"
    )
    ?.value || "same";


const dpMode =
  document
    .getElementById(
      "poDPMode"
    )
    ?.value || "same";

  const poData = {

  title:
    title,

  image_url:
    imageURL,

  po_type:
    poType,

     order_mode:
  orderMode,

  price_mode:
    priceMode,

  dp_mode:
    dpMode,

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
    )
    .select();
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

   if (
  existingPO &&
  (
    !result.data ||
    !result.data.length
  )
) {

  console.error(
    "UPDATE PO TIDAK MENGUBAH DATA:",
    result
  );

  alert(
    "Perubahan PO tidak masuk ke database. Silakan cek izin UPDATE pada tabel po_posts."
  );

  return;
}

  alert(
  existingPO
    ? "PO berhasil diperbarui. ♥"
    : "PO berhasil dibuat. ♥"
);

window.dearNadiyaPODraft =
  null;
   
const poFormContainer =
  document.getElementById(
    "poFormContainer"
  );

if (poFormContainer) {
  poFormContainer.innerHTML = "";
}

await loadPOList();
}

/* ============================================
   LOAD PO Running List
   ============================================ */

async function loadPORunningList() {
  const container = document.getElementById("poRunningContainer");

  if (!container) return;

  container.innerHTML = `<p>Memuat PO berjalan...</p>`;

  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseClient
      .from("po_posts")
      .select(`
        id,
        title,
        image_url,
        close_date,
        last_dp_date,
        created_at
      `)
      .or(`close_date.is.null,close_date.gte.${now}`)
      .order("created_at", {
        ascending: false
      });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="po-running-empty">
          Belum ada PO yang sedang berjalan.
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(po => `
      <div class="po-running-card" data-po-id="${po.id}">
        <div class="po-running-card-image">
          ${
            po.image_url
              ? `<img
                  src="${po.image_url}"
                  alt="${po.title || "Foto PO"}"
                >`
              : `<div class="po-running-card-placeholder">📦</div>`
          }
        </div>

        <div class="po-running-card-info">
          <h4>${po.title || "Tanpa Judul"}</h4>

          <p>
            <span>⏰ Batas PO</span>
            <strong>
              ${typeof formatDate === "function"
                ? formatDate(po.close_date)
                : (po.close_date || "-")}
            </strong>
          </p>

          <p>
            <span>💳 Batas DP</span>
            <strong>
              ${typeof formatDate === "function"
                ? formatDate(po.last_dp_date)
                : (po.last_dp_date || "-")}
            </strong>
          </p>
        </div>
      </div>
    `).join("");

     // ==========================================
// KLIK KARTU PO BERJALAN
// ==========================================

container
  .querySelectorAll(".po-running-card")
  .forEach(function (card) {

    card.addEventListener(
      "click",
      function () {

        const poId =
          this.dataset.poId;

        const poListContainer =
          document.getElementById(
            "poListContainer"
          );

        if (!poListContainer) {
          return;
        }

        // Tampilkan area detail
        poListContainer.style.display =
          "block";

        // Sembunyikan semua detail PO
        poListContainer
          .querySelectorAll(".po-card")
          .forEach(
            function (poCard) {

              if (
                String(
                  poCard.dataset.poId
                ) === String(poId)
              ) {

                poCard.style.display =
                  "";

              } else {

                poCard.style.display =
                  "none";

              }

            }
          );

        // Buat tombol kembali jika belum ada
        let backButton =
          document.getElementById(
            "backToPORunningButton"
          );

        if (!backButton) {

          backButton =
            document.createElement(
              "button"
            );

          backButton.type =
            "button";

          backButton.id =
            "backToPORunningButton";

          backButton.className =
            "secondary-button";

          backButton.textContent =
            "← Kembali ke PO Berjalan";

          poListContainer
            .insertBefore(
              backButton,
              poListContainer.firstChild
            );

        }

        // Fungsi kembali ke daftar kartu
        backButton.onclick =
          function () {

            poListContainer
              .querySelectorAll(
                ".po-card"
              )
              .forEach(
                function (poCard) {

                  poCard.style.display =
                    "";

                }
              );

            poListContainer.style.display =
              "none";

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          };

        // Scroll ke detail PO yang dipilih
        const selectedCard =
          poListContainer.querySelector(
            `.po-card[data-po-id="${poId}"]`
          );

        if (selectedCard) {

          setTimeout(
            function () {

              selectedCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });

            },
            100
          );

        }

      }
    );

  });

  } catch (error) {
    console.error("Gagal memuat PO berjalan:", error);

    container.innerHTML = `
      <div class="po-running-empty">
        Gagal memuat PO berjalan.
      </div>
    `;
  }
}

/* ============================================
   LOAD PO MASIH BISA CLAIM
   PO sudah melewati deadline tetapi masih
   memiliki member yang belum di-claim.
   ============================================ */

async function loadPOClaimList() {

  const container =
    document.getElementById(
      "poClaimContainer"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <p>
      Memuat PO yang masih bisa di-claim...
    </p>
  `;

  try {

    const now =
      new Date().toISOString();

    const { data, error } =
      await supabaseClient
        .from("po_posts")
        .select(`
          id,
          title,
          image_url,
          close_date,
          last_dp_date,
          created_at,
          order_mode,
          list_data
        `)
        .eq(
          "order_mode",
          "claim"
        )
        .not(
          "close_date",
          "is",
          null
        )
        .lt(
          "close_date",
          now
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {
      throw error;
    }

    const claimablePOs =
      (data || []).filter(
        function (po) {

          let rows =
            po.list_data || [];

          if (
            typeof rows ===
            "string"
          ) {
            try {
              rows =
                JSON.parse(
                  rows
                );
            } catch (error) {
              rows = [];
            }
          }

          if (
            !Array.isArray(rows)
          ) {
            rows = [];
          }

          return rows.some(
            function (row) {

              return (
                row &&
                row.member &&
                String(
                  row.member
                ).trim() &&
                !(
                  row.customer &&
                  String(
                    row.customer
                  ).trim()
                )
              );

            }
          );

        }
      );

    if (
      claimablePOs.length === 0
    ) {

      container.innerHTML = `
        <div class="po-running-empty">
          Tidak ada PO yang masih bisa di-claim.
        </div>
      `;

      return;
    }

    container.innerHTML =
      claimablePOs
        .map(
          function (po) {

            let rows =
              po.list_data || [];

            if (
              typeof rows ===
              "string"
            ) {
              try {
                rows =
                  JSON.parse(
                    rows
                  );
              } catch (error) {
                rows = [];
              }
            }

            if (
              !Array.isArray(rows)
            ) {
              rows = [];
            }

            const availableCount =
              rows.filter(
                function (row) {

                  return (
                    row &&
                    row.member &&
                    String(
                      row.member
                    ).trim() &&
                    !(
                      row.customer &&
                      String(
                        row.customer
                      ).trim()
                    )
                  );

                }
              ).length;

            return `
              <div
                class="po-running-card po-claim-card"
                data-po-id="${escapeHTML(
                  String(po.id)
                )}"
              >

                <div class="po-running-card-image">

                  ${
                    po.image_url
                      ? `
                        <img
                          src="${escapeHTML(
                            po.image_url
                          )}"
                          alt="${escapeHTML(
                            po.title ||
                            "Foto PO"
                          )}"
                        >
                      `
                      : `
                        <div class="po-running-card-no-image">
                          📦
                        </div>
                      `
                  }

                </div>

                <div class="po-running-card-info">

                  <h4>
                    ${escapeHTML(
                      po.title ||
                      "PO"
                    )}
                  </h4>

                  <p>
                    Selesai:
                    ${
                      po.close_date
                        ? new Date(
                            po.close_date
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            }
                          )
                        : "—"
                    }
                  </p>

                  <strong>
                    🟢 ${availableCount}
                    member masih tersedia
                  </strong>

                </div>

              </div>
            `;

          }
        )
        .join("");

/* ==========================================
   KLIK KARTU PO MASIH BISA CLAIM
   ========================================== */

container
  .querySelectorAll(
    ".po-claim-card"
  )
  .forEach(
    function (card) {

      card.addEventListener(
        "click",
        async function () {

          const poId =
            this.dataset.poId;

          if (!poId) {
            return;
          }

          try {

            /* Ambil PO langsung berdasarkan ID.
               Tidak menggunakan loadPOList()
               karena PO ini sudah melewati deadline. */

            const { data: po, error } =
              await supabaseClient
                .from("po_posts")
                .select("*")
                .eq(
                  "id",
                  poId
                )
                .single();

            if (error) {
              console.error(
                "Gagal mengambil detail PO claim:",
                error
              );

              alert(
                "Gagal membuka PO: " +
                error.message
              );

              return;
            }

            if (!po) {
              alert(
                "Data PO tidak ditemukan."
              );

              return;
            }

            /* Sembunyikan daftar PO biasa */
            const poListContainer =
              document.getElementById(
                "poListContainer"
              );

            if (poListContainer) {
              poListContainer.style.display =
                "none";
            }

            /* Buka form PO yang sudah ada */
            showPOForm(po);

            /* Scroll ke form */
            setTimeout(
              function () {

                const poFormContainer =
                  document.getElementById(
                    "poFormContainer"
                  );

                if (poFormContainer) {

                  poFormContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });

                }

              },
              100
            );

          } catch (error) {

            console.error(
              "Error membuka PO claim:",
              error
            );

            alert(
              "Terjadi kesalahan saat membuka PO."
            );

          }

        }
      );

    }
  );

  } catch (error) {

    console.error(
      "Gagal memuat PO masih bisa claim:",
      error
    );

    container.innerHTML = `
      <div class="po-running-empty">
        Gagal memuat PO yang masih bisa di-claim.
      </div>
    `;

  }

}

/* ============================================
   LOAD ARSIP PESANAN
   PO sudah melewati deadline dan seluruh
   member sudah memiliki customer.
   ============================================ */

async function loadPOArchiveList() {

  const container =
    document.getElementById(
      "poArchiveContainer"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <p>
      Memuat arsip pesanan...
    </p>
  `;

  try {

    const now =
      new Date().toISOString();

    const { data, error } =
      await supabaseClient
        .from("po_posts")
        .select(`
          id,
          title,
          image_url,
          close_date,
          last_dp_date,
          created_at,
          order_mode,
          list_data
        `)
        .not(
          "close_date",
          "is",
          null
        )
        .lt(
          "close_date",
          now
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {
      throw error;
    }

    const archivedPOs =
      (data || []).filter(
        function (po) {

          let rows =
            po.list_data || [];

          if (
            typeof rows ===
            "string"
          ) {

            try {

              rows =
                JSON.parse(
                  rows
                );

            } catch (error) {

              rows = [];

            }

          }

          if (
            !Array.isArray(
              rows
            )
          ) {

            rows = [];

          }

          /*
           * Arsip jika:
           * - tidak ada member kosong
           * - semua member yang dikonfigurasi
           *   sudah memiliki customer
           */

          const hasAvailableMember =
            rows.some(
              function (row) {

                return (
                  row &&
                  row.member &&
                  String(
                    row.member
                  ).trim() &&
                  !(
                    row.customer &&
                    String(
                      row.customer
                    ).trim()
                  )
                );

              }
            );

          return !hasAvailableMember;

        }
      );

    if (
      archivedPOs.length === 0
    ) {

      container.innerHTML = `
        <div class="po-running-empty">
          Belum ada arsip pesanan.
        </div>
      `;

      return;
    }

    container.innerHTML =
      archivedPOs
        .map(
          function (po) {

            return `
              <div
                class="po-running-card po-archive-card"
                data-po-id="${escapeHTML(
                  String(po.id)
                )}"
              >

                <div
                  class="po-running-card-image"
                >

                  ${
                    po.image_url
                      ? `
                        <img
                          src="${escapeHTML(
                            po.image_url
                          )}"
                          alt="${escapeHTML(
                            po.title ||
                            "Foto PO"
                          )}"
                        >
                      `
                      : `
                        <div
                          class="po-running-card-no-image"
                        >
                          📦
                        </div>
                      `
                  }

                </div>

                <div
                  class="po-running-card-info"
                >

                  <h4>
                    ${escapeHTML(
                      po.title ||
                      "PO"
                    )}
                  </h4>

                  <p>
                    Selesai:
                    ${
                      po.close_date
                        ? new Date(
                            po.close_date
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            }
                          )
                        : "—"
                    }
                  </p>

                  <strong>
                    ✅ Pesanan selesai
                  </strong>

                </div>

              </div>
            `;

          }
        )
        .join("");

         /* ==========================================
       KLIK ARSIP PESANAN
       ========================================== */

    container
      .querySelectorAll(
        ".po-archive-card"
      )
      .forEach(
        function (card) {

          card.addEventListener(
            "click",
            async function () {

              const poId =
                this.dataset.poId;

              if (!poId) {
                return;
              }

              try {

                const { data: po, error } =
                  await supabaseClient
                    .from("po_posts")
                    .select("*")
                    .eq(
                      "id",
                      poId
                    )
                    .single();

                if (error) {
                  throw error;
                }

                if (!po) {
                  alert(
                    "Data arsip pesanan tidak ditemukan."
                  );
                  return;
                }

                let rows =
                  po.list_data || [];

                if (
                  typeof rows ===
                  "string"
                ) {
                  try {
                    rows =
                      JSON.parse(rows);
                  } catch (error) {
                    rows = [];
                  }
                }

                if (
                  !Array.isArray(rows)
                ) {
                  rows = [];
                }

                const poListContainer =
                  document.getElementById(
                    "poListContainer"
                  );

                if (!poListContainer) {
                  return;
                }

                /* Sembunyikan daftar PO lama */
                poListContainer.style.display =
                  "none";

                /* Tampilkan detail arsip */
                const archiveDetail =
                  document.getElementById(
                    "poArchiveDetailContainer"
                  );

                if (!archiveDetail) {
                  return;
                }

                archiveDetail.style.display =
                  "block";

                archiveDetail.innerHTML = `
                  <div class="panel">

                    <div class="panel-header">

                      <div>
                        <h2>
                          📦 Arsip Pesanan
                        </h2>

                        <p>
                          ${escapeHTML(
                            po.title ||
                            "PO"
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        class="secondary-button"
                        id="backToPOArchiveButton"
                      >
                        ← Kembali ke Arsip
                      </button>

                    </div>

                    <div class="po-archive-detail">

                      <div class="po-archive-detail-info">

                        <div>
                          <span>Nama PO</span>
                          <strong>
                            ${escapeHTML(
                              po.title ||
                              "—"
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Tanggal Selesai</span>
                          <strong>
                            ${
                              po.close_date
                                ? new Date(
                                    po.close_date
                                  ).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric"
                                    }
                                  )
                                : "—"
                            }
                          </strong>
                        </div>

                        <div>
                          <span>Status</span>
                          <strong>
                            ✅ Selesai
                          </strong>
                        </div>

                      </div>

                      <div class="po-archive-detail-table">

                        <table class="product-table">

                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Member / Versi</th>
                              <th>Customer</th>
                              <th>Qty</th>
                              <th>Catatan</th>
                            </tr>
                          </thead>

                          <tbody>

                            ${
                              rows.length > 0
                                ? rows.map(
                                    function (
                                      row,
                                      index
                                    ) {

                                      return `
                                        <tr>

                                          <td>
                                            ${
                                              index +
                                              1
                                            }
                                          </td>

                                          <td>
                                            ${escapeHTML(
                                              row.member ||
                                              "—"
                                            )}
                                          </td>

                                          <td>
                                            ${escapeHTML(
                                              row.customer ||
                                              "—"
                                            )}
                                          </td>

                                          <td>
                                            ${escapeHTML(
                                              String(
                                                row.quantity ||
                                                1
                                              )
                                            )}
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
                                  ).join("")
                                : `
                                  <tr>
                                    <td
                                      colspan="5"
                                      style="
                                        text-align:center;
                                      "
                                    >
                                      Tidak ada data customer.
                                    </td>
                                  </tr>
                                `
                            }

                          </tbody>

                        </table>

                      </div>

                    </div>

                  </div>
                `;

                const backButton =
                  document.getElementById(
                    "backToPOArchiveButton"
                  );

                if (backButton) {

                  backButton.addEventListener(
                    "click",
                    function () {

                      archiveDetail.innerHTML =
                        "";

                      archiveDetail.style.display =
                        "none";

                      const archiveContainer =
                        document.getElementById(
                          "poArchiveContainer"
                        );

                      if (
                        archiveContainer
                      ) {

                        archiveContainer.scrollIntoView({
                          behavior: "smooth",
                          block: "start"
                        });

                      }

                    }
                  );

                }

                setTimeout(
                  function () {

                    archiveDetail.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });

                  },
                  100
                );

              } catch (error) {

                console.error(
                  "Gagal membuka arsip pesanan:",
                  error
                );

                alert(
                  "Gagal membuka arsip pesanan."
                );

              }

            }
          );

        }
      );

  } catch (error) {

    console.error(
      "Gagal memuat arsip pesanan:",
      error
    );

    container.innerHTML = `
      <div class="po-running-empty">
        Gagal memuat arsip pesanan.
      </div>
    `;

  }

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


  const now = new Date().toISOString();

const { data, error } = await supabaseClient
  .from("po_posts")
  .select("*")
  .or(`close_date.is.null,close_date.gte.${now}`)
  .order("created_at", {
    ascending: false
  });

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
  data-po-id="${po.id}"
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
  📦
  ${escapeHTML(
    po.title ||
    "Tanpa Judul"
  )}
</h3>

<span
  class="status-badge ${statusClass}"
>
  ${
    po.status === "active"
      ? "🟢 "
      : po.status === "closed"
        ? "🟡 "
        : "⚪ "
  }
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
    po.price_mode !== "different" &&
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
    po.dp_mode !== "different" &&
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
  ⏰ Batas PO:
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
  💳 Batas DP:
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
      <span class="po-table-icon">👤</span>
      Member / Versi
    </th>

    <th>
      <span class="po-table-icon">🧑</span>
      Customer
    </th>

    <th>
      <span class="po-table-icon">📦</span>
      Qty
    </th>

    ${
      po.price_mode === "different"
        ? `
          <th>
            <span class="po-table-icon">💰</span>
            Harga
          </th>
        `
        : ""
    }

    ${
      po.dp_mode === "different"
        ? `
          <th>
            <span class="po-table-icon">💳</span>
            DP
          </th>
        `
        : ""
    }

    <th>
  <span class="po-table-icon">📝</span>
  Catatan
</th>

<th>
  <span class="po-table-icon">📌</span>
  Status
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

          <!-- MEMBER / VERSI -->
          <td>
            ${escapeHTML(
              item.member ||
              "—"
            )}
          </td>


          <!-- CUSTOMER -->
          <td>
            ${escapeHTML(
              item.customer ||
              "—"
            )}
          </td>


          <!-- QTY -->
          <td>
            ${
              item.quantity ||
              1
            }
          </td>


         ${
  po.price_mode === "different"
    ? `
      <!-- HARGA PER CUSTOMER -->
      <td>
        ${escapeHTML(
          item.price ||
          "—"
        )}
      </td>
    `
    : ""
}


${
  po.dp_mode === "different"
    ? `
      <!-- DP PER CUSTOMER -->
      <td>
        ${escapeHTML(
          item.dp ||
          "—"
        )}
      </td>
    `
    : ""
}

          <!-- CATATAN -->
          <td>
            ${escapeHTML(
              item.note ||
              "—"
            )}
          </td>

          <!-- STATUS -->
<td>
  ${
    item.customer &&
    String(item.customer).trim()
      ? `
        <span class="po-status-claimed">
          🔵 Sudah di-claim
        </span>
      `
      : item.member &&
        String(item.member).trim()
        ? `
          <span class="po-status-available">
            🟢 Tersedia
          </span>
        `
        : `
          <span class="po-status-empty">
            ⚪ Belum dikonfigurasi
          </span>
        `
  }
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

          if (!selectedPO) {
            alert(
              "Data PO tidak ditemukan."
            );
            return;
          }

          window.dearNadiyaPODraft = {
  existingPO: selectedPO,
  ...selectedPO
};

showPOForm(
  selectedPO
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
   FORMAT TANGGAL PO
   ============================================ */

function formatDateTime(value) {

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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}

/* ============================================
   MASTER MEMBER / VERSI
   ============================================ */

async function loadMembers() {

  pageTitle.textContent =
    "Master Member / Versi";


  pageContent.innerHTML = `
    <div class="panel">

      <div class="panel-header">

        <div>
          <h2>
            👥 Master Member / Versi
          </h2>

          <p>
            Kelola daftar member atau versi
            yang nantinya digunakan pada form PO.
          </p>
        </div>

        <button
          type="button"
          class="primary-button"
          id="addMemberButton"
        >
          ➕ Tambah
        </button>

      </div>


      <div
        id="memberFormContainer"
        style="display:none;"
      ></div>


      <div
        id="memberListContainer"
      >
        <p>
          Memuat data...
        </p>
      </div>

    </div>
  `;


  const addButton =
    document.getElementById(
      "addMemberButton"
    );


  if (addButton) {

    addButton.addEventListener(
      "click",
      function () {

        showMemberForm();

      }
    );

  }


  await renderMemberList();

}

/* ============================================
   FORM TAMBAH / EDIT MEMBER
   ============================================ */

function showMemberForm(member = null) {

  const container =
    document.getElementById(
      "memberFormContainer"
    );

  if (!container) return;


  const isEdit = !!member;


  container.style.display = "block";


  container.innerHTML = `
    <div class="panel" style="margin-bottom:20px;">

      <div class="panel-header">

        <div>
          <h3>
            ${
              isEdit
                ? "✏️ Edit Member / Versi"
                : "➕ Tambah Member / Versi"
            }
          </h3>

          <p>
            ${
              isEdit
                ? "Perbarui data member / versi."
                : "Tambahkan member / versi baru ke master data."
            }
          </p>
        </div>

      </div>


      <div
        class="form-grid"
        style="
          display:grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap:16px;
        "
      >

        <!-- GROUP -->
        <div class="form-group">

          <label>
            Group
          </label>

          <input
            type="text"
            id="memberGroupName"
            placeholder="Contoh: Treasure"
            value="${
              isEdit
                ? escapeHTML(
                    member.group_name || ""
                  )
                : ""
            }"
          />

        </div>


        <!-- MEMBER / VERSI -->
        <div class="form-group">

          <label>
            Member / Versi
          </label>

          <input
            type="text"
            id="memberName"
            placeholder="Contoh: Hyunsuk"
            value="${
              isEdit
                ? escapeHTML(
                    member.member_name || ""
                  )
                : ""
            }"
          />

        </div>


        <!-- URUTAN -->
        <div class="form-group">

          <label>
            Urutan
          </label>

          <input
            type="number"
            id="memberSortOrder"
            min="0"
            value="${
              isEdit
                ? Number(
                    member.sort_order || 0
                  )
                : 0
            }"
          />

        </div>

      </div>


      <div
        style="
          display:flex;
          gap:10px;
          margin-top:20px;
        "
      >

        <button
          type="button"
          class="primary-button"
          id="saveMemberButton"
        >
          💾 Simpan
        </button>


        <button
          type="button"
          class="secondary-button"
          id="cancelMemberButton"
        >
          Batal
        </button>

      </div>

    </div>
  `;


  const saveButton =
    document.getElementById(
      "saveMemberButton"
    );

  const cancelButton =
    document.getElementById(
      "cancelMemberButton"
    );


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      function () {

        saveMember(
          member
        );

      }
    );

  }


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        container.style.display =
          "none";

        container.innerHTML = "";

      }
    );

  }


  setTimeout(function () {

    container.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 50);

}

/* ============================================
   SIMPAN MEMBER / VERSI
   ============================================ */

async function saveMember(member = null) {

  const groupInput =
    document.getElementById(
      "memberGroupName"
    );

  const memberInput =
    document.getElementById(
      "memberName"
    );

  const sortInput =
    document.getElementById(
      "memberSortOrder"
    );


  const groupName =
    groupInput?.value.trim() || "";

  const memberName =
    memberInput?.value.trim() || "";

  const sortOrder =
    Number(
      sortInput?.value || 0
    );


  /* ------------------------------------------
     VALIDASI
     ------------------------------------------ */

  if (!groupName) {

    alert(
      "Group belum diisi."
    );

    groupInput?.focus();

    return;

  }


  if (!memberName) {

    alert(
      "Member / Versi belum diisi."
    );

    memberInput?.focus();

    return;

  }


  /* ------------------------------------------
     DATA YANG DISIMPAN
     ------------------------------------------ */

  const memberData = {

    group_name:
      groupName,

    member_name:
      memberName,

    sort_order:
      sortOrder

  };


  try {

    let result;


    /* ----------------------------------------
       EDIT DATA
       ---------------------------------------- */

    if (member?.id) {

      result =
        await supabaseClient
          .from("po_members")
          .update(
            memberData
          )
          .eq(
            "id",
            member.id
          )
          .select();


    }

    /* ----------------------------------------
       TAMBAH DATA BARU
       ---------------------------------------- */

    else {

      result =
        await supabaseClient
          .from("po_members")
          .insert(
            memberData
          )
          .select();

    }


    /* ----------------------------------------
       CEK ERROR
       ---------------------------------------- */

    if (result.error) {

      console.error(
        "Gagal menyimpan member:",
        result.error
      );

      alert(
        "Gagal menyimpan data member.\n\n" +
        result.error.message
      );

      return;

    }


    /* ----------------------------------------
       BERHASIL
       ---------------------------------------- */

    alert(
      member?.id
        ? "Member berhasil diperbarui."
        : "Member berhasil ditambahkan."
    );


    const container =
      document.getElementById(
        "memberFormContainer"
      );


    if (container) {

      container.style.display =
        "none";

      container.innerHTML = "";

    }


    await renderMemberList();

  }

  catch (error) {

    console.error(
      "Error saveMember:",
      error
    );

    alert(
      "Terjadi kesalahan saat menyimpan data."
    );

  }

}

/* ============================================
   TAMPILKAN DAFTAR MEMBER / VERSI
   ============================================ */

async function renderMemberList() {

  const container =
    document.getElementById(
      "memberListContainer"
    );

  if (!container) return;


  container.innerHTML = `
    <p>
      Memuat data member...
    </p>
  `;


  try {

    const result =
      await supabaseClient
        .from("po_members")
        .select(`
          id,
          group_name,
          member_name,
          sort_order,
          created_at
        `)
        .order(
          "group_name",
          {
            ascending: true
          }
        )
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


    if (result.error) {

      console.error(
        "Gagal mengambil master member:",
        result.error
      );

      container.innerHTML = `
        <div class="panel">
          <p>
            Gagal memuat data member.
          </p>
        </div>
      `;

      return;

    }


    const members =
      result.data || [];


    if (members.length === 0) {

      container.innerHTML = `
        <div class="panel">
          <p>
            Belum ada data member / versi.
          </p>
        </div>
      `;

      return;

    }


    container.innerHTML = `

      <div class="panel">

        <div class="panel-header">

          <div>
            <h3>
              📋 Daftar Member / Versi
            </h3>

            <p>
              ${members.length}
              data tersedia
            </p>
          </div>

        </div>


        <div
          style="
            overflow-x:auto;
          "
        >

          <table
            style="
              width:100%;
              border-collapse:collapse;
            "
          >

            <thead>

              <tr>

                <th
                  style="
                    text-align:left;
                    padding:12px;
                  "
                >
                  Group
                </th>

                <th
                  style="
                    text-align:left;
                    padding:12px;
                  "
                >
                  Member / Versi
                </th>

                <th
                  style="
                    text-align:center;
                    padding:12px;
                  "
                >
                  Urutan
                </th>

                <th
                  style="
                    text-align:center;
                    padding:12px;
                  "
                >
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              ${members.map(function(item) {

                return `

                  <tr>

                    <td
                      style="
                        padding:12px;
                      "
                    >
                      ${escapeHTML(
                        item.group_name || ""
                      )}
                    </td>


                    <td
                      style="
                        padding:12px;
                      "
                    >
                      ${escapeHTML(
                        item.member_name || ""
                      )}
                    </td>


                    <td
                      style="
                        padding:12px;
                        text-align:center;
                      "
                    >
                      ${Number(
                        item.sort_order || 0
                      )}
                    </td>


                    <td
                      style="
                        padding:12px;
                        text-align:center;
                      "
                    >

                      <button
                        type="button"
                        class="secondary-button"
                        onclick='showMemberForm(${JSON.stringify(item)})'
                      >
                        ✏️ Edit
                      </button>

                    </td>

                  </tr>

                `;

              }).join("")}

            </tbody>

          </table>

        </div>

      </div>

    `;

  }

  catch (error) {

    console.error(
      "Error renderMemberList:",
      error
    );

    container.innerHTML = `
      <div class="panel">
        <p>
          Terjadi kesalahan saat memuat data member.
        </p>
      </div>
    `;

  }

}

/* ============================================
   AMBIL MASTER MEMBER UNTUK PO
   ============================================ */

async function loadPOMembers(groupName = "") {

  try {

    let query =
      supabaseClient
        .from("po_members")
        .select(`
          id,
          group_name,
          member_name,
          sort_order
        `)
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


    if (groupName) {

      query =
        query.eq(
          "group_name",
          groupName
        );

    }


    const result =
      await query;


    if (result.error) {

      console.error(
        "Gagal mengambil master member PO:",
        result.error
      );

      return [];

    }


    return result.data || [];

  }

  catch (error) {

    console.error(
      "Error loadPOMembers:",
      error
    );

    return [];

  }

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
   DELETE PO
   ============================================ */

async function deletePO(id) {

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
    "PO berhasil dihapus. ♥"
  );

  await loadPOList();

}

/* ============================================
   AKHIR ADMIN.JS
   ============================================ */
