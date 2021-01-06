
# @lumx/icons migration from @mdi v4 to v5

Starting with LumX v1, the @lumx/icons lib now uses material design icon v5.
To ease the migration, we managed to alias old icon names to new icon names when possible.

However, some icons could not be aliases and seem to be very uncommon so can still encounter breaking change when
updating to LumX v1.

The list of deleted icons: `square-inc-cash`, `behance`, `slackware`, `quicktime`, `shopify`, `strava`, `houzz`, `glassdoor`,
`beats`, `venmo`, `etsy`, `dribbble-box`, `accusoft`, `lyft`, `mixcloud`, `paypal`, `language-python-text`,
`pinterest-box`, `wunderlist`, `vk-box`, `vk-circle`, `yelp`, `adchoices`, `mixer`, `tumblr-box`, `tumblr`, `uber`,
`google-adwords`, `basecamp`, `google-physical-web`, `medium`, `meetup`, `flickr`, `mail-ru`, `houzz-box`, `itunes`,
`instapaper`, `lastfm`, `amazon-drive`, `blackberry`, `dribbble`, `xing`, `xing-circle`, `steam-box`,
`mastodon-variant`, `maxcdn`, `flattr`, `eventbrite`, `xda`, `google-pages`, `disqus-outline`,
`android-head`, `pocket`, `periscope`, `xing-box`, `foursquare`

The script used to generate the SCSS and JS icon aliases from V4 to V5: [mdi-v4-to-v5.js](https://gist.github.com/gcornut/5ffa16f1d09d00eedad1c9ab92c26d59)