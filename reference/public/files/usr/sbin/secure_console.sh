#!/bin/sh

# This is a wrapper script called by getty, which is unable to pass
# arguments to the program it starts (typically login). We need to pass
# the user to login as (-f root).
echo "Starting console..."
exec /bin/login -f root
