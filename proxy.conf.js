// Development server proxy, forwarding Mopidy's WebSocket and HTTP
// resources (e.g. local cover art) to a Mopidy server; set MOPIDY_URL
// to use a server other than http://localhost:6680.
const target = process.env.MOPIDY_URL || 'http://localhost:6680';

module.exports = {
  '/mopidy': { target, ws: true, changeOrigin: true },
  '/local': { target, changeOrigin: true },
};
