import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
    paid: Boolean,
}, {
    timestamps: true,
})

export const Order = models?.Order || model('Order', OrderSchema)
