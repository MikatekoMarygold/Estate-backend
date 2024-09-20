


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
            const existingUser = await Admin.findOne({ email: payload.email });
            if (existingUser) {
                return res.status(201).send("User already exist")
            }
            const hashedPassword = await bcrypt.hash(payload.password, 10)

            // Sending Email
            req.body = {
                to: req.body.email, // list of receivers
                subject: "New User Account created.", // Subject line
                text: `Welcome to : REAL ESTATE APPLICATION`, // plain text body
                html: `<h2>Good day <span style="color:green">${req.body.firstName}</span></h2>
                <p>Your accounct with <span style="color:crimson">REAL ESTATE</span> has been created</p>
                <p>Username: ${req.body.email}</p>
                <p>Password: ${req.body.password}</p>`

            }
            SendEmail.send_email(req, res);

            payload.password = hashedPassword
            const newUser = new Admin(payload);
            const result = await newUser.save();
            res.status(201).send(result)



        } catch (error) {
            res.status(500).send(error)
        }
    },
}