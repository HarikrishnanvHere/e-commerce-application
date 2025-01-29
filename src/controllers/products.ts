import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  //["tea","India"] => "tea,India"
  //Create a validator to validate the incoming data
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    //console.log(product);
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: product,
    });
    res.json(updatedProduct);
  } catch (err) {
    throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await prismaClient.product.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(deletedProduct);
  } catch (err) {
    throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const listProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json({ count, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    res.status(200).json(product);
  } catch (err) {
    throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND);
  }
};
