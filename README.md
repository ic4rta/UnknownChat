**UnknownChat is a private and temporary chat service hosted on tor that allows integration with proxychains and socat.**

## Manual deployment

1. Modify the local port of “HiddenServicePort” in the torrc file
2. Modify the listening port of “HiddenServicePort” in the torrc file
```lua
HiddenServicePort <local_port> 127.0.0.1:<tor_port>
```
3. In the config/proxychains.conf file, add the different proxies you want to use using the syntax: `<type> <IP> <port>`
```lua
[ProxyList]
socks4 77.89.224.146 5678 --> example
```
4. Start socat, tor and proxychain as follows
```lua
proxychains -f config/proxychains.conf node web/server.js <local_port>
sudo tor -f config/torrc
socat TCP-LISTEN:<tor_port>,fork,bind=127.0.0.1 TCP:127.0.0.1:<local_port>
```

- If the service does not work, change the local port to `80`.
--- 
To do: Implement the script correctly (unknown-chat.sh)
