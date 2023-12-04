import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function AdminsPage({swal}) {
    const [email, setEmail] = useState('')
    const [adminEmails, setAdminEmails] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    function addAdmin(ev) {
        ev.preventDefault();
        axios.post('/api/admins', {email}).then(res => {
            console.log(res.data)
            swal.fire({
                title: 'Đã thêm admin!',
                icon: 'success',
            })
            setEmail('')
            loadAdmins()
        }).catch(err => {
            swal.fire({
                title: 'Lỗi!',
                text: err.response.data.message,
                icon: 'error',
            })
        })
    }
    function deleteAdmin(_id,email) {
        swal.fire({
            title: 'Xóa',
            text: `Bạn có muốn xóa admin ${email}?`,
            showCancelButton: true,
            cancelButtonText :'Không',
            confirmButtonText : 'Có',
            confirmButtonColor: '#d55',
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id='+_id).then(() => {
                    swal.fire({
                        title: 'Đã xóa admin!',
                        icon: 'success',
                    })
                    loadAdmins()
                })
            }
        })
    }
    function loadAdmins() {
        setIsLoading(true)
        axios.get('/api/admins').then(res => {
            setAdminEmails(res.data)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        loadAdmins()
    }, [])
    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Thêm admin mới</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input type="text" className="mb-0" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="Admin email"/>
                    <button type="submit" className="btn-primary py-1">Thêm</button>
                </div>
            </form>
            <h2>Admins hiện tại</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
                    {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                        <tr>
                            <td>{adminEmail.email}</td>
                            <td>
                                <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="btn-red" >Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <AdminsPage swal={swal}/>
))