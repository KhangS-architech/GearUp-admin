import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(response => {
            setOrders(response.data)
            setIsLoading(false)
        })
    }, [])
    return (
        <Layout>
            <h1>Đơn hàng</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Tình trạng</th>
                        <th>Người nhận hàng</th>
                        <th>Sản phẩm</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{new Intl.DateTimeFormat('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'Asia/Ho_Chi_Minh',
                            }).format(new Date(order.createdAt))}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </td>
                            <td>
                                {order.name} {order.email} <br />
                                {order.phoneNumber} {order.address}
                            </td>
                            <td>{order.line_items.map(l => (
                                <>
                                {l.price_data?.product_data.name} x {l.quantity} <br/>
                                </>
                            ))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}