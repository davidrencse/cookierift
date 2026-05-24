import { createApp } from './app';

const port = Number(process.env.PORT || 4000);
const app = createApp();

app.listen(port, function onListen() {
  console.log(`CookieRift backend listening on port ${port}`);
});
