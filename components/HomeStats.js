import {useEffect, useState} from "react"
import axios from "axios"
import Spinner from "@/components/Spinner"
import {subHours} from "date-fns"

export default function HomeStats() {
  const [orders,setOrders] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/orders').then(res => {
      setOrders(res.data)
      setIsLoading(false)
    })
  }, [])

  function ordersTotal(orders) {
    let sum = 0
    orders.forEach(order => {
      const {line_items} = order
      line_items.forEach(li => {
        const lineSum = li.quantity * li.price_data.unit_amount / 100
        sum += lineSum
      })
    })
    return new Intl.NumberFormat('en-US').format(sum)
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(o =>  new Date(o.createdAt) > subHours(new Date, 24))
  const ordersWeek = orders.filter(o =>  new Date(o.createdAt) > subHours(new Date, 24*7))
  const ordersMonth = orders.filter(o =>  new Date(o.createdAt) > subHours(new Date, 24*30))

  return (
    <div>
      <h2>Đơn hàng</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hôm nay</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">{ordersToday.length} đơn hàng hôm nay</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tuần này</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">{ordersWeek.length} đơn hàng tuần này</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tháng này</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">{ordersMonth.length} đơn hàng tháng này</div>
        </div>
      </div>
      <h2>Doanh thu</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hôm nay</h3>
          <div className="tile-number">$ {ordersTotal(ordersToday)}</div>
          <div className="tile-desc">{ordersToday.length} đơn hàng hôm nay</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tuần này</h3>
          <div className="tile-number">$ {ordersTotal(ordersWeek)}</div>
          <div className="tile-desc">{ordersWeek.length} đơn hàng tuần này</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tháng này</h3>
          <div className="tile-number">$ {ordersTotal(ordersMonth)}</div>
          <div className="tile-desc">{ordersMonth.length} đơn hàng tháng này</div>
        </div>
      </div>
    </div>
  )
}