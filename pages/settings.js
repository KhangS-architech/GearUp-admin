import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function SettingsPage({swal}) {
    const [products, setProducts] = useState([])
    const [featuredProductId, setFeaturedProductId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [shippingFee, setShippingFee] = useState('')
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/products').then(res => {
            setProducts(res.data)
            setIsLoading(false)
        })
        axios.get('/api/settings?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value)
        })
        axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value)
        })
    }, [])
    async function saveSettings() {
        setIsLoading(true)
        await axios.put('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId
        }) 
        await axios.put('/api/settings', {
            name: 'shippingFee',
            value: shippingFee
        })
        setIsLoading(false)
        await swal.fire({
            title: 'Đã lưu!',
            icon:'success',
        })
    }
    return (
        <Layout>
            <h1>Cài đặt</h1>
            {isLoading && (
                <Spinner fullWidth={true}/>
            )}
            {!isLoading && (
                <>
                 <label>Sản phẩm nổi bật</label>
                 <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                    {products.length > 0 && products.map(product => (
                        <option key={product._id} value={product._id}>{product.title}</option>
                    ))}
                 </select>
                 <label>Phí vận chuyển (USD)</label>
                 <input type="number" value={shippingFee} onChange={ev => setShippingFee(ev.target.value)}/>
                 <div>
                    <button onClick={saveSettings} className="btn-primary">Lưu</button>
                 </div>
                </>
            )}
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <SettingsPage swal={swal}/>
)) 
