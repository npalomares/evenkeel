<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'evenkeel');

/** MySQL database username */
define('DB_USER', 'evenkeel');

/** MySQL database password */
define('DB_PASSWORD', 'FmsEypqMZwew23zR');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '(Hdpo]o;3 jB%(~gS?8hmLS9B#:=59 &eS&e)SF)9a Iwjp?}W-6m%8Vp7Ghuy8`');
define('SECURE_AUTH_KEY',  '0QK6k,W<MoWm]-RE*)vgEGsh;dc |}>l=:y a7YHDp(o _%@Z[Nq3PUG}jawij{x');
define('LOGGED_IN_KEY',    'Y[)K{k|Ea9-BW)/(d_ )p|#WBs<*g(61v4TB:i5_Q7cK|r&W7=pGh?E2,uenQ#)(');
define('NONCE_KEY',        'nhtKV6jVx$m]ooms{`>5*G]I2.fQ>S~*4Z^O+!/]ltFH$=Z8Hl#lB,i`$D}/hD/V');
define('AUTH_SALT',        'ZEb;2=@xW .kUpO!*rI1a`aatWllK>2IX=0;+e/r!dDC%r9b%^n^_6q6620Kt$en');
define('SECURE_AUTH_SALT', 'R+Q]d=wh@Y8Wi{zs0-=-L>&`:5$9?]:R|P9*@Jm?)xo@$|?-0_WKf`N*]F^|-oyk');
define('LOGGED_IN_SALT',   'wi{%};j+jR2Rtwv>Ba3Z20&>O`04?/aS[@6VN|%eKk{|5Q%q/N,n+]jd*e|;dJ~;');
define('NONCE_SALT',       '/d?6d%)7(~s|(QtpXcd[Bt%=;ZMl&Nx>m1s{G1^F5A/5+30?0O>kABcd)`.aaLSc');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

