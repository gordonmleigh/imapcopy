import Imap from 'imap';
import Promise from 'bluebird';


export default class ImapHelper {
  constructor (options) {
    this.options = options;
    this.imap = new Imap(options);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', function () {
        resolve(true);
      });
      this.imap.once('error', function (error) {
        reject(error);
      });
      this.imap.connect();
    });
  }


  openBox(mailbox) {
    return new Promise((resolve, reject) => {
      this.imap.openBox(mailbox, true, function (err, srcBox) {
        if (err) {
          reject(err);
        } else {
          resolve (srcBox);
        }
      })
    });
  }


  search(criteria) {
    return new Promise((resolve, reject) => {
      this.imap.search(criteria, function (err, uids) {
        if (err) {
          reject(err);
        } else {
          resolve(uids);
        }
      });
    });
  }


  fetch(uid) {
    return new Promise((resolve, reject) => {
      let messages = this.imap.fetch(uid, {
        bodies: ''
      });

      messages.on('message', (msg, seqno) => {
        let m = { data: '' };

        msg.on('attributes', (attrs) => {
          m.attribs = attrs;
        });

        msg.on('body', (stream, info) => {
          stream.on('data', (chunk) => {
            m.body += chunk.toString('utf8');
          });
        });

        msg.on('end', () => {
          m.headers = Imap.parseHeader(m.body);
          resolve(m);
        });
      });
    });
  }


  append(data, options) {
    return new Promise((resolve, reject) => {
      this.imap.append(data, options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
};
