import User from "../../../model/User";
import nodemailer from "nodemailer";
import smtpPool from "nodemailer-smtp-pool";

export default {
  Mutation: {
    checkSecretCode: async (_, args) => {
      const { email, code } = args;

      try {
        const tryUser = await User.findOne({ email });

        if (tryUser.secretCode === code) {
          await User.updateOne(
            { email },
            {
              $set: { secretCode: `` },
            }
          );

          return {
            result: true,
            objectId: tryUser._id,
          };
        } else {
          return {
            result: false,
            objectId: "-",
          };
        }
      } catch (e) {
        console.log(e);
        return {
          result: false,
          objectId: "-",
        };
      }
    },

    registUser: async (_, args) => {
      const {
        name,
        email,
        nickName,
        mobile,
        zoneCode,
        address,
        detailAddress,
      } = args;

      try {
        const prevResult = await User.find({ email });

        if (prevResult.length !== 0) {
          console.log("Exist User Email Yet...!");
          return false;
        } else {
          const result = await User.create({
            name,
            email,
            nickName,
            mobile,
            zoneCode,
            address,
            detailAddress,
          });

          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    tryLogin: async (_, args) => {
      const { email } = args;

      try {
        const exist = await User.find({ email });

        if (exist.length > 0) {
          const randomCode = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];

          const code =
            randomCode[Math.floor(Math.random() * 10)] +
            randomCode[Math.floor(Math.random() * 10)] +
            randomCode[Math.floor(Math.random() * 10)] +
            randomCode[Math.floor(Math.random() * 10)];

          const smtpTransport = nodemailer.createTransport(
            smtpPool({
              service: "Gmail",
              host: "localhost",
              port: "465",
              tls: {
                rejectUnauthorize: false,
              },

              auth: {
                user: "4leaf.ysh@gmail.com",
                pass: "nvpdqofovkebects",
              },
              maxConnections: 5,
              maxMessages: 10,
            })
          );

          const mailOpt = {
            from: "4leaf.ysh@gmail.com",
            to: email,
            subject: "🔐인증코드 전송 [https://www.sopy.com]",
            html: `인증코드는 ${code} 입니다.`,
          };

          await smtpTransport.sendMail(mailOpt, function (err, info) {
            if (err) {
              console.error("Send Mail error : ", err);
              smtpTransport.close();
            } else {
              console.log("Message sent : ", info);
              smtpTransport.close();
            }
          });

          const updateResult = await User.updateOne(
            { email },
            {
              $set: {
                secretCode: code,
              },
            }
          );
        } else {
          return false;
        }

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
