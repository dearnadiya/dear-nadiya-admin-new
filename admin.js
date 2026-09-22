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

function formatNominalInput(value) {
  const digits =
    String(value || "")
      .replace(/[^\d]/g, "");

  if (!digits) {
    return "";
  }

  return Number(digits)
    .toLocaleString("id-ID");
}


function parseNominalInput(value) {
  return Number(
    String(value || "")
      .replace(/[^\d]/g, "")
  ) || 0;
}

document.addEventListener(
  "input",
  function(event) {

    const input =
      event.target;

    if (
      !input.matches(
        ".currency-input"
      )
    ) {
      return;
    }

    const cursorPosition =
      input.selectionStart;

    const oldValue =
      input.value;

    const numericValue =
      parseNominalInput(
        oldValue
      );

    input.value =
      formatNominalInput(
        numericValue
      );

    const difference =
      input.value.length -
      oldValue.length;

    try {
      input.setSelectionRange(
        cursorPosition + difference,
        cursorPosition + difference
      );
    } catch (error) {
      /* abaikan */
    }
  }
);

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
   WHATSAPP CUSTOMER
============================================ */

function normalizeWhatsAppNumber(value) {
  let number = String(value || "")
    .replace(/[^\d]/g, "");

  if (!number) {
    return "";
  }

  if (number.startsWith("0")) {
    number = "62" + number.substring(1);
  }

  if (number.startsWith("8")) {
    number = "62" + number;
  }

  return number;
}

function openCustomerWhatsApp(
  whatsapp,
  message
) {
  const number =
    normalizeWhatsAppNumber(
      whatsapp
    );

  if (!number) {
    alert(
      "Nomor WhatsApp customer belum tersedia."
    );
    return;
  }

  const url =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(
      message || ""
    );

  window.open(
    url,
    "_blank"
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
  "customers"
) {
  loadCustomers();
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
    customer_id,
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
   AMBIL NOMOR WA CUSTOMER
===================================== */

const customerIds = [
  ...new Set(
    rows
      .map(row =>
        Number(row.customer_id) || null
      )
      .filter(Boolean)
  )
];

let customerWhatsAppMap = {};

if (customerIds.length > 0) {
  const {
    data: customerData,
    error: customerError
  } =
    await supabaseClient
      .from("customers")
      .select(`
        id,
        name,
        whatsapp
      `)
      .in(
        "id",
        customerIds
      );

  if (customerError) {
    console.error(
      "ERROR LOAD CUSTOMER WHATSAPP:",
      customerError
    );
  } else {
    (
      customerData || []
    ).forEach(customer => {
      customerWhatsAppMap[
        String(customer.id)
      ] =
        customer.whatsapp || "";
    });
  }
}


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

   const DENDA_PER_HARI = 3000;

function hitungHariTerlambat(deadline) {
  if (!deadline) {
    return 0;
  }

  const deadlineDate = new Date(
    String(deadline).substring(0, 10) + "T00:00:00"
  );

  const todayDate = new Date(
    getTodayISO() + "T00:00:00"
  );

  const selisih =
    Math.floor(
      (todayDate - deadlineDate) /
      (1000 * 60 * 60 * 24)
    );

  return Math.max(0, selisih);
}

function hitungDenda(deadline) {
  return (
    hitungHariTerlambat(deadline) *
    DENDA_PER_HARI
  );
}

    /* =====================================
       TOTAL CUSTOMER
    ===================================== */

    const uniqueCustomers =
  new Set();

rows.forEach(row => {

  const customerId =
    Number(row.customer_id) || null;

  const customerName =
    String(
      row.customer_name || ""
    ).trim();

  const key =
    customerId
      ? `id:${customerId}`
      : customerName
        ? `name:${customerName}`
        : null;

  if (key) {
    uniqueCustomers.add(key);
  }

});

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

    const customerId =
      Number(row.customer_id) || null;

    const customerName =
      String(
        row.customer_name || ""
      ).trim();

    /*
      Customer ID menjadi identitas utama.

      Untuk data lama yang belum memiliki
      customer_id, gunakan nama sebagai fallback.
    */
    const groupKey =
      customerId
        ? `id:${customerId}`
        : `name:${customerName}`;

    if (
      !customerId &&
      !customerName
    ) {
      return;
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }

    grouped[groupKey].push(row);
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

             const customerDisplayName =
  customerRows.find(row =>
    String(row.customer_name || "").trim()
  )?.customer_name || customerName;

            let totalDP = 0;
let totalDendaDP = 0;
const rincianDendaDP = [];

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

const hariTerlambat =
  hitungHariTerlambat(
    row.dp_deadline
  );

const denda =
  hitungDenda(
    row.dp_deadline
  );

if (hariTerlambat > 0) {
  totalDendaDP += denda;

  rincianDendaDP.push(
    `• ${row.batch_code || "—"}: ${hariTerlambat} hari × ${formatRupiah(DENDA_PER_HARI)} = ${formatRupiah(denda)}`
  );
}

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


            const firstCustomerRow =
  customerRows[0];

const customerId =
  Number(
    firstCustomerRow?.customer_id
  ) || null;

const customerWhatsApp =
  customerWhatsAppMap[
    String(customerId)
  ] || "";

let dpMessage =
`Halo ${customerDisplayName} ♥
Kami dari Dear Nadiya ingin mengingatkan mengenai pembayaran DP untuk pesanan ${firstCustomerRow?.batch_code || ""}.

Total tagihan DP: ${formatRupiah(totalDP)}`;

if (totalDendaDP > 0) {
  dpMessage += `

Rincian keterlambatan:
${rincianDendaDP.join("\n")}

Total denda keterlambatan: ${formatRupiah(totalDendaDP)}

Total yang perlu dibayarkan:
${formatRupiah(totalDP + totalDendaDP)}`;
}

dpMessage += `

Mohon segera melakukan pembayaran ya.
Terima kasih ♥
Dear Nadiya`;

return `
  <div class="dashboard-customer-card">

    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
      "
    >
      <h4>
        ${customerDisplayName}
      </h4>

      ${
        customerWhatsApp
          ? `
            <button
              type="button"
              class="secondary-button"
              onclick='openCustomerWhatsApp(
                ${JSON.stringify(customerWhatsApp)},
                ${JSON.stringify(dpMessage)}
              )'
            >
              💬 Chat WhatsApp
            </button>
          `
          : `
            <span
              style="
                color:#999;
                font-size:13px;
              "
            >
              WA belum tersedia
            </span>
          `
      }
    </div>
                
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
let totalDendaPayment = 0;
const rincianDendaPayment = [];

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

const hariTerlambat =
  hitungHariTerlambat(
    row.payment_deadline
  );

const denda =
  hitungDenda(
    row.payment_deadline
  );

if (hariTerlambat > 0) {
  totalDendaPayment += denda;

  rincianDendaPayment.push(
    `• ${row.batch_code || "—"}: ${hariTerlambat} hari × ${formatRupiah(DENDA_PER_HARI)} = ${formatRupiah(denda)}`
  );
}

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

             const firstCustomerRow =
  customerRows[0];

const customerId =
  Number(
    firstCustomerRow?.customer_id
  ) || null;

const customerWhatsApp =
  customerWhatsAppMap[
    String(customerId)
  ] || "";

let paymentMessage =
`Halo ${customerName} ♥
Kami dari Dear Nadiya ingin mengingatkan bahwa pembayaran pelunasan pesanan ${firstCustomerRow?.batch_code || ""} masih memiliki sisa ${formatRupiah(totalPayment)}.

Deadline pelunasan:
${firstCustomerRow?.payment_deadline || "—"}`;

if (totalDendaPayment > 0) {
  paymentMessage += `

Rincian keterlambatan:
${rincianDendaPayment.join("\n")}

Total denda keterlambatan: ${formatRupiah(totalDendaPayment)}

Total yang perlu dibayarkan:
${formatRupiah(totalPayment + totalDendaPayment)}`;
}

paymentMessage += `

Mohon segera melakukan pelunasan ya.
Terima kasih ♥
Dear Nadiya`;

            return `
              <div class="dashboard-customer-card">

                <div
  style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
  "
>
  <h4>
    ${customerName}
  </h4>

  ${
    customerWhatsApp
      ? `
        <button
          type="button"
          class="secondary-button"
          onclick='openCustomerWhatsApp(
            ${JSON.stringify(customerWhatsApp)},
            ${JSON.stringify(paymentMessage)}
          )'
        >
          💬 Chat WhatsApp
        </button>
      `
      : `
        <span
          style="
            color:#999;
            font-size:13px;
          "
        >
          WA belum tersedia
        </span>
      `
  }
</div>

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

        const customerId =
          Number(row.customer_id) || null;

        const name =
          String(
            row.customer_name || ""
          ).trim();

        const deadline =
          normalizeDate(
            row.co_deadline
          );

        if (
          (!customerId && !name) ||
          !deadline
        ) {
          return null;
        }

        const groupKey =
          customerId
            ? `id:${customerId}`
            : `name:${name}`;

        return [
          groupKey,
          {
            customerId,
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

<span>
  ${
    customerWhatsAppMap[
      String(customer.customerId)
    ]
      ? `
        <button
          type="button"
          class="secondary-button"
          onclick='openCustomerWhatsApp(
            ${JSON.stringify(
              customerWhatsAppMap[
                String(customer.customerId)
              ]
            )},
            ${JSON.stringify(
`Halo ${customer.name} ♥
Pengingat dari Dear Nadiya, batas akhir checkout untuk pesanan ini adalah ${customer.deadline}.

Mohon segera melakukan checkout ya.
Terima kasih ♥
Dear Nadiya`
            )}
          )'
        >
          💬 Chat
        </button>
      `
      : `
        <span
          style="
            color:#999;
            font-size:13px;
          "
        >
          WA belum tersedia
        </span>
      `
  }
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
      customer_id,
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

          const customerId =
  Number(row.customer_id) || null;

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
  (customerId || customerName) &&
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

    const customerId =
      Number(row.customer_id) || null;

    const customerName =
      String(
        row.customer_name || ""
      ).trim();

    /*
      Customer ID menjadi identitas utama.

      Untuk data lama yang belum memiliki
      customer_id, gunakan nama sebagai fallback.
    */
    const groupKey =
      customerId
        ? `id:${customerId}`
        : `name:${customerName}`;


    if (
      !customerGroups[
        groupKey
      ]
    ) {

      customerGroups[
        groupKey
      ] = {
        customerId:
          customerId,

        customerName:
          customerName,

        items: []
      };

    }


    customerGroups[
      groupKey
    ].items.push(
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
    function(groupKey) {

      const group =
        customerGroups[
          groupKey
        ];

      const items =
        group.items;

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
        customerId:
          group.customerId,

        customerName:
          group.customerName,

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

         /* ======================================
   SIMPAN TANGGAL CO
   SAAT ADMIN MENGONFIRMASI
   LAPORAN CO CUSTOMER
   ====================================== */

if (
  result === "Dikonfirmasi"
) {

  const tanggalCO =
    new Date().toISOString();

  const {
    error: tanggalCoError
  } =
    await supabaseClient
      .from("purchase_recap")
      .update({
        tanggal_co:
          tanggalCO
      })
      .in(
        "id",
        recapIds
      );

  if (tanggalCoError) {

    console.error(
      "ERROR UPDATE TANGGAL CO:",
      tanggalCoError
    );

    alert(
      "Pesanan berhasil diproses, tetapi tanggal CO gagal disimpan: " +
      tanggalCoError.message
    );

    return;
  }
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

<div
  style="
    display:flex;
    gap:8px;
    align-items:center;
    flex-wrap:wrap;
  "
>
  <button
    type="button"
    class="primary-button"
    id="exportAllRecapButton"
  >
    📊 Export Semua Rekap
  </button>

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
  localStorage.getItem("dearNadiyaRecapType") || "Treasure";

let selectedRecapCategory =
  localStorage.getItem("dearNadiyaRecapCategory") || "";
   
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

selectedRecapCategory = "";

localStorage.setItem(
  "dearNadiyaRecapType",
  selectedRecapType
);

localStorage.removeItem(
  "dearNadiyaRecapCategory"
);

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

/* ==========================================
   EXPORT SELURUH REKAP GO
   ========================================== */

const exportAllRecapButton =
  document.getElementById(
    "exportAllRecapButton"
  );

if (exportAllRecapButton) {

  exportAllRecapButton.addEventListener(
    "click",
    async function() {

      if (
        typeof XLSX ===
        "undefined"
      ) {
        alert(
          "Library Excel belum tersedia."
        );

        return;
      }

      exportAllRecapButton.disabled =
        true;

      exportAllRecapButton.textContent =
        "⏳ Menyiapkan Excel...";

      try {

        const allRows = [];

        let from = 0;

        const pageSize = 1000;

        while (true) {

          const {
            data,
            error
          } =
            await supabaseClient
              .from(
                "purchase_recap"
              )
              .select("*")
              .order(
                "id",
                {
                  ascending: true
                }
              )
              .range(
                from,
                from + pageSize - 1
              );

          if (error) {
            throw error;
          }

          const rows =
            data || [];

          allRows.push(
            ...rows
          );

          if (
            rows.length <
            pageSize
          ) {
            break;
          }

          from += pageSize;

        }

        if (
          allRows.length === 0
        ) {

          alert(
            "Belum ada data Rekap GO."
          );

          return;
        }

        const exportData =
          allRows.map(
            function(item) {

              return {

                "ID":
                  item.id ?? "",

                "Kategori":
                  item.category ||
                  "",

                "Kode Batch":
                  item.batch_code ||
                  "",

                "Nama Barang":
                  item.item_name ||
                  "",

                "Customer ID":
                  item.customer_id ??
                  "",

                "Customer":
                  item.customer_name ||
                  "",

                "Member ID":
                  item.member_id ??
                  "",

                "Versi / Member":
                  item.version ||
                  "",

                "Quantity":
                  Number(
                    item.quantity
                  ) || 0,

                "Harga":
                  Number(
                    item.item_price
                  ) || 0,

                "DP Minimum":
                  Number(
                    item.minimum_dp_amount
                  ) || 0,

                "DP Aktual":
                  Number(
                    item.dp_amount
                  ) || 0,

                "Sisa Pembayaran":
                  Number(
                    item.remaining_amount
                  ) || 0,

                "Status DP":
                  item.dp_status ||
                  "",

                "Status Pembayaran":
                  item.payment_status ||
                  "",

                "Status Customer":
                  item.customer_status ||
                  "",

                "Tracking":
                  item.tracking_status ||
                  "",

                "Tracking Batch":
                  item.batch_tracking_status ||
                  "",

                "Deadline DP":
                  item.dp_deadline ||
                  "",

                "Deadline Pelunasan":
                  item.payment_deadline ||
                  "",

                "Deadline CO":
                  item.co_deadline ||
                  "",

                "Tanggal CO":
                  item.tanggal_co ||
                  "",

                "Tipe Rekap":
                  item.recap_data_type ||
                  "",

                "Note":
                  item.note ||
                  "",

                "Created At":
                  item.created_at ||
                  "",

                "Updated At":
                  item.updated_at ||
                  ""

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
          "Rekap GO Lengkap"
        );

        const now =
          new Date();

        const year =
          now.getFullYear();

        const month =
          String(
            now.getMonth() + 1
          ).padStart(2, "0");

        const day =
          String(
            now.getDate()
          ).padStart(2, "0");

        XLSX.writeFile(
          workbook,
          `Rekap-GO-Lengkap-${year}-${month}-${day}.xlsx`
        );

        alert(
          `Export berhasil. ${allRows.length} data Rekap GO dimasukkan ke Excel.`
        );

      } catch (error) {

        console.error(
          "ERROR EXPORT SEMUA REKAP:",
          error
        );

        alert(
          "Gagal export Rekap GO lengkap: " +
          error.message
        );

      } finally {

        exportAllRecapButton.disabled =
          false;

        exportAllRecapButton.textContent =
          "📊 Export Semua Rekap";

      }

    }
  );

}

  /* =====================================
     AWALNYA HANYA TYPE REKAP
     ===================================== */

 showRecapTypeSelection();

const savedTypeButton =
  document.querySelector(
    '#recapTypeButtons button[data-recap-type="' +
    CSS.escape(selectedRecapType) +
    '"]'
  );

if (savedTypeButton) {
  document
    .querySelectorAll(
      "#recapTypeButtons button"
    )
    .forEach(function(button) {
      button.classList.remove("active");
    });

  savedTypeButton.classList.add("active");
}

/* =====================================
   PULIHKAN KATEGORI TERAKHIR
   ===================================== */

if (selectedRecapCategory) {

  showRecapCategories(
    selectedRecapType
  );

  const restoreTimer =
    setInterval(function() {

      const categoryButton =
        document.querySelector(
          '#recapCategoryButtons > .recap-category-wrapper > .recap-category-card[data-category="' +
          CSS.escape(selectedRecapCategory) +
          '"]'
        );

      if (!categoryButton) {
        return;
      }

      clearInterval(
        restoreTimer
      );

      categoryButton.click();

    }, 100);

}
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

             localStorage.removeItem(
  "dearNadiyaRecapCategory"
);

selectedRecapCategory = "";

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
  category.icon ||
  categoryIcons[categoryName] ||
  "📦";

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
  data-icon="${escapeHTML(
    category.icon || "📁"
  )}"
  data-tracking-options="${escapeHTML(
    JSON.stringify(
      category.tracking_options ||
      getTrackingOptions(categoryName)
    )
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

localStorage.setItem(
  "dearNadiyaRecapCategory",
  selectedRecapCategory
);
             
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

<div class="form-group">

  <label>
    Ikon Kategori
  </label>

  <input
    type="text"
    id="newRecapCategoryIcon"
    placeholder="📦"
    autocomplete="off"
    maxlength="4"
    style="
      width: 90px;
      text-align: center;
      font-size: 28px;
    "
  >

  <small>
    Pilih emoji dari keyboard perangkat, misalnya
    📦 💿 🎀 🧸 💎 🇰🇷 🇯🇵
  </small>

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

const iconInput =
  container.querySelector(
    "#newRecapCategoryIcon"
  );

const categoryIcon =
  iconInput
    ? iconInput.value.trim()
    : "";

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
      categoryName,

    icon:
      categoryIcon || "📁",

    tracking_options:
      getTrackingOptions(
        categoryName
      )
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

             const currentIcon =
              this.dataset.icon || "📁";

             let currentTrackingOptions = [];

try {

  currentTrackingOptions =
    JSON.parse(
      this.dataset.trackingOptions ||
      "[]"
    );

} catch (error) {

  console.warn(
    "Tracking options kategori tidak valid:",
    error
  );

  currentTrackingOptions =
    getTrackingOptions(
      currentName
    );

}

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

<div class="form-group">

  <label>
    Ikon Kategori
  </label>

  <input
    type="text"
    id="editRecapCategoryIcon"
    value="${escapeHTML(
      currentIcon
    )}"
    placeholder="📦"
    autocomplete="off"
    maxlength="4"
    style="
      width: 90px;
      text-align: center;
      font-size: 28px;
    "
  >

  <small>
    Pilih emoji langsung dari keyboard perangkat,
    misalnya 📦 💿 🎀 🧸 💎 🇰🇷 🇯🇵
  </small>

</div>

<div class="form-group">

  <label>
    Tracking Options
  </label>

  <small>
    Pilih status tracking yang ingin digunakan
    untuk kategori ini.
  </small>

  <div
  id="editRecapTrackingOptions"
  style="
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 10px 20px;
    max-width: 700px;
  "
>
    ${[
      "Co Web / Seller",
      "Co Seller",
      "Arrived WH KR",
      "Arrived WH JP",
      "Arrived WH CH",
      "Arrived WH Thai",
      "Shipping INA",
      "Arrived WH INA",
      "Arrived Admin",
      "Goods Arrive at Customer"
    ]
      .map(function(option) {

        const checked =
          currentTrackingOptions.includes(
            option
          )
            ? "checked"
            : "";

        return `
          <label
  style="
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fafafa;
    font-size: 14px;
    min-height: 38px;
    box-sizing: border-box;
  "
>

            <input
              type="checkbox"
              class="edit-recap-tracking-option"
              value="${escapeHTML(
                option
              )}"
              ${checked}
            >

            <span>
              ${escapeHTML(option)}
            </span>

          </label>
        `;

      })
      .join("")}

  </div>

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

const iconInput =
  container.querySelector(
    "#editRecapCategoryIcon"
  );

if (!input) return;

const newName =
  input.value.trim();

const newIcon =
  iconInput
    ? iconInput.value.trim()
    : "";
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


const trackingCheckboxes =
  container.querySelectorAll(
    ".edit-recap-tracking-option"
  );


const newTrackingOptions =
  Array.from(
    trackingCheckboxes
  )
    .filter(function(checkbox) {
      return checkbox.checked;
    })
    .map(function(checkbox) {
      return checkbox.value;
    });


const {
  error: updateError
} =
  await supabaseClient
    .from("recap_categories")
    .update({

      category_name:
        newName,

      icon:
        newIcon || "📁",

      tracking_options:
        newTrackingOptions

    })
    .eq(
      "id",
      categoryId
    );


if (updateError) {

  console.error(
    "Gagal mengubah kategori:",
    updateError
  );

  alert(
    "Gagal mengubah kategori: " +
    updateError.message
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

   const recapDataType =
  batch.recap_data_type ||
  "baru";

const batchCoDeadline =
  batch.co_deadline ||
  null;

const batchArrivedAdminAt =
  batch.arrived_admin_at ||
  null;


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


  async function addMemberCard() {

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


      <label>Customer</label>

<div
  class="customer-picker"
  style="
    position:relative;
    width:100%;
  "
>
  <input
  type="text"
  class="batch-customer"
  placeholder="🔍 Cari DN ID / nama / username WA..."
  autocomplete="off"
>

  <input
    type="hidden"
    class="batch-customer-id"
  >

  <div
    class="batch-customer-results"
    style="
      display:none;
      position:absolute;
      z-index:9999;
      left:0;
      right:0;
      top:100%;
      background:#fff;
      border:1px solid #ddd;
      border-radius:8px;
      max-height:240px;
      overflow-y:auto;
      box-shadow:0 6px 18px rgba(0,0,0,.12);
    "
  ></div>
</div>
      
            <label>
        Versi / Member
      </label>

      <div
        class="member-picker"
        style="
          position:relative;
          width:100%;
        "
      >

        <input
          type="text"
          class="batch-version"
          placeholder="🔎 Cari member / character / versi..."
          autocomplete="off"
        >

        <input
          type="hidden"
          class="batch-member-id"
        >

        <div
          class="batch-member-results"
          style="
            display:none;
            position:absolute;
            z-index:9999;
            left:0;
            right:0;
            top:100%;
            background:#fff;
            border:1px solid #ddd;
            border-radius:8px;
            max-height:240px;
            overflow-y:auto;
            box-shadow:0 6px 18px rgba(0,0,0,.12);
          "
        ></div>

      </div>
      
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
          type="text"
          class="batch-price currency-input"
          min="0"
          value="${Number(
            batch.item_price || 0
          )}"
        >


        <label>
          DP
        </label>

        <input
  type="text"
  class="batch-dp currency-input"
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

     /* ==========================================
   SEARCHABLE DATA CUSTOMER
   ========================================== */

const customerInput =
  item.querySelector(
    ".batch-customer"
  );

const customerIdInput =
  item.querySelector(
    ".batch-customer-id"
  );

const customerResults =
  item.querySelector(
    ".batch-customer-results"
  );

if (
  customerInput &&
  customerIdInput &&
  customerResults
) {

  const {
    data: customers,
    error: customersError
  } = await supabaseClient
    .from("customers")
    .select(
      "id, dn_id, name, username_wa"
    )
    .order(
      "id",
      {
        ascending: true
      }
    );

  if (customersError) {

    console.error(
      "ERROR LOAD CUSTOMERS:",
      customersError
    );

    customerInput.placeholder =
      "Gagal memuat Data Customer";

  } else {

    const customerList =
      customers || [];

    customerInput.addEventListener(
      "input",
      function() {

        const keyword =
          this.value
            .trim()
            .toLowerCase();

        customerIdInput.value =
          "";

        if (!keyword) {

          customerResults.innerHTML =
            "";

          customerResults.style.display =
            "none";

          return;
        }

        const matches =
          customerList
            .filter(
              function(customer) {

                const dnId =
                  String(
                    customer.dn_id || ""
                  ).toLowerCase();

                const name =
                  String(
                    customer.name || ""
                  ).toLowerCase();

                const username =
                  String(
                    customer.username_wa || ""
                  ).toLowerCase();

                return (
                  dnId.includes(keyword) ||
                  name.includes(keyword) ||
                  username.includes(keyword)
                );
              }
            )
            .slice(0, 10);

        if (
  matches.length === 0
) {

  customerResults.innerHTML = `
    <button
      type="button"
      class="batch-create-customer-option"
      style="
        display:block;
        width:100%;
        text-align:left;
        padding:10px 12px;
        border:0;
        border-bottom:1px solid #eee;
        background:#fff;
        cursor:pointer;
        font-size:13px;
      "
    >
      ➕ Buat Customer Baru
    </button>

    <div
      style="
        padding:10px 12px;
        color:#777;
        font-size:12px;
      "
    >
      Customer tidak ditemukan
    </div>
  `;

  customerResults.style.display =
    "block";

  return;
}
         
        customerResults.innerHTML =
  matches
    .map(
      function(customer) {

        return `
          <button
            type="button"
            class="batch-customer-result"
            data-id="${escapeHTML(
              String(customer.id)
            )}"
            data-name="${escapeHTML(
              customer.name || ""
            )}"
            style="
              display:block;
              width:100%;
              text-align:left;
              padding:6px 10px;
              border:0;
              border-bottom:1px solid #eee;
              background:#fff;
              cursor:pointer;
              font-size:13px;
              line-height:1.25;
            "
          >

            <strong>
              ${escapeHTML(
                customer.dn_id || "—"
              )}
            </strong>

            —
            ${escapeHTML(
              customer.name ||
              "Tanpa Nama"
            )}

            ${
              customer.username_wa
                ? `
                  <small
                    style="
                      display:block;
                      color:#777;
                      margin-top:2px;
                      font-size:11px;
                    "
                  >
                    ${escapeHTML(
                      customer.username_wa
                    )}
                  </small>
                `
                : ""
            }

          </button>
        `;

      }
    )
    .join("") +

  `
    <button
      type="button"
      class="batch-create-customer-option"
      style="
        display:block;
        width:100%;
        text-align:left;
        padding:10px;
        border:0;
        background:#f8f9fa;
        cursor:pointer;
        font-weight:600;
        color:#2563eb;
      "
    >
      ＋ Buat Customer Baru
    </button>
  `;

customerResults.style.display =
  "block";
      }
    );

customerResults.addEventListener(
  "click",
  function(event) {

    const createButton =
      event.target.closest(
        ".batch-create-customer-option"
      );

    if (createButton) {

      showQuickCustomerForm(
        function(newCustomer) {

          /* Masukkan customer baru
             ke daftar pencarian card ini */
          customerList.push(
            newCustomer
          );

          /* Langsung pilih customer */
          customerInput.value =
            newCustomer.name || "";

          customerIdInput.value =
            newCustomer.id || "";

          customerResults.innerHTML =
            "";

          customerResults.style.display =
            "none";

        }
      );

      return;
    }


    const button =
      event.target.closest(
        ".batch-customer-result"
      );

    if (!button) {
      return;
    }

    customerInput.value =
      button.dataset.name || "";

    customerIdInput.value =
      button.dataset.id || "";

    customerResults.innerHTML =
      "";

    customerResults.style.display =
      "none";

  }
);

    document.addEventListener(
      "click",
      function(event) {

        if (
          !item.contains(event.target)
        ) {

          customerResults.style.display =
            "none";
        }

      }
    );

  }
}

     /* ==========================================
   SEARCHABLE MASTER MEMBER / VERSI
   ========================================== */

const memberInput =
  item.querySelector(
    ".batch-version"
  );

const memberIdInput =
  item.querySelector(
    ".batch-member-id"
  );

const memberResults =
  item.querySelector(
    ".batch-member-results"
  );


if (
  memberInput &&
  memberIdInput &&
  memberResults
) {

  const {
    data: members,
    error: membersError
  } =
    await supabaseClient
      .from("po_members")
      .select(`
        id,
        group_name,
        member_name,
        entry_type,
        sort_order
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


  if (membersError) {

    console.error(
      "ERROR LOAD MASTER MEMBER:",
      membersError
    );

    memberInput.placeholder =
      "Gagal memuat Master Member";

  } else {

    const memberList =
      members || [];


    memberInput.addEventListener(
      "input",
      function() {

        const keyword =
          this.value
            .trim()
            .toLowerCase();


        memberIdInput.value =
          "";


        if (!keyword) {

          memberResults.innerHTML =
            "";

          memberResults.style.display =
            "none";

          return;

        }


        const matches =
          memberList
            .filter(
              function(member) {

                const groupName =
                  String(
                    member.group_name || ""
                  ).toLowerCase();

                const memberName =
                  String(
                    member.member_name || ""
                  ).toLowerCase();

                const entryType =
                  String(
                    member.entry_type || ""
                  ).toLowerCase();


                return (
                  groupName.includes(keyword) ||
                  memberName.includes(keyword) ||
                  entryType.includes(keyword)
                );

              }
            )
            .slice(0, 15);


        if (
          matches.length === 0
        ) {

          memberResults.innerHTML = `
            <div
              style="
                padding:10px 12px;
                color:#777;
                font-size:12px;
              "
            >
              Member / versi tidak ditemukan
            </div>
          `;

          memberResults.style.display =
            "block";

          return;

        }


        memberResults.innerHTML =
          matches
            .map(
              function(member) {

                let typeLabel =
                  "Member";


                if (
                  member.entry_type ===
                  "character"
                ) {

                  typeLabel =
                    "Character";

                }


                if (
                  member.entry_type ===
                  "version"
                ) {

                  typeLabel =
                    "Version";

                }


                return `
                  <button
                    type="button"
                    class="batch-member-result"
                    data-id="${escapeHTML(
                      String(member.id)
                    )}"
                    data-name="${escapeHTML(
                      member.member_name || ""
                    )}"
                    style="
                      display:block;
                      width:100%;
                      text-align:left;
                      padding:8px 10px;
                      border:0;
                      border-bottom:1px solid #eee;
                      background:#fff;
                      cursor:pointer;
                      font-size:13px;
                      line-height:1.25;
                    "
                  >

                    <strong>
                      ${escapeHTML(
                        member.member_name || "—"
                      )}
                    </strong>

                    <div
                      style="
                        margin-top:2px;
                        color:#777;
                        font-size:11px;
                      "
                    >
                      ${escapeHTML(
                        member.group_name || "—"
                      )}
                      ·
                      ${typeLabel}
                    </div>

                  </button>
                `;

              }
            )
            .join("");


        memberResults.style.display =
          "block";


        memberResults
          .querySelectorAll(
            ".batch-member-result"
          )
          .forEach(
            function(button) {

              button.addEventListener(
                "click",
                function() {

                  const memberId =
                    this.dataset.id || "";

                  const memberName =
                    this.dataset.name || "";


                  memberInput.value =
                    memberName;

                  memberIdInput.value =
                    memberId;


                  memberResults.innerHTML =
                    "";

                  memberResults.style.display =
                    "none";

                }
              );

            }
          );

      }
    );


    document.addEventListener(
      "click",
      function(event) {

        if (
          !item.contains(
            event.target
          )
        ) {

          memberResults.style.display =
            "none";

        }

      }
    );

  }

}

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
              "Minimal harus ada 1 member / versi.";

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

            const customerInput =
  item.querySelector(
    ".batch-customer"
  );

const customerId =
  Number(
    item.querySelector(
      ".batch-customer-id"
    ).value
  ) || null;

const customer =
  customerInput
    .value
    .trim();

            const version =
  item
    .querySelector(
      ".batch-version"
    )
    .value
    .trim();


const memberId =
  Number(
    item.querySelector(
      ".batch-member-id"
    )?.value
  ) || null;


            const quantity =
              Number(
                item
                  .querySelector(
                    ".batch-quantity"
                  )
                  .value
              ) || 1;


            const price =
  parseNominalInput(
    item
      .querySelector(
        ".batch-price"
      )
      .value
  );


const dp =
  parseNominalInput(
    item
      .querySelector(
        ".batch-dp"
      )
      .value
  );


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

              customer_id:
  customerId,

customer_name:
  customer,

member_id:
  memberId,

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

recap_data_type:
  recapDataType,

co_deadline:
  batchCoDeadline,

arrived_admin_at:
  batchArrivedAdminAt
               
            });

          }
        );


        /* ======================================
   CEK DATA WAJIB
====================================== */

const incomplete =
  records.find(
    function(record) {

      return (
  !record.customer_id ||
  !record.customer_name ||
  !record.version
);

    }
  );


if (incomplete) {

  if (message) {

    message.textContent =
      "Versi / Member wajib dipilih dari master!";

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
  "id, recap_type, category_name, icon, tracking_options"
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

  <label>Harga Satuan</label>

  <input
    id="batchCommonPrice"
    type="text"
    class="currency-input"
    value=""
    placeholder="50.000"
  >

  <label>DP Satuan</label>

  <input
    id="batchCommonDp"
    type="text"
    class="currency-input"
    value=""
    placeholder="20.000"
  >

  <small>
    Harga dan DP di atas adalah harga per 1 pcs.
    Total akan otomatis mengikuti Quantity masing-masing customer.
  </small>

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

<label>Jenis Rekap</label>

<select id="batchRecapDataType">
  <option value="baru">
    Rekap Baru
  </option>

  <option value="lama">
    Rekap Lama
  </option>
</select>

<small>
  Rekap Lama = Deadline CO diisi manual dari data sebelumnya.
  Rekap Baru = Deadline CO dihitung otomatis 3 bulan setelah Arrived Admin.
</small>


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

        <label>
  Deadline CO Shopee
</label>

<input
  type="date"
  id="batchCoDeadline"
>

<small id="batchCoDeadlineInfo">
  Untuk Rekap Baru, deadline akan dihitung otomatis
  saat batch menjadi Arrived Admin.
</small>

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

   const recapDataTypeSelect =
  document.getElementById(
    "batchRecapDataType"
  );

const coDeadlineInput =
  document.getElementById(
    "batchCoDeadline"
  );

const coDeadlineInfo =
  document.getElementById(
    "batchCoDeadlineInfo"
  );

function updateCoDeadlineMode() {

  if (!recapDataTypeSelect ||
      !coDeadlineInput) {
    return;
  }

  if (
    recapDataTypeSelect.value ===
    "lama"
  ) {

    coDeadlineInput.readOnly =
      false;

    coDeadlineInput.required =
      false;

    if (coDeadlineInfo) {
      coDeadlineInfo.textContent =
        "Rekap Lama: masukkan Deadline CO dari rekap sebelumnya.";
    }

  } else {

    coDeadlineInput.readOnly =
      true;

    coDeadlineInput.required =
      false;

    coDeadlineInput.value =
      "";

    if (coDeadlineInfo) {
      coDeadlineInfo.textContent =
        "Rekap Baru: Deadline CO dihitung otomatis 3 bulan setelah Arrived Admin.";
    }

  }

}

if (recapDataTypeSelect) {

  recapDataTypeSelect.addEventListener(
    "change",
    updateCoDeadlineMode
  );

}

updateCoDeadlineMode();


  let itemNumber = 0;


  /* ==========================================
     TAMBAH CUSTOMER
     ========================================== */

  async function addBatchItem() {
     
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

<div
  class="customer-picker"
  style="
    position:relative;
    width:100%;
  "
>
  <input
    type="text"
    class="batch-customer"
    placeholder="🔍 Cari DN ID / nama / username WA..."
    autocomplete="off"
  >

  <input
    type="hidden"
    class="batch-customer-id"
  >

  <div
    class="batch-customer-results"
    style="
      display:none;
      position:absolute;
      z-index:9999;
      left:0;
      right:0;
      top:100%;
      background:#fff;
      border:1px solid #ddd;
      border-radius:8px;
      max-height:240px;
      overflow-y:auto;
      box-shadow:0 6px 18px rgba(0,0,0,.12);
    "
  ></div>
</div>
      <label>Versi / Member</label>

<div
  class="member-picker"
  style="
    position:relative;
    width:100%;
  "
>
  <input
    type="text"
    class="batch-version"
    placeholder="🔎 Cari member / character / versi..."
    autocomplete="off"
  >

  <input
    type="hidden"
    class="batch-member-id"
  >

  <div
    class="batch-member-results"
    style="
      display:none;
      position:absolute;
      z-index:9999;
      left:0;
      right:0;
      top:100%;
      background:#fff;
      border:1px solid #ddd;
      border-radius:8px;
      max-height:240px;
      overflow-y:auto;
      box-shadow:0 6px 18px rgba(0,0,0,.12);
    "
  ></div>
</div>


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
  type="text"
  class="batch-price currency-input"
  value=""
  placeholder="50.000"
>

        <label>DP</label>

        <input
  type="text"
  class="batch-dp currency-input"
  value=""
  placeholder="50.000"
>

            </div>


      <!-- ====================================
           TOTAL HARGA CUSTOMER
           MENGIKUTI QUANTITY
           ==================================== -->

      <label>Total Harga</label>

      <input
        type="text"
        class="batch-total-price currency-input"
        value="0"
        readonly
      >

      <label>Total DP</label>

      <input
        type="text"
        class="batch-total-dp currency-input"
        value="0"
        readonly
      >


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
  type="text"
  class="batch-remaining currency-input"
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

     /* ==========================================
   SEARCHABLE DATA CUSTOMER
   ========================================== */

const customerInput =
  item.querySelector(".batch-customer");

const customerIdInput =
  item.querySelector(".batch-customer-id");

const customerResults =
  item.querySelector(".batch-customer-results");

if (
  customerInput &&
  customerIdInput &&
  customerResults
) {

  const {
    data: customers,
    error: customersError
  } = await supabaseClient
    .from("customers")
    .select(
      "id, dn_id, name, username_wa"
    )
    .order(
      "id",
      {
        ascending: true
      }
    );

  if (customersError) {

    console.error(
      "ERROR LOAD CUSTOMERS:",
      customersError
    );

    customerInput.placeholder =
      "Gagal memuat Data Customer";

  } else {

    const customerList =
      customers || [];

     // Sinkronisasi customer baru ke seluruh picker
function syncNewCustomer(event) {
  const newCustomer =
    event.detail;

  if (!newCustomer || !newCustomer.id) {
    return;
  }

  const exists =
    customerList.some(
      function(customer) {
        return String(customer.id) ===
          String(newCustomer.id);
      }
    );

  if (!exists) {
    customerList.push(
      newCustomer
    );
  }
}

document.addEventListener(
  "dearNadiyaCustomerCreated",
  syncNewCustomer
);

    customerInput.addEventListener(
      "input",
      function() {

        const keyword =
          this.value
            .trim()
            .toLowerCase();

        customerIdInput.value =
          "";

        if (!keyword) {

          customerResults.innerHTML =
            "";

          customerResults.style.display =
            "none";

          return;
        }

        const matches =
          customerList
            .filter(
              function(customer) {

                const dnId =
                  String(
                    customer.dn_id || ""
                  )
                    .toLowerCase();

                const name =
                  String(
                    customer.name || ""
                  )
                    .toLowerCase();

                const username =
                  String(
                    customer.username_wa || ""
                  )
                    .toLowerCase();

                return (
                  dnId.includes(keyword) ||
                  name.includes(keyword) ||
                  username.includes(keyword)
                );
              }
            )
            .slice(0, 10);

        if (
  matches.length === 0
) {

  customerResults.innerHTML = `
    <button
      type="button"
      class="batch-create-customer-option"
      style="
        display:block;
        width:100%;
        text-align:left;
        padding:10px 12px;
        border:0;
        border-bottom:1px solid #eee;
        background:#fff;
        cursor:pointer;
        font-size:13px;
      "
    >
      ➕ Buat Customer Baru: "${escapeHTML(this.value.trim())}"
    </button>

    <div
      style="
        padding:10px 12px;
        color:#777;
        font-size:12px;
      "
    >
      Customer tidak ditemukan
    </div>
  `;

  customerResults.style.display =
    "block";

  return;
}
         
        customerResults.innerHTML =
          matches
            .map(
              function(customer) {

                return `
                  <button
                    type="button"
  class="batch-customer-result"
  data-id="${escapeHTML(
    String(customer.id)
  )}"
  data-name="${escapeHTML(
    customer.name || ""
  )}"
  style="
    display:block;
    width:100%;
    text-align:left;
    padding:6px 10px;
    border:0;
    border-bottom:1px solid #eee;
    background:#fff;
    cursor:pointer;
    font-size:13px;
    line-height:1.25;
  "
>

                    <strong>
                      ${escapeHTML(
                        customer.dn_id || "—"
                      )}
                    </strong>

                    —
                    ${escapeHTML(
                      customer.name ||
                      "Tanpa Nama"
                    )}

                    ${
                      customer.username_wa
                        ? `
                          <small
  style="
    display:block;
    color:#777;
    margin-top:2px;
    font-size:11px;
  "
>
                            ${escapeHTML(
                              customer.username_wa
                            )}
                          </small>
                        `
                        : ""
                    }
                  </button>
                `;

              }
            )
            .join("");

        customerResults.style.display =
          "block";
      }
    );


    customerResults.addEventListener(
  "click",
  function(event) {

    /* ==========================================
       BUAT CUSTOMER BARU
    ========================================== */

    const createButton =
      event.target.closest(
        ".batch-create-customer-option"
      );

    if (createButton) {

      showQuickCustomerForm(
        function(newCustomer) {

          /* Masukkan customer baru
             ke daftar customer item ini */
          customerList.push(
            newCustomer
          );

          /* Langsung pilih customer baru */
          customerInput.value =
            newCustomer.name || "";

          customerIdInput.value =
            newCustomer.id || "";

          customerResults.innerHTML =
            "";

          customerResults.style.display =
            "none";
        }
      );

      return;
    }


    /* ==========================================
       PILIH CUSTOMER YANG SUDAH ADA
    ========================================== */

    const button =
      event.target.closest(
        ".batch-customer-result"
      );

    if (!button) {
      return;
    }

    customerInput.value =
      button.dataset.name || "";

    customerIdInput.value =
      button.dataset.id || "";

    customerResults.innerHTML =
      "";

    customerResults.style.display =
      "none";
  }
);

        document.addEventListener(
      "click",
      function(event) {
        if (
          !item.contains(event.target)
        ) {
          customerResults.style.display =
            "none";
        }
      }
    );

/* ==========================================
   SEARCHABLE MASTER MEMBER / VERSI
   ========================================== */

const memberInput =
  item.querySelector(
    ".batch-version"
  );

const memberIdInput =
  item.querySelector(
    ".batch-member-id"
  );

const memberResults =
  item.querySelector(
    ".batch-member-results"
  );

if (
  memberInput &&
  memberIdInput &&
  memberResults
) {

  const {
    data: members,
    error: membersError
  } =
    await supabaseClient
      .from("po_members")
      .select(`
        id,
        group_name,
        member_name,
        entry_type,
        sort_order
      `)
      .order(
        "group_name",
        {
          ascending:true
        }
      )
      .order(
        "sort_order",
        {
          ascending:true
        }
      );

  if (membersError) {

    console.error(
      "ERROR LOAD MASTER MEMBER:",
      membersError
    );

    memberInput.placeholder =
      "Gagal memuat Master Member";

  } else {

    const memberList =
      members || [];

    memberInput.addEventListener(
      "input",
      function() {

        const keyword =
          this.value
            .trim()
            .toLowerCase();

        memberIdInput.value =
          "";

        if (!keyword) {

          memberResults.innerHTML =
            "";

          memberResults.style.display =
            "none";

          return;
        }

        const matches =
          memberList
            .filter(
              function(member) {

                const groupName =
                  String(
                    member.group_name || ""
                  ).toLowerCase();

                const memberName =
                  String(
                    member.member_name || ""
                  ).toLowerCase();

                const entryType =
                  String(
                    member.entry_type || ""
                  ).toLowerCase();

                return (
                  groupName.includes(keyword) ||
                  memberName.includes(keyword) ||
                  entryType.includes(keyword)
                );

              }
            )
            .slice(0, 15);

        if (
          matches.length === 0
        ) {

          memberResults.innerHTML = `
            <div
              style="
                padding:10px 12px;
                color:#777;
                font-size:12px;
              "
            >
              Member / versi tidak ditemukan
            </div>
          `;

          memberResults.style.display =
            "block";

          return;
        }

        memberResults.innerHTML =
          matches
            .map(
              function(member) {

                let typeLabel =
                  "Member";

                if (
                  member.entry_type ===
                  "character"
                ) {
                  typeLabel =
                    "Character";
                }

                if (
                  member.entry_type ===
                  "version"
                ) {
                  typeLabel =
                    "Version";
                }

                return `
                  <button
                    type="button"
                    class="batch-member-result"
                    data-id="${escapeHTML(
                      String(member.id)
                    )}"
                    data-name="${escapeHTML(
                      member.member_name || ""
                    )}"
                    style="
                      display:block;
                      width:100%;
                      text-align:left;
                      padding:8px 10px;
                      border:0;
                      border-bottom:1px solid #eee;
                      background:#fff;
                      cursor:pointer;
                      font-size:13px;
                      line-height:1.25;
                    "
                  >

                    <strong>
                      ${escapeHTML(
                        member.member_name || "—"
                      )}
                    </strong>

                    <div
                      style="
                        margin-top:2px;
                        color:#777;
                        font-size:11px;
                      "
                    >
                      ${escapeHTML(
                        member.group_name || "—"
                      )}
                      ·
                      ${typeLabel}
                    </div>

                  </button>
                `;

              }
            )
            .join("");

        memberResults.style.display =
          "block";


        memberResults
          .querySelectorAll(
            ".batch-member-result"
          )
          .forEach(
            function(button) {

              button.addEventListener(
                "click",
                function() {

                  const memberId =
                    this.dataset.id ||
                    "";

                  const memberName =
                    this.dataset.name ||
                    "";

                  memberInput.value =
                    memberName;

                  memberIdInput.value =
                    memberId;

                  memberResults.innerHTML =
                    "";

                  memberResults.style.display =
                    "none";

                }
              );

            }
          );

      }
    );


    document.addEventListener(
      "click",
      function(event) {

        if (
          !item.contains(
            event.target
          )
        ) {
          memberResults.style.display =
            "none";
        }

      }
    );

  }
}  

    /*
      Setelah customer baru ditambahkan,
      hitung ulang sisa pembayaran batch
    */
    updateBatchRemaining();

  }
}
     
    item
  .querySelector(".remove-batch-item")
  .addEventListener(
    "click",
    function() {
      document.removeEventListener(
        "dearNadiyaCustomerCreated",
        syncNewCustomer
      );

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


  /* ==========================================
     HARGA SAMA
     HARGA & DP = HARGA SATUAN
     ========================================== */

  if (mode === "same") {

    commonPrice =
      parseNominalInput(
        document.getElementById(
          "batchCommonPrice"
        )?.value
      );


    commonDp =
      parseNominalInput(
        document.getElementById(
          "batchCommonDp"
        )?.value
      );

  }


  /* ==========================================
     HITUNG SETIAP CUSTOMER
     ========================================== */

  items.forEach(function(item) {

    const quantity =
      Math.max(
        1,
        Number(
          item.querySelector(
            ".batch-quantity"
          )?.value
        ) || 1
      );


    let unitPrice = commonPrice;
    let unitDp = commonDp;


    /* ========================================
       HARGA BERBEDA
       ======================================== */

    if (mode === "different") {

      unitPrice =
        parseNominalInput(
          item.querySelector(
            ".batch-price"
          )?.value
        );


      unitDp =
        parseNominalInput(
          item.querySelector(
            ".batch-dp"
          )?.value
        );

    }


    /* ========================================
       TOTAL BERDASARKAN QUANTITY
       ======================================== */

    const totalPrice =
      unitPrice * quantity;


    const totalDp =
      unitDp * quantity;


    const remaining =
      Math.max(
        0,
        totalPrice - totalDp
      );


    /* ========================================
       TAMPILKAN TOTAL HARGA
       ======================================== */

    const totalPriceInput =
      item.querySelector(
        ".batch-total-price"
      );


    if (totalPriceInput) {

      totalPriceInput.value =
        formatNominalInput(
          totalPrice
        );

    }


    /* ========================================
       TAMPILKAN TOTAL DP
       ======================================== */

    const totalDpInput =
      item.querySelector(
        ".batch-total-dp"
      );


    if (totalDpInput) {

      totalDpInput.value =
        formatNominalInput(
          totalDp
        );

    }


    /* ========================================
       TAMPILKAN SISA PEMBAYARAN
       ======================================== */

    const remainingInput =
      item.querySelector(
        ".batch-remaining"
      );


    if (remainingInput) {

      remainingInput.value =
        formatNominalInput(
          remaining
        );

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
        ".batch-quantity, .batch-price, .batch-dp"
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
   GENERATOR TAGIHAN WHATSAPP
   ============================================ */

async function showWhatsAppBillingBuilder(
  category
) {

  /* ==========================================
     AMBIL DATA REKAP
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
      .order(
        "id",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD TAGIHAN WHATSAPP:",
      error
    );

    alert(
      "Gagal mengambil data tagihan: " +
      error.message
    );

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    alert(
      "Belum ada data Rekap GO."
    );

    return;

  }


  /* ==========================================
     KELOMPOKKAN BATCH
     ========================================== */

  const batches = {};

  data.forEach(
    function(row) {

      const batchCode =
        String(
          row.batch_code || ""
        ).trim();

      if (!batchCode) {
        return;
      }

      if (!batches[batchCode]) {

        batches[batchCode] = [];

      }

      batches[batchCode].push(
        row
      );

    }
  );


  const batchCodes =
    Object.keys(
      batches
    );


  /* ==========================================
     MODAL
     ========================================== */

  const oldModal =
    document.getElementById(
      "whatsappBillingModal"
    );

  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "whatsappBillingModal";

  modal.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;


  modal.innerHTML = `

    <div
      style="
        width:min(1000px, 96vw);
        max-height:92vh;
        overflow:auto;
        background:#fff;
        border-radius:16px;
        padding:22px;
        box-sizing:border-box;
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:18px;
        "
      >

        <div>

          <h3
            style="
              margin:0 0 5px;
            "
          >
            💬 Buat Tagihan WhatsApp
          </h3>

          <p
            style="
              margin:0;
              color:#777;
              font-size:13px;
            "
          >
            ${escapeHTML(category)}
          </p>

        </div>


        <button
          type="button"
          id="closeWhatsAppBillingModal"
          style="
            border:0;
            background:transparent;
            font-size:22px;
            cursor:pointer;
          "
        >
          ✕
        </button>

      </div>


      <!-- MODE TAGIHAN -->

      <div
        style="
          border:1px solid #eee;
          border-radius:12px;
          padding:14px;
          margin-bottom:16px;
        "
      >

        <strong>
          Jenis Tagihan
        </strong>


        <div
          style="
            display:flex;
            gap:18px;
            flex-wrap:wrap;
            margin-top:10px;
          "
        >

          <label
            style="
              cursor:pointer;
            "
          >

            <input
              type="radio"
              name="whatsappBillingMode"
              value="customer"
              checked
            >

            🛍️ Barang / Gabung Customer

          </label>


          <label
            style="
              cursor:pointer;
            "
          >

            <input
              type="radio"
              name="whatsappBillingMode"
              value="sharing"
            >

            👥 Sharing / Pisahkan

          </label>

        </div>


        <small
          style="
            display:block;
            margin-top:8px;
            color:#777;
          "
        >
          Barang akan menggabungkan semua barang
          milik customer yang sama. Sharing akan
          mempertahankan pemisahan member / versi.
        </small>

      </div>


      <!-- PILIH BATCH -->

      <div
        style="
          border:1px solid #eee;
          border-radius:12px;
          padding:14px;
          margin-bottom:16px;
        "
      >

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
          "
        >

          <strong>
            Pilih Batch
          </strong>


          <div
            style="
              display:flex;
              gap:6px;
            "
          >

            <button
              type="button"
              id="selectAllBillingBatch"
            >
              Pilih Semua
            </button>

            <button
              type="button"
              id="clearAllBillingBatch"
            >
              Hapus Semua
            </button>

          </div>

        </div>


        <div
          id="whatsappBillingBatchList"
          style="
            display:grid;
            grid-template-columns:
              repeat(auto-fit,minmax(240px,1fr));
            gap:8px;
            margin-top:12px;
          "
        >

          ${
            batchCodes
              .map(
                function(batchCode) {

                  const rows =
                    batches[
                      batchCode
                    ];

                  const itemNames =
                    [
                      ...new Set(
                        rows
                          .map(
                            row =>
                              row.item_name
                          )
                          .filter(Boolean)
                      )
                    ];


                  return `

                    <label
                      style="
                        border:1px solid #eee;
                        border-radius:10px;
                        padding:10px;
                        cursor:pointer;
                      "
                    >

                      <input
                        type="checkbox"
                        class="whatsapp-billing-batch"
                        value="${escapeHTML(
                          batchCode
                        )}"
                      >

                      <strong>
                        ${escapeHTML(
                          batchCode
                        )}
                      </strong>

                      <div
                        style="
                          color:#777;
                          font-size:11px;
                          margin-top:4px;
                        "
                      >
                        ${escapeHTML(
                          itemNames
                            .slice(0,2)
                            .join(" · ")
                        )}
                      </div>

                    </label>

                  `;

                }
              )
              .join("")
          }

        </div>

      </div>


      <!-- PREVIEW -->

      <div
        style="
          border:1px solid #eee;
          border-radius:12px;
          padding:14px;
        "
      >

        <strong>
          Preview Tagihan
        </strong>


        <textarea
          id="whatsappBillingPreview"
          readonly
          style="
            width:100%;
            min-height:420px;
            margin-top:10px;
            box-sizing:border-box;
            resize:vertical;
            border:1px solid #ddd;
            border-radius:10px;
            padding:12px;
            font-family:Arial,sans-serif;
            font-size:13px;
            line-height:1.5;
          "
        ></textarea>

      </div>


      <!-- ACTION -->

      <div
        style="
          display:flex;
          justify-content:flex-end;
          gap:8px;
          flex-wrap:wrap;
          margin-top:16px;
        "
      >

        <button
          type="button"
          id="cancelWhatsAppBilling"
        >
          Batal
        </button>


        <button
          type="button"
          class="primary-button"
          id="copyWhatsAppBilling"
        >
          📋 Salin Tagihan
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  /* ==========================================
     ELEMENT
     ========================================== */

  const preview =
    document.getElementById(
      "whatsappBillingPreview"
    );


  const batchCheckboxes =
    modal.querySelectorAll(
      ".whatsapp-billing-batch"
    );


  const modeRadios =
    modal.querySelectorAll(
      "input[name='whatsappBillingMode']"
    );


  /* ==========================================
     FORMAT NOMINAL
     ========================================== */

  function money(value) {

    return formatNominalInput(
      Number(value) || 0
    ) || "0";

  }


  /* ==========================================
     BUAT PESAN
     ========================================== */

  function generateBillingMessage() {

    const selectedBatches =
      Array.from(
        batchCheckboxes
      )
        .filter(
          checkbox =>
            checkbox.checked
        )
        .map(
          checkbox =>
            checkbox.value
        );


    if (
      selectedBatches.length === 0
    ) {

      preview.value =
        "Pilih minimal 1 batch.";

      return;

    }


    const mode =
      modal.querySelector(
        "input[name='whatsappBillingMode']:checked"
      )?.value ||
      "customer";


    const selectedRows =
      data.filter(
        function(row) {

          return selectedBatches.includes(
            String(
              row.batch_code || ""
            ).trim()
          );

        }
      );


    /* ======================================
       MODE 1
       GABUNG CUSTOMER
       ====================================== */

    if (
      mode ===
      "customer"
    ) {

      const customers = {};


      selectedRows.forEach(
        function(row) {

          const customerId =
            Number(
              row.customer_id
            ) || null;

          const customerName =
            String(
              row.customer_name || ""
            ).trim();


          if (
            !customerName &&
            !customerId
          ) {

            return;

          }


          const key =
            customerId
              ? `id:${customerId}`
              : `name:${customerName.toLowerCase()}`;


          if (
            !customers[key]
          ) {

            customers[key] = {

              name:
                customerName ||
                "Customer",

              rows: []

            };

          }


          customers[key].rows.push(
            row
          );

        }
      );


      const customerBlocks =
        Object.values(
          customers
        )
        .map(
          function(customer) {

            let total =
              0;


            const itemLines =
              customer.rows
                .map(
                  function(row) {

                    const quantity =
                      Number(
                        row.quantity
                      ) || 1;

                    const price =
                      Number(
                        row.item_price
                      ) || 0;


                    const lineTotal =
                      price;


                    total +=
                      lineTotal;


                    const itemName =
                      String(
                        row.item_name ||
                        "Barang"
                      ).trim();


                    const batchLabel =
                      selectedBatches.length > 1
                        ? `[${
                            row.batch_code ||
                            "Batch"
                          }] `
                        : "";


                    return (
                      `${batchLabel}` +
                      `${itemName}` +
                      `${
                        quantity > 1
                          ? ` × ${quantity}`
                          : ""
                      }` +
                      ` - ${money(lineTotal)}`
                    );

                  }
                );


            return (
              `🛍️ ${customer.name}\n\n` +
              itemLines.join("\n") +
              `\n\n` +
              `Total - ${money(total)}`
            );

          }
        );


      preview.value =
        customerBlocks.join(
          "\n\n"
        );

      return;

    }


    /* ======================================
       MODE 2
       SHARING
       ====================================== */

    const batchGroups = {};


    selectedRows.forEach(
      function(row) {

        const batchCode =
          String(
            row.batch_code || ""
          ).trim();


        if (
          !batchGroups[batchCode]
        ) {

          batchGroups[batchCode] = [];

        }


        batchGroups[batchCode].push(
          row
        );

      }
    );


    const sharingBlocks =
      selectedBatches
        .filter(
          batchCode =>
            batchGroups[
              batchCode
            ]
        )
        .map(
          function(batchCode) {

            const rows =
              batchGroups[
                batchCode
              ];


            const lines =
              rows.map(
                function(row) {

                  const version =
                    String(
                      row.version ||
                      "—"
                    ).trim();

                  const customer =
                    String(
                      row.customer_name ||
                      "—"
                    ).trim();


                  return (
                    `${version} : ${customer}`
                  );

                }
              );


            return (
              `${batchCode}\n` +
              lines.join("\n")
            );

          }
        );


    preview.value =
      sharingBlocks.join(
        "\n\n"
      );

  }


  /* ==========================================
     UPDATE PREVIEW
     ========================================== */

  batchCheckboxes.forEach(
    function(checkbox) {

      checkbox.addEventListener(
        "change",
        generateBillingMessage
      );

    }
  );


  modeRadios.forEach(
    function(radio) {

      radio.addEventListener(
        "change",
        generateBillingMessage
      );

    }
  );


  /* ==========================================
     PILIH SEMUA
     ========================================== */

  document
    .getElementById(
      "selectAllBillingBatch"
    )
    ?.addEventListener(
      "click",
      function() {

        batchCheckboxes.forEach(
          function(checkbox) {

            checkbox.checked =
              true;

          }
        );

        generateBillingMessage();

      }
    );


  /* ==========================================
     HAPUS SEMUA
     ========================================== */

  document
    .getElementById(
      "clearAllBillingBatch"
    )
    ?.addEventListener(
      "click",
      function() {

        batchCheckboxes.forEach(
          function(checkbox) {

            checkbox.checked =
              false;

          }
        );

        generateBillingMessage();

      }
    );


  /* ==========================================
     COPY
     ========================================== */

  document
    .getElementById(
      "copyWhatsAppBilling"
    )
    ?.addEventListener(
      "click",
      async function() {

        const text =
          preview.value.trim();


        if (!text) {

          alert(
            "Belum ada tagihan yang dibuat."
          );

          return;

        }


        try {

          await navigator.clipboard.writeText(
            text
          );


          alert(
            "Tagihan berhasil disalin. ♥"
          );

        } catch (error) {

          console.error(
            "ERROR COPY TAGIHAN:",
            error
          );


          preview.select();

          document.execCommand(
            "copy"
          );


          alert(
            "Tagihan berhasil disalin. ♥"
          );

        }

      }
    );


  /* ==========================================
     TUTUP
     ========================================== */

  function closeModal() {

    modal.remove();

  }


  document
    .getElementById(
      "closeWhatsAppBillingModal"
    )
    ?.addEventListener(
      "click",
      closeModal
    );


  document
    .getElementById(
      "cancelWhatsAppBilling"
    )
    ?.addEventListener(
      "click",
      closeModal
    );


  modal.addEventListener(
    "click",
    function(event) {

      if (
        event.target ===
        modal
      ) {

        closeModal();

      }

    }
  );


  /* ==========================================
     DEFAULT
     ========================================== */

  if (
    batchCheckboxes.length ===
    1
  ) {

    batchCheckboxes[0].checked =
      true;

  }


  generateBillingMessage();

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

     /* ==========================================
     AMBIL TRACKING OPTIONS KATEGORI
     ========================================== */

  let categoryTrackingOptions = [];

  const {
    data: categoryConfig,
    error: categoryConfigError
  } = await supabaseClient
    .from("recap_categories")
    .select("tracking_options")
    .eq(
      "category_name",
      category
    )
    .limit(1)
    .maybeSingle();

  if (
    !categoryConfigError &&
    categoryConfig &&
    Array.isArray(
      categoryConfig.tracking_options
    ) &&
    categoryConfig.tracking_options.length > 0
  ) {

    categoryTrackingOptions =
      categoryConfig.tracking_options;

  } else {

    categoryTrackingOptions =
      getTrackingOptions(category);

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

      <button
        type="button"
        class="primary-button"
        id="createWhatsAppBillingButton"
      >
        💬 Buat Tagihan WhatsApp
      </button>

    </div>

  `;

     html += `
  <div
  class="recap-batch-table-header"
  style="
    display:grid;
    grid-template-columns:
  100px
  380px
  80px
  80px
  180px
  45px;
    align-items:center;
    gap:8px;
    width:100%;
    box-sizing:border-box;
  "
>

  <div
  class="recap-batch-table-code"
  style="
    grid-column:1;
    text-align:center;
    white-space:nowrap;
  "
>
  Kode Batch
</div>

  <div
  class="recap-batch-table-name"
  style="
    grid-column:2;
    white-space:nowrap;
  "
>
  Nama Barang
</div>

  <div
  class="recap-batch-table-edit"
  style="
    grid-column:3;
    text-align:center;
    white-space:nowrap;
  "
>
  Edit
</div>

  <div
  class="recap-batch-table-delete"
  style="
    grid-column:4;
    text-align:center;
    white-space:nowrap;
  "
>
  Hapus
</div>

  <div
  class="recap-batch-table-member"
  style="
    grid-column:5;
    text-align:center;
    white-space:nowrap;
  "
>
  Tambah Member / Versi
</div>

  <div
  class="recap-batch-table-arrow"
  style="
    grid-column:6;
    text-align:center;
    white-space:nowrap;
  "
>
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

         <div
  class="recap-batch-header"
  style="
    display:grid;
    grid-template-columns:
  100px
  430px
  80px
  80px
  180px
  45px;
    align-items:center;
    gap:8px;
    width:100%;
    box-sizing:border-box;
  "
>

  <!-- KODE BATCH -->
  <div style="grid-column:1;">
    <h3
      style="
        margin:0;
      "
    >
      ${escapeHTML(batchCode)}
    </h3>

  </div>


  <!-- NAMA BARANG -->
<div style="grid-column:2;">
  <span>
    ${escapeHTML(
      rows[0]?.item_name ||
      "Nama barang belum tersedia"
    )}
  </span>
</div>

  <!-- EDIT -->
<div
  style="
    grid-column:3;
    display:flex;
    align-items:center;
    justify-content:center;
  "
>

  <button
    type="button"
    class="primary-button edit-batch-header-button"
    data-batch-code="${escapeHTML(batchCode)}"
    data-category="${escapeHTML(category)}"
    style="
      padding:4px 10px;
      font-size:12px;
      white-space:nowrap;
    "
  >
    ✏️ Edit
  </button>

</div>


<!-- HAPUS -->
<div
  style="
    grid-column:4;
    display:flex;
    align-items:center;
    justify-content:center;
  "
>

    <button
      type="button"
      class="delete-button delete-batch-header-button"
      data-batch-code="${escapeHTML(batchCode)}"
      data-category="${escapeHTML(category)}"
      style="
        padding:4px 10px;
        font-size:12px;
        white-space:nowrap;
      "
    >
      🗑️ Hapus
    </button>

  </div>

  <!-- TAMBAH MEMBER -->
<div
  style="
    display:flex;
    align-items:center;
    justify-content:center;
    white-space:nowrap;
  "
>

  <button
    type="button"
    class="add-recap-member-button"
    data-batch-code="${escapeHTML(batchCode)}"
  >
    ＋ Tambah Member / Versi
  </button>

</div>



  <!-- PANAH -->
  <div
  style="
    grid-column:6;
    text-align:center;
    font-size:20px;
    white-space:nowrap;
  "
>
    →
  </div>
  
</div>
<div class="recap-batch-deadlines">

  <div>
    <strong>Harga:</strong>
    ${
      (() => {
        const prices =
          rows
            .map(row =>
              Number(
                row.item_price
              ) || 0
            )
            .filter(
              value => value > 0
            );

        if (!prices.length) {
          return "—";
        }

        const minPrice =
          Math.min(...prices);

        const maxPrice =
          Math.max(...prices);

        return minPrice === maxPrice
          ? formatNominalInput(
              minPrice
            )
          : formatNominalInput(
              minPrice
            ) +
            " - " +
            formatNominalInput(
              maxPrice
            );
      })()
    }
  </div>

  <div>
    <strong>DP:</strong>
    ${
      (() => {
        const dps =
  rows
    .map(row => {
      const minimumDp =
        Number(
          row.minimum_dp_amount
        ) || 0;

      const actualDp =
        Number(
          row.dp_amount
        ) || 0;

      return minimumDp > 0
        ? minimumDp
        : actualDp;
    })
    .filter(
      value => value > 0
    );
        if (!dps.length) {
          return "—";
        }

        const minDp =
          Math.min(...dps);

        const maxDp =
          Math.max(...dps);

        return minDp === maxDp
          ? formatNominalInput(
              minDp
            )
          : formatNominalInput(
              minDp
            ) +
            " - " +
            formatNominalInput(
              maxDp
            );
      })()
    }
  </div>

  <div>
    <strong>Deadline DP:</strong>
    ${
      rows[0]?.dp_deadline
        ? String(rows[0].dp_deadline).substring(0, 10)
        : "—"
    }
  </div>

  <div>
    <strong>Deadline Pelunasan:</strong>
    ${
      rows[0]?.payment_deadline
        ? String(rows[0].payment_deadline).substring(0, 10)
        : "—"
    }
  </div>

  <div>
    <strong>Deadline CO:</strong>
    ${
      rows[0]?.co_deadline
        ? String(rows[0].co_deadline).substring(0, 10)
        : "—"
    }
  </div>

</div>

<div
  class="batch-tracking"
  style="display:none;"
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

      ${categoryTrackingOptions.map(
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
  style="display:none;"
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
                    Tanggal CO
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
    row.tanggal_co
      ? String(row.tanggal_co).substring(0, 10)
      : "—"
  }
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
    async function() {

      /* ==========================================
         AMBIL TYPE REKAP DARI DATABASE
         BERDASARKAN KATEGORI AKTIF
         ========================================== */

      const {
        data: categoryData,
        error: categoryError
      } = await supabaseClient
        .from("recap_categories")
        .select("recap_type")
        .eq(
          "category_name",
          category
        )
        .limit(1)
        .maybeSingle();


      if (categoryError) {

        console.error(
          "Gagal mendapatkan type rekap:",
          categoryError
        );

        alert(
          "Gagal kembali ke daftar kategori: " +
          categoryError.message
        );

        return;

      }


      const recapType =
        categoryData?.recap_type || "";


      if (!recapType) {

        console.error(
          "Type rekap tidak ditemukan untuk kategori:",
          category
        );

        alert(
          "Type Rekap untuk kategori \"" +
          category +
          "\" tidak ditemukan."
        );

        return;

      }


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
   HAPUS BATCH LANGSUNG DARI HEADER
   ========================================== */

container
  .querySelectorAll(
    ".delete-batch-header-button"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        async function(event) {

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

          const confirmDelete =
            confirm(
              "Hapus seluruh batch ini?\n\n" +
              "Batch: " +
              batchCode +
              "\n\n" +
              "Semua member/customer di batch ini " +
              "juga akan dihapus.\n\n" +
              "Tindakan ini tidak dapat dibatalkan."
            );

          if (!confirmDelete) {
            return;
          }

          this.disabled = true;
          this.textContent =
            "Menghapus...";

          const {
            data: deletedRows,
            error: deleteError
          } =
            await supabaseClient
              .from("purchase_recap")
              .delete()
              .eq(
                "category",
                category
              )
              .eq(
                "batch_code",
                batchCode
              )
              .select("id");

          if (deleteError) {

            console.error(
              "ERROR DELETE BATCH:",
              deleteError
            );

            alert(
              "Gagal menghapus batch:\n\n" +
              deleteError.message
            );

            this.disabled = false;
            this.textContent =
              "🗑️ Hapus";

            return;
          }

          if (
            !deletedRows ||
            deletedRows.length === 0
          ) {

            alert(
              "Batch tidak terhapus.\n\n" +
              "Tidak ada data yang dihapus. " +
              "Periksa izin DELETE pada Supabase."
            );

            this.disabled = false;
            this.textContent =
              "🗑️ Hapus";

            return;
          }

          alert(
            "Batch " +
            batchCode +
            " berhasil dihapus."
          );

          await loadRecapList(
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


if (
  typeof loadOldRecapClaimList ===
  "function"
) {
  await loadOldRecapClaimList();
}

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
   BUAT TAGIHAN WHATSAPP
   ========================================== */

const createWhatsAppBillingButton =
  container.querySelector(
    "#createWhatsAppBillingButton"
  );


if (
  createWhatsAppBillingButton
) {

  createWhatsAppBillingButton.addEventListener(
    "click",
    function() {

      showWhatsAppBillingBuilder(
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

   const recapDataType =
  document.getElementById(
    "batchRecapDataType"
  ).value;

const manualCoDeadline =
  document.getElementById(
    "batchCoDeadline"
  ).value || null;

   let batchCoDeadline =
  null;

let arrivedAdminAt =
  null;

if (
  recapDataType ===
  "lama"
) {

  batchCoDeadline =
    manualCoDeadline;

} else if (
  recapDataType ===
  "baru" &&
  batchTracking ===
  "Arrived Admin"
) {

  const now =
    new Date();

  arrivedAdminAt =
    now.toISOString();

  const deadline =
    new Date(now);

  deadline.setMonth(
    deadline.getMonth() + 3
  );

  batchCoDeadline =
    deadline.toISOString();

}


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
  parseNominalInput(
    document.getElementById(
      "batchCommonPrice"
    ).value
  );


commonDp =
  parseNominalInput(
    document.getElementById(
      "batchCommonDp"
    ).value
  );
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

      const customerInput =
  item.querySelector(".batch-customer");

const customerId =
  Number(
    item.querySelector(".batch-customer-id")?.value
  ) || null;

const customer =
  customerInput
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

       const memberId =
  Number(
    item
      .querySelector(
        ".batch-member-id"
      )
      ?.value
  ) || null;


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

      let unitPrice = 0;


if (
  priceMode === "same"
) {

  /*
   * Harga sama untuk semua customer.
   * commonPrice = harga satuan.
   */

  unitPrice =
    commonPrice;

}

else {

  /*
   * Harga berbeda per customer.
   * batch-price = harga satuan.
   */

  unitPrice =
    parseNominalInput(
      item
        .querySelector(
          ".batch-price"
        )?.value
    );

}


/*
 * Total harga mengikuti quantity.
 */

const price =
  unitPrice * quantity;


      /* ======================================
         DP
         ====================================== */

      let unitDp = 0;


if (
  priceMode === "same"
) {

  /*
   * DP sama untuk semua customer.
   * commonDp = DP satuan.
   */

  unitDp =
    commonDp;

}

else {

  /*
   * DP berbeda per customer.
   * batch-dp = DP satuan.
   */

  unitDp =
    parseNominalInput(
      item
        .querySelector(
          ".batch-dp"
        )?.value
    );

}


/*
 * Total DP mengikuti quantity.
 */

const dp =
  unitDp * quantity;

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

const remaining =
  Math.max(
    0,
    price - dp
  );
       
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

        customer_id:
  customerId,

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

recap_data_type:
  recapDataType,

co_deadline:
  batchCoDeadline,

arrived_admin_at:
  arrivedAdminAt
});

    }
  );


 /* ==========================================
   CEK DATA WAJIB
========================================== */

/*
  Customer BOLEH kosong.

  Ini diperlukan untuk:
  - Member PO Claim yang belum memiliki pembeli
  - Member yang masuk Rekap GO tetapi
    masih tersedia untuk di-claim

  Yang wajib:
  - Versi / Member
*/

const incomplete =
  records.find(
    function(record) {

      return (
        !record.version
      );

    }
  );


if (incomplete) {

  message.textContent =
    "Versi / Member wajib diisi.";

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

   setTimeout(function () {

  container.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}, 50);

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
        row.minimum_dp_amount
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

   const arrivedAdminAt =
  firstRow.arrived_admin_at || null;

const existingCoDeadline =
  firstRow.co_deadline || null;

   const recapDataType =
  firstRow.recap_data_type ||
  "baru";

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


        <label>Harga</label>

<input
  id="editBatchHeaderPrice"
  type="text"
  class="currency-input"
  value="${
    (() => {
      const prices =
        data
          .map(row =>
            Number(row.item_price) || 0
          )
          .filter(value => value > 0);

      if (!prices.length) return "0";

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return formatNominalInput(minPrice);
    })()
  }"
>

<label>DP</label>

<input
  id="editBatchHeaderDp"
  type="text"
  class="currency-input"
  value="${
    (() => {
      const dps =
        data
          .map(row => {
            const minimumDp =
              Number(row.minimum_dp_amount) || 0;

            const actualDp =
              Number(row.dp_amount) || 0;

            return minimumDp > 0
              ? minimumDp
              : actualDp;
          })
          .filter(value => value > 0);

      if (!dps.length) return "0";

      const minDp = Math.min(...dps);
      const maxDp = Math.max(...dps);

      return formatNominalInput(minDp);
    })()
  }"
>
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
  Jenis Rekap
</label>

<select
  id="editBatchHeaderRecapDataType"
>

  <option
    value="baru"
    ${
      recapDataType === "baru"
        ? "selected"
        : ""
    }
  >
    Rekap Baru
  </option>

  <option
    value="lama"
    ${
      recapDataType === "lama"
        ? "selected"
        : ""
    }
  >
    Rekap Lama
  </option>

</select>

<small>
  Rekap Lama menggunakan Deadline CO manual.
  Rekap Baru menggunakan Deadline CO otomatis.
</small>

        <label>
  Deadline CO Shopee
</label>

<input
  id="editBatchHeaderCoDeadline"
  type="date"
  value="${
    existingCoDeadline
      ? String(
          existingCoDeadline
        ).substring(0, 10)
      : ""
  }"
  ${
    recapDataType === "baru"
      ? "readonly"
      : ""
  }
>

<small
  id="editBatchHeaderCoDeadlineInfo"
>
  ${
    recapDataType === "lama"
      ? "Rekap Lama: Deadline CO dapat diisi manual."
      : "Rekap Baru: Deadline CO dihitung otomatis 3 bulan setelah Arrived Admin."
  }
</small>

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
  
        <p
          id="editBatchHeaderMessage"
          class="login-error"
        ></p>

      </form>

    </div>

  `;
   
/* ==========================================
   MODE REKAP LAMA / BARU
   ========================================== */

const recapDataTypeSelect =
  document.getElementById(
    "editBatchHeaderRecapDataType"
  );

const coDeadlineInput =
  document.getElementById(
    "editBatchHeaderCoDeadline"
  );

const coDeadlineInfo =
  document.getElementById(
    "editBatchHeaderCoDeadlineInfo"
  );


function updateEditCoDeadlineMode() {

  if (
    !recapDataTypeSelect ||
    !coDeadlineInput
  ) {
    return;
  }


  if (
    recapDataTypeSelect.value ===
    "lama"
  ) {

    coDeadlineInput.readOnly =
      false;

    coDeadlineInput.disabled =
      false;

    if (coDeadlineInfo) {

      coDeadlineInfo.textContent =
        "Rekap Lama: Deadline CO dapat diisi manual.";

    }

  } else {

    coDeadlineInput.readOnly =
      true;

    coDeadlineInput.disabled =
      false;

    if (coDeadlineInfo) {

      coDeadlineInfo.textContent =
        "Rekap Baru: Deadline CO dihitung otomatis 3 bulan setelah Arrived Admin.";

    }

  }

}


if (recapDataTypeSelect) {

  recapDataTypeSelect.addEventListener(
    "change",
    updateEditCoDeadlineMode
  );

}


/* Terapkan kondisi awal */
updateEditCoDeadlineMode();
   
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
  parseNominalInput(
    document
      .getElementById(
        "editBatchHeaderPrice"
      )
      ?.value
  );

newDp =
  parseNominalInput(
    document
      .getElementById(
        "editBatchHeaderDp"
      )
      ?.value
  );

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

        const newTracking =
          document
            .getElementById(
              "editBatchHeaderTracking"
            )
            .value;

         const newRecapDataType =
  document
    .getElementById(
      "editBatchHeaderRecapDataType"
    )
    .value;

const manualCoDeadline =
  document
    .getElementById(
      "editBatchHeaderCoDeadline"
    )
    .value ||
  null;

         /* ======================================
   DEADLINE CO
   REKAP LAMA = MANUAL
   REKAP BARU = OTOMATIS
   ====================================== */

let newArrivedAdminAt =
  arrivedAdminAt;

let newCoDeadline =
  existingCoDeadline;


/* ======================================
   REKAP LAMA
   ====================================== */

if (
  newRecapDataType ===
  "lama"
) {

  newCoDeadline =
    manualCoDeadline;

}


/* ======================================
   REKAP BARU
   ====================================== */

else if (
  newRecapDataType ===
  "baru"
) {

  /*
   * Baru masuk Arrived Admin
   */
  if (
    newTracking ===
      "Arrived Admin" &&
    batchTracking !==
      "Arrived Admin"
  ) {

    const now =
      new Date();

    newArrivedAdminAt =
      now.toISOString();

    const deadline =
      new Date(now);

    deadline.setMonth(
      deadline.getMonth() + 3
    );

    newCoDeadline =
      deadline.toISOString();

  }

  /*
   * Sudah Arrived Admin
   * Jangan reset deadline
   */
  else if (
    newTracking ===
      "Arrived Admin" &&
    batchTracking ===
      "Arrived Admin"
  ) {

    newArrivedAdminAt =
      arrivedAdminAt;

    newCoDeadline =
      existingCoDeadline;

  }

}
         
        /* ======================================
   UPDATE SEMUA CUSTOMER DALAM BATCH
   ====================================== */

const updateData = {
  batch_code:
    newBatchCode,

  item_name:
    newItemName,

   recap_data_type:
  newRecapDataType,

  dp_deadline:
    newDpDeadline,

  payment_deadline:
    newPaymentDeadline,

  co_deadline:
    newCoDeadline,

  arrived_admin_at:
    newArrivedAdminAt,

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
  ) ||
  document.getElementById(
    "poFormContainer"
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
     CUSTOMER / DN ID
     ====================================== -->

<label>
  Customer
</label>

<div
  class="customer-picker"
  style="position:relative;width:100%;"
>
  <input
    type="text"
    id="editCustomerInput"
    placeholder="🔍 Cari DN ID / nama / username WA..."
    value="${escapeHTML(data.customer_name || "")}"
    autocomplete="off"
  >

  <input
    type="hidden"
    id="editCustomerId"
    value="${escapeHTML(String(data.customer_id || ""))}"
  >

  <div
    id="editCustomerResults"
    style="display:none;position:absolute;z-index:9999;left:0;right:0;top:100%;background:#fff;border:1px solid #ddd;border-radius:8px;max-height:240px;overflow-y:auto;box-shadow:0 6px 18px rgba(0,0,0,.12);"
  ></div>
</div>

<small>
  Cari dan pilih customer berdasarkan DN ID, nama, atau username WA.
</small>

      <!-- ======================================
           VERSI / MEMBER
           ====================================== -->

        <label>
  Versi / Member
</label>

<div
  class="member-picker"
  style="position:relative;width:100%;"
>
  <input
    id="editVersion"
    type="text"
    value="${escapeHTML(
      data.version || ""
    )}"
    placeholder="🔎 Cari member / character / versi..."
    autocomplete="off"
  >

  <input
    type="hidden"
    id="editMemberId"
    value="${escapeHTML(
      String(data.member_id || "")
    )}"
  >

  <div
    id="editMemberResults"
    style="
      display:none;
      position:absolute;
      z-index:9999;
      left:0;
      right:0;
      top:100%;
      background:#fff;
      border:1px solid #ddd;
      border-radius:8px;
      max-height:240px;
      overflow-y:auto;
      box-shadow:0 6px 18px rgba(0,0,0,.12);
    "
  ></div>
</div>

<small>
  Cari member, character, atau versi dari Master Member / Versi.
</small>


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
     HARGA
     ====================================== -->

<label>
  Harga Barang
</label>

<input
  id="editItemPrice"
  type="text"
  value="${formatNominalInput(
    data.item_price || 0
  )}"
  class="currency-input"
  placeholder="50.000"
>


<!-- ======================================
     DP MINIMUM
     ====================================== -->

<label>
  DP Minimum
</label>

<input
  id="editDpMinimum"
  type="text"
  value="${formatNominalInput(
    data.minimum_dp_amount || 0
  )}"
  class="currency-input"
  placeholder="50.000"
>


<!-- ======================================
     DP AKTUAL
     ====================================== -->

<label>
  DP Aktual
</label>

<input
  id="editDpActual"
  type="text"
  value="${formatNominalInput(
    data.dp_amount || 0
  )}"
  class="currency-input"
  readonly
>


<!-- ======================================
     SISA PEMBAYARAN
     ====================================== -->

<label>
  Sisa Pembayaran
</label>

<input
  id="editRemaining"
  type="text"
  value="${formatNominalInput(
    data.remaining_amount || 0
  )}"
  class="currency-input"
  readonly
>
    
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

   container
  .querySelectorAll(
    ".currency-input"
  )
  .forEach(
    function(input) {
      input.value =
        formatNominalInput(
          input.value
        );
    }
  );

     /* ==========================================
     LOAD DATA CUSTOMER
     ========================================== */

  const editCustomerId =
    document.getElementById(
      "editCustomerId"
    );

  if (editCustomerId) {

    const { data: customers, error } =
  await supabaseClient
    .from("customers")
    .select("id, dn_id, name, username_wa")
    .order("id", { ascending: true });

     const editCustomerInput =
  document.getElementById("editCustomerInput");
     
const editCustomerResults =
  document.getElementById("editCustomerResults");

  function renderEditCustomerResults(
  keyword = ""
) {

  const q =
    keyword
      .trim()
      .toLowerCase();

  const filtered =
    customers
      .filter(c => {

        const dnId =
          String(
            c.dn_id || ""
          ).toLowerCase();

        const name =
          String(
            c.name || ""
          ).toLowerCase();

        const username =
          String(
            c.username_wa || ""
          ).toLowerCase();

        return (
          !q ||
          dnId.includes(q) ||
          name.includes(q) ||
          username.includes(q)
        );

      })
      .slice(0, 10);


  const customerButtons =
    filtered
      .map(c => `

        <button
          type="button"
          class="edit-customer-option"
          data-id="${c.id}"
          data-name="${escapeHTML(
            c.name || ""
          )}"
          style="
            display:block;
            width:100%;
            text-align:left;
            border:0;
            border-bottom:1px solid #eee;
            background:#fff;
            padding:9px 10px;
            cursor:pointer;
          "
        >
          <strong>
            ${escapeHTML(
              c.dn_id || ""
            )}
          </strong>

          —
          ${escapeHTML(
            c.name || ""
          )}

          ${
            c.username_wa
              ? `
                <span
                  style="color:#777;"
                >
                  (${escapeHTML(
                    c.username_wa
                  )})
                </span>
              `
              : ""
          }

        </button>

      `)
      .join("");


  editCustomerResults.innerHTML =
    customerButtons +

    `
      <button
        type="button"
        class="edit-create-customer-option"
        style="
          display:block;
          width:100%;
          text-align:left;
          border:0;
          background:#f8f9fa;
          padding:10px;
          cursor:pointer;
          font-weight:600;
          color:#2563eb;
        "
      >
        ＋ Buat Customer Baru
      </button>
    `;


  editCustomerResults.style.display =
    "block";

}
editCustomerInput.addEventListener("input", () => {
  editCustomerId.value = "";
  renderEditCustomerResults(
    editCustomerInput.value
  );
});

editCustomerInput.addEventListener("focus", () => {
  renderEditCustomerResults(
    editCustomerInput.value
  );
});

editCustomerResults.addEventListener(
  "click",
  event => {

    const createButton =
      event.target.closest(
        ".edit-create-customer-option"
      );

    if (createButton) {

  showQuickCustomerForm(
    function(newCustomer) {

      /* ==========================================
         MASUKKAN CUSTOMER BARU KE DAFTAR EDIT
      ========================================== */

      customers.push(
        newCustomer
      );


      /* ==========================================
         LANGSUNG PILIH CUSTOMER BARU
      ========================================== */

      editCustomerInput.value =
        newCustomer.name || "";

      editCustomerId.value =
        newCustomer.id || "";


      /* ==========================================
         TUTUP HASIL PENCARIAN
      ========================================== */

      editCustomerResults.innerHTML =
        "";

      editCustomerResults.style.display =
        "none";

    }
  );

  return;
}

    const button =
      event.target.closest(
        ".edit-customer-option"
      );

    if (!button) {
      return;
    }


    editCustomerInput.value =
      button.dataset.name || "";

    editCustomerId.value =
      button.dataset.id || "";

    editCustomerResults.style.display =
      "none";

     
  }
);
document.addEventListener("click", event => {
  if (
    !editCustomerInput.contains(event.target) &&
    !editCustomerResults.contains(event.target)
  ) {
    editCustomerResults.style.display =
      "none";
  }
});

/* ==========================================
   SEARCHABLE MASTER MEMBER / VERSI
   ========================================== */

const editVersionInput =
  document.getElementById(
    "editVersion"
  );

const editMemberIdInput =
  document.getElementById(
    "editMemberId"
  );

const editMemberResults =
  document.getElementById(
    "editMemberResults"
  );

if (
  editVersionInput &&
  editMemberIdInput &&
  editMemberResults
) {

  const {
    data: masterMembers,
    error: masterMembersError
  } = await supabaseClient
    .from("po_members")
    .select(
      "id, group_name, member_name, entry_type, sort_order"
    )
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

  if (masterMembersError) {

    console.error(
      "ERROR LOAD MASTER MEMBER:",
      masterMembersError
    );

  } else {

    const memberList =
      masterMembers || [];

    function renderEditMemberResults(
      keyword = ""
    ) {

      const q =
        keyword
          .trim()
          .toLowerCase();

      const filtered =
        memberList
          .filter(function(member) {

            const group =
              String(
                member.group_name || ""
              )
                .toLowerCase();

            const name =
              String(
                member.member_name || ""
              )
                .toLowerCase();

            const type =
              String(
                member.entry_type || ""
              )
                .toLowerCase();

            return (
              !q ||
              group.includes(q) ||
              name.includes(q) ||
              type.includes(q)
            );

          })
          .slice(0, 10);

      if (filtered.length === 0) {

        editMemberResults.innerHTML = `
          <div
            style="
              padding:10px 12px;
              color:#777;
              font-size:12px;
            "
          >
            Member / character / versi tidak ditemukan.
          </div>
        `;

      } else {

        editMemberResults.innerHTML =
          filtered
            .map(function(member) {

              let typeLabel =
                "Member";

              if (
                member.entry_type ===
                "character"
              ) {
                typeLabel =
                  "Character";
              }

              if (
                member.entry_type ===
                "version"
              ) {
                typeLabel =
                  "Version";
              }

              return `
                <button
                  type="button"
                  class="edit-member-option"
                  data-id="${escapeHTML(
                    String(member.id)
                  )}"
                  data-name="${escapeHTML(
                    member.member_name || ""
                  )}"
                  style="
                    display:block;
                    width:100%;
                    text-align:left;
                    padding:8px 10px;
                    border:0;
                    border-bottom:1px solid #eee;
                    background:#fff;
                    cursor:pointer;
                    font-size:13px;
                    line-height:1.3;
                  "
                >
                  <strong>
                    ${escapeHTML(
                      member.member_name || "—"
                    )}
                  </strong>

                  <small
                    style="
                      display:block;
                      color:#777;
                      margin-top:2px;
                    "
                  >
                    ${escapeHTML(
                      member.group_name || "—"
                    )}
                    ·
                    ${escapeHTML(
                      typeLabel
                    )}
                  </small>
                </button>
              `;

            })
            .join("");

      }

      editMemberResults.style.display =
        "block";
    }

    editVersionInput.addEventListener(
      "input",
      function() {

        editMemberIdInput.value =
          "";

        renderEditMemberResults(
          editVersionInput.value
        );

      }
    );

    editVersionInput.addEventListener(
      "focus",
      function() {

        renderEditMemberResults(
          editVersionInput.value
        );

      }
    );

    editMemberResults.addEventListener(
      "click",
      function(event) {

        const button =
          event.target.closest(
            ".edit-member-option"
          );

        if (!button) {
          return;
        }

        editVersionInput.value =
          button.dataset.name || "";

        editMemberIdInput.value =
          button.dataset.id || "";

        editMemberResults.innerHTML =
          "";

        editMemberResults.style.display =
          "none";

      }
    );

    document.addEventListener(
      "click",
      function(event) {

        if (
          !editVersionInput.contains(
            event.target
          ) &&
          !editMemberResults.contains(
            event.target
          )
        ) {

          editMemberResults.style.display =
            "none";

        }

      }
    );

  }
}
     
  }

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
  parseNominalInput(
    editPriceInput?.value
  );
   
  const dpTarget =
  parseNominalInput(
    editDpInput?.value
  );

  const remaining =
    Math.max(
      0,
      price - dpTarget
    );

  if (editRemainingInput) {
  editRemainingInput.value =
    formatNominalInput(
      remaining
    );
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


        const newPrice =
  parseNominalInput(
    document
      .getElementById("editItemPrice")
      ?.value
  );

const newDpMinimum =
  parseNominalInput(
    document
      .getElementById("editDpMinimum")
      ?.value
  );

/*
  DP Aktual berasal dari pembayaran yang sudah dikonfirmasi.
  Jangan ambil dari input form.
*/
const actualDp =
  Number(data.dp_amount) || 0;

/*
  Ambil total pembayaran aktual lama.

  Harga lama - Sisa lama
  = total uang yang sudah benar-benar dibayar.
*/
const oldPrice =
  Number(data.item_price) || 0;

const oldRemaining =
  Number(data.remaining_amount) || 0;

const totalActualPaid =
  Math.max(
    0,
    oldPrice - oldRemaining
  );

/*
  Setelah harga berubah,
  sisa pembayaran dihitung ulang
  berdasarkan total pembayaran aktual
  yang sudah ada.
*/
const newRemaining =
  Math.max(
    0,
    newPrice - totalActualPaid
  );

/*
  Status DP ditentukan dari:
  DP Aktual vs DP Minimum
*/
const newDpStatus =
  actualDp <= 0
    ? "unpaid"
    : actualDp >= newDpMinimum
      ? "paid"
      : "insufficient";

/*
  Status pembayaran ditentukan dari
  sisa pembayaran.
*/
const newPaymentStatus =
  newPrice > 0 &&
  newRemaining <= 0
    ? "paid"
    : "unpaid";

const updatedData = {

  batch_code:
    document
      .getElementById("editBatchCode")
      .value
      .trim(),

  item_name:
    document
      .getElementById("editItemName")
      .value
      .trim(),

  customer_id:
    Number(
      document
        .getElementById("editCustomerId")
        .value
    ) || null,

  customer_name:
    document
      .getElementById("editCustomerInput")
      .value
      .trim(),

  member_id:
  Number(
    document
      .getElementById("editMemberId")
      ?.value
  ) || null,

version:
  document
    .getElementById("editVersion")
    .value
    .trim(),

  quantity:
    Number(
      document
        .getElementById("editQuantity")
        .value
    ) || 1,

  item_price:
    newPrice,

  minimum_dp_amount:
    newDpMinimum,

  /*
    PENTING:
    DP Aktual tidak diubah dari form.
  */
  dp_amount:
    actualDp,

  dp_status:
    newDpStatus,

  remaining_amount:
    newRemaining,

  payment_status:
    newPaymentStatus,

  customer_status:
    document
      .getElementById("editCustomerStatus")
      .value,

  note:
    document
      .getElementById("editNote")
      .value
      .trim()

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

 <div class="po-archive-toggle-wrapper">
  <button
    type="button"
    id="poArchiveToggleButton"
    class="po-archive-toggle-button"
    title="Buka Arsip Pesanan"
  >
    📦 Arsip Pesanan
  </button>
</div>

<div
  id="poArchiveContainer"
  style="display:none;"
></div>

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
await loadOldRecapClaimList();
await loadPOArchiveList();
await loadPOList();
   
/* ==========================================
   RESTORE POSISI TERAKHIR DI PESANAN
========================================== */

const savedRunningPO =
  localStorage.getItem(
    "dearNadiyaSelectedPO"
  );

const savedClaimPO =
  localStorage.getItem(
    "dearNadiyaSelectedClaimPO"
  );

const savedArchivePO =
  localStorage.getItem(
    "dearNadiyaSelectedArchivePO"
  );


/* ==========================================
   1. RESTORE PO BERJALAN
========================================== */

if (savedRunningPO) {

  const card =
    document.querySelector(
      '.po-running-card:not(.po-claim-card)[data-po-id="' +
      CSS.escape(savedRunningPO) +
      '"]'
    );

  if (card) {

    card.click();
    return;

  }

  localStorage.removeItem(
    "dearNadiyaSelectedPO"
  );
}


/* ==========================================
   2. RESTORE PO MASIH BISA CLAIM
========================================== */

if (savedClaimPO) {

  const claimCard =
    document.querySelector(
      '.po-claim-card[data-po-id="' +
      CSS.escape(savedClaimPO) +
      '"]'
    );

  if (claimCard) {

    claimCard.click();
    return;

  }

  localStorage.removeItem(
    "dearNadiyaSelectedClaimPO"
  );
}


/* ==========================================
   3. RESTORE ARSIP PESANAN
========================================== */

if (savedArchivePO) {

  await loadPOArchiveList(true);

  setTimeout(function() {

    const archiveCard =
      document.querySelector(
        '.po-archive-table-row[data-po-id="' +
        CSS.escape(savedArchivePO) +
        '"]'
      );

    if (archiveCard) {

      archiveCard.click();

    } else {

      localStorage.removeItem(
        "dearNadiyaSelectedArchivePO"
      );

    }

  }, 100);

}

}
   
/* ============================================
   DETAIL PO BERJALAN
============================================ */

function showPODetailAdmin(po) {

  const container =
    document.getElementById(
      "poFormContainer"
    );

  if (!container || !po) {
    return;
  }

  let listData = [];

  try {

    listData =
      Array.isArray(po.list_data)
        ? po.list_data
        : JSON.parse(
            po.list_data || "[]"
          );

  } catch (error) {

    listData = [];

  }


  const priceMode =
    po.price_mode || "same";

  const dpMode =
    po.dp_mode || "same";


  container.style.display =
    "block";


  container.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <div
  style="
    display:flex;
    align-items:center;
    gap:12px;
  "
>

  ${
    po.image_url
      ? `
        <img
          src="${escapeHTML(
            po.image_url
          )}"
          alt="Foto PO"
          style="
            width:64px;
            height:64px;
            object-fit:cover;
            border-radius:10px;
            border:1px solid #e4dceb;
            flex-shrink:0;
          "
        >
      `
      : `
        <div
          style="
            width:64px;
            height:64px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f5f3fa;
            border-radius:10px;
            font-size:28px;
            flex-shrink:0;
          "
        >
          📦
        </div>
      `
  }

  <div>

    <h2
      style="
        margin:0;
      "
    >
      📦 ${escapeHTML(
        po.title ||
        "Detail PO"
      )}
    </h2>

    <p
      style="
        margin:4px 0 0;
      "
    >
      Detail PO berjalan
    </p>

  </div>

</div>
        </div>

        <div
  style="
    display:flex;
    gap:8px;
    align-items:center;
    flex-wrap:wrap;
  "
>
  <button
    type="button"
    class="secondary-button"
    id="backToPOListButton"
  >
    ← Kembali ke List Pesanan
  </button>

  <button
    type="button"
    class="primary-button"
    id="editSelectedPOButton"
  >
    ✏️ Edit PO
  </button>

  <button
    type="button"
    class="delete-po-button"
    data-id="${po.id}"
  >
    🗑️ Hapus PO
  </button>
</div>
      </div>


      <div class="po-meta">

        ${
          priceMode !== "different" &&
          po.price_text
            ? `
              <div>
                <strong>Harga:</strong>
                ${escapeHTML(
                  po.price_text
                )}
              </div>
            `
            : ""
        }


        ${
          dpMode !== "different" &&
          po.dp_text
            ? `
              <div>
                <strong>DP:</strong>
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
              style="margin-top:15px;"
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
              style="margin-top:20px;"
            >

              <h4>
                📋 Daftar Pesanan
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
  Member / Versi
</th>

<th>
  Customer
</th>

<th>
  Status
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
                        Catatan
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    ${
                      listData
                        .map(
                          function(item) {

                            return `

                              <tr>

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
            🟢 available
          </span>
        `
        : `
          <span class="po-status-empty">
            ⚪ Belum dikonfigurasi
          </span>
        `
  }
</td>

<td>
  ${
    item.quantity ||
    1
  }
</td>

                                ${
  priceMode ===
  "different"
    ? `
      <td>
        ${escapeHTML(
          item.price ||
          "—"
        )}
      </td>
    `
    : `
      <td>
        ${escapeHTML(
          po.price_text ||
          "—"
        )}
      </td>
    `
}

                               <td>
  ${
    dpMode === "different"
      ? escapeHTML(
          item.dp ||
          "—"
        )
      : escapeHTML(
          po.dp_text ||
          "—"
        )
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
                        )
                        .join("")
                    }

                  </tbody>

                </table>

              </div>

            </div>

          `
          : `
            <div
              class="po-empty-result"
              style="margin-top:20px;"
            >
              Belum ada daftar pesanan.
            </div>
          `
      }

    </div>

  `;


  const editButton =
    document.getElementById(
      "editSelectedPOButton"
    );

  if (editButton) {

    editButton.addEventListener(
      "click",
      function() {

        window.dearNadiyaPODraft = {
          existingPO: po,
          ...po
        };

        showPOForm(po);

      }
    );

  }

   const backToPOListButton =
  document.getElementById(
    "backToPOListButton"
  );
   
if (backToPOListButton) {
  backToPOListButton.addEventListener(
    "click",
    function() {

      /* Hapus PO yang sedang dibuka */
      localStorage.removeItem(
        "dearNadiyaSelectedPO"
      );

      /* Tutup detail PO */
      container.innerHTML = "";
      container.style.display = "none";

      /* Kembali ke PO Berjalan */
      const poRunningContainer =
  document.getElementById(
    "poRunningContainer"
  );
       
      if (poRunningContainer) {
  setTimeout(function() {

    poRunningContainer.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 100);
}
    }
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

<div
  class="form-group"
  style="grid-column:1 / -1;"
>
  <label>Status Batch</label>

  <select id="poBatchStatus">
    <option
      value="available"
      ${
        po.batch_status !== "full"
          ? "selected"
          : ""
      }
    >
      🟢 Masih Tersedia
    </option>

    <option
      value="full"
      ${
        po.batch_status === "full"
          ? "selected"
          : ""
      }
    >
      🔴 Batch Full
    </option>
  </select>

  <small>
    Pilih <strong>Batch Full</strong> jika kuota barang
    sudah habis meskipun waktu PO masih berjalan.
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
   class="currency-input"
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
  class="currency-input"
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
              type="date"
              id="poCloseDate"
              value="${
  po.close_date
    ? new Date(
        po.close_date
      )
        .toISOString()
        .slice(0, 10)
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
              type="date"
              id="poLastDPDate"
              value="${
  po.last_dp_date
    ? new Date(
        po.last_dp_date
      )
        .toISOString()
        .slice(0, 10)
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


  async function addPORow(
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
  style="position:relative;"
>
  <label>
    Customer
  </label>

  <input
    type="text"
    class="po-row-customer"
    placeholder="🔍 Cari DN ID / nama / username WA..."
    value="${escapeHTML(
      rowData.customer ||
      ""
    )}"
    autocomplete="off"
  >

  <input
    type="hidden"
    class="po-row-customer-id"
    value="${escapeHTML(
      String(rowData.customer_id || "")
    )}"
  >

  <div
    class="po-row-customer-results"
    style="
      display:none;
      position:absolute;
      z-index:9999;
      left:0;
      right:0;
      top:100%;
      background:#fff;
      border:1px solid #ddd;
      border-radius:8px;
      max-height:240px;
      overflow-y:auto;
      box-shadow:0 6px 18px rgba(0,0,0,.12);
    "
  ></div>
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
  class="po-row-price currency-input"
  placeholder="Contoh: Rp50.000"
  value="${escapeHTML(
    rowData.price ||
    ""
  )}"
  data-unit-price=""
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
  class="po-row-dp currency-input"
  placeholder="Contoh: Rp20.000"
  value="${escapeHTML(
    rowData.dp ||
    ""
  )}"
  data-unit-dp=""
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
   SEARCH CUSTOMER UNTUK PO
========================================== */

const customerInput =
  row.querySelector(
    ".po-row-customer"
  );

const customerIdInput =
  row.querySelector(
    ".po-row-customer-id"
  );

const customerResults =
  row.querySelector(
    ".po-row-customer-results"
  );

if (
  customerInput &&
  customerIdInput &&
  customerResults
) {

  const {
    data: customers,
    error: customersError
  } = await supabaseClient
    .from("customers")
    .select(
      "id, dn_id, name, username_wa"
    )
    .order(
      "id",
      {
        ascending: true
      }
    );

  if (customersError) {

    console.error(
      "ERROR LOAD CUSTOMERS FOR PO:",
      customersError
    );

  } else {

    const customerList =
      customers || [];

    function renderPOCustomerResults(
      keyword = ""
    ) {

      const q =
        keyword
          .trim()
          .toLowerCase();

      const filtered =
        customerList
          .filter(
            function(customer) {

              const dnId =
                String(
                  customer.dn_id || ""
                ).toLowerCase();

              const name =
                String(
                  customer.name || ""
                ).toLowerCase();

              const username =
                String(
                  customer.username_wa || ""
                ).toLowerCase();

              return (
                !q ||
                dnId.includes(q) ||
                name.includes(q) ||
                username.includes(q)
              );

            }
          )
          .slice(0, 10);

      customerResults.innerHTML =
  filtered
    .map(
      function(customer) {
        return `
          <button
            type="button"
            class="po-customer-option"
            data-id="${customer.id}"
            data-name="${escapeHTML(
              customer.name || ""
            )}"
            style="
              display:block;
              width:100%;
              text-align:left;
              border:0;
              background:#fff;
              padding:9px 10px;
              cursor:pointer;
              border-bottom:1px solid #eee;
            "
          >
            <strong>
              ${escapeHTML(
                customer.dn_id || "—"
              )}
            </strong>
            —
            ${escapeHTML(
              customer.name || "Tanpa Nama"
            )}
            ${
              customer.username_wa
                ? `
                  <span
                    style="color:#777;"
                  >
                    (${escapeHTML(
                      customer.username_wa
                    )})
                  </span>
                `
                : ""
            }
          </button>
        `;
      }
    )
    .join("") +

  `
    <button
      type="button"
      class="po-create-customer-option"
      style="
        display:block;
        width:100%;
        text-align:left;
        border:0;
        background:#f8f9fa;
        padding:10px;
        cursor:pointer;
        font-weight:600;
        color:#2563eb;
      "
    >
      ＋ Buat Customer Baru
    </button>
  `;

customerResults.style.display =
  "block";
    }

    customerInput.addEventListener(
      "input",
      function() {

        customerIdInput.value =
          "";

        renderPOCustomerResults(
          customerInput.value
        );

      }
    );

    customerInput.addEventListener(
      "focus",
      function() {

        renderPOCustomerResults(
          customerInput.value
        );

      }
    );

    customerResults.addEventListener(
  "click",
  function(event) {

    const createButton =
      event.target.closest(
        ".po-create-customer-option"
      );

    if (createButton) {

      showQuickCustomerForm(
        function(newCustomer) {

          /* Masukkan customer baru ke daftar
             pencarian row PO ini */
          customerList.push(
            newCustomer
          );

          /* Langsung pilih customer baru */
          customerInput.value =
            newCustomer.name || "";

          customerIdInput.value =
            newCustomer.id || "";

          customerResults.style.display =
            "none";

        }
      );

      return;
    }


    const button =
      event.target.closest(
        ".po-customer-option"
      );

    if (!button) {
      return;
    }

    customerInput.value =
      button.dataset.name || "";

    customerIdInput.value =
      button.dataset.id || "";

    customerResults.style.display =
      "none";

  }
);
    document.addEventListener(
      "click",
      function(event) {

        if (
          !customerInput.contains(
            event.target
          ) &&
          !customerResults.contains(
            event.target
          )
        ) {

          customerResults.style.display =
            "none";

        }

      }
    );

  }

}

/* ==========================================
   GENERAL PO — HARGA & DP BERDASARKAN QTY
========================================== */

const poTypeNow =
  document.getElementById("poType")?.value ||
  "general";

if (poTypeNow === "general") {

  const quantityInput =
    row.querySelector(
      ".po-row-quantity"
    );

  const priceInput =
    row.querySelector(
      ".po-row-price"
    );

  const dpInput =
    row.querySelector(
      ".po-row-dp"
    );

  const headerPriceInput =
    document.getElementById(
      "poPrice"
    );

  const headerDPInput =
    document.getElementById(
      "poDP"
    );

  const priceModeInput =
    document.getElementById(
      "poPriceMode"
    );

  const dpModeInput =
    document.getElementById(
      "poDPMode"
    );


  /* ==========================================
     HITUNG HARGA & DP ROW
  ========================================== */

  function updateGeneralRowTotal() {

    const qty =
      Math.max(
        1,
        Number(
          quantityInput?.value
        ) || 1
      );


    const priceMode =
      priceModeInput?.value ||
      "same";

    const dpMode =
      dpModeInput?.value ||
      "same";


    /* ======================================
       HARGA
    ====================================== */

    if (
      priceInput
    ) {

      if (
        priceMode ===
        "same"
      ) {

        const unitPrice =
          parsePONominal(
            headerPriceInput?.value
          );

        const totalPrice =
          unitPrice *
          qty;

        priceInput.value =
          formatPONominal(
            totalPrice
          );

        priceInput.readOnly =
          true;

      } else {

        priceInput.readOnly =
          false;

      }

    }


    /* ======================================
       DP
    ====================================== */

    if (
      dpInput
    ) {

      if (
        dpMode ===
        "same"
      ) {

        const unitDP =
          parsePONominal(
            headerDPInput?.value
          );

        const totalDP =
          unitDP *
          qty;

        dpInput.value =
          formatPONominal(
            totalDP
          );

        dpInput.readOnly =
          true;

      } else {

        dpInput.readOnly =
          false;

      }

    }

  }


  /* ==========================================
     QTY BERUBAH
  ========================================== */

  if (
    quantityInput
  ) {

    quantityInput.addEventListener(
      "input",
      function() {

        updateGeneralRowTotal();

      }
    );

    quantityInput.addEventListener(
      "change",
      function() {

        updateGeneralRowTotal();

      }
    );

  }


  /* ==========================================
     HARGA HEADER BERUBAH
  ========================================== */

  if (
    headerPriceInput
  ) {

    headerPriceInput.addEventListener(
      "input",
      function() {

        updateGeneralRowTotal();

      }
    );

    headerPriceInput.addEventListener(
      "change",
      function() {

        updateGeneralRowTotal();

      }
    );

  }


  /* ==========================================
     DP HEADER BERUBAH
  ========================================== */

  if (
    headerDPInput
  ) {

    headerDPInput.addEventListener(
      "input",
      function() {

        updateGeneralRowTotal();

      }
    );

    headerDPInput.addEventListener(
      "change",
      function() {

        updateGeneralRowTotal();

      }
    );

  }


  /* ==========================================
     MODE HARGA BERUBAH
  ========================================== */

  if (
    priceModeInput
  ) {

    priceModeInput.addEventListener(
      "change",
      function() {

        updateGeneralRowTotal();

      }
    );

  }


  /* ==========================================
     MODE DP BERUBAH
  ========================================== */

  if (
    dpModeInput
  ) {

    dpModeInput.addEventListener(
      "change",
      function() {

        updateGeneralRowTotal();

      }
    );

  }


  /* ==========================================
     TAMPILKAN HASIL AWAL
  ========================================== */

  updateGeneralRowTotal();

}
     
/* ==========================================
   WAR / MEMBER — HARGA MENGIKUTI HEADER
========================================== */

if (poTypeNow === "war") {

  const priceInput =
    row.querySelector(".po-row-price");

  const headerPriceInput =
    document.getElementById("poPrice");

function updateWarRowPrice() {
  if (!priceInput || !headerPriceInput) {
    return;
  }

  priceInput.value =
    headerPriceInput.value || "";

  priceInput.readOnly = true;
}
   
  if (headerPriceInput) {
    headerPriceInput.addEventListener(
      "input",
      updateWarRowPrice
    );

    headerPriceInput.addEventListener(
      "change",
      updateWarRowPrice
    );
  }

  updateWarRowPrice();
}

     /* ==========================================
   WAR / MEMBER — DP MENGIKUTI HEADER
========================================== */

if (
  poTypeNow === "war"
) {

  const dpInput =
    row.querySelector(
      ".po-row-dp"
    );

  const headerDPInput =
    document.getElementById(
      "poDP"
    );

  function updateWarRowDP() {

    if (
      !dpInput ||
      !headerDPInput
    ) {
      return;
    }

    dpInput.value =
      headerDPInput.value || "";

    dpInput.readOnly = true;
  }

  if (headerDPInput) {

    headerDPInput.addEventListener(
      "input",
      updateWarRowDP
    );

    headerDPInput.addEventListener(
      "change",
      updateWarRowDP
    );

  }

  updateWarRowDP();
}
     
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
   HITUNG NILAI RUPIAH
========================================== */

function parsePONominal(value) {

  return Number(
    String(value || "")
      .replace(/[^\d]/g, "")
  ) || 0;

}


function formatPONominal(value) {

  return Number(value || 0)
    .toLocaleString("id-ID");

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

 document.querySelectorAll(".po-row-price-group")
  .forEach(function(group) {
    group.style.display = "";
  });

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

  document.querySelectorAll(".po-row-dp-group")
  .forEach(function(group) {
    group.style.display = "";
  });
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

        customer_id:
  Number(
    row
      .querySelector(
        ".po-row-customer-id"
      )
      ?.value
  ) || null,

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
   
   const batchStatus =
  document.getElementById("poBatchStatus")?.value || "available";


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


      const customerInput =
  row.querySelector(
    ".po-row-customer"
  );

const customerId =
  Number(
    row.querySelector(
      ".po-row-customer-id"
    )?.value
  ) || null;

const customer =
  customerInput
    ?.value
    .trim() || "";

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

  customer_id:
    customerId,

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

     batch_status:
   batchStatus,
     
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

/* ==========================================
   KEMBALI KE DAFTAR PO BERJALAN
   SETELAH EDIT / SIMPAN
========================================== */

const poListContainer =
  document.getElementById(
    "poListContainer"
  );

if (poListContainer) {
  poListContainer.style.display =
    "none";
}

await loadPORunningList();
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
        batch_status,
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

          ${
  po.batch_status === "full"
    ? `
      <div class="po-batch-full-notice">
        🔴 BATCH FULL
      </div>
    `
    : ""
}
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
      async function () {

        const poId =
          this.dataset.poId;

         localStorage.setItem(
  "dearNadiyaSelectedPO",
  String(poId)
);

   localStorage.removeItem(
  "dearNadiyaSelectedClaimPO"
);

localStorage.removeItem(
  "dearNadiyaSelectedArchivePO"
);

        if (!poId) {
          return;
        }

        try {

          const {
            data: po,
            error
          } =
            await supabaseClient
              .from("po_posts")
              .select("*")
              .eq("id", poId)
              .single();

          if (error) {

            console.error(
              "Gagal mengambil PO:",
              error
            );

            alert(
              "Gagal membuka PO: " +
              error.message
            );

            return;
          }

          const poListContainer =
            document.getElementById(
              "poListContainer"
            );

          if (poListContainer) {
            poListContainer.style.display =
              "none";
          }

          showPODetailAdmin(po);

        } catch (error) {

          console.error(
            "ERROR BUKA PO:",
            error
          );

          alert(
            "Gagal membuka PO."
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

/* Simpan PO claim terakhir */
localStorage.setItem(
  "dearNadiyaSelectedClaimPO",
  String(poId)
);

/* Pastikan mode lain tidak ikut tersimpan */
localStorage.removeItem(
  "dearNadiyaSelectedPO"
);

localStorage.removeItem(
  "dearNadiyaSelectedArchivePO"
);

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

/* ==========================================
   TAMPILKAN DETAIL PO CLAIM
   TIDAK LANGSUNG MASUK FORM EDIT
========================================== */

showPODetailAdmin(po);

/* Scroll ke detail */
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
   LOAD REKAP LAMA MASIH BISA CLAIM
   ============================================ */

async function loadOldRecapClaimList() {
  const container =
    document.getElementById(
      "poClaimContainer"
    );

  if (!container) {
    return;
  }

   /* ==========================================
   HAPUS KARTU REKAP GO LAMA
   SEBELUM MEMUAT ULANG
========================================== */

container
  .querySelectorAll(
    ".po-recap-claim-card"
  )
  .forEach(
    function(card) {

      card.remove();

    }
  );

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("purchase_recap")
        .select(`
  id,
  category,
  batch_code,
  item_name,
  version,
  quantity,
  item_price,
  minimum_dp_amount,
  customer_id,
  customer_name,
  image_url,
  batch_tracking_status
`)
        .not(
          "version",
          "is",
          null
        )
        .order(
          "id",
          {
            ascending: false
          }
        );

    if (error) {
      console.error(
        "ERROR LOAD REKAP LAMA CLAIM:",
        error
      );
      return;
    }

    const availableRows =
      (data || []).filter(
        function(row) {

          const hasMember =
            row &&
            row.version &&
            String(
              row.version
            ).trim();

          const hasCustomer =
            row &&
            row.customer_name &&
            String(
              row.customer_name
            ).trim();

          const tracking =
  String(
    row.batch_tracking_status || ""
  ).trim();

return (
  hasMember &&
  !hasCustomer &&
  tracking !== "Arrived Admin" &&
  tracking !== "Goods Arrive at Customer"
);

        }
      );

    if (
      availableRows.length === 0
    ) {
      return;
    }

    /*
      Kelompokkan berdasarkan
      kategori + batch
    */
    const grouped = {};

    availableRows.forEach(
      function(row) {

        const key =
          [
            row.category || "",
            row.batch_code || ""
          ].join("|");

        if (!grouped[key]) {
  grouped[key] = {
    category:
      row.category || "",
    batch_code:
      row.batch_code || "",
    item_name:
      row.item_name || "",
    image_url:
      row.image_url || "",
    rows: []
  };
}
         
        grouped[key].rows.push(
          row
        );

      }
    );

    const cards =
      Object.values(
        grouped
      )
      .map(
        function(group) {

          const count =
            group.rows.length;

          return `
            <div
              class="po-running-card po-claim-card po-recap-claim-card"
              data-recap-batch="${escapeHTML(
                group.batch_code
              )}"
              data-recap-category="${escapeHTML(
                group.category
              )}"
            >

              <div
  class="po-running-card-image"
>
  ${
    group.image_url
      ? `
        <img
          src="${escapeHTML(
            group.image_url
          )}"
          alt="${escapeHTML(
            group.item_name ||
            group.batch_code ||
            "Foto Rekap GO"
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
                    group.batch_code ||
                    "Rekap GO"
                  )}
                </h4>

                <p>
                  ${escapeHTML(
                    group.item_name ||
                    group.category ||
                    "Rekap GO Lama"
                  )}
                </p>

                <strong>
                  🟢 ${count}
                  member masih tersedia
                </strong>

              </div>

            </div>
          `;

        }
      )
      .join("");

    container.insertAdjacentHTML(
      "beforeend",
      cards
    );

    /*
      Klik kartu Rekap Lama
    */
    container
      .querySelectorAll(
        ".po-recap-claim-card"
      )
      .forEach(
        function(card) {

          card.addEventListener(
            "click",
            async function() {

              const batchCode =
                this.dataset
                  .recapBatch;

              const category =
                this.dataset
                  .recapCategory;

              if (
                !batchCode ||
                !category
              ) {
                return;
              }

              await showOldRecapClaimDetail(
                category,
                batchCode
              );

            }
          );

        }
      );

  } catch (error) {

    console.error(
      "Gagal memuat Rekap GO lama yang masih bisa claim:",
      error
    );

  }
}


/* ============================================
   DETAIL REKAP LAMA UNTUK CLAIM
   ============================================ */

async function showOldRecapClaimDetail(
  category,
  batchCode
) {

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
      "ERROR LOAD DETAIL REKAP CLAIM:",
      error
    );

    alert(
      "Gagal membuka Rekap GO."
    );

    return;
  }

  const rows =
    (data || []).filter(
      function(row) {

        const tracking =
  String(
    row.batch_tracking_status || ""
  ).trim();

return (
  row &&
  row.version &&
  String(
    row.version
  ).trim() &&
  !(
    row.customer_name &&
    String(
      row.customer_name
    ).trim()
  ) &&
  tracking !== "Arrived Admin" &&
  tracking !== "Goods Arrive at Customer"
);

      }
    );

/* ==========================================
   RINGKASAN DATA REKAP GO
   ========================================== */

const firstRow =
  data?.[0] || {};


/* Harga */

const recapPrice =
  Number(
    firstRow.item_price || 0
  );


/* DP
   Prioritas:
   1. DP Aktual
   2. DP Minimum
*/

const recapDP =
  Number(
    firstRow.dp_amount || 0
  ) > 0
    ? Number(
        firstRow.dp_amount
      )
    : Number(
        firstRow.minimum_dp_amount || 0
      );


/* Sisa pembayaran */

const recapRemaining =
  Number(
    firstRow.remaining_amount || 0
  );


/* Tracking */

const recapTracking =
  String(
    firstRow.batch_tracking_status ||
    ""
  ).trim() ||
  "—";


/* Status DP */

const recapDPStatus =
  String(
    firstRow.dp_status ||
    ""
  ).trim() ||
  "—";


/* Status pembayaran */

const recapPaymentStatus =
  String(
    firstRow.payment_status ||
    ""
  ).trim() ||
  "—";


/* Status customer */

const recapCustomerStatus =
  String(
    firstRow.customer_status ||
    ""
  ).trim() ||
  "—";


/* Format nominal */

const formatDetailRupiah =
  function(value) {

    const number =
      Number(value || 0);

    if (!number) {
      return "—";
    }

    return (
      "Rp" +
      number.toLocaleString(
        "id-ID"
      )
    );

  };


/* Format tanggal */

const formatDetailDate =
  function(value) {

    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

  };
   
  const container =
    document.getElementById(
      "poFormContainer"
    );

  if (!container) {
    return;
  }

  container.style.display =
    "block";

  container.innerHTML = `
  <div class="panel">

    <div
      class="panel-header"
      style="
        align-items:flex-start;
        gap:18px;
      "
    >

      <div
        style="
          display:flex;
          align-items:flex-start;
          gap:14px;
          min-width:0;
        "
      >

        <div
          style="
            width:72px;
            height:72px;
            flex:0 0 72px;
            border-radius:10px;
            overflow:hidden;
            border:1px solid #e4dceb;
            background:#f8f7fb;
            display:flex;
            align-items:center;
            justify-content:center;
          "
        >
          ${
            data?.[0]?.image_url
              ? `
                <img
                  src="${escapeHTML(
                    data[0].image_url
                  )}"
                  alt="Foto Barang"
                  style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                  "
                >
              `
              : `
                <span
                  style="
                    font-size:28px;
                  "
                >
                  📦
                </span>
              `
          }
        </div>

        <div>
          <h3>
            🎟️ Claim Member
          </h3>

          <p>
            ${escapeHTML(
              batchCode
            )}
          </p>

          <strong>
  ${escapeHTML(
    data?.[0]?.item_name ||
    "Rekap GO"
  )}
</strong>

<div class="old-recap-detail-info">

  <div class="old-recap-detail-item">

    <span>Harga</span>

    <strong>
      Rp${Number(
        data?.[0]?.item_price || 0
      ).toLocaleString("id-ID")}
    </strong>

  </div>


  <div class="old-recap-detail-item">

    <span>DP</span>

    <strong>
  Rp${recapDP.toLocaleString("id-ID")}
</strong>

  </div>


  <div class="old-recap-detail-item">

    <span>Tracking</span>

    <strong>
      ${escapeHTML(
        data?.[0]?.batch_tracking_status ||
        "—"
      )}
    </strong>

  </div>

</div>

<div
  style="
    margin-top:10px;
  "
>
            <button
              type="button"
              class="secondary-button"
              id="editOldRecapPhotoButton"
            >
              ${
                data?.[0]?.image_url
                  ? "✏️ Ganti Foto"
                  : "📷 Tambah Foto"
              }
            </button>
          </div>
        </div>

      </div>

      <button
        type="button"
        class="secondary-button"
        id="backOldRecapClaimButton"
      >
        ← Kembali
      </button>

    </div>

          <div
        style="
          display:grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap:12px;
          margin-top:20px;
        "
      >

        <div
          style="
            padding:14px;
            border:1px solid #eadfe6;
            border-radius:12px;
            background:#fff;
          "
        >
          <div
            style="
              font-size:13px;
              color:#777;
              margin-bottom:5px;
            "
          >
            Harga
          </div>

          <strong>
            Rp${recapPrice.toLocaleString("id-ID")}
          </strong>
        </div>

        <div
          style="
            padding:14px;
            border:1px solid #eadfe6;
            border-radius:12px;
            background:#fff;
          "
        >
          <div
            style="
              font-size:13px;
              color:#777;
              margin-bottom:5px;
            "
          >
            DP
          </div>

          <strong>
            Rp${recapDP.toLocaleString("id-ID")}
          </strong>
        </div>

        <div
          style="
            padding:14px;
            border:1px solid #eadfe6;
            border-radius:12px;
            background:#fff;
          "
        >
          <div
            style="
              font-size:13px;
              color:#777;
              margin-bottom:5px;
            "
          >
            Tracking
          </div>

          <strong>
            ${escapeHTML(recapTracking)}
          </strong>
        </div>

      </div>
    
      <div
        class="product-table-wrapper"
        style="margin-top:20px;"
      >

        <table
          class="product-table"
        >

          <thead>
            <tr>
              <th>
                Versi / Member
              </th>

              <th>
                Quantity
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

            ${
              rows
                .map(
                  function(row) {

                    return `
                      <tr>

                        <td>
                          ${escapeHTML(
                            row.version ||
                            "—"
                          )}
                        </td>

                        <td>
                          ${
                            row.quantity ||
                            1
                          }
                        </td>

                        <td>
                          <span
                            class="po-status-available"
                          >
                            🟢 available
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            class="primary-button old-recap-claim-button"
                            data-id="${escapeHTML(
                              String(
                                row.id
                              )
                            )}"
                          >
                            🎟️ Claim
                          </button>
                        </td>

                      </tr>
                    `;

                  }
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>
  `;

  document
    .getElementById(
      "backOldRecapClaimButton"
    )
    ?.addEventListener(
      "click",
      function() {

        container.innerHTML = "";
        container.style.display =
          "none";

      }
    );

const editOldRecapPhotoButton =
  document.getElementById(
    "editOldRecapPhotoButton"
  );

if (
  editOldRecapPhotoButton
) {

  editOldRecapPhotoButton.addEventListener(
    "click",
    async function() {

      await uploadOldRecapBatchPhoto(
        category,
        batchCode
      );

    }
  );

}

  container
    .querySelectorAll(
      ".old-recap-claim-button"
    )
    .forEach(
      function(button) {

        button.addEventListener(
          "click",
          async function() {

            const id =
              Number(
                this.dataset.id
              );

            if (!id) {
              return;
            }

            await editRecap(id);

          }
        );

      }
    );

  setTimeout(
    function() {

      container.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    50
  );
}

/* ============================================
   UPLOAD FOTO REKAP LAMA MASIH BISA CLAIM
   ============================================ */

async function uploadOldRecapBatchPhoto(
  category,
  batchCode
) {

  const fileInput =
    document.createElement(
      "input"
    );

  fileInput.type = "file";
  fileInput.accept =
    "image/*";

  fileInput.addEventListener(
    "change",
    async function() {

      const file =
        fileInput.files?.[0];

      if (!file) {
        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "File foto harus berupa gambar."
        );
        return;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();

      const fileName =
        `recap-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${extension}`;

      const {
        error: uploadError
      } =
        await supabaseClient
          .storage
          .from(
            "po-images"
          )
          .upload(
            fileName,
            file,
            {
              cacheControl:
                "3600",
              upsert:
                false
            }
          );

      if (uploadError) {

        console.error(
          "ERROR UPLOAD RECAP IMAGE:",
          uploadError
        );

        alert(
          "Gagal upload foto: " +
          uploadError.message
        );

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
            fileName
          );

      const imageURL =
        publicURLData?.publicUrl ||
        null;

      if (!imageURL) {

        alert(
          "URL foto tidak berhasil dibuat."
        );

        return;
      }

      /*
        SIMPAN FOTO UNTUK
        SELURUH BATCH
      */

      const {
        error: updateError
      } =
        await supabaseClient
          .from(
            "purchase_recap"
          )
          .update({
            image_url:
              imageURL
          })
          .eq(
            "category",
            category
          )
          .eq(
            "batch_code",
            batchCode
          );

      if (updateError) {

        console.error(
          "ERROR UPDATE RECAP IMAGE:",
          updateError
        );

        alert(
          "Foto berhasil di-upload, tetapi gagal disimpan: " +
          updateError.message
        );

        return;
      }

      alert(
        "Foto batch berhasil disimpan. ♥"
      );

      await showOldRecapClaimDetail(
        category,
        batchCode
      );
    }
  );

  fileInput.click();
}

/* ============================================
   LOAD ARSIP PESANAN
   PO sudah melewati deadline dan seluruh
   member sudah memiliki customer.
   ============================================ */

async function loadPOArchiveList(showData = false) {

  const container =
    document.getElementById(
      "poArchiveContainer"
    );

  if (!container) {
    return;
  }

   if (!showData) {
  container.innerHTML = `
    <button
      type="button"
      id="poArchiveToggleButton"
      class="po-archive-toggle-button"
      title="Buka Arsip Pesanan"
    >
      📦
    </button>
  `;

  const archiveButton =
    document.getElementById(
      "poArchiveToggleButton"
    );

  if (archiveButton) {
    archiveButton.addEventListener(
      "click",
      function () {
        loadPOArchiveList(true);
      }
    );
  }

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

     console.log("ARCHIVE DATA:", data);
console.log("ARCHIVE ERROR:", error);

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

     const archiveTableHeader = `
  <div class="po-archive-table-header">

    <div>Kode PO</div>
    <div>Nama Barang</div>
    <div>Tanggal Selesai</div>
    <div>Member</div>
    <div>Customer</div>
    <div>Status</div>
    <div></div>

  </div>
`;

  container.innerHTML =
  archiveTableHeader +
  archivedPOs.map(function(po) {
     
  let listData = po.list_data || [];

  if (typeof listData === "string") {
    try {
      listData = JSON.parse(listData);
    } catch (error) {
      listData = [];
    }
  }

  if (!Array.isArray(listData)) {
    listData = [];
  }

  const totalMember = listData.filter(function(row) {
    return row && row.member;
  }).length;

  const totalCustomer = listData.filter(function(row) {
    return (
      row &&
      row.customer &&
      String(row.customer).trim()
    );
  }).length;

  const closeDate = po.close_date
    ? new Date(po.close_date).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      )
    : "—";

  return `
    <div
      class="po-archive-table-row"
      data-po-id="${escapeHTML(String(po.id))}"
    >

      <div class="po-archive-cell po-archive-code">
        ${escapeHTML(String(po.id))}
      </div>

      <div class="po-archive-cell po-archive-title">
        ${escapeHTML(String(po.title || "—"))}
      </div>

      <div class="po-archive-cell po-archive-date">
        ${closeDate}
      </div>

      <div class="po-archive-cell po-archive-member">
        ${totalMember}
      </div>

      <div class="po-archive-cell po-archive-customer">
        ${totalCustomer}
      </div>

      <div class="po-archive-cell po-archive-status">
        <span class="po-archive-status-badge">
          ✅ Selesai
        </span>
      </div>

      <div class="po-archive-cell po-archive-arrow">
        →
      </div>

    </div>
  `;

}).join("");
     
         /* ==========================================
       KLIK ARSIP PESANAN
       ========================================== */

    container
      .querySelectorAll(
        ".po-archive-table-row"
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

/* Simpan arsip yang sedang dibuka */
localStorage.setItem(
  "dearNadiyaSelectedArchivePO",
  String(poId)
);

/* Pastikan mode lain tidak ikut tersimpan */
localStorage.removeItem(
  "dearNadiyaSelectedPO"
);

localStorage.removeItem(
  "dearNadiyaSelectedClaimPO"
);

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

<div
  class="po-recap-confirmation"
  style="
    margin-top:20px;
    padding:18px;
    border:1px solid #e4dceb;
    border-radius:12px;
    background:#faf8fc;
  "
>

  <h3 style="margin:0 0 6px;">
    📊 Konfirmasi Rekap GO
  </h3>

  <p style="margin:0 0 16px;">
    Tentukan tujuan Rekap GO setelah PO selesai.
  </p>

  <div
    style="
      display:grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
      gap:14px;
    "
  >

    <div class="form-group">
      <label>Type Rekap</label>

      <select id="archiveRecapType">
        <option value="">
          Pilih Type Rekap
        </option>

        <option value="Treasure">
          💎 Treasure
        </option>

        <option value="Multi Group">
          👥 Multi Group
        </option>

        <option value="Tabungan">
          💰 Tabungan
        </option>

        <option value="Jastip">
          📦 Jastip
        </option>
      </select>
    </div>


    <div class="form-group">
      <label>Kategori Rekap</label>

      <select
        id="archiveRecapCategory"
        disabled
      >
        <option value="">
          Pilih Type Rekap terlebih dahulu
        </option>
      </select>
    </div>


    <div class="form-group">
      <label>Kode Batch</label>

      <input
        type="text"
        id="archiveRecapBatchCode"
        placeholder="Contoh: TKR-260912-001"
      >
    </div>


    <div class="form-group">
      <label>Batas DP</label>

      <input
        type="text"
        value="${
          po.last_dp_date
            ? formatDateTime(
                po.last_dp_date
              )
            : "—"
        }"
        readonly
      >

      <small>
        Otomatis mengikuti Batas DP pada PO.
      </small>
    </div>


    <div
      class="form-group"
      style="grid-column:1 / -1;"
    >
      <label>Status Tracking</label>

      <select id="archiveRecapTrackingStatus">
  <option value="">
    Pilih Status Tracking
  </option>
</select>

<small>
  Pilih status tracking sesuai alur Rekap GO.
</small>
      <small>
        Status tracking dikonfirmasi Admin
        saat PO dimasukkan ke Rekap GO.
      </small>
    </div>

  </div>


  <button
    type="button"
    id="archiveRecapSubmitButton"
    class="primary-button"
    style="margin-top:16px;"
  >
  
    📥 Masukkan ke Rekap GO
  </button>

</div>

                  </div>
                `;

                 const archiveRecapType =
  document.getElementById(
    "archiveRecapType"
  );

const archiveRecapCategory =
  document.getElementById(
    "archiveRecapCategory"
  );

const archiveRecapTrackingStatus =
  document.getElementById(
    "archiveRecapTrackingStatus"
  );

if (
  archiveRecapCategory &&
  archiveRecapTrackingStatus
) {
  function updateArchiveRecapTracking() {

    const category =
      archiveRecapCategory.value;

    archiveRecapTrackingStatus.innerHTML = `
      <option value="">
        Pilih Status Tracking
      </option>
    `;

    if (!category) {
      return;
    }

    const trackingOptions =
      getTrackingOptions(category);

    trackingOptions.forEach(
      function(option) {

        const trackingOption =
          document.createElement("option");

        trackingOption.value =
          option;

        trackingOption.textContent =
          option;

        archiveRecapTrackingStatus.appendChild(
          trackingOption
        );

      }
    );

  }

  archiveRecapCategory.addEventListener(
    "change",
    updateArchiveRecapTracking
  );

  updateArchiveRecapTracking();
}


if (
  archiveRecapType &&
  archiveRecapCategory
) {

  archiveRecapType.addEventListener(
    "change",
    async function () {

      const recapType =
        this.value;

      archiveRecapCategory.innerHTML = `
        <option value="">
          Memuat kategori...
        </option>
      `;

      archiveRecapCategory.disabled =
        true;


      if (!recapType) {

        archiveRecapCategory.innerHTML = `
          <option value="">
            Pilih Type Rekap terlebih dahulu
          </option>
        `;

        return;
      }


      const categories =
        await loadRecapCategories(
          recapType
        );


      if (!categories.length) {

        archiveRecapCategory.innerHTML = `
          <option value="">
            Belum ada kategori
          </option>
        `;

        return;
      }


      archiveRecapCategory.innerHTML = `
        <option value="">
          Pilih Kategori Rekap
        </option>

        ${
          categories
            .map(
              function (category) {

                return `
                  <option
                    value="${escapeHTML(
                      category.category_name
                    )}"
                  >
                    ${escapeHTML(
                      category.category_name
                    )}
                  </option>
                `;

              }
            )
            .join("")
        }
      `;


      archiveRecapCategory.disabled =
        false;

    }
  );

}

/* ==========================================
   MASUKKAN ARSIP PO KE REKAP GO
========================================== */

const archiveRecapSubmitButton =
  document.getElementById(
    "archiveRecapSubmitButton"
  );

if (archiveRecapSubmitButton) {

  archiveRecapSubmitButton.addEventListener(
    "click",
    async function () {

      const recapType =
        document.getElementById(
          "archiveRecapType"
        )?.value || "";

      const category =
        document.getElementById(
          "archiveRecapCategory"
        )?.value || "";

      const batchCode =
        document.getElementById(
          "archiveRecapBatchCode"
        )?.value
          .trim() || "";

      const trackingStatus =
        document.getElementById(
          "archiveRecapTrackingStatus"
        )?.value || "";


      /* ==============================
         VALIDASI
      ============================== */

      if (!recapType) {
        alert(
          "Silakan pilih Type Rekap."
        );
        return;
      }


      if (!category) {
        alert(
          "Silakan pilih Kategori Rekap."
        );
        return;
      }


      if (!batchCode) {
        alert(
          "Silakan isi Kode Batch."
        );
        return;
      }


      if (!trackingStatus) {
        alert(
          "Silakan pilih Status Tracking."
        );
        return;
      }


      if (
        !rows ||
        !rows.length
      ) {
        alert(
          "Tidak ada data customer dari PO ini."
        );
        return;
      }


      const yakin =
        confirm(
          "Masukkan seluruh data PO ini ke Rekap GO?"
        );


      if (!yakin) {
        return;
      }


      archiveRecapSubmitButton.disabled =
        true;

      archiveRecapSubmitButton.textContent =
        "⏳ Menyimpan...";


      try {

        const recapRows =
          rows
            .filter(function(row) {

              return (
                row.customer &&
                String(
                  row.customer
                ).trim()
              );

            })
            .map(function(row) {

              const quantity =
  Number(row.quantity) || 1;


let price = 0;

/* Harga dari baris customer */
price =
  Number(
    String(
      row.price || ""
    ).replace(
      /[^\d]/g,
      ""
    )
  ) || 0;

/* Jika row kosong, fallback ke harga header */
if (price === 0) {
  const unitPrice =
    Number(
      String(
        po.price_text || ""
      ).replace(
        /[^\d]/g,
        ""
      )
    ) || 0;

  price =
    unitPrice * quantity;
}


let dp = 0;

/* DP dari baris customer */
dp =
  Number(
    String(
      row.dp || ""
    ).replace(
      /[^\d]/g,
      ""
    )
  ) || 0;

/* Jika row kosong, fallback ke DP header */
if (dp === 0) {
  const unitDP =
    Number(
      String(
        po.dp_text || ""
      ).replace(
        /[^\d]/g,
        ""
      )
    ) || 0;

  dp =
    unitDP * quantity;
}


const remaining =
  Math.max(
    0,
    price - dp
  );


/* ==========================================
   PO ARSIP SELALU MENJADI REKAP BARU
   ========================================== */

const recapDataType =
  "baru";

let arrivedAdminAt =
  null;

let coDeadline =
  null;


/*
  Jika saat dikonfirmasi
  status tracking sudah Arrived Admin,
  catat waktu dan hitung Deadline CO +3 bulan.
*/

if (
  trackingStatus ===
  "Arrived Admin"
) {

  const now =
    new Date();

  arrivedAdminAt =
    now.toISOString();

  const deadline =
    new Date(now);

  deadline.setMonth(
    deadline.getMonth() + 3
  );

  coDeadline =
    deadline.toISOString();

}


return {
                recap_type:
                  recapType,

                category:
                  category,

                batch_code:
                  batchCode,

                item_name:
                  po.title || "",

                customer_id:
  Number(
    row.customer_id
  ) || null,

customer_name:
  String(
    row.customer || ""
  ).trim(),
                version:
                  String(
                    row.member || ""
                  ).trim(),

                quantity:
                  quantity,

                item_price:
                  price,

                minimum_dp_amount:
                  dp,

                dp_amount:
                  0,

                dp_status:
                  "unpaid",

                remaining_amount:
                  remaining,

                payment_status:
                  "unpaid",

                tracking_status:
                  trackingStatus,

                batch_tracking_status:
                  trackingStatus,

                customer_status:
                  "Belum Checkout Shopee",

                note:
                  String(
                    row.note || ""
                  ).trim(),

                dp_deadline:
  po.last_dp_date ||
  null,

recap_data_type:
  recapDataType,

co_deadline:
  coDeadline,

arrived_admin_at:
  arrivedAdminAt
   
              };

            });


        if (
          !recapRows.length
        ) {
          alert(
            "Tidak ada customer yang dapat dimasukkan ke Rekap GO."
          );

          archiveRecapSubmitButton.disabled =
            false;

          archiveRecapSubmitButton.textContent =
            "📥 Masukkan ke Rekap GO";

          return;
        }

         if (po.recap_status === "completed") {
  alert(
    "PO ini sudah pernah dimasukkan ke Rekap GO."
  );
  return;
}


        const {
          error
        } =
          await supabaseClient
            .from(
              "purchase_recap"
            )
            .insert(
              recapRows
            );


        if (error) {

          console.error(
            "ERROR MASUKKAN PO KE REKAP:",
            error
          );

          alert(
            "Gagal memasukkan PO ke Rekap GO:\n" +
            error.message
          );

          archiveRecapSubmitButton.disabled =
            false;

          archiveRecapSubmitButton.textContent =
            "📥 Masukkan ke Rekap GO";

          return;
        }


        alert(
          "PO berhasil dimasukkan ke Rekap GO. ♥"
        );

         const { error: recapStatusError } =
  await supabaseClient
    .from("po_posts")
    .update({
      recap_type: recapType,
      recap_category: category,
      recap_batch_code: batchCode,
      recap_status: "completed"
    })
    .eq("id", po.id);

if (recapStatusError) {
  console.error(
    "GAGAL MENYIMPAN STATUS REKAP PO:",
    recapStatusError
  );
}

        archiveRecapSubmitButton.textContent =
          "✅ Sudah Masuk Rekap GO";


      } catch (error) {

        console.error(
          "ERROR KONFIRMASI REKAP:",
          error
        );

        alert(
          "Terjadi kesalahan saat memasukkan PO ke Rekap GO."
        );


        archiveRecapSubmitButton.disabled =
          false;

        archiveRecapSubmitButton.textContent =
          "📥 Masukkan ke Rekap GO";

      }

    }
  );

}

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
   MASTER DATA CUSTOMER
   ============================================ */

async function loadCustomers() {

  pageTitle.textContent =
    "Data Customer";

  pageContent.innerHTML = `
    <div class="panel">

      <div class="panel-header">

        <div>
          <h2>
            👤 Data Customer
          </h2>

          <p>
            Kelola identitas customer Dear Nadiya
            berdasarkan DN ID.
          </p>
        </div>

        <button
          type="button"
          class="primary-button"
          id="addCustomerButton"
        >
          ➕ Tambah Customer
        </button>

      </div>

      <div
        id="customerFormContainer"
        style="margin-bottom:20px;"
      ></div>

      <div
        style="
          margin-bottom:16px;
        "
      >
        <input
          type="text"
          id="customerSearchInput"
          placeholder="🔎 Cari DN ID, nama, WhatsApp, atau username..."
          style="
            width:100%;
            box-sizing:border-box;
          "
        >
      </div>

      <div
        id="customerListContainer"
      >
        Memuat data customer...
      </div>

    </div>
  `;

  const addButton =
    document.getElementById(
      "addCustomerButton"
    );

  if (addButton) {

    addButton.addEventListener(
      "click",
      function () {

        showCustomerForm();

      }
    );

  }

  const searchInput =
    document.getElementById(
      "customerSearchInput"
    );

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        renderCustomerTable(
          this.value
        );

      }
    );

  }

  await renderCustomerTable();

}


/* ============================================
   TAMPILKAN FORM CUSTOMER
   ============================================ */

function showCustomerForm(
  customer = null
) {

  const container =
    document.getElementById(
      "customerFormContainer"
    );

  if (!container) {
    return;
  }

  const isEdit =
    customer !== null;

  container.innerHTML = `

    <div
      class="panel"
      style="
        background:#faf8fc;
        border:1px solid #e4dceb;
      "
    >

      <h3>
        ${
          isEdit
            ? "✏️ Edit Customer"
            : "➕ Tambah Customer"
        }
      </h3>

      ${
        isEdit
          ? `
            <p>
              DN ID:
              <strong>
                ${escapeHTML(
                  customer.dn_id
                )}
              </strong>
            </p>
          `
          : `
            <p>
              DN ID akan dibuat otomatis oleh sistem.
            </p>
          `
      }

      <form id="customerForm">

        <label>
          Nama Customer
        </label>

        <input
          type="text"
          id="customerNameInput"
          value="${escapeHTML(
            customer?.name || ""
          )}"
          required
        >

        <label>
          Nomor WhatsApp
        </label>

        <input
          type="text"
          id="customerWhatsappInput"
          value="${escapeHTML(
            customer?.whatsapp || ""
          )}"
          placeholder="Contoh: 628123456789"
        >

        <small>
          Boleh dikosongkan jika belum tersedia.
        </small>

        <label>
          Username WhatsApp
        </label>

        <input
          type="text"
          id="customerUsernameInput"
          value="${escapeHTML(
            customer?.username_wa || ""
          )}"
          placeholder="@username"
        >

        <label>
          Email
        </label>

        <input
          type="email"
          id="customerEmailInput"
          value="${escapeHTML(
            customer?.email || ""
          )}"
          placeholder="Opsional"
        >
        
        <div
          style="
            display:flex;
            gap:10px;
            margin-top:16px;
          "
        >

          <button
            type="submit"
            class="primary-button"
          >
            ${
              isEdit
                ? "💾 Simpan Perubahan"
                : "💾 Simpan Customer"
            }
          </button>

          <button
            type="button"
            class="secondary-button"
            id="cancelCustomerButton"
          >
            Batal
          </button>

        </div>

      </form>

    </div>

  `;


  const form =
    document.getElementById(
      "customerForm"
    );

  if (form) {

    form.addEventListener(
      "submit",
      async function(event) {

        event.preventDefault();

        await saveCustomer(
          customer
        );

      }
    );

  }


  const cancelButton =
    document.getElementById(
      "cancelCustomerButton"
    );

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function() {

        container.innerHTML = "";

      }
    );

  }

}


/* ============================================
   SIMPAN CUSTOMER
   ============================================ */

/* ============================================
   QUICK CREATE CUSTOMER
   Untuk PO / Rekap GO
   ============================================ */

async function createCustomerQuickly({
  name,
  whatsapp = "",
  username_wa = ""
}) {

  name = String(name || "").trim();
  whatsapp = String(whatsapp || "").trim();
  username_wa = String(username_wa || "").trim();

  if (!name) {
    alert("Nama customer wajib diisi.");
    return null;
  }

  const whatsappValue =
    whatsapp || null;

  /* ==========================================
     CEK DUPLIKAT WHATSAPP
  ========================================== */

  if (whatsappValue) {

    const {
      data: duplicateWhatsapp,
      error: duplicateError
    } = await supabaseClient
      .from("customers")
      .select("id")
      .eq("whatsapp", whatsappValue)
      .limit(1);

    if (duplicateError) {

      console.error(
        "ERROR CEK WHATSAPP QUICK CUSTOMER:",
        duplicateError
      );

      alert(
        "Gagal mengecek nomor WhatsApp."
      );

      return null;
    }

    if (
      duplicateWhatsapp &&
      duplicateWhatsapp.length > 0
    ) {

      alert(
        "Nomor WhatsApp tersebut sudah digunakan oleh customer lain."
      );

      return null;
    }

  }

  /* ==========================================
     BUAT DN ID BERIKUTNYA
  ========================================== */

  const {
    data: lastCustomer,
    error: lastError
  } = await supabaseClient
    .from("customers")
    .select("dn_id")
    .not("dn_id", "is", null)
    .order("dn_id", {
      ascending: false
    })
    .limit(1);

  if (lastError) {

    console.error(
      "ERROR AMBIL DN ID QUICK CUSTOMER:",
      lastError
    );

    alert(
      "Gagal membuat DN ID: " +
      lastError.message
    );

    return null;
  }

  let nextNumber = 1;

  if (
    lastCustomer &&
    lastCustomer.length > 0 &&
    lastCustomer[0].dn_id
  ) {

    const match =
      String(
        lastCustomer[0].dn_id
      ).match(/DN-(\d+)/);

    if (match) {

      nextNumber =
        Number(match[1]) + 1;

    }

  }

  const dnId =
    "DN-" +
    String(nextNumber).padStart(
      6,
      "0"
    );

  /* ==========================================
     INSERT CUSTOMER
  ========================================== */

  const {
    data: newCustomer,
    error: insertError
  } = await supabaseClient
    .from("customers")
    .insert({
      dn_id: dnId,
      name: name,
      whatsapp: whatsappValue,
      username_wa:
        username_wa || null
    })
    .select(
      "id, dn_id, name, whatsapp, username_wa"
    )
    .single();

    if (insertError) {

    console.error(
      "ERROR INSERT QUICK CUSTOMER:",
      insertError
    );

    alert(
      "Gagal menambahkan customer: " +
      insertError.message
    );

    return null;
  }


  /* ==========================================
     BERITAHU SEMUA FORM BATCH
     BAHWA CUSTOMER BARU SUDAH DIBUAT
     ========================================== */

  document.dispatchEvent(
    new CustomEvent(
      "dearNadiyaCustomerCreated",
      {
        detail: newCustomer
      }
    )
  );


  return newCustomer;
}

function showQuickCustomerForm(
  onSaved
) {

  const oldModal =
    document.getElementById(
      "quickCustomerModal"
    );

  if (oldModal) {
    oldModal.remove();
  }

  const overlay =
    document.createElement("div");

  overlay.id =
    "quickCustomerModal";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:100000;
    padding:20px;
  `;

  overlay.innerHTML = `
    <div
      style="
        width:100%;
        max-width:420px;
        background:#fff;
        border-radius:14px;
        padding:20px;
        box-shadow:0 12px 35px rgba(0,0,0,.2);
      "
    >

      <h3
        style="
          margin:0 0 16px;
        "
      >
        ➕ Buat Customer Baru
      </h3>

      <label
        style="
          display:block;
          margin-bottom:6px;
          font-weight:600;
        "
      >
        Nama Customer
      </label>

      <input
        type="text"
        id="quickCustomerName"
        placeholder="Nama customer"
        autocomplete="off"
        style="
          width:100%;
          box-sizing:border-box;
          padding:9px 10px;
          margin-bottom:12px;
        "
      >

      <label
        style="
          display:block;
          margin-bottom:6px;
          font-weight:600;
        "
      >
        Nomor WhatsApp
      </label>

      <input
        type="text"
        id="quickCustomerWhatsapp"
        placeholder="628123456789"
        autocomplete="off"
        style="
          width:100%;
          box-sizing:border-box;
          padding:9px 10px;
          margin-bottom:12px;
        "
      >

      <label
        style="
          display:block;
          margin-bottom:6px;
          font-weight:600;
        "
      >
        Username WhatsApp
      </label>

      <input
        type="text"
        id="quickCustomerUsername"
        placeholder="@username"
        autocomplete="off"
        style="
          width:100%;
          box-sizing:border-box;
          padding:9px 10px;
          margin-bottom:18px;
        "
      >

      <div
        style="
          display:flex;
          gap:8px;
          justify-content:flex-end;
        "
      >

        <button
          type="button"
          id="cancelQuickCustomer"
        >
          Batal
        </button>

        <button
          type="button"
          id="saveQuickCustomer"
        >
          💾 Simpan Customer
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(
    overlay
  );

  const nameInput =
    document.getElementById(
      "quickCustomerName"
    );

  const whatsappInput =
    document.getElementById(
      "quickCustomerWhatsapp"
    );

  const usernameInput =
    document.getElementById(
      "quickCustomerUsername"
    );

  const saveButton =
    document.getElementById(
      "saveQuickCustomer"
    );

  const cancelButton =
    document.getElementById(
      "cancelQuickCustomer"
    );

  nameInput?.focus();

  cancelButton?.addEventListener(
    "click",
    () => {
      overlay.remove();
    }
  );

  overlay.addEventListener(
    "click",
    event => {

      if (
        event.target === overlay
      ) {
        overlay.remove();
      }

    }
  );

  saveButton?.addEventListener(
    "click",
    async () => {

      if (
        saveButton.disabled
      ) {
        return;
      }

      saveButton.disabled =
        true;

      saveButton.textContent =
        "⏳ Menyimpan...";

      const customer =
        await createCustomerQuickly({
          name:
            nameInput?.value || "",
          whatsapp:
            whatsappInput?.value || "",
          username_wa:
            usernameInput?.value || ""
        });

      if (!customer) {

        saveButton.disabled =
          false;

        saveButton.textContent =
          "💾 Simpan Customer";

        return;
      }

      overlay.remove();

      if (
        typeof onSaved ===
        "function"
      ) {
        onSaved(customer);
      }

    }
  );

}

async function saveCustomer(
  existingCustomer = null
) {

  const name =
    document
      .getElementById(
        "customerNameInput"
      )
      ?.value
      .trim() || "";

  const whatsappRaw =
    document
      .getElementById(
        "customerWhatsappInput"
      )
      ?.value
      .trim() || "";

  const username =
    document
      .getElementById(
        "customerUsernameInput"
      )
      ?.value
      .trim() || "";

  const email =
    document
      .getElementById(
        "customerEmailInput"
      )
      ?.value
      .trim() || "";


  if (!name) {

    alert(
      "Nama customer wajib diisi."
    );

    return;

  }


  const whatsapp =
    whatsappRaw || null;


  /*
    CEK NOMOR WHATSAPP
    Hanya jika diisi.
  */

  if (whatsapp) {

    let query =
      supabaseClient
        .from("customers")
        .select("id")
        .eq(
          "whatsapp",
          whatsapp
        )
        .limit(1);

    if (existingCustomer) {

      query =
        query.neq(
          "id",
          existingCustomer.id
        );

    }

    const {
      data: duplicateWhatsapp,
      error: duplicateError
    } =
      await query;

    if (duplicateError) {

      console.error(
        "ERROR CEK WHATSAPP:",
        duplicateError
      );

      alert(
        "Gagal mengecek nomor WhatsApp."
      );

      return;

    }

    if (
      duplicateWhatsapp &&
      duplicateWhatsapp.length > 0
    ) {

      alert(
        "Nomor WhatsApp tersebut sudah digunakan oleh customer lain."
      );

      return;

    }

  }


  /*
    EDIT CUSTOMER
  */

  if (existingCustomer) {

    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .update({

          name:
            name,

          whatsapp:
            whatsapp,

          username_wa:
            username || null,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          "id",
          existingCustomer.id
        );


    if (error) {

      console.error(
        "ERROR UPDATE CUSTOMER:",
        error
      );

      alert(
        "Gagal memperbarui customer: " +
        error.message
      );

      return;

    }


    alert(
      "Data customer berhasil diperbarui."
    );

  }


  /*
    CUSTOMER BARU
  */

  else {

    /*
      Ambil DN ID terakhir
      lalu buat nomor berikutnya.
    */

    const {
      data: lastCustomer,
      error: lastError
    } =
      await supabaseClient
        .from("customers")
        .select(
          "dn_id"
        )
        .not(
          "dn_id",
          "is",
          null
        )
        .order(
          "dn_id",
          {
            ascending:false
          }
        )
        .limit(1);


    if (lastError) {

      console.error(
        "ERROR AMBIL DN ID:",
        lastError
      );

      alert(
        "Gagal membuat DN ID: " +
        lastError.message
      );

      return;

    }


    let nextNumber =
      1;


    if (
      lastCustomer &&
      lastCustomer.length > 0 &&
      lastCustomer[0].dn_id
    ) {

      const match =
        String(
          lastCustomer[0].dn_id
        ).match(
          /DN-(\d+)/
        );

      if (match) {

        nextNumber =
          Number(
            match[1]
          ) + 1;

      }

    }


    const dnId =
      "DN-" +
      String(
        nextNumber
      ).padStart(
        6,
        "0"
      );


    const {
      error
    } =
      await supabaseClient
        .from("customers")
        .insert({

          dn_id:
            dnId,

          name:
            name,

          whatsapp:
            whatsapp,

          username_wa:
            username || null,

          email:
            email || null,

          notes:
            notes || null

        });


    if (error) {

      console.error(
        "ERROR INSERT CUSTOMER:",
        error
      );

      alert(
        "Gagal menambahkan customer: " +
        error.message
      );

      return;

    }


    alert(
      "Customer berhasil ditambahkan dengan DN ID " +
      dnId
    );

  }


  const formContainer =
    document.getElementById(
      "customerFormContainer"
    );

  if (formContainer) {

    formContainer.innerHTML = "";

  }


  await renderCustomerTable();

}


/* ============================================
   RENDER TABEL CUSTOMER
   ============================================ */

async function renderCustomerTable(
  searchText = ""
) {

  const container =
    document.getElementById(
      "customerListContainer"
    );

  if (!container) {
    return;
  }


  let query =
    supabaseClient
      .from("customers")
      .select(
        "*"
      )
      .order(
        "dn_id",
        {
          ascending:true
        }
      );


  const {
    data,
    error
  } =
    await query;


  if (error) {

    console.error(
      "ERROR LOAD CUSTOMER:",
      error
    );

    container.innerHTML = `
      <p>
        Gagal memuat data customer:
        ${escapeHTML(
          error.message
        )}
      </p>
    `;

    return;

  }


  let rows =
    data || [];


  const keyword =
    String(
      searchText || ""
    )
      .trim()
      .toLowerCase();


  if (keyword) {

    rows =
      rows.filter(
        function(customer) {

          return [

            customer.dn_id,
            customer.name,
            customer.whatsapp,
            customer.username_wa

          ]
            .some(
              function(value) {

                return String(
                  value || ""
                )
                  .toLowerCase()
                  .includes(
                    keyword
                  );

              }
            );

        }
      );

  }


  if (rows.length === 0) {

    container.innerHTML = `
      <div
        style="
          text-align:center;
          padding:30px;
        "
      >
        Belum ada data customer.
      </div>
    `;

    return;

  }


  container.innerHTML = `

    <div
  style="
    width:100%;
    overflow-x:hidden;
  "
>

      <table
  class="product-table"
  style="
  width:100% !important;
  table-layout:fixed !important;
"
>

        <thead>

          <tr>
            <th>No</th>
            <th>DN ID</th>
            <th>Nama</th>
            <th>WhatsApp</th>
            <th>Username WA</th>
            <th>Aksi</th>
          </tr>

        </thead>

        <tbody>

          ${
            rows
              .map(
                function(
                  customer,
                  index
                ) {

                  return `

                    <tr>

                      <td>
                        ${
                          index + 1
                        }
                      </td>

                      <td>
                        <strong>
                          ${escapeHTML(
                            customer.dn_id
                          )}
                        </strong>
                      </td>

                      <td>
                        ${escapeHTML(
                          customer.name
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          customer.whatsapp ||
                          "—"
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          customer.username_wa ||
                          "—"
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          class="secondary-button edit-customer-button"
                          data-id="${customer.id}"
                        >
                          ✏️ Edit
                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
          }

        </tbody>

      </table>

    </div>

  `;


  container
    .querySelectorAll(
      ".edit-customer-button"
    )
    .forEach(
      function(button) {

        button.addEventListener(
          "click",
          async function() {

            const id =
              this.dataset.id;

            const customer =
              rows.find(
                function(item) {

                  return String(
                    item.id
                  ) === String(
                    id
                  );

                }
              );

            if (customer) {

              showCustomerForm(
                customer
              );

            }

          }
        );

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

        <!-- JENIS -->
<div class="form-group">
  <label>
    Jenis
  </label>

  <select id="memberEntryType">

    <option
      value="member"
      ${
        isEdit &&
        member.entry_type === "member"
          ? "selected"
          : ""
      }
    >
      Member
    </option>

    <option
      value="character"
      ${
        isEdit &&
        member.entry_type === "character"
          ? "selected"
          : ""
      }
    >
      Character
    </option>

    <option
      value="version"
      ${
        isEdit &&
        member.entry_type === "version"
          ? "selected"
          : ""
      }
    >
      Version
    </option>

  </select>
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

   const entryTypeInput =
  document.getElementById(
    "memberEntryType"
  );


  const groupName =
    groupInput?.value.trim() || "";

  const memberName =
    memberInput?.value.trim() || "";

  const sortOrder =
    Number(
      sortInput?.value || 0
    );

   const entryType =
  entryTypeInput?.value ||
  "member";


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

  entry_type:
    entryType,

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

     /* ============================================
   KELOMPOKKAN MEMBER BERDASARKAN GROUP
   ============================================ */

const groups = [];

members.forEach(function(item) {

  const groupName =
    String(item.group_name || "").trim();

  if (
    groupName &&
    !groups.includes(groupName)
  ) {
    groups.push(groupName);
  }

});

    container.innerHTML = `

  <div class="panel">

    <div class="panel-header">

      <div>
        <h3>
          📋 Jenis Member / Versi
        </h3>

        <p>
          Pilih jenis untuk melihat daftar
          member / versi.
        </p>
      </div>

    </div>


    <div
      id="memberGroupButtons"
      style="
        display:grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(180px, 1fr)
          );
        gap:12px;
        width:100%;
      "
    >

      ${
        groups.map(function(groupName) {

          const groupCount =
            members.filter(function(item) {

              return String(
                item.group_name || ""
              ).trim() === groupName;

            }).length;


          return `

            <button
              type="button"
              class="member-group-card"
              data-group="${escapeHTML(groupName)}"
              style="
                width:100%;
                min-height:105px;
                padding:16px;
                border:1px solid #e4dceb;
                border-radius:14px;
                background:#fff;
                cursor:pointer;
                text-align:center;
                box-sizing:border-box;
              "
            >

              <div
                style="
                  font-size:28px;
                  margin-bottom:7px;
                "
              >
                👥
              </div>


              <div
                style="
                  font-size:15px;
                  font-weight:700;
                  color:#20233f;
                "
              >
                ${escapeHTML(groupName)}
              </div>


              <div
                style="
                  margin-top:4px;
                  font-size:12px;
                  color:#777;
                "
              >
                ${groupCount}
                member / versi
              </div>


              <div
                style="
                  margin-top:5px;
                  font-size:13px;
                "
              >
                Lihat →
              </div>

            </button>

          `;

        }).join("")
      }

    </div>

  </div>

`;

     /* ============================================
   AKSI KLIK KARTU GROUP
   ============================================ */

const groupButtons =
  container.querySelectorAll(
    ".member-group-card"
  );

groupButtons.forEach(function(button) {

  button.addEventListener(
    "click",
    function() {

      const groupName =
        button.dataset.group || "";

      showMemberGroup(
        groupName,
        members
      );

    }
  );

});
     
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
   TAMPILKAN MEMBER / VERSI DALAM SATU GROUP
   ============================================ */

function showMemberGroup(groupName, members) {

  const container =
    document.getElementById("memberListContainer");

  if (!container) {
    return;
  }

  const groupMembers =
    members.filter(function(item) {
      return String(item.group_name || "").trim() === groupName;
    });

  container.innerHTML = `
    <div style="
      margin-bottom:14px;
    ">
      <button
        type="button"
        class="secondary-button"
        id="backToMemberGroupsButton"
      >
        ← Kembali ke Jenis
      </button>
    </div>

    <div style="
      margin-bottom:14px;
    ">
      <h3 style="
        margin:0;
      ">
        👥 ${escapeHTML(groupName)}
      </h3>

      <p style="
        margin:4px 0 0;
        color:#777;
        font-size:13px;
      ">
        ${groupMembers.length} member / versi
      </p>
    </div>

    <div style="
      width:100%;
      overflow-x:auto;
    ">
      <table style="
        width:100%;
        min-width:600px;
        border-collapse:collapse;
      ">
        <thead>
          <tr>
            <th style="padding:10px;text-align:left;">
              Member / Versi
            </th>

            <th style="padding:10px;text-align:center;">
              Urutan
            </th>

            <th style="padding:10px;text-align:center;">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>

          ${
            groupMembers.map(function(item) {

              return `
                <tr>

                  <td style="padding:10px;">
                    ${escapeHTML(
                      String(item.member_name || "—")
                    )}
                  </td>

                  <td style="
                    padding:10px;
                    text-align:center;
                  ">
                    ${Number(item.sort_order) || 0}
                  </td>

                  <td style="
                    padding:10px;
                    text-align:center;
                  ">

                    <div style="
                      display:flex;
                      gap:6px;
                      justify-content:center;
                      flex-wrap:wrap;
                    ">

                      <button
                        type="button"
                        class="secondary-button"
                        onclick='showMemberForm(${JSON.stringify(item)})'
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        class="secondary-button"
                        onclick="deleteMember(${Number(item.id)})"
                      >
                        🗑️ Hapus
                      </button>

                    </div>

                  </td>

                </tr>
              `;

            }).join("")
          }

        </tbody>
      </table>
    </div>
  `;

  const backButton =
    document.getElementById(
      "backToMemberGroupsButton"
    );

  if (backButton) {
    backButton.addEventListener(
      "click",
      function() {
        renderMemberList();
      }
    );
  }
}

/* ============================================
   HAPUS MEMBER / VERSI
   ============================================ */

async function deleteMember(id) {

  if (!id) {
    return;
  }

  const yakin =
    confirm(
      "Yakin ingin menghapus member / versi ini?"
    );

  if (!yakin) {
    return;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("po_members")
      .delete()
      .eq("id", id)
      .select("id");

  if (error) {

    console.error(
      "Gagal menghapus member / versi:",
      error
    );

    alert(
      "Gagal menghapus member / versi: " +
      error.message
    );

    return;
  }

  if (!data || data.length === 0) {

    alert(
      "Data tidak terhapus. Periksa izin DELETE di Supabase."
    );

    return;
  }

  alert(
    "Member / versi berhasil dihapus. ♥"
  );

  await renderMemberList();
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
