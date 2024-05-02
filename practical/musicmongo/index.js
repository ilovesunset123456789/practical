const express = require('express')
const mongoose = require('mongoose')

const app = express();

const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });


const schema = new mongoose.Schema({
    name: String,
    film: String,
    md: String,
    singer: String,
    actor: String,
    actress: String
});
app.use(express.static('public'));

const song = mongoose.model('song', schema, 'song_details');


app.use(express.json());

// const records = [
//     {
//         name: 's1', film: 'f1', md: 'm1', singer: 'sin1'
//     },
//     {
//         name: 's2', film: 'f2', md: 'm2', singer: 'sin2'
//     },
//     {
//         name: 's3', film: 'f3', md: 'm3', singer: 'sin3'
//     },
//     {
//         name: 's4', film: 'f4', md: 'm4', singer: 'sin4'
//     },
//     {
//         name: 's5', film: 'f5', md: 'm5', singer: 'sin5'
//     }
// ];

// song.insertMany(records)
//     .then(() => console.log("records added successfully"))
//     .catch(err => console.error('error adding records', error));




app.post('/songs', async (req, res) => {
    try {
        const songs = req.body;
        const result = await song.insertMany(songs);
        console.log('songs added successfully');
    }
    catch (error) {
        console.error("error while inserting songs");
    }
});

app.get('/getall', async (req, res) => {
    try {
        const result = await song.find();

        // Construct HTML string to display song data
        const htmlResponse = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Song List</title>
                            </head>
                            <body>
                            <h1>Song List</h1>
                            <table border="1">
                                <tr>
                                    <th>Name</th>
                                    <th>Film</th>
                                    <th>Music Director</th>
                                    <th>Singer</th>
                                </tr>
                                ${result.map(song => `
                                    <tr>
                                        <td>${song.name}</td>
                                        <td>${song.film}</td>
                                        <td>${song.md}</td>
                                        <td>${song.singer}</td>
                                    </tr>
                                `).join('')}
                            </table>
                            </body>
                            </html>`;

        // Send the HTML response
        res.send(htmlResponse);

        console.log('Song get success');
    } catch (error) {
        console.error('Song get failed:', error);
        // Handle error and send appropriate response if needed
        res.status(500).send('Failed to retrieve songs');
    }
});


app.get('/getcount', async (req, res) => {
    try {
        const result = await song.countDocuments();
        const htmlResponse = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>There are total ${result} documents</p>
        </body>
        </html>`
        res.send(htmlResponse);
        console.log('count docs success');
    }
    catch (error) {
        console.error('errro fetching count', error);
    }
});

app.get('/songs/musicdirector/:musicdir', async (req, res) => {
    try {
        const reqdir = req.params.musicdir;
        const result = await song.find({ md: reqdir });
        console.log("result", result);
        htmlResponse = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
           <h2>Songs sung by music director:${reqdir}</h2>
           <table border="1">
                                <tr>
                                    <th>Name</th>
                                    <th>Film</th>
                                    <th>Music Director</th>
                                    
                                </tr>
                                ${result.map(song => `
                                    <tr>
                                        <td>${song.name}</td>
                                        <td>${song.film}</td>
                                        
                                        <td>${song.singer}</td>
                                    </tr>
                                `).join('')}
                            </table>
        </body>
        </html>`

        res.send(htmlResponse);
    }
    catch (error) {
        console.error('error finding director', error);
    }
});

app.get('/songs/musicdirector/:musicdir/singer/:sin', async (req, res) => {
    try {
        const reqdir = req.params.musicdir;
        const reqsin = req.params.sin;
        const result = await song.find({ md: reqdir, singer: reqsin });

        htmlResponse = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
           <h2>Songs sung by music director:${reqdir} and singer name:${reqsin}</h2>
           <table border="1">
            <tr>
                <th>Song</th>
                <th>Film</th>
            </tr>
            ${result.map(song => `
                <tr>
                    <td>${song.name}</td>
                    <td>${song.film}</td>
                </tr>
            `).join('')}
           </table>
        </body>
        </html>
        `
        res.send(htmlResponse);


    }

    catch (error) {
        console.error('error fecthing songs', error);
    }
});

app.delete('/songs/del/:song', async (req, res) => {
    try {
        const songName = req.params.song; // Corrected variable name
        const result = await song.findOneAndDelete({ name: songName }); // Corrected variable name

        if (!result)
            return res.status(404).json({ error: 'Song not found' });

        res.json({ message: 'Song deleted successfully', deletedSong: result }); // Changed deletedSong to result
    }
    catch (error) {
        // If an error occurs during the deletion process, return a 500 response
        console.error('Error deleting song:', error); // Corrected variable name
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/songs/addsongs', async (req, res) => {
    try {
        const { name, film, md, singer } = req.body;

        const newsong = new song({ name, film, md, singer });
        await newsong.save();
        res.json({ message: 'Favorite song added successfully', newsong });
    }

    catch (error) {
        // If an error occurs during the addition process, return a 500 response
        console.error('Error adding favorite song:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/songs/singer/:sin/film/:fm', async (req, res) => {
    try {
        reqsin = req.params.sin;
        reqfm = req.params.fm;
        const result = await song.find({ singer: reqsin, film: reqfm });
        htmlResponse = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h2>Details about song sung by singer ${reqsin} and in film ${reqfm}</h2>
            <table border="1"><tr>
                <th>
                    Song name
                </th>
                <th>
                    music director
                </th>
            </tr>
        
            ${result.map(song => `
               <tr>
                <td>${song.name}</td>
                <td>${song.md}</td>
               </tr> `).join('')}
        </table>
        </body>
        </html>`


    }
    catch (error) {
        console.error('error getting songs', error);
    }
});


async function updatecollection(actor, actress, songname) {



    const songtoupdate = await song.findOne({ name: songname });
    if (songtoupdate) {
        await songtoupdate.updateOne({ $set: { actor: actor, actress: actress } });
        console.log("nameadded successfully")
    }
    else
        console.log(`Song "${songname}" not found.`);


}
// updatecollection("a1", "ac1", "s1");
// updatecollection("a2", "ac2", "s2");
// updatecollection("a3", "ac3", "s3");
// updatecollection("a5", "ac5", "s5");
// updatecollection("a6", "ac6", "s6");

app.get('/songs/getalldata', async (req, res) => {
    try {
        // Retrieve all documents from the collection
        const result = await song.find();

        // Count the total number of documents
        const count = await song.countDocuments();

        // Render an HTML page with the data in tabular format
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>All Songs</title>
            </head>
            <body>
                <h1>All Songs (${count} total)</h1>
                <table border="1">
                    <tr>
                        <th>Name</th>
                        <th>Film</th>
                        <th>Music Director</th>
                        <th>Singer</th>
                        <th>Actor</th>
                        <th>Actress</th>
                    </tr>
                    ${result.map(song => `
                        <tr>
                            <td>${song.name}</td>
                            <td>${song.film}</td>
                            <td>${song.md}</td>
                            <td>${song.singer}</td>
                            <td>${song.actor}</td>
                            <td>${song.actress}</td>


                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error retrieving all songs:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});