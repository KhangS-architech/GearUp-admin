import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory,setEditedCategory] = useState (null)
    const [name,setName] = useState('')
    const [parentCategory,setParentCategory] = useState('')
    const [categories,setCategories] = useState([])
    const [properties,setProperties] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
       fetchCategories()
    },[])
    function fetchCategories () {
        setIsLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories (result.data)
            setIsLoading(false)
         })
    }
    async function saveCategory(ev) {
        ev.preventDefault()
        const data = {
            name,
            parentCategory,
            properties: properties.map (p => ({
                name: p.name,
                values: p.values.split(','),
            }))
        }
        if (editedCategory) {
            data._id = editedCategory._id 
            await axios.put('/api/categories',data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories',data)
        }
        setName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }
    function editCategory (category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values: values.join (',')
            }) )
            )
    }
    function deleteCategory (category) {
        swal.fire({
            title: 'Xóa',
            text: `Bạn có muốn xóa ${category.name}?`,
            showCancelButton: true,
            cancelButtonText :'Không',
            confirmButtonText : 'Có',
            confirmButtonColor: '#d55',
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category
                await axios.delete('/api/categories?_id='+_id) 
                fetchCategories()
            }
        })
    }
    function addProperty () {
        setProperties (prev => {
            return [...prev, {name:'', values : ''}]
        })
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev]
            properties [index].name = newName
            return properties
        })
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev]
            properties [index].values = newValues
            return properties
        })
    }
    function removeProperty (indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p,pIndex)=> {
                return pIndex !== indexToRemove
            })
        })
    }
    
    return (
        <Layout>
            <h1>Phân loại</h1>
            <label>{editedCategory ? `Chỉnh sửa ${editedCategory.name}` : 'Tên danh mục'}</label>
            <form onSubmit={saveCategory}>
            <div className="flex gap-1">
            <input  
            type="text" 
            placeholder={'Tên danh mục'}
            onChange={ev => setName(ev.target.value)} 
            value={name}/>
            <select  
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                <option value=""> Không có danh mục tổng</option>
                {categories.length > 0 && categories.map(category => (
                       <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
            </select>
            </div>
            <div className="mb-2">
                <label className="block">Đặc tính</label>
                <button 
                onClick={addProperty}
                type="button" 
                className="btn-default text-sm mb-2">Thêm đặc tính mới
                </button>
                {properties.length > 0 && properties.map((property, index) => (
                    <div key={index} className="flex gap-1 mb-2">
                        <input 
                        type="text"
                        className="mb-0" 
                        value={property.name} 
                        onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                        placeholder="Tên đặc tính (VD: màu sắc)"/>
                        <input 
                        type="text"
                        className="mb-0" 
                        onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)}
                        value ={property.values} 
                        placeholder="Chi tiết, ngăn cách bởi dấu phẩy"/>
                        <button 
                        onClick={() =>removeProperty(index)}
                        type="button"
                        className="btn-red">
                            Xóa
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-1">
            {editedCategory && (
                <button 
                type="button"
                onClick={() => {
                    setName('')
                    setEditedCategory(null)
                    setParentCategory('')
                    setProperties([])
                }}
                className="btn-default">
                    Hủy
                </button>
            )}
            
            <button type="submit" className="btn-primary py-1">Lưu</button>
            </div>
          
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Tên danh mục</td>
                        <td>Danh mục tổng</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={3}>
                                <div className="py-4">
                                    <Spinner fullWidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
                    {categories.length > 0 && categories.map(category => (
                       <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button onClick={() => editCategory(category)}
                            className="btn-default mr-1">Chỉnh sửa</button>
                            <button 
                            onClick={() => deleteCategory(category)}
                            className="btn-red">Xóa</button>
                        </td>
                       </tr> 
                    ))}
                </tbody>
            </table>
            )}
            
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
))