import { createOrder, editOrder, getOrderById, getOrders, getPreventives, getPreventivesFromSubArea, getSubArea } from "../DB/nodePG/preventives.js";
import { getAllUsers, getUserById } from "../DB/nodePG/users.js";
export const resolvers = {
    Query: {
        preventives: () => getPreventives(),
        orders: () => getOrders(),
        order: async (_root, args) => {
            const order = await getOrderById(args.order_id);
            return order[0];
        },
        users: () => getAllUsers(),
        //(parent,args,context)
        user: async (_root, args, { req }) => {
            console.log(req.cookies);
            const user = await getUserById(args.user_id); //"wrAeySmVZTlR" 
            return user;
        }
    },
    Mutation: {
        createOrder: async (_, args) => {
            const newOrder = await createOrder(args.user_id, args.sub_area_id);
            return newOrder;
        },
        editOrder: async (_root, args) => {
            const updatedOrder = await editOrder(args.input);
            return updatedOrder;
        },
    },
    Order: {
        sub_area: async (order) => {
            const ordersFromOne = await getSubArea(order.sub_area_id);
            return ordersFromOne;
        },
        preventives: async (order) => {
            return await getPreventivesFromSubArea(order.sub_area_id);
        }
    },
};
