'use strict'

var gCurrLang = 'en'

var gTrans = {
    title: {
        en: 'Book inventory',
        he: 'ספרים - ניהול מלאי'
    },
    'modal-rate': {
        en: 'rate',
        he: 'דירוג'
    },
    'modal-bookDesc': {
        en: 'Book Description',
        he: 'תיאור הספר'
    },
    'modal-close': {
        en: 'Close',
        he: 'סגור'
    },
    'table-id': {
        en: 'Id',
        he: 'מזהה'
    },
    'table-title': {
        en: 'Title',
        he: 'כותרת'
    },
    'table-img': {
        en: 'Image',
        he: 'תמונה'
    },
    'table-price': {
        en: 'Price&#x25BC',
        he: '&#x25BCמחיר'
    },
    'table-rate': {
        en: 'Rate&#x25BC',
        he: `&#x25BCדירוג`
    },
    'table-actions': {
        en: 'Actions',
        he: 'פעולות'
    },
    'table-btn-read': {
        en: 'Read',
        he: 'לקרוא'
    },
    'table-btn-update': {
        en: 'Update',
        he: 'עדכן'
    },
    'table-btn-delete': {
        en: 'Delete',
        he: 'מחק'
    },
    'add-btn': {
        en: 'Add book',
        he: 'הוסף ספר'
    },
    'pagenumber': {
        en: `Page ${getPageNumber()}`,
        he: `${getPageNumber()} עמוד`
    },
    search: {
        en: 'Search book...',
        he: '...חפש ספר'
    }
}

function setLang(lang) {
    gCurrLang = lang
}

function getLang() {
    return gCurrLang
}

function getTrans(transKey) {
    const key = gTrans[transKey]
    if (!key) return 'UNKNOWN'

    var translation = key[gCurrLang]
    if (!translation) translation = key.en
    return translation
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)
        if (transKey === 'table-rate' || transKey === 'table-price') el.innerHTML = translation
        else el.innerText = translation

        if (el.placeholder) el.placeholder = translation
    })
}