fx_version 'cerulean'
game 'gta5'

version '1.0'
description 'Admin menu for FiveM'
author 'Dimitar'

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/app.js',
    'web/styles/*.css'
}

shared_scripts {
    'config.lua',
    'menu.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua'
}