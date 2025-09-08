import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not_found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad_requests";
import { OrderStatusSchema } from "../schema/order";

export const createOrder = async (req: Request, res: Response) => {
  // 1. Tạo một transaction
  // 2. Liệt kê tất cả các sản phẩm trong giỏ hàng và chỉ tiếp tục nếu giỏ không rỗng
  // 3. Tính tổng số tiền
  // 4. Lấy địa chỉ của người dùng
  // 5. Định nghĩa một field tính toán (computed field) cho địa chỉ đã được format trong module address
  // 6. Tạo một order và các sản phẩm thuộc order đó
  // 7. Tạo event (sự kiện)
  // 8. Làm trống giỏ hàng
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItems.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress,
      },
    });
    const order = await tx.order.create({
        data:{
            userId: req.user.id,
            netAmout: price,
            address: address.formattedAddress,
            products:{
                create: cartItems.map((cart)=>{
                    return{
                        productId: cart.productId,
                        quantity: cart.quantity
                    }
                })
            }
        }
    })

    const orderEvent = await tx.orderEvent.create({
        data:{
            orderId: order.id
        }
    })
    await tx.cartItems.deleteMany({
        where: {
            userId: req.user.id
        }
    })

    return res.json(order)

  });
};

export const listOrders = async(req: Request, res: Response)=>{
    const orders = await prismaClient.order.findMany({
        where: {
            userId: +req.user.id
        }
    })
    res.json(orders)
}

export const cancelOrder = async(req: Request, res: Response)=>{
    return await prismaClient.$transaction(async(tx)=>{
        const order = await tx.order.findFirst({
            where:{
                id: +req.user.id
            }
        })
        if(!order){
            throw new NotFoundException("Not found order", ErrorCode.ORDER_NOT_FOUND)
        }

        if(order.userId !== req.user.id){
            throw new BadRequestException("ForBidden ", ErrorCode.FORBIDDEN)
        }
        const orderCancelled = await prismaClient.order.update({
            where: {
                id: +req.user.id
            },
            data:{
                status:"CANCELLED"
            }
        })
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: "CANCELLED"
            }
        })
        res.json(orderCancelled)

    })
    // try {
    //     const order = await prismaClient.order.update({
    //         where: {
    //             id: +req.user.id
    //         },
    //         data:{
    //             status:"CANCELLED"
    //         }
    //     })
    //     await prismaClient.orderEvent.create({
    //         data: {
    //             orderId: order.id,
    //             status: "CANCELLED"
    //         }
    //     })
    //     res.json(order)
    // } catch (error) {
    //     throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
    // }
}

export const getOrderById = async(res: Response, req: Request)=>{
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where:{
                id: +req.params.id
            },
            include:{
                products: true,
                events:true
            }
        })
        res.json(order)
    } catch (error) {
        throw new NotFoundException("Not found Order", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async(res: Response, req: Request)=>{
    let whereClause = {}
    const status = req.query.status
    if(status){
        whereClause = {status}
    }

    const orders = await prismaClient.order.findMany({
        where:whereClause,
        skip: + req.query.skip || 0,
        take: 5
    })
    res.json(orders)
}

export const changeStatus = async(res: Response, req: Request)=>{
    // const statusBody = OrderStatusSchema.parse(req.body.status)

    return await prismaClient.$transaction(async(tx)=>{
        const order = await tx.order.update({
            where: {
                id: +req.params.id
            },
            data:{
                status: req.body.status
            }
        })
        await tx.orderEvent.create({
            data:{
                orderId: order.id,
                status: req.body.status
            }
        })
        res.json(order)
    })
}

export const listUserOrder = async(res: Response, req: Request)=>{
    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5
    })
    res.json(orders)
}