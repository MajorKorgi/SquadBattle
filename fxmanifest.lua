fx_version 'cerulean'
game 'gta5'

author 'Korgron'
description 'SquadBattle'

version '0.1.11'

client_scripts {
    'core/main_sh.js',
    'config/languages/*.js',
    'core/main_c.js',
    'core/client/*.js',
}

server_scripts { 
    'core/main_sh.js',
    'config/languages/*.js',
    'core/main_s.js',
    'core/server/classes/*.js',
    'core/server/*.js',
}

dependencys {
    'webpack',
    'yarn'
}

webpack_config 'webpack.config.js'