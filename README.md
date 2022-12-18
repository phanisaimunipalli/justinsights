# Just Insights

- JustInsights is an amazing web application that can take a CSV file consisting of customers credit and debit transactions, and then analyzes and calculates the different types of balances like minimumBalance, maximum and endingBalance.

## Table of contents

- [Just Insights](#justinsights)
  - [Table of contents](#table-of-contents)
  - [Points to Note](#points-to-note)
  - [How to Use?](#how-to-use?)
  - [What is the Tech Stack?](#what-is-the-tech-stack?)
  - [How to setup in local?](#how-to-setup-in-local?)
  - [Screenshots](#screenshots)
  - [Contact](#contact)

## How to Use?

- Upload a [CSV](/data.csv) file from the React UI and then /upload POST API will be called in backend (server.js).
- If there is no issue, this file is stored in public/uploads/ or else an error message is throwed back to UI.
- There is a progress-bar included to track the upload percentage along with a message status that can be dismissable.

## Points To Note

- Please remove the file in local from "/public/uploads/" or rename it before uploading the same file again.
- You can also use the below cURL to consume this API from other program or postman

```
curl --location --request POST 'http://localhost:5000/upload' \
--header 'Content-Type: multipart/form-data' \
--form 'file=@"/FILE_PATH/data.csv"'
```

- Please refer to your backend console to check for the console messages and error logs.
- You can always uncomment the console.log statements to view the log messages.

## What is the Tech Stack?

- [Node.js v14](https://nodejs.org/) javascript runtime using the [Chrome V8 engine](https://v8.dev/)
- [Express middleware v4](https://expressjs.com/)
- [Express fileupload middleware v1](https://www.npmjs.com/package/express-fileupload)
- [React v16](https://reactjs.org/) Frontend javascript library.
- [Bootstrap front-end component library](https://getbootstrap.com/)
- [Font Awesome icons](https://fontawesome.com/)
- [React Hooks](https://reactjs.org/docs/hooks-overview.html#state-hook)

## How to setup in local?

- `npm run dev` runs the front and backend simultaneously in development mode. It will open [http://localhost:3000](http://localhost:3000) to view in browser. Any code changes will automatically reload the browser.

## Screenshots

![Example screenshot](./img/screen-shot.png).

## Contact

- Repo created by [Phani Sai Ram Munipalli](https://github.com/phanisaimunipalli)
- Reach out to me on: [LinkedIn](https://www.linkedin.com/in/iamphanisairam/)
