const User = require('../Models/newUser')
const Estate = require('../Models/estate')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const SendEmail = require('../Controllers/EmailController');

let bucket;
mongoose.connection.on("open", () => {
    console.log('COONECTION RUNNING')
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
})

module.exports = {
    defaultRoute: async (req, res) => {
        try {
            res.send(`Welcome to My Clinic Backend`);
        } catch (error) {
            res.status(500).send(error)
        }
    },
    addUser: async (req, res) => {
        try {
            const payload = { ...req.body };
            console.log("Data", payload)
            const existingUser = await User.findOne({ email: payload.email });
            if (existingUser) {
                return res.status(201).send("User already exist")
            }
            const hashedPassword = await bcrypt.hash(payload.password, 10)

            // Sending Email
            req.body = {
                to: req.body.email, // list of receivers
                subject: "New User Account created.", // Subject line
                text: `Welcome to : REAL ESTATE APPLICATION`, // plain text body
                html: `<h2>Good day</h2>
                <p>Your accounct with <span style="color:crimson">REAL ESTATE</span> has been created</p>
                <p>Username: ${req.body.email}</p>
                <p>Password: ${req.body.password}</p>`

            }
            SendEmail.send_email(req, res);

            payload.password = hashedPassword
            const newUser = new User(payload);
            const result = await newUser.save();
            res.status(201).send(result)



        } catch (error) {
            res.status(500).send(error)
            console.log("Error sending user", error)
        }
    },

    userLogin: async (req, res) => {
        try {
            const payload = { ...req.body }
            const existingUser = await User.findOne({ email: payload.email });
            if (!existingUser) {
                return res.status(404).send("User not Found")
            }
            const match = await bcrypt.compare(payload.password, existingUser.password)
            if (!match) {
                return res.status(404).send("Invalid password")
            }

            res.send(existingUser);


        } catch (error) {
            res.status(500).send(error)
        }

    },
    addEstate: async (req, res) => {
        try {
            const payload = { ...req.body };
            const newMedication = new Estate(payload)
            const result = await newMedication.save()
            res.status(201).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getEstates: async (req, res) => {
        try {
            const result = await Estate.find();
            res.status(200).send(result);
        } catch (error) {
            console.error("Error fetching Estates:", error);
            res.status(500).send({ error: "An error occurred while fetching Estates." });
        }
    },

    updateEstate: async (req, res) => {
        const options = { upsert: true };
        const filter = { ...req.params }
        try {
            const result = await Estate.updateOne(filter, req.body, options);

            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error);
        }
    },
    deleteEstate: async (req, res) => {
        try {
            const { _id } = req.params;
            const deletedItem = await Estate.findByIdAndDelete(_id);
            if (!deletedItem) {
                return res.status(404).send("Medication not found")
            }

            res.status(200).send(deletedItem)


        } catch (error) {
            res.status(500).send(error)
        }
    },
}