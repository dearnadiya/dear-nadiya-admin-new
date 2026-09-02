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


  container.innerHTML = `

    <div class="panel">

      <p>
        Memuat rekap...
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
        .select("*")
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

      throw error;

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
            Belum terdapat data pada kategori
            ${category}.
          </p>

        </div>

      `;

      return;

    }


    /* ========================================
       GROUPING BERDASARKAN KODE BATCH
       ======================================== */

    const grouped = {};


    data.forEach(
      function(item) {

        const batchCode =
          item.batch_code ||
          "Tanpa Kode Batch";


        if (
          !grouped[batchCode]
        ) {

          grouped[batchCode] = [];

        }


        grouped[batchCode].push(
          item
        );

      }
    );


    /* ========================================
       FORMAT RUPIAH
       ======================================== */

    function formatRupiah(
      value
    ) {

      return (
        "Rp" +
        Number(
          value || 0
        ).toLocaleString(
          "id-ID"
        )
      );

    }


    /* ========================================
       STATUS DP
       ======================================== */

    function dpStatusHTML(
      status
    ) {

      if (
        status === "paid"
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


    /* ========================================
       STATUS PELUNASAN
       ======================================== */

    function paymentStatusHTML(
      status
    ) {

      if (
        status === "paid"
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


    /* ========================================
       TRACKING
       ======================================== */

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
          ${status}
        </span>

      `;

    }


    /* ========================================
       TANGGAL
       ======================================== */

    function formatDate(
      value
    ) {

      if (!value) {

        return "—";

      }


      const date =
        new Date(
          value
        );


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


    /* ========================================
       BUAT TAMPILAN SETIAP BATCH
       ======================================== */

    const batchHTML =
      Object.entries(
        grouped
      )
      .map(
        function(
          [
            batchCode,
            items
          ]
        ) {

          const firstItem =
            items[0];


          return `

            <div
              class="recap-batch-card"
            >

              <!-- ==========================
                   HEADER BATCH
                   ========================== -->

              <div
                class="recap-batch-header"
              >

                <div>

                  <div
                    class="recap-batch-code"
                  >
                    ${batchCode}
                  </div>


                  <div
                    class="recap-batch-name"
                  >
                    ${
                      firstItem.item_name ||
                      "—"
                    }
                  </div>

                </div>


                <div
                  class="recap-batch-count"
                >
                  ${items.length}
                  data
                </div>

              </div>


              <!-- ==========================
                   TABEL BATCH
                   ========================== -->

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

                    ${items.map(
                      function(item) {

                        const version =
                          item.version ||
                          "AVAILABLE";


                        const customer =
                          item.customer_name ||
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


                        const dpStatus =
                          dpStatusHTML(
                            item.dp_status
                          );


                        const paymentStatus =
                          paymentStatusHTML(
                            item.payment_status
                          );


                        const tracking =
                          trackingHTML(
                            item.tracking_status
                          );


                        const deadline =
                          formatDate(
                            item.co_deadline
                          );


                        return `

                          <tr>

                            <td>
                              ${versionHTML}
                            </td>


                            <td>
                              ${customerHTML}
                            </td>


                            <td>
                              ${item.quantity || 1}
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
                              ${dpStatus}
                            </td>


                            <td>
                              ${formatRupiah(
                                item.remaining_amount
                              )}
                            </td>


                            <td>
                              ${paymentStatus}
                            </td>


                            <td>
                              ${tracking}
                            </td>


                            <td>
                              ${
                                item.note ||
                                "—"
                              }
                            </td>


                            <td>
                              ${deadline}
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


    /* ========================================
       TAMPILKAN KE HALAMAN
       ======================================== */

    container.innerHTML = `

      <div
        class="recap-list"
      >

        <div
          class="recap-list-header"
        >

          <div>

            <h2>
              ${category}
            </h2>

            <p>
              ${data.length}
              data pembelian dari
              ${Object.keys(grouped).length}
              kode batch
            </p>

          </div>

        </div>


        ${batchHTML}

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

async function loadOrders() {

  pageTitle.textContent =
    "Pesanan";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Pesanan
          </h2>

          <p>
            Daftar pesanan customer
            Dear Nadiya.
          </p>

        </div>

      </div>


      <div
        id="ordersContainer"
      >

        <p>
          Memuat pesanan...
        </p>

      </div>

    </div>

  `;


  const container =
    document.getElementById(
      "ordersContainer"
    );


  if (!container) {
    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("orders")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD ORDERS:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat pesanan
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
          Belum ada pesanan
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
              Produk
            </th>

            <th>
              Qty
            </th>

            <th>
              Total
            </th>

            <th>
              Status
            </th>

            <th>
              Tanggal
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(order) {

              return `

                <tr>

                  <td>
                    ${
                      order.id ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.customer_name ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.product_name ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.quantity ||
                      1
                    }
                  </td>

                  <td>
                    Rp${Number(
                      order.total_amount ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    ${
                      order.status ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )
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

}


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
            Kelola pembayaran customer.
          </p>

        </div>

      </div>


      <div
        id="paymentsContainer"
      >

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
      .from("payments")
      .select("*")
      .order(
        "id",
        {
          ascending: false
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
              Jumlah
            </th>

            <th>
              Metode
            </th>

            <th>
              Status
            </th>

            <th>
              Tanggal
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(payment) {

              return `

                <tr>

                  <td>
                    ${
                      payment.id ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.customer_name ||
                      "—"
                    }
                  </td>

                  <td>
                    Rp${Number(
                      payment.amount ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    ${
                      payment.method ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.status ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )
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
            Kelola rekapan pembelian berdasarkan
            kategori dan kode batch.
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
          Pilih kategori untuk melihat rekap.
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


  /* ========================================
     PILIH KATEGORI
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


          loadRecapList(
            selectedCategory
          );

        }
      );

    }
  );


  /* ========================================
     TAMBAH REKAP
     ======================================== */

  document
    .getElementById(
      "addRecapButton"
    )
    .addEventListener(
      "click",
      function() {

        showRecapBatchForm(
          selectedCategory
        );

      }
    );


  /* ========================================
     LOAD KATEGORI AWAL
     ======================================== */

  loadRecapList(
    selectedCategory
  );

}


/* ============================================
   PILIHAN TRACKING
   ============================================ */

function getTrackingOptions(
  category
) {

  /* ----------------------------------------
     TREASURE INA
     ---------------------------------------- */

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


  /* ----------------------------------------
     TRUZ
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE KR
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE JP
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE CH
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE THAI
     ---------------------------------------- */

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


  /* ----------------------------------------
     TREASURE ALBUM
     ---------------------------------------- */

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


  /* ----------------------------------------
     DEFAULT
     ---------------------------------------- */

  return [

    "Co Web / Seller",

    "Shipping INA",

    "Arrived WH INA",

    "Arrived Admin",

    "Goods Arrive at Customer"

  ];

}


/* ============================================
   FORM TAMBAH REKAP BATCH
   ============================================ */

function showRecapBatchForm(
  category
) {

  const container =
    document.getElementById(
      "recapFormContainer"
    );


  container.innerHTML = `

    <div class="panel recap-form">

      <h3>
        Tambah Rekap Pembelian
      </h3>


      <form id="recapBatchForm">


        <!-- ==================================
             KATEGORI
             ================================== -->

        <label>
          Kategori
        </label>

        <select
          id="batchCategory"
          required
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


        <!-- ==================================
             KODE BATCH
             ================================== -->

        <label>
          Kode Batch
        </label>

        <input
          id="batchCode"
          type="text"
          placeholder="Contoh: CH-169"
          required
        >


        <!-- ==================================
             NAMA BARANG
             ================================== -->

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
          Tambahkan versi, member, atau
          character sesuai kebutuhan batch.
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


  /* ========================================
     TAMBAH BARIS VERSI / MEMBER
     ======================================== */

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


    item.dataset.item =
      itemNumber;


    item.innerHTML = `

      <div
        class="batch-item-header"
      >

        <h4>
          Versi / Member ${itemNumber}
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


      <hr>

    `;


    itemsContainer.appendChild(
      item
    );


    /* ======================================
       HAPUS BARIS
       ====================================== */

    item
      .querySelector(
        ".remove-batch-item"
      )
      .addEventListener(
        "click",
        function() {

          item.remove();

        }
      );

  }


  /* ========================================
     BARIS PERTAMA
     ======================================== */

  addBatchItem();


  /* ========================================
     TAMBAH BARIS
     ======================================== */

  document
    .getElementById(
      "addBatchItemButton"
    )
    .addEventListener(
      "click",
      addBatchItem
    );


  /* ========================================
     PERUBAHAN KATEGORI
     ======================================== */

  document
    .getElementById(
      "batchCategory"
    )
    .addEventListener(
      "change",
      function() {

        const options =
          getTrackingOptions(
            this.value
          );


        document
          .querySelectorAll(
            ".batch-tracking"
          )
          .forEach(
            function(select) {

              select.innerHTML =
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

      }
    );


  /* ========================================
     BATAL
     ======================================== */

  document
    .getElementById(
      "cancelBatchButton"
    )
    .addEventListener(
      "click",
      function() {

        container.innerHTML =
          "";

      }
    );


  /* ========================================
     SUBMIT
     ======================================== */

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
   SIMPAN BATCH KE SUPABASE
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
    function(item) {

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


  console.log(
    "DATA BATCH:",
    records
  );


  const {
    data,
    error
  } =
    await supabaseClient
      .from("purchase_recap")
      .insert(
        records
      )
      .select();


  console.log(
    "HASIL INSERT:",
    data
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
    700
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


  container.innerHTML = `

    <div class="panel">

      <p>
        Memuat rekap...
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
        .select("*")
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

      throw error;

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
            Belum terdapat data pada kategori
            ${category}.
          </p>

        </div>

      `;

      return;

    }


    /* ========================================
       GROUPING BERDASARKAN KODE BATCH
       ======================================== */

    const grouped = {};


    data.forEach(
      function(item) {

        const batchCode =
          item.batch_code ||
          "Tanpa Kode Batch";


        if (
          !grouped[batchCode]
        ) {

          grouped[batchCode] = [];

        }


        grouped[batchCode].push(
          item
        );

      }
    );


    /* ========================================
       FORMAT RUPIAH
       ======================================== */

    function formatRupiah(
      value
    ) {

      return (
        "Rp" +
        Number(
          value || 0
        ).toLocaleString(
          "id-ID"
        )
      );

    }


    /* ========================================
       STATUS DP
       ======================================== */

    function dpStatusHTML(
      status
    ) {

      if (
        status === "paid"
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


    /* ========================================
       STATUS PELUNASAN
       ======================================== */

    function paymentStatusHTML(
      status
    ) {

      if (
        status === "paid"
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


    /* ========================================
       TRACKING
       ======================================== */

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
          ${status}
        </span>

      `;

    }


    /* ========================================
       TANGGAL
       ======================================== */

    function formatDate(
      value
    ) {

      if (!value) {

        return "—";

      }


      const date =
        new Date(
          value
        );


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


    /* ========================================
       BUAT TAMPILAN SETIAP BATCH
       ======================================== */

    const batchHTML =
      Object.entries(
        grouped
      )
      .map(
        function(
          [
            batchCode,
            items
          ]
        ) {

          const firstItem =
            items[0];


          return `

            <div
              class="recap-batch-card"
            >

              <!-- ==========================
                   HEADER BATCH
                   ========================== -->

              <div
                class="recap-batch-header"
              >

                <div>

                  <div
                    class="recap-batch-code"
                  >
                    ${batchCode}
                  </div>


                  <div
                    class="recap-batch-name"
                  >
                    ${
                      firstItem.item_name ||
                      "—"
                    }
                  </div>

                </div>


                <div
                  class="recap-batch-count"
                >
                  ${items.length}
                  data
                </div>

              </div>


              <!-- ==========================
                   TABEL BATCH
                   ========================== -->

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

                    ${items.map(
                      function(item) {

                        const version =
                          item.version ||
                          "AVAILABLE";


                        const customer =
                          item.customer_name ||
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


                        const dpStatus =
                          dpStatusHTML(
                            item.dp_status
                          );


                        const paymentStatus =
                          paymentStatusHTML(
                            item.payment_status
                          );


                        const tracking =
                          trackingHTML(
                            item.tracking_status
                          );


                        const deadline =
                          formatDate(
                            item.co_deadline
                          );


                        return `

                          <tr>

                            <td>
                              ${versionHTML}
                            </td>


                            <td>
                              ${customerHTML}
                            </td>


                            <td>
                              ${item.quantity || 1}
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
                              ${dpStatus}
                            </td>


                            <td>
                              ${formatRupiah(
                                item.remaining_amount
                              )}
                            </td>


                            <td>
                              ${paymentStatus}
                            </td>


                            <td>
                              ${tracking}
                            </td>


                            <td>
                              ${
                                item.note ||
                                "—"
                              }
                            </td>


                            <td>
                              ${deadline}
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


    /* ========================================
       TAMPILKAN KE HALAMAN
       ======================================== */

    container.innerHTML = `

      <div
        class="recap-list"
      >

        <div
          class="recap-list-header"
        >

          <div>

            <h2>
              ${category}
            </h2>

            <p>
              ${data.length}
              data pembelian dari
              ${Object.keys(grouped).length}
              kode batch
            </p>

          </div>

        </div>


        ${batchHTML}

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

async function loadOrders() {

  pageTitle.textContent =
    "Pesanan";


  pageContent.innerHTML = `

    <div class="panel">

      <div class="panel-header">

        <div>

          <h2>
            Pesanan
          </h2>

          <p>
            Daftar pesanan customer
            Dear Nadiya.
          </p>

        </div>

      </div>


      <div
        id="ordersContainer"
      >

        <p>
          Memuat pesanan...
        </p>

      </div>

    </div>

  `;


  const container =
    document.getElementById(
      "ordersContainer"
    );


  if (!container) {
    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("orders")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "ERROR LOAD ORDERS:",
      error
    );


    container.innerHTML = `

      <div class="panel">

        <h3>
          Gagal memuat pesanan
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
          Belum ada pesanan
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
              Produk
            </th>

            <th>
              Qty
            </th>

            <th>
              Total
            </th>

            <th>
              Status
            </th>

            <th>
              Tanggal
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(order) {

              return `

                <tr>

                  <td>
                    ${
                      order.id ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.customer_name ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.product_name ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.quantity ||
                      1
                    }
                  </td>

                  <td>
                    Rp${Number(
                      order.total_amount ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    ${
                      order.status ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )
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

}


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
            Kelola pembayaran customer.
          </p>

        </div>

      </div>


      <div
        id="paymentsContainer"
      >

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
      .from("payments")
      .select("*")
      .order(
        "id",
        {
          ascending: false
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
              Jumlah
            </th>

            <th>
              Metode
            </th>

            <th>
              Status
            </th>

            <th>
              Tanggal
            </th>

          </tr>

        </thead>


        <tbody>

          ${data.map(
            function(payment) {

              return `

                <tr>

                  <td>
                    ${
                      payment.id ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.customer_name ||
                      "—"
                    }
                  </td>

                  <td>
                    Rp${Number(
                      payment.amount ||
                      0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    ${
                      payment.method ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.status ||
                      "—"
                    }
                  </td>

                  <td>
                    ${
                      payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )
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

}

/* ============================================
   REFRESH
   ============================================ */

if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    async function () {

      const activeButton =
        document.querySelector(
          ".menu-button.active"
        );


      const currentPage =
        activeButton?.dataset?.page;


      if (
        currentPage ===
        "dashboard"
      ) {

        loadDashboard();

      }


      else if (
        currentPage ===
        "products"
      ) {

        loadProducts();

      }


      else if (
        currentPage ===
        "orders"
      ) {

        loadOrders();

      }


      else if (
        currentPage ===
        "payments"
      ) {

        loadPayments();

      }


      else if (
        currentPage ===
        "recap"
      ) {

        loadRecap();

      }

    }
  );

}


/* ============================================
   MULAI APLIKASI
   ============================================ */

checkGoogleSession();
