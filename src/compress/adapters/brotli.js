'use strict'

const { brotliCompress, brotliDecompress } = require('zlib')
const { promisify } = require('util')

const pBrotliCompress = promisify(brotliCompress)
const pBrotliDecompress = promisify(brotliDecompress)

// Compress to Brotli
const compress = function(content) {
  return pBrotliCompress(content)
}

// Decompress from Brotli
const decompress = function(content) {
  return pBrotliDecompress(content)
}

module.exports = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
}
