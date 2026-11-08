/* Dubai Off Plan Homes: Download Brochure block, shared by the project pages.
   Adds one "Download Brochure" button under the stats bar and a pop-up form
   (first name, email, optional WhatsApp number with country code).
   The brochure is only offered for download when a PDF is listed in BROCHURES below,
   e.g.  'page-file-name.html': 'brochure-file-name.pdf'.  Until then the visitor is told
   the brochure will be emailed, and nothing pretends a download exists. */
(function () {
  var FORM_URL = 'https://formspree.io/f/xnjrobnq';
  var BROCHURES = {
    // 'mira-coral-bay-al-mairid-ras-al-khaimah.html': 'mira-coral-bay-brochure.pdf'
  };
  var CODES = [['+971','UAE'],['+44','UK'],['+1','USA / Canada'],['+353','Ireland'],['+61','Australia'],['+27','South Africa'],['+91','India'],['+92','Pakistan'],['+966','Saudi Arabia'],['+974','Qatar'],['+965','Kuwait'],['+973','Bahrain'],['+968','Oman'],['+20','Egypt'],['+90','Turkey'],['+7','Russia / Kazakhstan'],['+49','Germany'],['+33','France'],['+34','Spain'],['+39','Italy'],['+31','Netherlands'],['+41','Switzerland'],['+46','Sweden'],['+86','China'],['+65','Singapore'],['+234','Nigeria'],['+254','Kenya']];

  var css = '' +
    '.dop-actions{background:#111;border:1px solid rgba(201,168,76,.25);border-radius:12px;max-width:900px;margin:28px auto;padding:14px}' +
    '.dop-actions button{width:100%;padding:20px 16px;border-radius:6px;font-family:"Montserrat",sans-serif;font-size:.95rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;background:#c9a84c;color:#111;border:1px solid #c9a84c;transition:background .2s}' +
    '.dop-actions button:hover{background:#e8c97a}' +
    '.dop-overlay{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.82);align-items:center;justify-content:center;padding:20px;overflow-y:auto}' +
    '.dop-overlay.open{display:flex}' +
    '.dop-modal{background:#1a1a1a;border:1px solid rgba(201,168,76,.3);width:100%;max-width:440px;padding:36px 32px;position:relative;font-family:"Montserrat",sans-serif;color:#f5f2ec;margin:auto}' +
    '.dop-close{position:absolute;top:8px;right:14px;background:none;border:none;color:#c9a84c;font-size:1.9rem;cursor:pointer;line-height:1;padding:6px}' +
    '.dop-title{font-family:"Cormorant Garamond",serif;font-size:1.6rem;font-weight:400;margin:0 0 6px;color:#f5f2ec}' +
    '.dop-sub{font-size:.74rem;color:#888;margin:0 0 22px;line-height:1.6}' +
    '.dop-modal label{display:block;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#888;margin:0 0 6px}' +
    '.dop-modal input,.dop-modal select{width:100%;background:#111;border:1px solid rgba(201,168,76,.25);color:#f5f2ec;padding:13px 14px;font-size:16px;font-family:"Montserrat",sans-serif;font-weight:300;outline:none;margin-bottom:14px;border-radius:0;-webkit-appearance:none;appearance:none}' +
    '.dop-modal input:focus,.dop-modal select:focus{border-color:#c9a84c}' +
    '.dop-phone{display:grid;grid-template-columns:112px 1fr;gap:8px}' +
    '.dop-hp{position:absolute!important;left:-9999px;width:1px;height:1px;opacity:0}' +
    '.dop-submit{width:100%;background:#c9a84c;color:#111;border:none;padding:15px;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;cursor:pointer;font-family:"Montserrat",sans-serif}' +
    '.dop-submit:hover{background:#e8c97a}.dop-submit:disabled{opacity:.6;cursor:default}' +
    '.dop-note{font-size:.62rem;color:#888;text-align:center;margin-top:10px}' +
    '.dop-error{color:#e08a7a;font-size:.74rem;margin:-4px 0 12px;display:none;line-height:1.5}' +
    '.dop-thanks{text-align:center;padding:10px 0}' +
    '.dop-thanks p{font-size:.84rem;line-height:1.8;color:rgba(245,242,236,.8);margin-top:8px}' +
    '.dop-thanks a{display:inline-block;margin-top:16px;background:#c9a84c;color:#111;padding:13px 28px;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;text-decoration:none}' +
    '@media(max-width:600px){.dop-actions{margin:20px 16px}.dop-modal{padding:30px 20px}}';

  function track(name, params) {
    try { if (typeof gtag === 'function') { var p = { project: project }; for (var k in params) p[k] = params[k]; gtag('event', name, p); } } catch (e) {}
  }
  var project = document.title;

  function init() {
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var h1 = document.querySelector('h1');
    if (h1) {
      var c = h1.cloneNode(true);
      Array.prototype.forEach.call(c.querySelectorAll('em,br,span,small'), function (n) { n.parentNode.removeChild(n); });
      project = c.textContent.replace(/\s+/g, ' ').trim() || project;
    }
    var page = location.pathname.split('/').pop() || '';

    var actions = document.createElement('div');
    actions.className = 'dop-actions';
    actions.innerHTML = '<button type="button">Download Brochure</button>';
    var anchor = document.querySelector('.stats-bar');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(actions, anchor.nextSibling);
    else { var hero = document.querySelector('.hero') || document.body.firstElementChild; hero.parentNode.insertBefore(actions, hero.nextSibling); }

    var options = CODES.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === '+971' ? ' selected' : '') + '>' + c[0] + ' ' + c[1] + '</option>'; }).join('');
    var overlay = document.createElement('div');
    overlay.className = 'dop-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="dop-modal" role="dialog" aria-modal="true">' +
        '<button type="button" class="dop-close" aria-label="Close">&times;</button>' +
        '<div class="dop-formwrap">' +
          '<div class="dop-title"></div>' +
          '<p class="dop-sub">Enter your details to receive the brochure.</p>' +
          '<label for="dopFirst">First Name</label><input type="text" id="dopFirst" autocomplete="given-name">' +
          '<label for="dopEmail">Email Address</label><input type="email" id="dopEmail" autocomplete="email" inputmode="email">' +
          '<label for="dopPhone">WhatsApp Number (optional)</label>' +
          '<div class="dop-phone"><select id="dopCode" aria-label="Country code">' + options + '</select><input type="tel" id="dopPhone" autocomplete="tel-national" inputmode="tel"></div>' +
          '<input type="text" id="dopHp" class="dop-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="dop-error" id="dopError" role="alert"></div>' +
          '<button type="button" class="dop-submit">Get The Brochure</button>' +
          '<div class="dop-note">100% free service. Your details will never be shared.</div>' +
        '</div>' +
        '<div class="dop-thanks" style="display:none"><div class="dop-title">Thank You</div><p class="dop-thanks-text"></p></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var formwrap = overlay.querySelector('.dop-formwrap'), thanks = overlay.querySelector('.dop-thanks'), thanksText = overlay.querySelector('.dop-thanks-text');
    var submit = overlay.querySelector('.dop-submit'), err = overlay.querySelector('#dopError'), lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      overlay.querySelector('.dop-formwrap .dop-title').textContent = 'Download the ' + project + ' Brochure';
      formwrap.style.display = 'block'; thanks.style.display = 'none'; err.style.display = 'none';
      submit.disabled = false; submit.textContent = 'Get The Brochure';
      overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
      setTimeout(function () { overlay.querySelector('#dopFirst').focus(); }, 50);
    }
    function close() { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    actions.querySelector('button').addEventListener('click', open);
    overlay.querySelector('.dop-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

    submit.addEventListener('click', function () {
      if (overlay.querySelector('#dopHp').value) return;
      var first = overlay.querySelector('#dopFirst').value.trim();
      var email = overlay.querySelector('#dopEmail').value.trim();
      var raw = overlay.querySelector('#dopPhone').value.trim();
      var num = raw.replace(/[^\d]/g, '').replace(/^0+/, '');
      var code = overlay.querySelector('#dopCode').value;
      if (!first || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Please enter your first name and a valid email address.'; err.style.display = 'block'; return; }
      if (raw && num.length < 6) { err.textContent = 'Please check your WhatsApp number, or leave it blank.'; err.style.display = 'block'; return; }
      err.style.display = 'none'; submit.disabled = true; submit.textContent = 'Sending...';
      fetch(FORM_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: first, email: email, phone: num ? code + ' ' + num : '', project: project, request: 'Brochure request', form: 'brochure', page: location.href, _subject: 'Brochure request: ' + project })
      }).then(function (r) { return r.ok; }).catch(function () { return false; }).then(function (ok) {
        if (!ok) { submit.disabled = false; submit.textContent = 'Get The Brochure'; err.textContent = 'Sorry, that did not send. Please check your connection and try again.'; err.style.display = 'block'; return; }
        track('generate_lead', { form_name: 'brochure' });
        track('brochure_request', { form_name: 'brochure' });
        formwrap.style.display = 'none'; thanks.style.display = 'block';
        var old = thanks.querySelector('a'); if (old) old.remove();
        if (BROCHURES[page]) {
          thanksText.textContent = 'Thank you, ' + first + '. Your brochure is ready.';
          var a = document.createElement('a'); a.href = BROCHURES[page]; a.setAttribute('download', ''); a.textContent = 'Download Brochure';
          a.addEventListener('click', function () { track('brochure_download', { method: 'brochure_form' }); });
          thanks.appendChild(a); a.click();
        } else {
          thanksText.textContent = 'Thank you, ' + first + '. We have your details and will email you the ' + project + ' brochure.';
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
