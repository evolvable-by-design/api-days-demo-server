const { Link } = require('./hypermedia');

module.exports = {
  delete: (talk) => Link('delete', { name: talk.name }),
  attend: (talk) => Link('attend', { name: talk.name })
}