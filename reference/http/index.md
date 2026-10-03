# HTTP / non-SOAP surface

Beyond the documented control surface, the player answers ordinary HTTP requests: a built-in diagnostic and maintenance web surface most users never see. Some of it is famous. The /status page gives a rich snapshot of what the player is doing, and the support tools lean on it heavily. But there are also endpoints for rebooting, managing logs, checking network state, and a few surprising extras. This page inventories every HTTP path the firmware registers: what's served, what it accepts, and which of them are genuinely useful versus internal.

::: details Technical details

Endpoints and HTTP-layer behaviors recovered from the binary outside the SOAP control path. All are static-analysis records.

:::

| Group | Entries |
|---|---|
| [Endpoints & server behavior](endpoints.md) | 12 |
| [Discovery & routing](discovery.md) | 6 |
| [Auth & security](auth-security.md) | 7 |
| [Outbound clients & cloud](cloud-clients.md) | 7 |
| [Media & streaming](media-streaming.md) | 5 |
| [Internal vocabularies & tables](vocabularies.md) | 9 |
