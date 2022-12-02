'use struct'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    // var books = gBooks

    var tableStartHtmlStr = `
    <section class="status-bar">
     <button class="new-book-btn" onclick="onAddBook()">Add book</button>
     <input class="search-Input" type="text" onkeyup="onKeyUpSearch()" placeholder="Search book..">
     <button class="page-btn" onclick="onPrevPage()">&#60</button><span class="page-number" >Page ${getPageNumber()}</span><button class="page-btn" onclick="onNextPage()">&#62</button>
    </section>  

    <table class="data-table">
    <tbody>
        <tr class="first-row">
         <td>Id</td>
         <td class="title-cell">Title</td>
         <td>Image</td>
         <td class="sorting-cell bookprice" onclick="onSetSortBy('bookPrice')">Price<span>&#x25BC<span></td>
         <td class="sorting-cell rate" onclick="onSetSortBy('rate')">Rate<span>&#x25BC<span></td>
         <td class="long-row">Actions</td>
        </tr>`

    var strHtmls = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td class="title-cell">${book.bookName}</td>
            <td><img classs="book-img" onerror="this.src='IMG/Rand.jpg'" src="IMG/${book.bookName}.jpg"></td>
            <td>$${book.bookPrice}</td>
            <td>${book.rate}</td>
            <td><button class="button-84" role="button" onclick="onReadBook('${book.id}')">Read</button>
            <button class="button-84" role="button" onclick="onUpdateBook('${book.id}')">Update</button>
            <button class="button-84" role="button" onclick="onDeleteBook('${book.id}')">Delete</button></td>
        </tr>`
    )

    var tableEndHtmlStr = `</tbody></table>`

    var hendleStr = strHtmls.join('')
    var totalStr = `${tableStartHtmlStr}${hendleStr}${tableEndHtmlStr}`
    document.querySelector('.books-container').innerHTML = totalStr
}

function onReadBook() {

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
    <span>rate</span>
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

function onSetFilterBy() {

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
    renderPageCouner()
}

function onPrevPage() {
    prevPage()
    renderBooks()
    renderPageCouner()
}

function onRateClick(bookId, action) {
    var book = getBookById(bookId)
    var currRate = updateBookRating(book, action)
    document.querySelector('.curr-rating').innerText = currRate
    renderBooks()
    flashMsg(`item ${book.id} rating updated`)
}

function onKeyUpSearch() {
    const searchStr = document.querySelector('.search-Input').value
    filterBy = setBooksFilter(searchStr)
    renderBooks()

    const queryStringParams = `?bookName=${filterBy.bookName}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = { bookName: queryStringParams.get('bookName') || '' }
    if (!filterBy.bookName) return

    document.querySelector('.search-Input').value = filterBy.bookName
    setBooksFilter(filterBy.bookName)
}