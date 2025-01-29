import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "..";
import bcrypt from "bcrypt";

export const sendMail = async (req: Request, res: Response) => {
  const { toMail } = req.body;
  const uId: string = uuidv4();

  const user = await prismaClient.user.findFirst({
    where: {
      email: toMail,
    },
  });

  if (!user) {
    res.status(400).json({ message: "User Not Found" });
  }

  const userId = user!.id;

  await prismaClient.passwordRequest.create({
    data: {
      id: uId,
      userId: userId,
      isActive: true,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "harikrishnantestmail@gmail.com",
      pass: "yghi kkom genq odvc",
    },
  });
  const mailOptions = {
    from: "harikrishnantestmail@gmail.com",
    to: toMail,
    subject: "Reset Password",
    text: "Click on this link to Reset your Password: ",
    html: `<a href="http://localhost:3000/api/request/${uId}">reset password</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      res.json(info.response);
    }
  });
};

export const sendUI = async (req: Request, res: Response) => {
  //console.log("API hit successful!");
  const requestId = req.params.id;
  const request = await prismaClient.passwordRequest.findFirst({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    res.json({ message: "Something Went Wrong" });
  }
  if (request!.isActive === true) {
    await prismaClient.passwordRequest.update({
      where: {
        id: requestId,
      },
      data: {
        isActive: false,
      },
    });
    res.status(200).send(
      `<html>
          <script>
              function formsubmitted(e){
                  e.preventDefault();
                  console.log('called')
              }
          </script>

          <form action="/api/request/update/${requestId}" method="get">
              <label for="newpassword">Enter New password</label>
              <input name="newPassword" type="password" required></input>
              <button>reset password</button>
          </form>
      </html>`
    );
    res.end();
  } else {
    res.status(200).send(
      `<html>
              <h1>Link Expired</h1>
          </html>`
    );
    res.end();
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  //console.log("2nd API hit success!", req.params.id, req.query);
  const requestId = req.params.id;
  const newPassword: string = req.query.newPassword as string;
  //console.log(newPassword);

  const request = await prismaClient.passwordRequest.findFirst({
    where: {
      id: requestId,
    },
  });
  const user = await prismaClient.user.findFirst({ where: { id: request!.userId } });

  // encrypting password

  const hashrounds = 10;

  bcrypt.hash(newPassword, hashrounds, async (err, hash) => {
    if (err) {
      res.send(`<html>
                      <h1>Something went wrong!</h1>
                  </html>`);
      res.end();
    }
    await prismaClient.user.update({
      where: { id: request!.userId },
      data: {
        password: hash,
      },
    });
  });
  res.send(`<h1>Password Updated Successfully</h1>`);
};
