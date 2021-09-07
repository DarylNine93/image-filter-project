import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;


    // Use the body parser middleware for post requests
    app.use(bodyParser.json());



    // RESTFUL ENDPOINT TO FILTER AN IMAGE FROM A PUBLIC URL

    app.get("/filteredimage/", (req: Request, res: Response) => {
        // Getting image url from query parameter
        const { image_url } = req.query

        if (!image_url) {
            return res.status(400).send("Bad Request")
        }
        // Filtering the image and returning the filtered image path
        filterImageFromURL(image_url).then((data) => {
            const filtered_image_url = data
            // Creating an array with the filtered image path for delete purpose
            let local_files = [filtered_image_url]
            // Sending filtered image to response
            res.status(200).sendFile(filtered_image_url)
            //deleting the filtered image from server when finish
            res.on('finish', () => {
                deleteLocalFiles(local_files)
            })
        }
            , (error) => {
                console.log("Something went wrong when filtering")
            })


    });


    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();