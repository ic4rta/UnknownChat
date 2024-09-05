#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'


# Colores
source ${0%/*}/scripts/colors.sh

# Interrupcion del programa
trap ctrl_c SIGINT

# Funcion de limpieza 
ctrl_c() {
  echo -e "\n${blueColor} Ctrl+C presionado. Ejecutando la función de limpieza...${endColor}" && sleep 1.5

  # Eliminar el hidden service
  echo -e "\n${double_colon} Eliminando hidden service..."
  cd /var/lib/tor/
  rm -rf hidden_service

  # Matar los servicios activos
  echo -e "\n${double_colon} Matando procesos activos..."
  cd ../${0%/*}
  scripts/kill-process.sh &> /dev/null   

  exit 0
}


print_help() {
  echo -e "\n${yellowColor}Uso: $0 <LOCAL_PORT> <TOR_PORT>${endColor}\n"
}

if [ "$EUID" -ne 0 ]; then
    echo -e "\n${warning} Este script debe ser ejecutado como root.\n"
    exit 1
fi

if [ $# -eq 2 ]; then
  LOCAL_PORT="$1"
  TOR_PORT="$2"
else
  print_help
  exit 1
fi

verificar_dependencias() {
  cd "${0%/*}" || return

  # Verifica si el directorio 'node_modules' existe dentro de 'web'
  if ! ls web | grep -q node_modules; then
    echo "node_modules no encontrado. Verificando instalacion..."
    scripts/check_node_npm
  fi
}


modificar_archivos() {
  # Reemplazar el puerto local en torrc
  if ! sed -i "s/^\(HiddenServicePort \)[0-9]\{1,5\}/\1$LOCAL_PORT/" config/torrc; then
    echo "Error: No se pudo modificar el puerto local en config/torrc"
    exit 1
  fi

  # Reemplazar el puerto de Tor en torrc
  if ! sed -i "s/^\(HiddenServicePort $LOCAL_PORT 127.0.0.1:\)[0-9]\{1,5\}$/\1$TOR_PORT/" config/torrc; then
    echo "Error: No se pudo modificar el puerto de Tor en config/torrc"
    exit 1
  fi
}

ejecutar(){
  verificar_dependencias

  echo -e "${plus} Iniciando socat..."
  socat TCP-LISTEN:$TOR_PORT,fork,bind=127.0.0.1 TCP:127.0.0.1:$LOCAL_PORT &

  echo -e "${plus} Iniciando Tor..."
  tor -f config/torrc & 

  echo "Leyendo la URL del servicio oculto..."
  if [ -f /var/lib/tor/hidden_service/hostname ]; then
    VIEW_URL="$(cat /var/lib/tor/hidden_service/hostname)"
  else
    sleep 10  # Incrementa el tiempo de espera si es necesario.
    VIEW_URL="$(cat /var/lib/tor/hidden_service/hostname)"
  fi
  
  echo -e "${yellowColor}URL del servicio oculto:${endColor} $VIEW_URL:$LOCAL_PORT"

  echo "Ejecutando proxychains..."
  # Guardar la salida completa de proxychains en una variable
  cd "$(dirname "$0")/web"
  proxychains -f ../config/proxychains.conf node server.js $LOCAL_PORT
}

# Habilitar la depuración para ver cada comando ejecutado
#set -x

modificar_archivos
ejecutar
