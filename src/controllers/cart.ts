import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { CartItems, Product } from "@prisma/client";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not_found";
import { ErrorCode } from "../exceptions/root";
import { success } from "zod";
import tr from "zod/v4/locales/tr.cjs";

export const addItemToCart= async(req: Request, res: Response)=>{
    const validateData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }

    let productInCart: CartItems
    try {
        productInCart = await prismaClient.cartItems.findFirst({
            where:{
                productId: validateData.productId,
                userId: req.user.id
            }
        })
    } catch (error) {
        throw new NotFoundException("Sanr pham ko ton tai trong gio hang", ErrorCode.PRODUCT_NOT_FOUND)
    }

    if(productInCart){
        const updateCart = await prismaClient.cartItems.update({
            where:{
                id: productInCart.id
            },
            data:{
                quantity: validateData.quantity
            }
        })
        res.json(updateCart)
    }else{
        const cart = await prismaClient.cartItems.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validateData.quantity
        }
    })
    res.json(cart)
    }
    
    
}

export const getCart= async(req: Request, res: Response)=>{
    const cart = await prismaClient.cartItems.findMany({
        where:{
            userId: +req.params.id
        },
        include:{
            product: true
        }
    })
    res.json(cart)
}

export const deleteItemFromCart= async(req: Request, res: Response)=>{
    await prismaClient.cartItems.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success:true})
}

export const changeQuantity= async(req: Request, res: Response)=>{
    const validateData = ChangeQuantitySchema.parse(req.body)
    const updateCart = await prismaClient.cartItems.update({
        where:{
            id: +req.params.id
        },
        data:{
            quantity: validateData.quantity
        }
    })

    res.json(updateCart)
}