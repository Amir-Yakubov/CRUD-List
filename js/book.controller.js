'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    addLangBtnEvent()
}

function renderBooks() {
    const books = getBooks()
    var elPageNum = document.querySelector('.page-number')
    elPageNum.innerText = `Page ${getPageNumber()}`

    var elSearchInput = document.querySelector('.search-Input')
    elSearchInput.placeholder = (!gFilterBy.bookName) ? 'Search' : gFilterBy.bookName

    var strHtmls = books.map(book => {
        const { id, bookName, bookPrice, rate } = book
        return `<tr>
            <td>${id}</td>
            <td class="title-cell">${bookName}</td>
            <td><img classs="book-img" onerror="this.src='IMG/Rand.jpg'" src="IMG/${bookName}.jpg"></td>
            <td>$${bookPrice}</td>
            <td>${rate}</td>
            <td><button class="button-84" role="button" data-trans="table-btn-read" onclick="onReadBook('${id}')">Read</button>
            <button class="button-84" role="button" data-trans="table-btn-update" onclick="onUpdateBook('${id}')">Update</button>
            <button class="button-84" role="button" data-trans="table-btn-delete" onclick="onDeleteBook('${id}')">Delete</button></td>
        </tr>`
    }
    )
    var strHtml = strHtmls.join('')
    strHtml += `</tbody></table>`
    document.querySelector('.table-body').innerHTML = strHtml
    doTrans()
}

function onUpdateBook(bookId) {
    var bookPrice = +prompt('book price?')
    updateBook(bookId, bookPrice)
    renderBooks()
    flashMsg(`Book ${bookId} price updated to ${bookPrice}`)
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    flashMsg(`Book ${bookId} Deleted`)
}

function onAddBook() {
    var bookName = prompt('book name?')
    var bookPrice = prompt('book price?')
    if (bookName) {
        const book = addBook(bookName, bookPrice)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')

    elModal.querySelector('.rate-box').innerHTML = `
    <span data-trans="modal-rate">rate</span>
    <button class="rate-btn plus" onclick="onRateClick('${bookId}', 'plus')">+</button>
    <a class="curr-rating">${book.rate}</a>
    <button class="rate-btn minus" onclick="onRateClick('${bookId}', 'minus')">-</button>`

    elModal.querySelector('h3').innerText = book.bookName
    elModal.querySelector('h4 span').innerText = '$' + book.bookPrice
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSetSortBy(sortName) {
    const prop = sortName
    const sortBy = {}

    sortBy[prop] = (gSortIsOn) ? -1 : 1
    setBookSort(sortBy)
    renderBooks()
}

function onNextPage() {
    nextPage()
    renderBooks()
    renderPageNumber()
}

function onPrevPage() {
    prevPage()
    renderBooks()
    renderPageNumber()
}

function onRateClick(bookId, action) {
    var book = getBookById(bookId)
    var currRate = updateBookRating(book, action)
    document.querySelector('.curr-rating').innerText = currRate
    renderBooks()
    flashMsg(`item ${book.id} rating updated`)
}

function onKeyUpSearch() {
    setTimeout(() => {
        const searchStr = document.querySelector('.search-Input').value
        const filterBy = setBooksFilter(searchStr)
        const lang = getLang()

        setQueryStringParams(filterBy, lang)
        renderBooks()
        document.querySelector('.search-Input').value = searchStr
    }, 1500);
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = { bookName: queryStringParams.get('bookName') || '' }
    const langBy = { appLang: queryStringParams.get('lang') || '' }

    onSetLang(langBy.appLang)
    if (!filterBy.bookName) return
    setBooksFilter(filterBy.bookName)
}

function setQueryStringParams(filterBy = '', lang = 'en') {
    const queryStringParams = `?bookName=${filterBy.bookName}&lang=${lang}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetLang(lang) {
    var elStatusBar = document.querySelector('.status-bar')

    setLang(lang)
    if (lang === 'he') {
        document.body.classList.add('rtl')
        elStatusBar.classList.add('rtl')
    } else {
        document.body.classList.remove('rtl')
        elStatusBar.classList.remove('rtl')
    }
    doTrans()
}

function addLangBtnEvent() {
    var elEnglishBtn = document.querySelector('.en')
    elEnglishBtn.addEventListener('click', addEventEn)

    var elEnglishBtn = document.querySelector('.he')
    elEnglishBtn.addEventListener('click', addEventHe)
}

function addEventEn(event) {
    var lang = 'en'
    onSetLang(lang)
    event.preventDefault()
    const filterBy = getFilterBy()
    setQueryStringParams(filterBy, lang)
}

function addEventHe(event) {
    var lang = 'he'
    event.preventDefault()
    onSetLang(lang)
    const filterBy = getFilterBy()
    setQueryStringParams(filterBy, lang)
}

function renderPageNumber() {
    var elPageNum = document.querySelector('.page-number')
    elPageNum.innerText = `Page ${getPageNumber()}`
}