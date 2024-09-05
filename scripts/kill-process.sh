#!/usr/bin/env bash

sudo lsof -i | grep -E "proxychains|tor|socat|node" | awk '{print $2}' | xargs kill 
sudo ps aux | grep -E "proxychains|tor|socat|node" | awk '{print $2}' | xargs kill 
