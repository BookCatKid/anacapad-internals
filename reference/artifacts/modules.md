# Artifacts: Kernel modules

Drivers that plug into the Linux kernel at boot: the audio hardware driver, the infrared receiver, the watchdog, and the WiFi chipset modules. They are the lowest software layer, sitting between the operating system and the physical chips.

::: details Technical details

Loadable kernel objects under /modules and /wifi (Atheros driver family for the SonosNet-capable radio stack).

:::

### `audiodev.ko`

The audio device driver: the kernel module that exposes the sound hardware to the programs above, carrying the actual digital audio to the amplifiers.

[Download](/files/modules/audiodev.ko) · 142.9 KB

::: details Technical details

- **Path in image:** `/modules/audiodev.ko`
- **Category:** modules
- **Size:** 142.9 KB (146328 bytes)
- **SHA-256:** `65bb803d74054376cad1f9305696ad0df921763981c3071fb10c70cfbf138ba4`

Core audio driver; the lla and tdm_driver entries document the interface layered on it.


:::

### `chk.ko`

The hardware-check module: a small kernel piece the system uses to verify board identity and hardware health.

[Download](/files/modules/chk.ko) · 4.6 KB

::: details Technical details

- **Path in image:** `/modules/chk.ko`
- **Category:** modules
- **Size:** 4.6 KB (4736 bytes)
- **SHA-256:** `f099055a15c41e29074bd0855c3c0add5f30d23df2a5d7c14f172bc3df00978e`

Board-check module; its device node (/dev/chk) appears in the updater's sibling-binary inventory.


:::

### `hwevent_queue.ko`

The hardware-event queue: delivers physical events like button presses and jack insertions from the kernel up to the programs that handle them.

[Download](/files/modules/hwevent_queue.ko) · 17.2 KB

::: details Technical details

- **Path in image:** `/modules/hwevent_queue.ko`
- **Category:** modules
- **Size:** 17.2 KB (17596 bytes)
- **SHA-256:** `b569eb24c4d5591dd4874e2ca99b6c8109465eb442e7484c79cf08bfbe5eb2ea`

Kernel queue feeding hw_input_events / hwmessagelib, the layer that turns physical presses into internal messages.


:::

### `ir_rcvr.ko`

The infrared receiver driver: the kernel piece that captures remote-control signals from the IR sensor on models that have one, like the Playbar.

[Download](/files/modules/ir_rcvr.ko) · 7.8 KB

::: details Technical details

- **Path in image:** `/modules/ir_rcvr.ko`
- **Category:** modules
- **Size:** 7.8 KB (7948 bytes)
- **SHA-256:** `467aaf41cc857a0109c1b4d124a9031c291188f238fc1f93917118f21ccff715`

IR receiver driver feeding /opt/ir config and the ir_decoder/ir_learn machinery. Absent on models without an IR sensor (a documented m8-vs-m9 difference).


:::

### `sonos_device.ko`

The Sonos board-support module: kernel glue for the custom hardware bits specific to the player.

[Download](/files/modules/sonos_device.ko) · 3.6 KB

::: details Technical details

- **Path in image:** `/modules/sonos_device.ko`
- **Category:** modules
- **Size:** 3.6 KB (3640 bytes)
- **SHA-256:** `c5047d17c5bf529db12a3009b21c6f432d0fd51fb47f1949e83ba6bdacb2a571`

Board-support kernel module for the limelight platform.


:::

### `adf.ko`

A lower-level Atheros driver framework module the WiFi stack loads beneath the main radio driver.

[Download](/files/wifi/N/adf.ko) · 24.2 KB

::: details Technical details

- **Path in image:** `/wifi/N/adf.ko`
- **Category:** modules
- **Size:** 24.2 KB (24776 bytes)
- **SHA-256:** `7a137d22cbc1cf94d2eabe2aa093867b11d8cddb75f14aa133c6fa5f23ea4705`

Atheros Driver Framework layer for the wifi/N radio build.


:::

### `asf.ko`

Another Atheros support layer in the WiFi stack, handling shared services the radio driver relies on.

[Download](/files/wifi/N/asf.ko) · 12.8 KB

::: details Technical details

- **Path in image:** `/wifi/N/asf.ko`
- **Category:** modules
- **Size:** 12.8 KB (13124 bytes)
- **SHA-256:** `537acdbc2de81b9c75f3aed2849ad37ebaa3768c78a8671554ae4f1e0b734bf1`

Atheros Service Framework layer for the wifi/N radio build.


:::

### `ath_driver.ko`

The main WiFi radio driver: the kernel module that actually talks to the Atheros wireless chip and does the work of joining networks and carrying traffic.

[Download](/files/wifi/N/ath_driver.ko) · 353.5 KB

::: details Technical details

- **Path in image:** `/wifi/N/ath_driver.ko`
- **Category:** modules
- **Size:** 353.5 KB (362008 bytes)
- **SHA-256:** `13e8c2658306cb55464fc942fb01d9be49b9ec53f62518367812b36454e43778`

Primary ath driver for the Atheros-based radio in this generation of hardware.


:::

### `ath_hal.ko`

The radio's hardware-abstraction module: the closed-off layer between the open driver and the actual radio silicon.

[Download](/files/wifi/N/ath_hal.ko) · 341.5 KB

::: details Technical details

- **Path in image:** `/wifi/N/ath_hal.ko`
- **Category:** modules
- **Size:** 341.5 KB (349744 bytes)
- **SHA-256:** `bf6fa38237599dc0c7551eb8c8dd850874dc922b3db907f8bfaede36f8d9f3db`

Atheros HAL (hardware abstraction layer), the proprietary core of the driver stack.


:::

### `dfs.ko`

The radar-detection module: watches for radar on restricted WiFi channels so the speaker can legally operate on them, part of the 5 GHz regulatory machinery.

[Download](/files/wifi/N/dfs.ko) · 56.7 KB

::: details Technical details

- **Path in image:** `/wifi/N/dfs.ko`
- **Category:** modules
- **Size:** 56.7 KB (58024 bytes)
- **SHA-256:** `7721e59669177601410ee881d03d935ddc7b33edb6ece2c618bce130773debd1`

DFS (Dynamic Frequency Selection) module; pairs with the radartool utility.


:::

### `bridge.ko`

The network-bridge module: lets the speaker bridge wired and wireless interfaces so SonosNet members can share a connection.

[Download](/files/wifi/bridge.ko) · 76.2 KB

::: details Technical details

- **Path in image:** `/wifi/bridge.ko`
- **Category:** modules
- **Size:** 76.2 KB (78056 bytes)
- **SHA-256:** `1f738329dd9016b52f1872a5fde659ca2291fca638253adc94024fb52215252a`

Kernel bridge support used by brctl in the SonosNet topology.


:::

