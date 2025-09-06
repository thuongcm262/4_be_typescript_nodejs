import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not_found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response)=>{
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(",")
        }
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response)=>{
    try {
        const product = req.body
        if(product.tags){
            product.tags = product.tags.join(",")
        }
        const updateProduct = await prismaClient.product.update({
            where: {id: +req.params.id},
            data: product
        })
        res.json(updateProduct)
    } catch (e: any) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const deleteProduct = async (req: Request, res: Response)=>{
    try {
        const product = await prismaClient.product.findUnique({
            where: {id: +req.params.id}
        })
        if (!product) {
            throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
        }

        await prismaClient.product.delete({
            where: {id: +req.params.id}
        })
        res.json({message: 'Product deleted'})
    } catch (e: any) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const listProducts = async (req: Request, res: Response)=>{
    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip || 0,
        take: +req.query.take || 10,
    })
    res.json({count, products})

    // const count = await prismaClient.product.count();
    // const products = await prismaClient.product.findMany({
    //     skip,
    //     take,
    // });

    // res.json({
    //     count,
    //     totalPages: Math.ceil(count / take),
    //     currentPage: page,
    //     products,
    // });
}

export const getProductById = async (req: Request, res: Response)=>{
    try {
        const product = await prismaClient.product.findUnique({
            where: {id: +req.params.id}
        })
        if (!product) {
            throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
        }
        res.json(product);
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const searchProducts = async (req: Request, res: Response)=>{

}