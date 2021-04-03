# yaMUN

- [jackharrhy](https://github.com/jackharrhy)
- [Mudkip](https://github.com/mudkip)
- [AidanLanger](https://github.com/aidanlanger)

## Running the Application

- Ensure you are using a modern node version, we test using Node v15.
- Run a mongodb server, by default the application will attempt to connect locally without any authentication.

### Backend

```sh
cd /path/to/yaMUN
npm install
npm run start
```

Note: on first startup, if there is no data, it will attempt to scrape _all_ of the required data, this might take upwards of five minutes, but once its done it won't need doing again.

### Frontend

```sh
cd /path/to/yaMUN
cd ./src/frontend
npm install
npm run dev
```

Open up `http://localhost:3000/`, the app should now be running!

If you are on the find courses screen, and there is no data, there likely is an issue.

