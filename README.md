# ImapCopy

This is a simple mailbox copy program which copies emails from one IMAP account to another.  I 
wrote it after I couldn't get [mbsync](http://isync.sourceforge.net/mbsync.html) to work.  It 
uses the brilliant [node-imap](https://github.com/mscdex/node-imap) library to do the heavy 
lifting.

## Licence

Copyright (c) 2015, Gordon Mackenzie-Leigh
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the author nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


## Usage

The usage of ImapCopy is simple, just provide connection details in a config.json file and 
specify source and dest mailboxes on the command line:

node imapcopy.js -s [source] -d [dest]

The config file looks like this:

    {
      source: <sourceopts,
      dest: <destopts>
    }

The `<sourceopts>` and `<destops>` arguments are any valid connection options for 
[node-imap](https://github.com/mscdex/node-imap).  An example file would look like the following:

    {
      "source": {
        "user": 'mygmailname@gmail.com',
        "password": 'mygmailpassword',
        "host": 'imap.gmail.com',
        "port": 993,
        "tls": true
      },
      "dest": {
        "user": 'mygmailname@gmail.com',
        "password": 'myoutlookpassword',
        "host": 'office.outlook.com',
        "port": 993,
        "tls": true
      }
    }


## UID log

ImapCopy can be run multiple times in the same mailbox and will only copy new messages.  A list of
known message UIDs is stored in the file `uidsync.log` by default, but you can override this file
with the `--uids [file]` command option.
