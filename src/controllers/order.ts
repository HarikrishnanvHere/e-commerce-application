import { Request, Response } from "express";
import Razorpay from "razorpay";
import { prismaClient } from "..";
import { Order } from "@prisma/client";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../secret";

const key_id_ = RAZORPAY_KEY_ID;
const key_secret_ = RAZORPAY_KEY_SECRET;

export const createOrder = async (req: Request, res: Response) => {
  try {
    //    console.log(key_id_,key_secret_);
    const rzp = new Razorpay({
      key_id: key_id_!,
      key_secret: key_secret_,
    });

    const amount = req.user.total;
    console.log(amount);
    rzp.orders.create({ amount: amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.log("jjjjjjjjjjj", err);
        throw new Error(JSON.stringify(err));
      }
      const newOrder: Order = await prismaClient.order.create({
        data: {
          userId: req.user.id,
          order_id: order.id,
          status: "PENDING",
          payment_id: "default",
        },
      });
      res.json(order.id);
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "order not created" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { order_id, payment_id } = req.body;
    const order = await prismaClient.order.findFirst({ where: { order_id: order_id } });
    if (payment_id) {
      await prismaClient.order.update({
        where: {
          id: order?.id,
        },
        data: {
          payment_id: payment_id,
          status: "SUCCESS",
        },
      });
      const data = await prismaClient.cartItem.findMany({
        where: {
          userId: req.user.id,
        },
      });
      for (let i of data) {
        const { userId, productId, quantity } = i;
        await prismaClient.orderedItem.create({
          data: {
            userId: userId,
            productId: productId,
            quantity: quantity,
          },
        });
      }
      await prismaClient.cartItem.deleteMany({
        where: {
          userId: req.user.id,
        },
      });
      await prismaClient.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          total: 0,
        },
      });
      res.json({ message: "Order Placed Successfully!" });
    } else {
      await prismaClient.order.update({
        where: {
          id: order?.id,
        },
        data: {
          status: "FAILED",
        },
      });
      res.json({ message: "transaction failed!" });
    }
  } catch (err) {
    res.status(403).json({ success: false, message: "Transaction failed!" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const orderedItems = await prismaClient.orderedItem.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orderedItems);
};
