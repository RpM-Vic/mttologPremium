import { pool } from "./dbConnection.js";
export async function getPreventives() {
    try {
        const { rows } = await pool.query(`SELECT * FROM preventives`);
        return rows;
    }
    catch (error) {
        console.error("Error getting preventives:", error);
        throw new Error("Database error while fetching preventives");
    }
}
export async function getSubArea(sub_area_id) {
    try {
        const { rows } = await pool.query(`SELECT * FROM sub_areas WHERE sub_area_id = $1`, [sub_area_id]);
        ;
        return rows[0];
    }
    catch (error) {
        console.error("Error getting preventives:", error);
        throw new Error("Database error while fetching preventives");
    }
}
export async function getPreventivesFromSubArea(sub_area_id) {
    try {
        const { rows } = await pool.query(`SELECT * FROM preventives WHERE sub_area_id = $1`, [sub_area_id]);
        return rows;
    }
    catch (error) {
        console.error(`Error getting preventives for sub_area_id=${sub_area_id}:`, error);
        throw new Error("Database error while fetching preventives for sub area");
    }
}
export async function getPreventivesFromOrder(order_id) {
    try {
        const orderResult = await pool.query(`SELECT sub_area_id FROM orders WHERE id = $1`, [order_id]);
        if (orderResult.rowCount === 0) {
            throw new Error(`Order with id=${order_id} not found`);
        }
        const sub_area_id = orderResult.rows[0].sub_area_id;
        return await getPreventivesFromSubArea(sub_area_id);
    }
    catch (error) {
        console.error(`Error getting preventives from order_id=${order_id}:`, error);
        throw new Error("Database error while fetching preventives from order");
    }
}
export async function getOrders() {
    try {
        const { rows } = await pool.query(`SELECT * FROM orders`);
        return rows;
    }
    catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Database error while fetching orders");
    }
}
export async function getOrderById(order_id) {
    try {
        const { rows } = await pool.query(`SELECT * FROM orders WHERE order_id = $1`, [order_id]);
        return rows;
    }
    catch (error) {
        console.error("Error getting orders:", error);
        throw new Error("Database error while fetching orders");
    }
}
export async function getOrdersFromOneUser(user_id) {
    try {
        const { rows } = await pool.query(`SELECT * FROM orders WHERE user_id = $1`, [user_id]);
        return rows;
    }
    catch (error) {
        console.error(`Error getting orders for user_id=${user_id}:`, error);
        throw new Error("Database error while fetching user orders");
    }
}
export async function createOrder(user_id, sub_area_id) {
    try {
        const query = `
      INSERT INTO orders (user_id, sub_area_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
        const { rows } = await pool.query(query, [user_id, sub_area_id]);
        return rows[0];
    }
    catch (error) {
        console.error(`Error creating order for user_id=${user_id}, sub_area_id=${sub_area_id}:`, error);
        throw new Error("Database error while creating order");
    }
}
export async function createPreventive(sub_area_id, description, denomination, periodicity_id) {
    try {
        const query = `
      INSERT INTO preventives ( sub_area_id,description,denomination,periodicity_id)
      VALUES ($1, $2, $3,$4)
      RETURNING *;
    `;
        const { rows } = await pool.query(query, [sub_area_id, description, denomination, periodicity_id]);
        return rows[0];
    }
    catch (error) {
        console.error(`Error creating order for user_id=${description}:`, error);
        throw new Error("Database error while creating order");
    }
}
export async function editOrder({ order_id, notes, finished_date }) {
    if (!notes && !finished_date) {
        throw new Error("You must provide at least one field to edit");
    }
    const client = await pool.connect();
    try {
        const updateFields = [];
        const queryParams = [];
        let paramCount = 1;
        if (notes !== undefined) {
            updateFields.push(`notes = $${paramCount}`);
            queryParams.push(notes);
            paramCount++;
        }
        if (finished_date !== undefined) {
            updateFields.push(`finished_date = $${paramCount}`);
            queryParams.push(finished_date);
            paramCount++;
        }
        queryParams.push(order_id);
        const query = `
      UPDATE orders 
      SET ${updateFields.join(', ')}
      WHERE order_id = $${paramCount}
      RETURNING order_id, notes, finished_date
    `;
        const result = await client.query(query, queryParams);
        if (result.rows.length === 0) {
            throw new Error(`Order with id ${order_id} not found`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.error(`Error editing order with order_id=${order_id}:`, error);
        throw new Error("Database error while editing order");
    }
    finally {
        client.release();
    }
}
