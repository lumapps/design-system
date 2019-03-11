# LumApps Design System (LumX)

## How to run examples

Run:

```bash
yarn install
# Or
npm install
```

This will install `http-server`, a simple HTTP server.
You can also install it globally:

```bash
yarn global add http-server
# Or
npm install -g http-server
```

Then, simply run:

```bash
yarn serve:<angularjs|react>
# Or
npm run serve:<angularjs|react>
```

Or start your globally installed `http-server`:

```bash
http-server -p 8080 <angularjs|react> -s -o --cors -c-1
```

Your browser should open automatically, otherwise, you can go to [http://localhost:8080](http://localhost:8080).
Then, click on the `examples` directory in the showing listing and you should land on the example page.
