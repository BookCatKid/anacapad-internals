# Artifacts: Shared libraries

Reusable code bundles the programs load at runtime. Each one provides a specialty, like playing a music format, encrypting a connection, or talking to a database, so the main program does not have to carry everything itself.

::: details Technical details

Dynamically linked ELF shared objects under /lib and /usr/lib; includes Sonos-internal libsonos-* components plus bundled third-party libraries.

:::

### `ld.so.1`

The dynamic loader itself: the very first piece of code that runs when any program starts, responsible for finding and linking all the shared libraries below.

[Download](/files/lib/ld.so.1) · 197.3 KB

::: details Technical details

- **Path in image:** `/lib/ld.so.1`
- **Category:** libs
- **Size:** 197.3 KB (202084 bytes)
- **SHA-256:** `925663a234c829c93f0a154a888d475cd5f529d4e8bb78093052db73a0286484`

Runtime linker/loader (glibc ld.so); resolves every .so dependency at process start.


:::

### `libanl.so.1`

A resolver helper for asynchronous name lookups, part of the standard C library family.

[Download](/files/lib/libanl.so.1) · 65.6 KB

::: details Technical details

- **Path in image:** `/lib/libanl.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67216 bytes)
- **SHA-256:** `bf44349ff423df018391a8c8c33717e3b43bcb82f3e710f7a69ced43276ff374`

glibc async DNS stub resolver library.


:::

### `libatomic.so.1`

Provides atomic operations for code that needs to update shared values safely across threads.

[Download](/files/lib/libatomic.so.1) · 65.3 KB

::: details Technical details

- **Path in image:** `/lib/libatomic.so.1`
- **Category:** libs
- **Size:** 65.3 KB (66888 bytes)
- **SHA-256:** `936d09871114ec00675d9dca65d9ee65602f8cfff561a9d1600f2f0951765d8e`

GCC runtime for atomic builtins used by the C++ concurrency primitives.


:::

### `libavcodec.so.59`

One of the FFmpeg libraries: provides the codecs that decode compressed audio formats the speaker receives.

[Download](/files/lib/libavcodec.so.59) · 513.8 KB

::: details Technical details

- **Path in image:** `/lib/libavcodec.so.59`
- **Category:** libs
- **Size:** 513.8 KB (526112 bytes)
- **SHA-256:** `b76beb0d832bcd54646196e33459fb06ef16e15b71fbd6619d68f95d87fb3772`

FFmpeg codec library (avcodec 59); backs part of the decode layer alongside the dedicated decoders.


:::

### `libavformat.so.59`

The FFmpeg container-format library: understands the file and stream wrappers that audio arrives in, like MP4 or streaming containers.

[Download](/files/lib/libavformat.so.59) · 321.7 KB

::: details Technical details

- **Path in image:** `/lib/libavformat.so.59`
- **Category:** libs
- **Size:** 321.7 KB (329396 bytes)
- **SHA-256:** `8fdf976dca64b38bc36953b83b1ebd21962d1aecc5b3861232c26c4a1ab7d778`

FFmpeg demuxer library; parses container formats for the audio pipeline.


:::

### `libavutil.so.57`

The FFmpeg utility foundation: shared helpers the other FFmpeg libraries use for buffers, math, and data structures.

[Download](/files/lib/libavutil.so.57) · 770.2 KB

::: details Technical details

- **Path in image:** `/lib/libavutil.so.57`
- **Category:** libs
- **Size:** 770.2 KB (788656 bytes)
- **SHA-256:** `c5410f65833a122f6d03945554ab28150085733e8091179ad25c85318d99a082`

FFmpeg utility library (libavutil 57).


:::

### `libc.so.6`

The core C library: the basic building blocks every program uses, from memory and strings to files and sockets. The single most fundamental library on the device.

[Download](/files/lib/libc.so.6) · 1.5 MB

::: details Technical details

- **Path in image:** `/lib/libc.so.6`
- **Category:** libs
- **Size:** 1.5 MB (1593260 bytes)
- **SHA-256:** `68480e345dae7c02b16cce5797c23f7205baf08e0b491e11c34eccaae4121c74`

glibc 6; the platform C runtime.


:::

### `libcrypt.so.1`

The password-hashing library: implements the cryptographic hashing used for account passwords in the shadow file.

[Download](/files/lib/libcrypt.so.1) · 65.6 KB

::: details Technical details

- **Path in image:** `/lib/libcrypt.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67152 bytes)
- **SHA-256:** `6045bf5a663a0b035f0dde6fb858ecb01b53215ee81ad27411d1d799db5bf39d`

libcrypt with MD5-crypt ($1$) and friends; the format etc/shadow uses.


:::

### `libdcadec.so.0`

The DTS decoder: handles the DTS surround format that some TVs and discs send instead of Dolby. Its presence is a Playbar-specific feature; smaller speakers do not ship it.

[Download](/files/lib/libdcadec.so.0) · 385.6 KB

::: details Technical details

- **Path in image:** `/lib/libdcadec.so.0`
- **Category:** libs
- **Size:** 385.6 KB (394888 bytes)
- **SHA-256:** `4bd12f82476b9b10cd5ae7007143f7207923bb85f98b465a61426b28c906b50d`

DTS decode library (dcadec); an m9-only component flagged in the firmware-differences page.


:::

### `libdl.so.2`

The dynamic-loading helper: lets programs open extra shared libraries on demand after they have already started.

[Download](/files/lib/libdl.so.2) · 65.7 KB

::: details Technical details

- **Path in image:** `/lib/libdl.so.2`
- **Category:** libs
- **Size:** 65.7 KB (67268 bytes)
- **SHA-256:** `4af444ffc67a8ce5e9a7c69b6890a9a28de563c97ccd083020be98213d332faf`

glibc dlopen/dlsym stubs.


:::

### `libdns_sd.so.1`

The service-discovery client library: the piece programs use to announce and find services on the local network.

[Download](/files/lib/libdns_sd.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libdns_sd.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66968 bytes)
- **SHA-256:** `7f0c4057b48f02e4586370837b83148c62eea8951a06562c2bcf2234d5a4bf33`

DNS-SD client library backing the mDNS/discovery layer.


:::

### `libflash.so.1`

The flash-memory library: safe read/write access to the device's flash storage, used by the updater and the factory-data tooling.

[Download](/files/lib/libflash.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libflash.so.1`
- **Category:** libs
- **Size:** 65.4 KB (67016 bytes)
- **SHA-256:** `454a6c5e2bde42f0f6fa64854dc738a3d1b4731a99f4af6c9272576ca2ff641d`

Sonos flash/NCD access library; backs mdputil and the device-payload handling.


:::

### `libgcc_s.so.1`

A small GCC support runtime providing helpers the compiler emits calls into, like long-division on hardware that lacks the instruction.

[Download](/files/lib/libgcc_s.so.1) · 129.5 KB

::: details Technical details

- **Path in image:** `/lib/libgcc_s.so.1`
- **Category:** libs
- **Size:** 129.5 KB (132564 bytes)
- **SHA-256:** `3210e9d6b8605e995224f9f65cd1eb2a09edd67d2b690198059184d785450ae2`

GCC shared runtime support library.


:::

### `libhwmessagelib.so.1`

Sonos's hardware-message library: the shared code for sending events between the kernel drivers and the programs, covering things like button presses and jacks.

[Download](/files/lib/libhwmessagelib.so.1) · 65.5 KB

::: details Technical details

- **Path in image:** `/lib/libhwmessagelib.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67068 bytes)
- **SHA-256:** `f9a8118a37378555d5e0015135c53db84119f4cda90b4ac5eab95c411c58e1c4`

Sonos-internal lib; backs hwmessagelib/hw_input_events.


:::

### `libm.so.6`

The math library: floating-point and transcendental functions used by audio processing and anything else that computes.

[Download](/files/lib/libm.so.6) · 1.1 MB

::: details Technical details

- **Path in image:** `/lib/libm.so.6`
- **Category:** libs
- **Size:** 1.1 MB (1196608 bytes)
- **SHA-256:** `b50c76409e06d9d4d44318a5ef80acebe3bb20e99f28946a31419c51fa782363`

glibc math library.


:::

### `libmbedcrypto.so.16`

The cryptographic primitives library: the raw math for encryption, hashing, and signing that the TLS layer builds on.

[Download](/files/lib/libmbedcrypto.so.16) · 385.7 KB

::: details Technical details

- **Path in image:** `/lib/libmbedcrypto.so.16`
- **Category:** libs
- **Size:** 385.7 KB (394952 bytes)
- **SHA-256:** `a1963eed20b9837f13c0d8620ec78508e3a096174d799ca3556dea9988bdb866`

mbedTLS crypto core; underpins the secure channels (lechmere, TLS to music services, cert verification).


:::

### `libmbedtls.so.21`

The secure-connection library: implements the encrypted protocol behind every https and secure-socket conversation the speaker has, from cloud calls to music services.

[Download](/files/lib/libmbedtls.so.21) · 129.5 KB

::: details Technical details

- **Path in image:** `/lib/libmbedtls.so.21`
- **Category:** libs
- **Size:** 129.5 KB (132560 bytes)
- **SHA-256:** `c61d42e59c107c5a8bf9d01358322d2cef656e890e3c46141cc4ae3599694cde`

mbedTLS TLS implementation; the tls_stack entry documents the layer built on it.


:::

### `libmbedx509.so.7`

The certificate-parsing library: understands the format of digital certificates so the device can verify who it is talking to.

[Download](/files/lib/libmbedx509.so.7) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libmbedx509.so.7`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `730be3bbb923833a5fdb17c4bd65b0eb16a96ab962f12276492bab287016b437`

mbedTLS X.509 parser; used with libsonos-certval for device identity.


:::

### `libmpg123.so.0`

The MP3 decoder library: fast, mature MPEG-audio decoding for one of the oldest formats the player accepts.

[Download](/files/lib/libmpg123.so.0) · 194.0 KB

::: details Technical details

- **Path in image:** `/lib/libmpg123.so.0`
- **Category:** libs
- **Size:** 194.0 KB (198636 bytes)
- **SHA-256:** `18566d9f255bcbd5d41ec649738c5a7b1e06180458fcb97eebbdc51f2c362fda`

mpg123 decode library.


:::

### `libnl-3.so.200`

The netlink library: how userspace programs talk to the kernel's networking subsystem for things like interface and route events.

[Download](/files/lib/libnl-3.so.200) · 129.9 KB

::: details Technical details

- **Path in image:** `/lib/libnl-3.so.200`
- **Category:** libs
- **Size:** 129.9 KB (132980 bytes)
- **SHA-256:** `7860c4c6239085ecab4c42092796f9e58b4da6788c5509a1001eeb8863361e35`

netlink-3 core library.


:::

### `libnl-genl-3.so.200`

The generic-netlink extension: the modern netlink flavor used for wireless and other kernel subsystems.

[Download](/files/lib/libnl-genl-3.so.200) · 66.0 KB

::: details Technical details

- **Path in image:** `/lib/libnl-genl-3.so.200`
- **Category:** libs
- **Size:** 66.0 KB (67584 bytes)
- **SHA-256:** `a757566c04cebbb4db3d4b435d6de7cbb5506a4238722a3e92f26cb6cc540104`

netlink-3 generic library; consumed by WiFi tooling.


:::

### `libnss_dns.so.2`

The DNS name-service module: the piece that actually performs name lookups when a program asks for a hostname's address.

[Download](/files/lib/libnss_dns.so.2) · 65.5 KB

::: details Technical details

- **Path in image:** `/lib/libnss_dns.so.2`
- **Category:** libs
- **Size:** 65.5 KB (67060 bytes)
- **SHA-256:** `dbd9e2ce0f5805dfabdcbcf41068d44b2c23e0ec9160db8e9123b02a434f288a`

glibc NSS DNS plugin loaded per nsswitch.conf.


:::

### `libnss_files.so.2`

The file-based name-service module: answers lookups from flat files like hosts and passwd before the network is consulted.

[Download](/files/lib/libnss_files.so.2) · 65.7 KB

::: details Technical details

- **Path in image:** `/lib/libnss_files.so.2`
- **Category:** libs
- **Size:** 65.7 KB (67228 bytes)
- **SHA-256:** `0dacf4f54ea6e3bf02dd6839aa0e15686220c9860e78e69d34d33b112c4a3a4b`

glibc NSS files plugin.


:::

### `libpcap.so.1`

The packet-capture library: the standard API for sniffing network traffic, backing the pcap diagnostic tool.

[Download](/files/lib/libpcap.so.1) · 260.5 KB

::: details Technical details

- **Path in image:** `/lib/libpcap.so.1`
- **Category:** libs
- **Size:** 260.5 KB (266780 bytes)
- **SHA-256:** `a41237fb615ad5af53c1fbfa8a853b0d17d0be44a6aae177a68188eddf9785f6`

libpcap; used by bin/pcap for diagnostic captures.


:::

### `libprotobuf-nanopb.so.0`

A small protocol-buffers implementation for structured data: the lightweight serialization used in the embedded plumbing.

[Download](/files/lib/libprotobuf-nanopb.so.0) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libprotobuf-nanopb.so.0`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `5cf58557c28f238743c16c45ca6aa69f473abf75e6b12674426932162dea48a3`

nanopb protobuf runtime; pairs with the decoded protobuf descriptor set documented under protobuf_descriptors.


:::

### `libpthread.so.0`

The threading library: lets programs run many things at once, which a speaker needs constantly for playback, networking, and control at the same time.

[Download](/files/lib/libpthread.so.0) · 131.1 KB

::: details Technical details

- **Path in image:** `/lib/libpthread.so.0`
- **Category:** libs
- **Size:** 131.1 KB (134284 bytes)
- **SHA-256:** `a7e61be7e6fc906d4a8ae1b241c02fedca47c5aac4d3161b4e3687e43d06fec1`

glibc POSIX threads.


:::

### `libresolv.so.2`

The resolver library: full DNS query machinery beyond the simple name lookups.

[Download](/files/lib/libresolv.so.2) · 130.2 KB

::: details Technical details

- **Path in image:** `/lib/libresolv.so.2`
- **Category:** libs
- **Size:** 130.2 KB (133324 bytes)
- **SHA-256:** `36bd8c24be52922455395f6399ac6d02cb5d7b03ba1d1d797be7c33d9a7117a3`

glibc resolver library.


:::

### `libsbc.so.1`

The Bluetooth audio codec library: decodes the standard Bluetooth audio format on products that ship a Bluetooth radio. It is present here because the codebase is shared across models.

[Download](/files/lib/libsbc.so.1) · 129.5 KB

::: details Technical details

- **Path in image:** `/lib/libsbc.so.1`
- **Category:** libs
- **Size:** 129.5 KB (132612 bytes)
- **SHA-256:** `a1a5998d4a6d6a6563185296da0515997cede5d88449419bbc150fbfedca6c9a`

SBC codec library; dormant on this wired-only Playbar (documented under bt_sbc).


:::

### `libsmb2.so.1`

The Windows file-sharing client library: the component that lets the speaker mount and read music stored on computers and NAS drives.

[Download](/files/lib/libsmb2.so.1) · 193.9 KB

::: details Technical details

- **Path in image:** `/lib/libsmb2.so.1`
- **Category:** libs
- **Size:** 193.9 KB (198556 bytes)
- **SHA-256:** `ba823cc96747f662227885c14134a735f24d1338d6c53b659816468a7ec0805a`

SMB2 client library backing the smb/mntmgr music-share machinery.


:::

### `libsonos-certval.so.2`

The device-certificate verifier: Sonos's own library for checking that a presented certificate chains back to a trusted Sonos root. It is what 'a genuine Sonos device' means in code.

[Download](/files/lib/libsonos-certval.so.2) · 1.6 MB

::: details Technical details

- **Path in image:** `/lib/libsonos-certval.so.2`
- **Category:** libs
- **Size:** 1.6 MB (1706972 bytes)
- **SHA-256:** `6a3aaba84eea36d6ea0fafbcce1321199958950a62d4a8ded483fc796fa4f230`

Sonos-internal cert validation library; manages the RCB bundles including /etc/fallback_trusted_roots.rcb (see libsonos_certval).


:::

### `libsonos-mdp.so.1`

The manufacturing-data library: reads and writes the factory data block carrying serial number, MAC, and per-unit calibration values.

[Download](/files/lib/libsonos-mdp.so.1) · 65.3 KB

::: details Technical details

- **Path in image:** `/lib/libsonos-mdp.so.1`
- **Category:** libs
- **Size:** 65.3 KB (66888 bytes)
- **SHA-256:** `919a36bec2cd00aaa31efefff2b0cf7d4ba3247d63f1ac88f5739a6a630b628c`

Sonos-internal MDP library behind mdputil and the device-payload.bin template.


:::

### `libsonos-root-cert-bundle.so.2`

The packaged root-cert bundle: the primary set of trust anchors for secure connections, shipped as its own updatable library.

[Download](/files/lib/libsonos-root-cert-bundle.so.2) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libsonos-root-cert-bundle.so.2`
- **Category:** libs
- **Size:** 65.4 KB (66984 bytes)
- **SHA-256:** `4cd8ae0486d1d68f01e25408f98b572b6e55ae41f77912d8adaeae812f9803a6`

Sonos cert-bundle carrier; its runtime-update path is documented under libsonos_certval/rcb_bundle_format.


:::

### `libsonos-time-c.so.1`

Sonos's own time library: the company's shared clock code that the sync machinery builds on.

[Download](/files/lib/libsonos-time-c.so.1) · 65.5 KB

::: details Technical details

- **Path in image:** `/lib/libsonos-time-c.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67116 bytes)
- **SHA-256:** `c3b34b1a671da66b2e61f8cb2c6bf47991d6f9c0777fd726f06e71b2666c1325`

Sonos-internal time library feeding the sntp/time-sync layer.


:::

### `libsonoscrypto.so.3`

Sonos's cryptographic wrapper: the company's own layer on top of the base crypto, used for signing and key handling across the household protocols.

[Download](/files/lib/libsonoscrypto.so.3) · 65.7 KB

::: details Technical details

- **Path in image:** `/lib/libsonoscrypto.so.3`
- **Category:** libs
- **Size:** 65.7 KB (67316 bytes)
- **SHA-256:** `7ba2531b9c5921e414af50404e202d5ad0f3f015214d8f2578355fb6ea69f681`

Sonos-internal crypto utility library; the PSK hierarchy entries describe what it protects.


:::

### `libsonoseventreporter.so.1`

The event-reporting library: the shared machinery for packaging and shipping telemetry and diagnostic events up to Sonos.

[Download](/files/lib/libsonoseventreporter.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libsonoseventreporter.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66984 bytes)
- **SHA-256:** `e0f4b82d2d4d85a1d53eafb0d0e02cf3172f8d2f279f4990f453a9c96b8684f5`

Sonos-internal reporter library; part of the telemetry/reporting pipeline.


:::

### `libsonosminiutils.so.1`

A grab-bag Sonos utility library: small shared helpers the daemons and tools reuse.

[Download](/files/lib/libsonosminiutils.so.1) · 65.9 KB

::: details Technical details

- **Path in image:** `/lib/libsonosminiutils.so.1`
- **Category:** libs
- **Size:** 65.9 KB (67500 bytes)
- **SHA-256:** `94c1afdcdff05f2696a13878de75d209f36c6086938059d501f91c68af81a192`

Sonos-internal utility library.


:::

### `libsonossbcpacket.so.1`

The Sonos channel-protocol packet library: framing for the proprietary audio-distribution protocol that keeps grouped players in sync.

[Download](/files/lib/libsonossbcpacket.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libsonossbcpacket.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `64fa1ab7469501d0e8cc43b882b4b3dbb3fef287a90921a6bf98249a959e8dee`

Sonos-internal packet library for the chsrc/chsnk group-audio channel (see native_protocols).


:::

### `libsonossyslog.so.1`

Sonos's logging glue: the internal library that routes messages into the per-subsystem log files.

[Download](/files/lib/libsonossyslog.so.1) · 65.5 KB

::: details Technical details

- **Path in image:** `/lib/libsonossyslog.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67056 bytes)
- **SHA-256:** `d329c65f3724229a9303f9b9b0db3f2c61a1c7178db44b69dfd0da575c931cec`

Sonos-internal syslog/log plumbing tied to the log_domains machinery.


:::

### `libsonosutils.so.1`

Sonos's general utility library: the shared toolbox of helpers used across the daemons, from containers to string handling.

[Download](/files/lib/libsonosutils.so.1) · 65.8 KB

::: details Technical details

- **Path in image:** `/lib/libsonosutils.so.1`
- **Category:** libs
- **Size:** 65.8 KB (67388 bytes)
- **SHA-256:** `c8c1c75905f955c5d7c9759171a7f7e207930a18bb62f3e8c2444fb9fda622de`

Sonos-internal general-purpose library.


:::

### `libsqlite3.so.0`

The embedded database library: a whole SQL database engine in one file, used for structured stores like the timer and alarm records.

[Download](/files/lib/libsqlite3.so.0) · 904.9 KB

::: details Technical details

- **Path in image:** `/lib/libsqlite3.so.0`
- **Category:** libs
- **Size:** 904.9 KB (926600 bytes)
- **SHA-256:** `3a96ea0afd93227345d6d8e6155e13440eb0a4d2ae2968d215755a5cee73a795`

SQLite3; the embedded_sqlite entry documents its use (timer.db prepared statements and friends).


:::

### `libsyslib_hal.so.1`

The hardware-abstraction library: gives programs a uniform way to talk to the board's LEDs, buttons, and sensors without caring about the exact chips.

[Download](/files/lib/libsyslib_hal.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libsyslib_hal.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66972 bytes)
- **SHA-256:** `3f1fc46c69ee388ef4783910c9d5dc15e09997c7d3e609fd14762184017eb628`

Sonos hardware-abstraction library sitting above the kernel modules.


:::

### `libthread_db.so.1`

A debugger-support library: helps tools like gdb understand a program's threads. Harmless plumbing that ships with the toolchain.

[Download](/files/lib/libthread_db.so.1) · 66.1 KB

::: details Technical details

- **Path in image:** `/lib/libthread_db.so.1`
- **Category:** libs
- **Size:** 66.1 KB (67680 bytes)
- **SHA-256:** `e8be7d7c581e0d939c54812d6ddaf1be4c146303034b97b055b03209794f4840`

glibc thread-debug helper (gdb support).


:::

### `libtomlc99.so.1`

The config-file parser library: reads the TOML format used by the logger configs and other modern config files in the image.

[Download](/files/lib/libtomlc99.so.1) · 65.5 KB

::: details Technical details

- **Path in image:** `/lib/libtomlc99.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67052 bytes)
- **SHA-256:** `9e2650c723f9b70b9a05a495588ecf75b90ea1a263746201af9af49236d94223`

tomlc99 parser; backs the *_logger.toml files and limelight.toml-style configs (see toml_config).


:::

### `libutil.so.1`

A small utility library with terminal and process helpers from the C library family.

[Download](/files/lib/libutil.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libutil.so.1`
- **Category:** libs
- **Size:** 65.4 KB (67004 bytes)
- **SHA-256:** `9c933e83204eb337114efeed4e6beefa6869e9e9f7c19282492e3f6974e53fbf`

glibc libutil (pty/login helpers).


:::

### `libuuid.so.1`

The unique-ID library: generates and parses the long identifier strings the system uses everywhere for devices, groups, and accounts.

[Download](/files/lib/libuuid.so.1) · 65.6 KB

::: details Technical details

- **Path in image:** `/lib/libuuid.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67184 bytes)
- **SHA-256:** `a179176cfee5b04bd400183110013ec12372db62432a99d3127052fb6abdc8e7`

libuuid; produces the RINCON_-style UUIDs documented under rincon_uuid.


:::

### `libwifi.so.1`

The wireless support library: a shared layer for controlling and querying the WiFi hardware, used by the network daemons.

[Download](/files/lib/libwifi.so.1) · 65.4 KB

::: details Technical details

- **Path in image:** `/lib/libwifi.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66964 bytes)
- **SHA-256:** `911d6f28bd36442832a749e7a3c066939de53a2d8044cc9216d0668df9a506ef`

WiFi utility library for the Atheros stack (wifi_hal).


:::

### `libz.so.1`

The compression library: the classic zlib, used anywhere data gets squeezed or unpacked, from saved files to network payloads.

[Download](/files/lib/libz.so.1) · 129.6 KB

::: details Technical details

- **Path in image:** `/lib/libz.so.1`
- **Category:** libs
- **Size:** 129.6 KB (132740 bytes)
- **SHA-256:** `510c0897069e9837bb3af133f2d95ec2e752773ea7c13e5d0fe8f45bb3250e04`

zlib; the iocompress queue/state compression wraps it.


:::

### `libcap.so.2`

The capabilities library: manages the fine-grained Linux privilege bits that let a program keep only the powers it needs instead of running fully as root.

[Download](/files/usr/lib/libcap.so.2) · 65.6 KB

::: details Technical details

- **Path in image:** `/usr/lib/libcap.so.2`
- **Category:** libs
- **Size:** 65.6 KB (67196 bytes)
- **SHA-256:** `b4b2bd747773e10fda5f2d0fa3f47b17a4bb46c6d5b42acba0c486332bd0b0ec`

libcap; supports the capability keep-set on the anacapad launch line.


:::

