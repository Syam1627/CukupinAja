/* ===== CukupinAja – Transaksi & Anggaran ===== */
(() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const LS_TRX = 'cukupin_transaksi';
  const LS_ANG = 'cukupin_anggaran';

  function loadJSON(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    }
    catch { return []; }
  }
  function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function rupiah(n) {
    n = Number(n) || 0;
    const abs = Math.abs(n);
    const str = abs.toLocaleString('id-ID');
    return (n < 0 ? '-' : '') + 'Rp ' + str;
  }

  // Tanggal lokal (bukan UTC) supaya tidak bergeser sehari di zona waktu +7
  function toLocalISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Parsing "YYYY-MM-DD" sebagai tanggal lokal
  function parseISO(iso) {
    if (!iso) return null;
    const parts = iso.split('-').map(Number);
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(iso);
  }

  function fmtDate(iso) {
    const d = parseISO(iso);
    if (!d || isNaN(d)) return '-';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ============================
     TRANSAKSI
     ============================ */
  let transactions = loadJSON(LS_TRX);

  const elTotalIn   = $('#totalPemasukan');
  const elTotalOut  = $('#totalPengeluaran');
  const elSaldo     = $('#saldoSaatIni');
  const elTrxBody   = $('#trxBody');
  const elTrxEmpty  = $('#trxEmpty');
  const formTrx     = $('#formTransaksi');
  const elSearch    = $('#trx-search');
  const elFilterJ   = $('#trx-filter-jenis');
  const elFilterD   = $('#trx-filter-date');
  const msgTrx      = $('#trx-msg');

  function showTrxMsg(text, isError) {
    if (!msgTrx) return;
    msgTrx.textContent = text;
    msgTrx.classList.toggle('is-error', !!isError);
  }

  function calcSummary() {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.jenis === 'pemasukan') inc += Number(t.nominal) || 0;
      else exp += Number(t.nominal) || 0;
    });
    if (elTotalIn) elTotalIn.textContent = rupiah(inc);
    if (elTotalOut) elTotalOut.textContent = rupiah(exp);
    if (elSaldo) elSaldo.textContent = rupiah(inc - exp);

    // Perbarui juga kartu progres anggaran (karena pemakaian per kategori bisa berubah)
    renderAnggaran();
  }

  function getFilteredTransactions() {
    const q = (elSearch ? elSearch.value : '').toLowerCase().trim();
    const jenis = elFilterJ ? elFilterJ.value : 'semua';
    const date = elFilterD ? elFilterD.value : '';

    return transactions.filter(t => {
      if (jenis !== 'semua' && t.jenis !== jenis) return false;
      if (date && t.tanggal !== date) return false;
      if (q) {
        const haystack = ((t.kategori || '') + ' ' + (t.desc || '')).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function renderTable() {
    if (!elTrxBody) return;
    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
      elTrxBody.innerHTML = '';
      if (elTrxEmpty) elTrxEmpty.style.display = '';
      return;
    }

    if (elTrxEmpty) elTrxEmpty.style.display = 'none';

    elTrxBody.innerHTML = filtered.map(t => {
      const isIn = t.jenis === 'pemasukan';
      const cls = isIn ? 'amount-in' : 'amount-out';
      const sign = isIn ? '+' : '-';
      return `<tr data-id="${t.id}">
        <td>${fmtDate(t.tanggal)}</td>
        <td>${escHtml(t.kategori || '-')}</td>
        <td>${escHtml(t.desc || '-')}</td>
        <td class="${cls}">${sign} ${rupiah(t.nominal)}</td>
        <td><button class="btn-del" data-del="${t.id}" title="Hapus" aria-label="Hapus transaksi">✕</button></td>
      </tr>`;
    }).join('');
  }

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function addTransaction(data) {
    data.id = Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    transactions.unshift(data);
    saveJSON(LS_TRX, transactions);
    calcSummary();
    renderTable();
  }

  function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveJSON(LS_TRX, transactions);
    calcSummary();
    renderTable();
  }

  // Form submit
  if (formTrx) {
    formTrx.addEventListener('submit', e => {
      e.preventDefault();
      const nom = parseInt($('#trx-nominal').value, 10) || 0;
      if (nom <= 0) {
        showTrxMsg('Nominal harus lebih dari Rp 0.', true);
        $('#trx-nominal').focus();
        return;
      }
      addTransaction({
        tanggal: $('#trx-tanggal').value,
        jenis: $('#trx-jenis').value,
        nominal: nom,
        kategori: $('#trx-kategori').value.trim(),
        desc: $('#trx-desc').value.trim()
      });
      showTrxMsg('Transaksi berhasil disimpan.');
      formTrx.reset();
      // Set default date to today (tanggal lokal)
      $('#trx-tanggal').value = toLocalISO(new Date());
    });
  }

  // Delete handler (event delegation)
  if (elTrxBody) {
    elTrxBody.addEventListener('click', e => {
      const btn = e.target.closest('[data-del]');
      if (btn) deleteTransaction(btn.dataset.del);
    });
  }

  // Filters
  [elSearch, elFilterJ, elFilterD].forEach(el => {
    if (el) el.addEventListener('input', renderTable);
  });

  /* ============================
     ANGGARAN
     ============================ */
  let budgets = loadJSON(LS_ANG);

  // Rapikan data lama: gabungkan kategori ganda (tidak case-sensitive)
  (() => {
    const seen = new Map();
    budgets.forEach(b => {
      const key = (b.kategori || '').trim().toLowerCase();
      if (!key) return;
      const prev = seen.get(key);
      if (prev) prev.batas = b.batas;
      else seen.set(key, b);
    });
    const cleaned = [...seen.values()];
    if (cleaned.length !== budgets.length) {
      budgets = cleaned;
      saveJSON(LS_ANG, budgets);
    }
  })();

  const elTotalAng  = $('#totalAnggaran');
  const elSisaAman  = $('#sisaDanaAman');
  const elAngList   = $('#anggaranList');
  const elAngEmpty  = $('#angEmpty');
  const formAng     = $('#formAnggaran');
  const msgAng      = $('#ang-msg');

  function showAngMsg(text, isError) {
    if (!msgAng) return;
    msgAng.textContent = text;
    msgAng.classList.toggle('is-error', !!isError);
  }

  function getSpentByCategory(cat) {
    const catLower = cat.toLowerCase();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return transactions
      .filter(t => {
        if (t.jenis !== 'pengeluaran') return false;
        if ((t.kategori || '').toLowerCase() !== catLower) return false;
        // Same month
        if (t.tanggal) {
          const d = parseISO(t.tanggal);
          return d && d.getMonth() === month && d.getFullYear() === year;
        }
        return false;
      })
      .reduce((sum, t) => sum + (Number(t.nominal) || 0), 0);
  }

  function updateAnggaranSummary() {
    let totalBudget = 0;
    let totalSpentInBudgetCategories = 0;

    budgets.forEach(b => {
      totalBudget += b.batas;
      totalSpentInBudgetCategories += getSpentByCategory(b.kategori);
    });

    if (elTotalAng) elTotalAng.textContent = rupiah(totalBudget);
    if (elSisaAman) elSisaAman.textContent = rupiah(Math.max(0, totalBudget - totalSpentInBudgetCategories));
  }

  function renderAnggaran() {
    if (!elAngList) return;

    // Remove existing ang-cards
    elAngList.querySelectorAll('.ang-card').forEach(el => el.remove());

    // Sinkronkan saran kategori pada form transaksi
    const datalist = $('#kategoriOptions');
    if (datalist) {
      datalist.innerHTML = '';
      budgets.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.kategori;
        datalist.appendChild(opt);
      });
    }

    if (budgets.length === 0) {
      if (elAngEmpty) elAngEmpty.style.display = '';
      updateAnggaranSummary();
      return;
    }

    if (elAngEmpty) elAngEmpty.style.display = 'none';

    budgets.forEach(b => {
      const spent = getSpentByCategory(b.kategori);
      const pct = b.batas > 0 ? Math.min((spent / b.batas) * 100, 100) : 0;
      const overBudget = spent > b.batas;
      const warn = pct >= 75 && !overBudget;

      let fillClass = '';
      let statusClass = 'ang-card__status--safe';
      let statusText = 'Aman';

      if (overBudget) {
        fillClass = 'ang-card__fill--over';
        statusClass = 'ang-card__status--over';
        statusText = 'Melebihi Batas!';
      } else if (warn) {
        fillClass = 'ang-card__fill--warn';
        statusClass = 'ang-card__status--warn';
        statusText = 'Hampir Penuh';
      }

      const card = document.createElement('div');
      card.className = 'ang-card';
      card.innerHTML = `
        <div class="ang-card__header">
          <span class="ang-card__name">${escHtml(b.kategori)}</span>
          <span class="ang-card__budget">Batas: ${rupiah(b.batas)}</span>
        </div>
        <div class="ang-card__bar">
          <div class="ang-card__fill ${fillClass}" style="width: ${pct}%"></div>
        </div>
        <div class="ang-card__footer">
          <span>Terpakai: ${rupiah(spent)} / ${rupiah(b.batas)}</span>
          <span class="ang-card__status ${statusClass}">${statusText}</span>
          <button class="btn-del" data-del-ang="${b.id}" title="Hapus" aria-label="Hapus anggaran">✕</button>
        </div>
      `;
      elAngList.appendChild(card);
    });

    updateAnggaranSummary();
  }

  function addBudget(data) {
    data.id = Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    budgets.push(data);
    saveJSON(LS_ANG, budgets);
    renderAnggaran();
  }

  function deleteBudget(id) {
    budgets = budgets.filter(b => b.id !== id);
    saveJSON(LS_ANG, budgets);
    renderAnggaran();
  }

  // Form submit
  if (formAng) {
    formAng.addEventListener('submit', e => {
      e.preventDefault();
      const batas = parseInt($('#ang-batas').value, 10) || 0;
      const kat = $('#ang-kategori').value.trim();

      if (!kat) {
        showAngMsg('Isi nama kategori terlebih dahulu.', true);
        $('#ang-kategori').focus();
        return;
      }
      if (batas <= 0) {
        showAngMsg('Batas anggaran harus lebih dari Rp 0.', true);
        $('#ang-batas').focus();
        return;
      }

      // Cegah kategori ganda (kalau ada, perbarui batasnya)
      const existing = budgets.find(b => (b.kategori || '').toLowerCase() === kat.toLowerCase());
      if (existing) {
        existing.batas = batas;
        saveJSON(LS_ANG, budgets);
        renderAnggaran();
        showAngMsg('Kategori ini sudah punya anggaran — batasnya diperbarui.');
      } else {
        addBudget({ kategori: kat, batas });
        showAngMsg('Anggaran berhasil dibuat.');
      }

      formAng.reset();
    });
  }

  // Delete handler (event delegation)
  if (elAngList) {
    elAngList.addEventListener('click', e => {
      const btn = e.target.closest('[data-del-ang]');
      if (btn) deleteBudget(btn.dataset.delAng);
    });
  }

  /* ---------- Init ---------- */
  // Set default date
  const dateInput = $('#trx-tanggal');
  if (dateInput) dateInput.value = toLocalISO(new Date());

  const footerYear = $('#footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  calcSummary();
  renderTable();
  renderAnggaran();

  /* ---------- Nav active highlight (semua section) ---------- */
  const sections = ['home', 'edukasi', 'transaksi', 'anggaran'];
  const navLinks = $$('[data-link]');

  function updateActiveNav() {
    let activeId = 'home';
    const threshold = window.innerHeight * 0.35;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= threshold) activeId = id;
    });

    navLinks.forEach(a => a.classList.toggle('active', a.dataset.link === activeId));
  }

  let navTick = false;
  function scheduleNavUpdate() {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(() => {
      navTick = false;
      updateActiveNav();
    });
  }

  window.addEventListener('scroll', scheduleNavUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavUpdate);
  window.addEventListener('hashchange', () => setTimeout(updateActiveNav, 400));
  updateActiveNav();
})();
