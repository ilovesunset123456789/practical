const express = require('express')

const app = express();

app.use(express.static('public'));



PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})