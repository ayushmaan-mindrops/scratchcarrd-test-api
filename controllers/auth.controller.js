const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Trader = require("../models/Trader.model");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const ScratchCard = require("../models/ScratchCard.model");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

exports.createUser = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const img = req.file ? req.file.path : "/images/defaultProfile.png";

    if (!username || !password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      img,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        img: newUser.img,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Username or email does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        img: user.img,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      function (err, token) {
        console.log(token);
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({
          message: "Login Successfull",
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// const template = `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Woodcrrests | Email</title>
// </head>
// <body style="font-family: Arial, sans-serif; text-align: center;  margin: 0; padding: 0;">

//     <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" max-width="680px" style="margin: 0px auto; border: 1px solid #ffffff; border-radius: 5px; background-image: url(https://woodcrrests.netlify.app/assets/imgs/background_3.jpg);">
//       <tr>
//         <td style="padding: 20px;">
//           <img src="https://woodcrrests.netlify.app/assets/imgs/woodcrrests_logo_3.png" alt="Your Logo" style="display: block; margin: 0 auto;">
//           <h2 style="margin-top: 10px; color: #000000;">M/S: K.R.G & CO</h2>
//           <h2 style="color: #000000; text-transform: uppercase;">Thank you for participating In!</h2>
//           <img src="https://woodcrrests.netlify.app/assets/imgs/gift-box-image.png" alt="Gift Wrapper" style="display: block; margin: 20px auto;">
//           <h2 style="color: #000000;">Congratulations!</h2>
//           <h3 style="color: #000000; text-transform: uppercase;">You have won 3 scratch cards.</h3>
//           <a href="#" style="display: inline-block; padding: 10px 20px; color: #ffffff; text-decoration: none; border-radius: 18px; background-color: #E12F29;">Redeem Now</a>
//         </td>
//       </tr>
//     </table>
  
//   </body>
// </html>`;

exports.email = async (req, res) => {
  try {
    let traderId = req.body.id;
    let trader = await Trader.findOne({
      where: {
        id: traderId,
      },
      include: [ScratchCard],
    });

    if (!trader) {
      return res.status(400).json({ error: "Trader not found" });
    }

    if (trader.ScratchCards.length == 0) {
      return res
        .status(400)
        .json({ error: "No Scratchcards are assigned to this Trader" });
    }

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Woodcrrests | Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center;  margin: 0; padding: 0;">
    
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" max-width="680px" style="margin: 0px auto; border: 1px solid #ffffff; border-radius: 5px; background-image: url(https://woodcrrests.netlify.app/assets/imgs/background_3.jpg);">
          <tr>
            <td style="padding: 20px;">
              <img src="https://woodcrrests.netlify.app/assets/imgs/woodcrrests_logo_3.png" alt="Your Logo" style="display: block; margin: 0 auto;">
              <h2 style="margin-top: 10px; color: #000000;">${trader.traderName}</h2>
              <h2 style="color: #000000; text-transform: uppercase;">Thank you for participating In!</h2>
              <img src="https://woodcrrests.netlify.app/assets/imgs/gift-box-image.png" alt="Gift Wrapper" style="display: block; margin: 20px auto;">
              <h2 style="color: #000000;">Congratulations!</h2>
              <h3 style="color: #000000; text-transform: uppercase;">You have won ${trader.ScratchCards.length} scratch cards.</h3>
              <a href="#" style="display: inline-block; padding: 10px 20px; color: #ffffff; text-decoration: none; border-radius: 18px; background-color: #E12F29;">Redeem Now</a>
            </td>
          </tr>
        </table>
      
      </body>
    </html>`;
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ujjwalsaxena774@gmail.com",
        pass: "fcbw tzoj crya tyqk",
      },
    });

    const info = await transporter.sendMail({
      from: "ujjwalsaxena774@gmail.com",
      // to: "ujjwalsaxena774@yahoo.com",
      to: trader.email,
      subject: "Congrats! You have won some rewards!",
      html,
    });

    console.log("Message Sent:", info);

    res.status(200).json({
      message: "Email Sent",
    });
  } catch (error) {
    console.log(error);
  }
};
