import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { firestore } from '@services/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface CategorySelectProps {
    setDraftInfo: (data: any) => void
    draftInfo: {
        draftCategory: string | number
        [key: string]: any
    }
    setIsLoaded: (loaded: boolean) => void
}

interface Category {
    key: number
    label: string
}

export const CategorySelect = ({ setDraftInfo, draftInfo, setIsLoaded }: CategorySelectProps) => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const docRef = doc(firestore, 'categoriasServicios', 'aPTAljOeD48FbniBg6Lw')
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()?.listadoCategorias || []
                    setCategories(data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDraftInfo((prev: any) => ({
            ...prev,
            draftCategory: event.target.value
        }))
        setIsLoaded(false)
    }

    return (
        <Form.Select
            className="casillaSeleccion"
            name="draftCategory"
            value={draftInfo.draftCategory}
            onChange={handleChange}
        >
            <option value="0">Seleccionar una...</option>
            {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                    {cat.label}
                </option>
            ))}
        </Form.Select>
    )
}

export default CategorySelect
