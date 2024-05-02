const express = require('express')
const mongoose = require('mongoose')

const app = express();


const PORT = process.env.PORT || 4000
mongoose.connect('mongodb://localhost:27017/ps11');


const schema = new mongoose.Schema({
    name: String,
    roll: Number,
    wad: Number,
    cc: Number,
    dsbda: Number
})
app.use(express.static('public'));

const std = mongoose.model('std', schema, 'studentmarks');

app.use(express.json())


const records = [
    { name: 'abhi', roll: 1, wad: 22, cc: 28, dsbda: 35 },
    { name: 'travis', roll: 2, wad: 28, cc: 35, dsbda: 70 },
    { name: 'aiden', roll: 3, wad: 15, cc: 26, dsbda: 35 },
    { name: 'nitish', roll: 4, wad: 45, cc: 32, dsbda: 30 },
    { name: 'samad', roll: 5, wad: 22, cc: 70, dsbda: 80 },
    { name: 'klassen', roll: 6, wad: 28, cc: 28, dsbda: 28 },
    { name: 'bhvui', roll: 7, wad: 30, cc: 36, dsbda: 50 },
    { name: 'pat', roll: 8, wad: 32, cc: 38, dsbda: 40 },
    { name: 'nattu', roll: 9, wad: 34, cc: 40, dsbda: 30 },
    { name: 'mayank', roll: 10, wad: 36, cc: 42, dsbda: 29 },
]

// std.insertMany(records).then(() => console.log("10 records added")).catch(err => console.error('error adding records', error));


app.get('/student/countndisplay', async (req, res) => {
    result = await std.countDocuments();
    data = await std.find();
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <p>There are total ${result} documents</p>
        <table border="1">
            <tr>
                <th>name</th>
                <th>rollno</th>
                <th>wad</th>
                <th>cc</th>
                <th>dsbda</th>
            </tr>
            ${data.map(std => `
            <tr>
                <td>${std.name}</td>
                <td>${std.roll}</td>
                <td>${std.wad}</td>
                <td>${std.cc}</td>
                <td>${std.dsbda}</td>
            </tr>`).join('')}
        </table>
    </body>
    </html>`);
})

app.get('/student/morethan20', async (req, res) => {
    const result = await std.find({ dsbda: { $gte: 50 } }, { name: 1, roll: 1, dsbda: 1 })
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <table border="1">
            <tr>
                <th>Rollno</th>
                <th>name</th>
                <th>marks</th>
            </tr>
            ${result.map(std =>
        `
            <tr>
                <td>${std.roll}</td>
                <td>${std.name}</td>
                <td>${std.dsbda}</td>
            </tr>`).join('')}
        </table>
    </body>
    </html>`)
})

app.get('/student/morethan25', async (req, res) => {
    const result = await std.find({ wad: { $gt: 25 }, dsbda: { $gt: 25 }, cc: { $gt: 25 } }, { name: 1, roll: 1, dsbda: 1, wad: 1, cc: 1 })
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <table border="1">
            <tr>
                <th>Name</th>
                <th>rollno</th>
                <th>dsbda</th>
                <th>wad</th>
                <th>cc</th>
            </tr>
            ${result.map(std =>
        `<tr>
                <td>${std.name}</td>
                <td>${std.roll}</td>
                <td>${std.dsbda}</td>
                <td>${std.wad}</td>
                <td>${std.cc}</td>
            </tr>
            `).join('')}
    
        </table>
    </body>
    </html>`)
});

app.get('/student/lessthan40', async (req, res) => {
    const result = await std.find({ wad: { $lt: 40 }, dsbda: { $lt: 40 } }, { name: 1, roll: 1, wad: 1, dsbda: 1 })
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <table border="1">
            <tr>
                <th>name</th>
                <th>rollno</th>
                <th>wad</th>
                <th>dsbda</th>
    
            </tr>
            ${result.map(std =>
        `<tr>
                    <td>${std.name}</td>
                    <td>${std.roll}</td>
                    <td>${std.wad}</td>
                    <td>${std.dsbda}</td>
                </tr>
                `).join('')}
        </table>
    </body>
    </html>`);
})

app.get('/student/getall', async (req, res) => {
    const result = await std.find();
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <p>The data of students is displayed below</p>
        <table border="1">
            <tr>
                <th>name</th>
                <th>roll</th>
                <th>wad</th>
                <th>cc</th>
                <th>dsbda</th>
            </tr>
            ${result.map(std =>
        `<tr>
                    <td>${std.name}</td>
                    <td>${std.roll}</td>
                    <td>${std.wad}</td>
                    <td>${std.cc}</td>
                    <td>${std.dsbda}</td>
                </tr>
                `).join('')}
        </table>
    </body>
    </html>`)
})


app.delete('/student/del/:rollno', async (req, res) => {
    const number = req.params.rollno;
    const result = await std.findOneAndDelete({ roll: number });
    if (!result)
        console.error('req student not present');

    console.log('student deleted successfully');
});

app.put('/student/update', async (req, res) => {
    try {
        // const {studentnames}=req.body;
        // const result=await std.updateMany({name:{$in:studentnames}},{$inc:{wad:10,cc:10,dsbda:10}})
        const result = await std.updateMany(
            { name: { $in: ["abhi", "Travis"] } }, // Filter criteria for specific student names
            { $inc: { wad: 10, cc: 10, dsbda: 10 } } // Update fields and their values
        );
        res.send(`${result.nModified} records updated successfully`);
    } catch (error) {
        console.error('Error updating records:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
});