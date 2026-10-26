export const SPOTIFY_ARTIST_ID = '0cpL1ooyiyxpJ4KRz8ILWW';
export const SPOTIFY_ARTIST_URL = `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}?si=xMjRsQ7PTdadF9e4FRyHrA`;

export const YOUTUBE_URL = 'https://www.youtube.com/channel/UCK4Jk9WTq1hlpt5s6nWnuZA';

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

// Seed for the admin-managed settings (see src/lib/content.js).
export const settings = {
    // Merch is unpublished: the STORE link is hidden and /store stays out of
    // search until this is switched on from /admin/products.
    showStore: false,
}

// Feeds the mono info strip at the bottom of the landing page. Editable from
// /admin/album.
export const album = {
    title: 'hehemonia',
    status: 'OUT now',
}
