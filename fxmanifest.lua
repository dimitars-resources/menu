fx_version 'cerulean'
game 'gta5'

version '0.0.4'
description 'Item menu for FiveM'
author 'Dimitar'

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/app.js',
    'web/styles/*.css',
    'web/locales.json'
}

shared_scripts {
    'config.lua',
    'menu.lua',
    '@es_extended/imports.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua'
}