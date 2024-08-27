#!/usr/bin/env bash

puerto_local="$1"
puerto_tor="$2"

modificar_archivos() {
    sed -i "s/\(HiddenServicePort \)[0-9]\{1,5\}/\1$puerto_local/" config/torrc
    sed -i "s/\(HiddenServicePort $puerto_local 127.0.0.1:\)[0-9]*$/\1$puerto_tor/" config/torrc
}

ejecutar(){
	socat TCP-LISTEN:$puerto_tor,fork,bind=127.0.0.1 TCP:127.0.0.1:$puerto_local &
	tor -f config/torrc &
	proxychains -f config/proxychains.conf web/node server.js $puerto_local &
}

modificar_archivos $puerto_local $puerto_tor
ejecutar $puerto_local $puerto_tor
