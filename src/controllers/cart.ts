import { Request, Response } from "express";
import { changeQuantitySchema, createCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = createCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (err) {
    throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }

  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      productId: validatedData.productId,
      userId: req.user.id,
    },
  });

  console.log(product);

  if (existingCartItem) {
    const updatedQuantity = existingCartItem.quantity + validatedData.quantity;
    const data = { quantity: updatedQuantity };
    const updatedProduct = await prismaClient.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: data,
    });
    const updatedTotal = await prismaClient.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        total: req.user.total + +product.price * validatedData.quantity,
      },
    });
    res.json(updatedProduct);
  } else {
    const cart = await prismaClient.cartItem.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
    const updatedTotal = await prismaClient.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        total: req.user.total + +product.price * validatedData.quantity,
      },
    });
    res.json(cart);
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartItem = await prismaClient.cartItem.findFirstOrThrow({
    where: {
      id: +req.params.id,
    },
  });
  if (cartItem.userId != req.user.id) {
    throw new UnauthorizedException("User Not Authorized to Delete this cart Item", ErrorCode.UNAUTHORIZED);
  }
  const product = await prismaClient.product.findFirst({
    where: {
      id: cartItem.productId,
    },
  });
  await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      total: req.user.total - +product!.price * cartItem.quantity,
    },
  });
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json({ success: true });
};
export const updateQuantity = async (req: Request, res: Response) => {
  const validatedData = changeQuantitySchema.parse(req.body);
  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      id: +req.params.id,
    },
  });
  if (req.user.id != existingCartItem?.userId) {
    throw new UnauthorizedException("User Not Authorized to Update this cart Item", ErrorCode.UNAUTHORIZED);
  }
  const product = await prismaClient.product.findFirst({
    where: {
      id: existingCartItem.productId,
    },
  });
  const productprice = product?.price;
  await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      total: validatedData.quantity * +productprice!,
    },
  });
  const updatedItem = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedItem);
};
export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
