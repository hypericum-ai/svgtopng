const { convert } = require("convert-svg-to-png");
const express = require("express");
const fs = require("fs");
const { marked } = require("marked");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/convert", async (req, res) => {
  console.log(req.body);
  const defaultWidth = 100;
  const defaultHeight = 100;
  let width = parseInt(req.body["width"], 10);
  let height = parseInt(req.body["height"], 10);

  if (isNaN(width)) {
    width = defaultWidth;
  }
  if (isNaN(height)) {
    height = defaultHeight;
  }

  const options = { width, height };

  try {
    const png = await convert(req.body["name"], options);
    res.set("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed", err);
  }
});

app.post("/colors", async (req, res) => {
  console.log(req.body);
  const { spawn } = require("child_process");

  const pythonProcess = spawn("python3", [
    "colors.py",
    req.body["colors"] ?? "pastel",
    req.body["n_colors"] ?? 10,
    req.body["desat"] ?? 1.0,
  ]);

  let output = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data}`);
    res.status(500).send(`Color resolution failed: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.status(200).send(output);
      console.log("Color resolution returned:", output);
    } else {
      res.status(500).send(`Python process exited with code ${code}`);
    }
  });
});

app.get("/", (req, res) => {
  try {
    const md = fs.readFileSync("README.md", "utf8");
    const html = marked(md);
    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load README.md");
  }
});

app.post("/send-email", async (req, res) => {

  console.log("###Received contact form submission:", req.body);
  const { name, email, company, message,to_email } = req.body;
  try {

     const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    
    // email content
    const mailOptions = {
      from: `Ezio Contact Form <${process.env.GMAIL_USER}>`,
      to: to_email,
      subject: "New Ezio Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Company: ${company}
        Message: ${message || "(none)"}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(port);
