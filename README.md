To capture DNS queries, symlink the bind log to `./bind_log`.

To capture POST data, run `tshark.sh` which will output to `./tshark_log`.
If you want to monitor traffic from other devices on the network,
the network interface must be in promiscuous mode.

Run the log monitor with `node app.js`, and connect to the web server at port 9000.
