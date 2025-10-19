import { createOrder, editOrder, getOrderById, getOrders, getOrdersFromOneUser, getPreventives, getPreventivesFromOrder, getPreventivesFromSubArea, getSubArea } from "../DB/nodePG/preventives"
import { getAllUsers, getUserById } from "../DB/nodePG/users"
import { DBUser, IOrder, } from "../interfaces"
import  { Request } from "express"

export const resolvers={
  Query:{
    preventives:()=>getPreventives(),
    orders:()=>getOrders(),
    order:async (_root:IOrder,args:{order_id:number})=>{
      const order = await getOrderById(args.order_id)
      return order[0]
    },
    users:()=>getAllUsers(),
    //(parent,args,context)
    user:async (_root:IOrder,args:{user_id:string},{req}:{req:Request})=>{
      console.log(req.cookies)
      const user=await getUserById(args.user_id)//"wrAeySmVZTlR" 
      return user
    }
  },
  Mutation:{
    createOrder:async (_:IOrder,args:{user_id:string,sub_area_id:number})=>{
      const newOrder=await createOrder(args.user_id,args.sub_area_id)
      return newOrder
    },
    editOrder:async (
      _root:IOrder,
      args:{input:{
        order_id:number
        notes?:string
        finished_date?:string
      }}
    )=>{
      const updatedOrder=await editOrder(args.input)
      return updatedOrder
    },
  },

  Order:{
    sub_area:async (order:IOrder)=>{
      const ordersFromOne=await getSubArea(order.sub_area_id)
      return ordersFromOne
    },
    preventives:async (order:IOrder)=>{
      return await getPreventivesFromSubArea(order.sub_area_id)
    }
  },

}