// Enter your template code here.
const log = require('logToConsole');
const copyFromWindow = require('copyFromWindow');
const copyFromDataLayer = require('copyFromDataLayer');
const JSON = require('JSON');
const getCookieValues = require('getCookievalues');

const location = copyFromWindow('location');
const gtag = copyFromWindow('gtag');
const datalayer = copyFromWindow('datalayer');
const document = copyFromWindow('document');


    const gaid = data.trackingid;
    const category = data.category;


    let split_parse = function (s, sep, delim) {
      let separator = sep || '&';
      let delimiter = delim || '=';
      return s.split(separator).reduce(function (agg, t) {
        if (t && 0 < t.length) {
          let ts = t.split(delimiter);
          let k = ts && 0 < ts.length ? ts[0].toString() : null;
          let v = ts && 1 < ts.length ? ts[1] : undefined;
          //try { v = JSON.parse(v) } catch (ex) { }
          agg[k] = v;
        }
        return agg;
      }, {});
    };

    let __searches = split_parse(location.search, /[\?&]/);
    let __cookies = split_parse(getCookieValues, /;\s*/);


    var gpath = ((suffix) => {
      let utm_keys = ['campaign', 'source', 'medium', 'content', 'term'];
      let utms;
      let assign_utms = function (campaign, source, medium, content, term) {
        if (!utms) utms = {};
        // required
        utms.campaign = utms.campaign || campaign;
        utms.source = source;
        utms.medium = medium;
        // optional
        if (content) utms.content = content;
        if (term) utms.term = term;
        return utms;
      };
      // url에 utm 있을 시
      if (__searches.utm_campaign) {
        utms = utm_keys.reduce(function (gg, uk) {
          if (__searches['utm_' + uk]) gg[uk] = __searches['utm_' + uk];
          return gg;
        }, {});
      }
       // url에 cid 있을 시
       else if (__searches.cid && typeof (__searches.cid) == 'string') {
         let ctoks = __searches.cid.split('_');
         if (9 <= ctoks.length) {
           assign_utms(ctoks[4] || category, ctoks[3], ctoks[6], ctoks[8], 10 <= ctoks.length ? ctoks[9] : null);
         }
       }
      var the_path = '/' + category + '/' + (suffix || '') + (!suffix && utms ? '?' + utm_keys.filter((k) => utms[k]).map((k) => 'utm_' + k + '=' + utms[k]).join('&') : '');
      return the_path;
    });

    var pv = ((suffix) => {
      var path = gpath(suffix);
      gtag('event', 'page_view', {
        page_location: 'https://' + location.hostname + path,
        page_path: path,
        send_to: gaid,
      });
    });
    // default pageview here
    pv();  //CTX 에서 세팅한 PV로 확인 이탈률 영향때문에 제외

    
    var eventCode;
    //fnCallPop2 에서 click 시 eventCode 가져오기
    document.querySelectorAll('[onclick*="fnCallPop2"]').forEach((btn) => {
      btn.addEventListener('click', function (ev) {
        var btn_event_code_match = /fnCallPop2\s*\(\s*(?<evcode>\d+)\s*\)/.exec(ev.target.getAttribute('onclick'));
        if (btn_event_code_match) {
          eventCode = btn_event_code_match.groups.evcode;
        }
      });
    });
  


data.gtmOnSuccess();