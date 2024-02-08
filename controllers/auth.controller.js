const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Trader = require("../models/Trader.model");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const ScratchCard = require("../models/ScratchCard.model");
require("dotenv").config();

exports.createUser = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const img = req.file ? req.file.path : "images/defaultProfile.png";

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
          user,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.validateTrader = async (req, res) => {
  try {
    let traderId = req.params.id;

    if (!traderId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const trader = await Trader.findByPk(traderId);
    if (!trader) {
      return res.status(400).json({ error: "Invalid Trader Id" });
    }

    jwt.sign(
      {
        traderId,
      },
      process.env.JWT_SECRET_KEY,
      function (err, token) {
        console.log(token);
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(200).json({
          message: "Valid Trader",
          token,
          trader,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
exports.email = async (req, res) => {
  try {
    let traderId = req.body.id;
    let isMegaEmail = req.query.isMegaEmail;
    let trader = await Trader.findOne({
      where: {
        id: traderId,
      },
      include: [
        {
          model: ScratchCard,
          where: {
            isMega: false,
            status: "pending",
          },
        },
      ],
    });

    if (!trader || trader.ScratchCards.length === 0) {
      return res
        .status(400)
        .json({ error: "No Scratchcards are assigned to this Trader" });
    }

    let html;
    if (!isMegaEmail) {
      html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Woodcrrests | Email</title>
        </head>
        <style>
        @font-face {
          font-family: 'Rhino6';
          src: url(data:application/font-ttf;base64
        }
        
        @font-face {
          font-family: 'Montserrat-SemiBold';
          src: url(data:application/font-otf;base64, [BASE64_ENCODED_DATA]) format('opentype');
        }
        
        </style>
        <body
          style="
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
          "
        >
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
            style="
              width: 100%;
              max-width: 1280px;
              overflow: hidden;
              height: min-content;
              margin-inline: auto;
              border: 1px solid #000000;
              background-image: url(https://woodcrrests.netlify.app/assets/imgs/background_3.jpg);
            "
          >
            <tr>
              <td style="padding: 10px">
                <img
                  src="https://woodcrrests-new.netlify.app/assets/imgs/woodcrrests_logo_3.png"
                  style="
                    display: block;
                    margin: 0 auto;
                    width: 100px;
                    max-width: 100%;
                  "
                />
                <h2
                  style="
                    margin-block: 5px;
                    color: #000000;
                    font-family: 'Montserrat-SemiBold', 'Montserrat', sans-serif;
                  "
                >
                  ${trader.traderName} <br />
                  Thank you for participating In!
                </h2>
                <img
                  src="https://woodcrrests-new.netlify.app/assets/imgs/gift-box-image.png"
                  alt="Gift Wrapper"
                  style="display: block; margin: 5px auto; width: min(250px, 100%)"
                  class="banner"
                />
                <h2
                  style="
                    margin-block: 10px;
                    color: #000000;
                    font-family: 'Rhino6', sans-serif;
                  "
                >
                  Congratulations!
                </h2>
                <h3
                  style="
                    margin-block: 5px;
                    color: #000000;
                    text-transform: uppercase;
                    font-family: 'Montserrat-SemiBold', 'Montserrat', sans-serif;
                  "
                >
                  You have won ${trader.ScratchCards.length} scratch cards.
                </h3>
                <a
                  href="https://heydayrewards.com/trader/${traderId}>"
                  style="
                    display: inline-block;
                    padding: 10px 20px;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 10px;
                    background-color: #e12f29;
                    font-family: 'Montserrat-SemiBold', 'Montserrat', sans-serif;
                  "
                >
                  Redeem Now
                </a>
              </td>
            </tr>
          </table>
        </body>
      </html>
      
      `;
    } else {
      // send mega scratchcard/jackpot email
    }

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
      to: "ujjwal.saxena@mindrops.com",
      subject: "Congrats! You have won some rewards!",
      html,
    });

    console.log("Message Sent:", info);

    res.status(200).json({
      message: "Email Sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
