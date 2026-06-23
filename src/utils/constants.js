export const SPOTIFY_ARTIST_ID = '0cpL1ooyiyxpJ4KRz8ILWW';
export const SPOTIFY_ARTIST_URL = `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}?si=xMjRsQ7PTdadF9e4FRyHrA`;

export const YOUTUBE_URL = 'https://www.youtube.com/channel/UCK4Jk9WTq1hlpt5s6nWnuZA';

// Telegram channel — release / drop notifications ("notify me" CTA).
export const NOTIFY_URL = 'https://t.me/+TXM2bH5v0945MWNi';

// Where "Buy" buttons in the catalog point. Catalog-only store: orders are
// taken over this channel (no on-site checkout). Update to a real store URL
// when one exists.
export const ORDER_URL = 'https://t.me/surrealenko';

export const mainLinks = [
    {name: 'STORE', url: '/store', internal: true},
    {name: 'SPOTIFY', url: SPOTIFY_ARTIST_URL},
    {name: 'APPLE', url: 'https://music.apple.com/us/artist/surreal/1631369195'},
    {name: 'YOUTUBE', url: YOUTUBE_URL},
    // {name: 'INSTAGRAM', url: 'https://www.instagram.com/surreal4you/'},
]

export const sideLinks = [
    {name: 'INSTAGRAM', url: 'https://www.instagram.com/surrealovych/'},
    {name: 'TIKTOK', url: 'https://www.tiktok.com/@surrealovych'},
    {name: 'TELEGRAM', url: 'https://t.me/+TXM2bH5v0945MWNi'},
    {name: 'OTHER', url: 'https://t.me/surrealenko'},
]

// Flip to `true` on release day (03.07) to show the album announcement on the
// landing page again.
export const showAlbumAnnounce = false;

export const album = {
    title: 'hehemonia',
    status: 'OUT 03.07',
    releaseDate: '2026-07-03', // 03.07
    cover: '/hehemonia.png',
    listenUrl: SPOTIFY_ARTIST_URL,
}
