#!/bin/bash

export MIX_ENV=prod
export PORT=4830

CFGD=$(readlink -f ~/.config/mbta)

if [ ! -e "$CFGD/base" ]; then
    echo "run deploy first"
    exit 1
fi

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/mbta_tracker/bin/mbta_tracker start
