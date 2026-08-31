// ============================================
// DEAR NADIYA ADMIN - NEW VERSION
// ============================================

const SUPABASE_URL = "https://cwwzsbqfznzwfclajwnw.supabase.co";
const SUPABASE_KEY = "sb_publishable_ADa_gyMfyBZ1ZcdUO8FRfw_iELzOmbQ";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// --------------------------------------------
// LOGIN
// --------------------------------------------

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "180322";

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showApp() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  showPage("dashboard");
}

function showLogin() {
  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("dearNadiyaAdminLoggedIn", "1");
    loginMessage.classList.add("hidden");
    showApp();
  } else {
    loginMessage.textContent = "Username atau password salah.";
    loginMessage.className = "message error";
  }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  sessionStorage.removeItem("dearNadiyaAdminLoggedIn");
  showLogin();
});

if (sessionStorage.getItem("dearNadiyaAdminLoggedIn") === "1") {
  showApp();
}

// --------------------------------------------
// HELPERS
// --------------------------------------------

function rupiah(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusBadge(status) {
  const s = String(status || "pending").toLowerCase();
  const label = s === "verified"
    ? "Terverifikasi"
    : s === "rejected"
      ? "Ditolak"
      : "Menunggu Verifikasi";

  return `<span class="status ${escapeHtml(s)}">${label}</span>`;
}

function setContent(html) {
  document.getElementById("pageContent").innerHTML = html;
}

// --------------------------------------------
// NAVIGATION
// --------------------------------------------

const pageTitles = {
  dashboard: "Dashboard",
  products: "Produk & GO",
  orders: "Pesanan",
  payments: "Pembayaran",
  recap: "Rekap GO"
};

document.querySelectorAll(".nav-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    showPage(button.dataset.page);
  });
});

document.getElementById("refreshBtn").addEventListener("click", function () {
  const active = document.querySelector(".nav-btn.active");
  if (active) showPage(active.dataset.page);
});

async function showPage(page) {
  document.getElementById("pageTitle").textContent =
    pageTitles[page] || "Dashboard";

  document.querySelectorAll(".nav-btn").forEach(function (button) {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  if (page === "dashboard") return loadDashboard();
  if (page === "products") return loadProducts();
  if (page === "orders") return loadOrders();
  if (page === "payments") return loadPayments();
  if (page === "recap") return loadRecap();
}

// --------------------------------------------
// DASHBOARD
// --------------------------------------------

async function loadDashboard() {
  setContent(`
    <div class="grid-3">
      <div class="card">
        <div class="muted">Total Pesanan</div>
        <div id="dashOrders" class="stat-value">...</div>
      </div>

      <div class="card">
        <div class="muted">Total Pembayaran</div>
        <div id="dashPayments" class="stat-value">...</div>
      </div>

      <div class="card">
        <div class="muted">Pembayaran Menunggu</div>
        <div id="dashPending" class="stat-value">...</div>
      </div>
    </div>

    <div class="panel" style="margin-top:16px">
      <h2>Selamat datang di Dear Nadiya Admin ♥</h2>
      <p class="muted">
        Kelola produk, pesanan, pembayaran, dan Group Order
        dari dashboard baru ini.
      </p>
    </div>
  `);

  try {
    const [orders, payments] = await Promise.all([
      db.from("go_rekap_public").select("*"),
      db.from("dn_payment_submissions").select("amount,status")
    ]);

    if (orders.error) throw orders.error;
    if (payments.error) throw payments.error;

    const paymentRows = payments.data || [];

    document.getElementById("dashOrders").textContent =
      (orders.data || []).length;

    document.getElementById("dashPayments").textContent =
      rupiah(
        paymentRows.reduce(
          (sum, row) => sum + Number(row.amount || 0),
          0
        )
      );

    document.getElementById("dashPending").textContent =
      paymentRows.filter(
        row => String(row.status || "pending").toLowerCase() === "pending"
      ).length;

  } catch (error) {
    showContentError(error);
  }
}

// --------------------------------------------
// PRODUCTS
// --------------------------------------------

async function loadProducts() {
  setContent(`
    <div class="toolbar">
      <div>
        <h2>Produk & Group Order</h2>
        <p class="muted">Kelola produk dan GO Dear Nadiya.</p>
      </div>
      <button id="addProductBtn" class="primary-btn" style="width:auto">
        ➕ Tambah Produk
      </button>
    </div>

    <div id="productFormArea"></div>
    <div id="productList" class="product-list">
      <div class="panel">Memuat produk...</div>
    </div>
  `);

  document.getElementById("addProductBtn").addEventListener(
    "click",
    showProductForm
  );

  // Produk dibuat menggunakan localStorage untuk versi awal.
  // Nanti dapat kita pindahkan ke tabel Supabase khusus products.
  renderLocalProducts();
}

function getLocalProducts() {
  try {
    return JSON.parse(
      localStorage.getItem("dearNadiyaProducts") || "[]"
    );
  } catch {
    return [];
  }
}

function saveLocalProducts(rows) {
  localStorage.setItem(
    "dearNadiyaProducts",
    JSON.stringify(rows)
  );
}

function renderLocalProducts() {
  const list = document.getElementById("productList");
  if (!list) return;

  const rows = getLocalProducts();

  if (!rows.length) {
    list.innerHTML = `
      <div class="panel empty">
        <h3>Belum ada produk</h3>
        <p>Klik "Tambah Produk" untuk membuat GO baru.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = rows.map(row => `
    <div class="product-card">
      <div>
        <h3>${escapeHtml(row.name)}</h3>
        <p>Jenis: <b>${escapeHtml(row.type)}</b></p>
        <p>Harga: <b>${rupiah(row.price)}</b></p>
        <p>DP: <b>${rupiah(row.dp)}</b></p>
        <p>Status: <b>${escapeHtml(row.status)}</b></p>
        <p>Deadline List: <b>${escapeHtml(row.deadlineList || "-")}</b></p>
        <p>Deadline Pembayaran: <b>${escapeHtml(row.deadlinePayment || "-")}</b></p>
      </div>
      <div class="actions">
        <button class="danger-btn" data-delete-product="${row.id}">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-delete-product]").forEach(
    function (button) {
      button.addEventListener("click", function () {
        const id = Number(button.dataset.deleteProduct);

        if (!confirm("Hapus produk ini?")) return;

        saveLocalProducts(
          getLocalProducts().filter(row => row.id !== id)
        );

        renderLocalProducts();
      });
    }
  );
}

function showProductForm() {
  const area = document.getElementById("productFormArea");
  if (!area) return;

  area.innerHTML = `
    <div class="panel" style="margin-bottom:16px">
      <h2>Tambah Produk / GO</h2>

      <form id="productForm">

        <label>
          Nama Produk / GO
          <input id="pName" required placeholder="Contoh: TREASURE Album Baru">
        </label>

        <label>
          Jenis
          <select id="pType">
            <option>Group Order</option>
            <option>Pre Order</option>
            <option>Ready Stock</option>
          </select>
        </label>

        <label>
          Harga
          <input id="pPrice" type="number" min="0" required>
        </label>

        <label>
          DP
          <input id="pDp" type="number" min="0" value="0">
        </label>

        <label>
          Status
          <select id="pStatus">
            <option>Open</option>
            <option>Closed</option>
            <option>Selesai</option>
          </select>
        </label>

        <label>
          Deadline List
          <input id="pDeadlineList" type="date">
        </label>

        <label>
          Deadline Pembayaran
          <input id="pDeadlinePayment" type="date">
        </label>

        <div class="form-actions">
          <button class="primary-btn" type="submit" style="width:auto">
            💾 Simpan
          </button>
          <button class="secondary-btn" type="button" id="cancelProductBtn">
            Batal
          </button>
        </div>
      </form>
    </div>
  `;

  document.getElementById("cancelProductBtn").addEventListener(
    "click",
    () => area.innerHTML = ""
  );

  document.getElementById("productForm").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const row = {
        id: Date.now(),
        name: document.getElementById("pName").value.trim(),
        type: document.getElementById("pType").value,
        price: Number(document.getElementById("pPrice").value),
        dp: Number(document.getElementById("pDp").value || 0),
        status: document.getElementById("pStatus").value,
        deadlineList: document.getElementById("pDeadlineList").value,
        deadlinePayment: document.getElementById("pDeadlinePayment").value
      };

      if (!row.name) return;

      const rows = getLocalProducts();
      rows.push(row);
      saveLocalProducts(rows);

      area.innerHTML = "";
      renderLocalProducts();
    }
  );
}

// --------------------------------------------
// ORDERS
// --------------------------------------------

async function loadOrders() {
  setContent(`
    <div class="panel">
      <h2>Pesanan</h2>
      <p class="muted">Data pesanan dari rekap GO.</p>
      <div id="ordersArea">Memuat data...</div>
    </div>
  `);

  try {
    const result = await db
      .from("go_rekap_public")
      .select("*");

    if (result.error) throw result.error;

    const rows = result.data || [];

    if (!rows.length) {
      document.getElementById("ordersArea").innerHTML =
        `<div class="empty">Belum ada pesanan.</div>`;
      return;
    }

    document.getElementById("ordersArea").innerHTML = `
      <div class="table-wrap" style="margin-top:16px">
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Produk</th>
              <th>Customer</th>
              <th>Versi</th>
              <th>Harga</th>
              <th>DP</th>
              <th>Pelunasan</th>
              <th>Status Barang</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                <td>${escapeHtml(row.product_code || "-")}</td>
                <td>${escapeHtml(row.product_name || "-")}</td>
                <td>${escapeHtml(row.customer_name || "-")}</td>
                <td>${escapeHtml(row.product_version || "-")}</td>
                <td>${rupiah(row.price)}</td>
                <td>${rupiah(row.dp)}</td>
                <td>${rupiah(row.pelunasan)}</td>
                <td>${escapeHtml(row.item_status || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    showContentError(error);
  }
}

// --------------------------------------------
// PAYMENTS
// --------------------------------------------

async function loadPayments() {
  setContent(`
    <div class="toolbar">
      <div>
        <h2>Pembayaran</h2>
        <p class="muted">
          Bukti pembayaran yang dikirim customer tanpa login.
        </p>
      </div>
    </div>

    <div id="paymentsArea">
      <div class="panel">Memuat pembayaran...</div>
    </div>
  `);

  try {
    const result = await db
      .from("dn_payment_submissions")
      .select("*")
      .order("id", { ascending: false });

    if (result.error) throw result.error;

    const rows = result.data || [];

    if (!rows.length) {
      document.getElementById("paymentsArea").innerHTML = `
        <div class="panel empty">
          <h3>Belum ada pembayaran</h3>
          <p>Pembayaran dari Customer Portal akan muncul di sini.</p>
        </div>
      `;
      return;
    }

    document.getElementById("paymentsArea").innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>WA</th>
              <th>Kode Produk</th>
              <th>Versi</th>
              <th>Nominal</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            ${rows.map(row => `
              <tr>
                <td>${escapeHtml(row.customer_name || "-")}</td>
                <td>${escapeHtml(row.whatsapp_last4 || "-")}</td>
                <td>${escapeHtml(row.product_code || "-")}</td>
                <td>${escapeHtml(row.product_version || "-")}</td>
                <td>${rupiah(row.amount)}</td>
                <td>${escapeHtml(row.payment_date || "-")}</td>
                <td>${statusBadge(row.status)}</td>

                <td>
                  <button
                    class="small-btn"
                    data-proof="${escapeHtml(row.proof_path || "")}"
                  >
                    👁 Lihat
                  </button>
                </td>

                <td>
                  <div class="actions">
                    <button
                      class="small-btn"
                      data-verify="${row.id}"
                    >
                      ✅ Verifikasi
                    </button>

                    <button
                      class="danger-btn"
                      data-reject="${row.id}"
                    >
                      ❌ Tolak
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    document.querySelectorAll("[data-proof]").forEach(
      function (button) {
        button.addEventListener("click", function () {
          openProof(button.dataset.proof);
        });
      }
    );

    document.querySelectorAll("[data-verify]").forEach(
      function (button) {
        button.addEventListener("click", function () {
          updatePayment(
            Number(button.dataset.verify),
            "verified"
          );
        });
      }
    );

    document.querySelectorAll("[data-reject]").forEach(
      function (button) {
        button.addEventListener("click", function () {
          updatePayment(
            Number(button.dataset.reject),
            "rejected"
          );
        });
      }
    );

  } catch (error) {
    showContentError(error);
  }
}

async function openProof(path) {
  if (!path) {
    alert("Bukti pembayaran tidak tersedia.");
    return;
  }

  try {
    const result = await db.storage
      .from("payment-proofs")
      .createSignedUrl(path, 600);

    if (result.error) throw result.error;

    if (!result.data?.signedUrl) {
      throw new Error("URL bukti tidak tersedia.");
    }

    window.open(result.data.signedUrl, "_blank");
  } catch (error) {
    alert("Gagal membuka bukti pembayaran:\n\n" + error.message);
  }
}

async function updatePayment(id, status) {
  const question = status === "verified"
    ? "Verifikasi pembayaran ini?"
    : "Tolak pembayaran ini?";

  if (!confirm(question)) return;

  try {
    const result = await db
      .from("dn_payment_submissions")
      .update({ status })
      .eq("id", id);

    if (result.error) throw result.error;

    alert(
      status === "verified"
        ? "Pembayaran berhasil diverifikasi."
        : "Pembayaran berhasil ditolak."
    );

    await loadPayments();
  } catch (error) {
    alert("Gagal mengubah status:\n\n" + error.message);
  }
}

// --------------------------------------------
// RECAP
// --------------------------------------------

async function loadRecap() {
  setContent(`
    <div class="panel">
      <h2>Rekap Group Order</h2>
      <p class="muted">Data rekap yang tersedia untuk admin.</p>
      <div id="recapArea">Memuat data...</div>
    </div>
  `);

  try {
    const result = await db
      .from("go_rekap_public")
      .select("*");

    if (result.error) throw result.error;

    const rows = result.data || [];

    if (!rows.length) {
      document.getElementById("recapArea").innerHTML =
        `<div class="empty">Belum ada data rekap.</div>`;
      return;
    }

    document.getElementById("recapArea").innerHTML = `
      <div class="table-wrap" style="margin-top:16px">
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Produk</th>
              <th>Customer</th>
              <th>Versi</th>
              <th>Harga</th>
              <th>DP</th>
              <th>Pelunasan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                <td>${escapeHtml(row.product_code || "-")}</td>
                <td>${escapeHtml(row.product_name || "-")}</td>
                <td>${escapeHtml(row.customer_name || "-")}</td>
                <td>${escapeHtml(row.product_version || "-")}</td>
                <td>${rupiah(row.price)}</td>
                <td>${rupiah(row.dp)}</td>
                <td>${rupiah(row.pelunasan)}</td>
                <td>${escapeHtml(row.item_status || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    showContentError(error);
  }
}

// --------------------------------------------
// ERROR
// --------------------------------------------

function showContentError(error) {
  console.error(error);

  setContent(`
    <div class="panel">
      <h2>Terjadi masalah</h2>
      <p class="muted">
        Website berhasil dibuka, tetapi data belum dapat dimuat.
      </p>
      <div class="message error">
        ${escapeHtml(error.message || String(error))}
      </div>
    </div>
  `);
}
