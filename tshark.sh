tshark -l -o "capture.prom_mode:TRUE" -Y "http.request.method == POST" -T fields -e ip.src -e ip.dst -e http.host -e urlencoded-form.key -e urlencoded-form.value -E aggregator=\| > tshark_log
