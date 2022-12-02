'use struct'

const STORAGE_KEY = 'booksDB'
const gBookNames = ['To kill a mockingbird', 'The great gatsby', 'Ulysses', 'The catcher in the rye', 'Pride and prejudice', 'Verity', 'Where the crawdads sing', 'The body keeps the score', 'Braiding sweetgrass', 'All about love', 'All about me', 'Faith still moves mountains', 'The choice', 'It starts with us', 'It ends with us']
const PAGE_SIZE = 5

var gBooks
var gFilterBy = { bookName: '', }
var gSortBy = {}
var gSortIsOn
var gPageIdx = 0

_createBooks()


function getPageNumber() {
    return gPageIdx + 1
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
    }
}

function _createBook(bookName, bookPrice = 0) {
    return {
        id: makeId(4),
        bookName,
        bookPrice: (!bookPrice) ? getRandomIntInclusive(50, 250) : bookPrice,
        imgUrl: `"IMG/${bookName}.jpg"`,
        desc: makeLorem(),
        rate: getRandomIntInclusive(0, 10)
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < gBookNames.length; i++) {
            var bookName = gBookNames[i]
            books.push(_createBook(bookName))
        }
    }

    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBooks() {
    var books = gBooks.filter(book => book.bookName.includes(gFilterBy.bookName))

    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.bookPrice = bookPrice
    _saveBooksToStorage()
    return book
}

function addBook(bookName, bookPrice) {
    const book = _createBook(bookName, bookPrice)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBookRating(book, action) {
    book.rateCounter++
    if (action === 'plus' && book.rate < 10) book.rate++
    if (action === 'minus' && book.rate) book.rate--
    _saveBooksToStorage()
    return book.rate
}

function setBookSort(sortBy = {}) {
    gPageIdx = 0
    if (sortBy.rate !== undefined) {
        gBooks.sort((c1, c2) => (c1.rate - c2.rate) * sortBy.rate)
        gSortIsOn = !gSortIsOn
    } else if (sortBy.bookPrice !== undefined) {
        gBooks.sort((c1, c2) => (c1.bookPrice - c2.bookPrice) * sortBy.bookPrice)
        gSortIsOn = !gSortIsOn
    }
}

function setBooksFilter(filterBy) {
    gFilterBy.bookName = filterBy
    return gFilterBy
}