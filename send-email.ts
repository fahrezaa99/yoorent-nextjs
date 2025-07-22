const { Resend } = require('resend');
const resend = new Resend('re_AnVbkzhw_83EFCayC4WR2ajnG53JLowEz'); // Ganti dengan API key-mu

resend.emails.send({
  from: 'noreply@yoorent.com',          // Ganti pakai domain yang sudah verified
  to: 'alamat@email.tujuan',
  subject: 'Hello dari YooRent',
  html: '<strong>Email pertama via Resend sukses!</strong>',
}).then(console.log).catch(console.error);
