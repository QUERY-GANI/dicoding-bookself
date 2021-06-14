const { nanoid } = require('nanoid')
const books = []

const addBookHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  const id = nanoid(10)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt,
    updatedAt,
    finished: pageCount === readPage
  }
  books.push(newBook)

  const isSuccess = books.filter((Book) => Book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getBookHandler = (req, h) => {
  const { id } = req.params
  const { name, reading, finished } = req.query
  const data = id
    ? {
        book: books.find(v => v.id === id)
      }
    : name
      ? {
          books: books.filter(v => v.name.split(' ').find(v => v.toLowerCase() === name.toLowerCase())).map(v => {
            const newObj = {}
            newObj.id = v.id
            newObj.name = v.name
            newObj.publisher = v.publisher
            return newObj
          })
        }
      : reading
        ? {
            books: books.filter(v => parseInt(reading) === 0 ? v.reading === false : parseInt(reading) === 1 ? v.reading === true : v).map(v => {
              const newObj = {}
              newObj.id = v.id
              newObj.name = v.name
              newObj.publisher = v.publisher
              return newObj
            })
          }
        : finished
          ? {
              books: books.filter(v => parseInt(finished) === 0 ? v.finished === false : parseInt(finished) === 1 ? v.finished === true : v).map(v => {
                const newObj = {}
                newObj.id = v.id
                newObj.name = v.name
                newObj.publisher = v.publisher
                return newObj
              })
            }
          : {
              books: books.map(v => {
                const newObj = {}
                newObj.id = v.id
                newObj.name = v.name
                newObj.publisher = v.publisher
                return newObj
              })
            }

  if (id && !data.book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const response = h.response({
    status: 'success',
    data
  })
  response.code(200)
  return response
}

const editBookByIdHandler = (req, h) => {
  const { id } = req.params
  const data = req.payload
  if (!data.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (data.readPage > data.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  const index = books.findIndex((v) => v.id === id)
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  const updatedAt = new Date().toISOString()
  books[index] = { ...books[index], ...data, updatedAt }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  })
  response.code(200)
  return response
}

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params
  const index = books.findIndex((v) => v.id === id)
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  books.splice(index, 1)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  })
  response.code(200)
  return response
}

module.exports = {
  addBookHandler, getBookHandler, editBookByIdHandler, deleteBookByIdHandler
}
