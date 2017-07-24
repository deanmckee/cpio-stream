var newc = require('./newc')

exports.size = newc.size

exports.encode = function(opts) {
  if (opts.name[opts.name.length - 1] !== '\0') {
    opts.name += '\0'
  }
  var paddedName = newc.padName(opts.name)

  var buf = new Buffer(110 + paddedName.length)
  if (opts.mtime instanceof Date) {
    opts.mtime = Math.round(opts.mtime.getTime() / 1000)
  }

  //console.log('CHKSUM', opts.checksum.toString(16));

  buf.write('070702', 0)
  buf.write(newc.encodeHex(opts.ino, 8), 6)
  buf.write(newc.encodeHex(opts.mode, 8), 14)
  buf.write(newc.encodeHex(opts.uid, 8), 22)
  buf.write(newc.encodeHex(opts.gid, 8), 30)
  buf.write(newc.encodeHex(opts.nlink, 8), 38)
  buf.write(newc.encodeHex(opts.mtime, 8), 46)
  buf.write(newc.encodeHex(opts.size, 8), 54)
  buf.write(newc.encodeHex(opts.devmajor, 8), 62)
  buf.write(newc.encodeHex(opts.devminor, 8), 70)
  buf.write(newc.encodeHex(opts.rdevmajor, 8), 78)
  buf.write(newc.encodeHex(opts.rdevminor, 8), 86)
  buf.write(newc.encodeHex(opts.name.length, 8), 94)
  buf.write(newc.encodeHex(opts.checksum, 8), 102) // check
  buf.write(paddedName, 110)

  return buf
}


exports.decode = function (buf) {
  var check = newc.decodeHex(buf, 96)
  var header = newc.decode(buf)

  header.checksum = check

  return header
}
