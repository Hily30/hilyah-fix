import React, { useState, useEffect } from 'react'
import Navigasi from '../../components/Navigasi'
import Link from 'next/link'
import Router from 'next/router'


export async function getServerSideProps(ctx){

    const reqPelajaran = await fetch(`${process.env.PUBLIC_URL}/api/pelajaran`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resPelajaran = await reqPelajaran.json()
    const data = resPelajaran.code === 200 ? resPelajaran.data : []
    return {
        props: {
            data
        }
    }
}

const Pelajaran = ({ data }) => {

    const [fields, setFields] = useState({
        kodep: '',
        nama: '',
        jenisKelamin: 'L',
        alamat: '',
        nohp: ''
    }) 

    const handlerChange = (e) => {
        e.preventDefault()
        const name = e.target.name
        setFields({
            ...fields,
            [name]: e.target.value
        })
    }

    const handlerSubmit = async(e) => {
        e.preventDefault()
        const reqTambahPelajaran = await fetch('/api/pelajaran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields)
        })
        const resTambahPelajaran = await reqTambahPelajaran.json()
        if(resTambahPelajaran.code === 200) return alert(resTambahPelajaran.message),Router.push('/pelajaran')
        return alert(resTambahPelajaran.message)
    }

    const handlerDelete = async(e, kodep) => {
        e.preventDefault()
        const status = confirm(`Yakin ingin menghapus data pelajaran dengan KODEP : ${kodep} ?`)
        const reqDeletePelajaran = await fetch(`/api/pelajaran/${kodep}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        })
        const resDeletePelajaran = await reqDeletePelajaran.json()
        if(resDeletePelajaran.code !== 200){
            alert(resDeletePelajaran.message)
        }else{
            alert(resDeletePelajaran.message)
            Router.push('/pelajaran')
        }
    }

    return (
        <>
            <Navigasi/>
            <div className="container mt-5">
            <button type="button" className="btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                [+] Tambah Pelajaran
            </button>

            <div className="modal modal-lg fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Tambah Data Pelajaran</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    
                    <div className="mb-3 row">
                        <label htmlFor="kodep" className="col-sm-3 col-form-label">Kode Pelajaran</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="kodep" name='kodep' onChange={e => handlerChange(e)} value={fields.kodep}/>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="nama" className="col-sm-3 col-form-label">Nama Pelajaran</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="nama" name='nama' onChange={e => handlerChange(e)} value={fields.nama}/>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="jenisKelamin" className="col-sm-3 col-form-label">Jenis Kelamin</label>
                        <div className="col-sm-9">
                            <select className="form-select" aria-label="jenisKelamin" id="jenisKelamin" name='jenisKelamin' onChange={e => handlerChange(e)}>
                            {
                                fields.jenisKelamin === 'L'?
                                <>
                                    <option value="L" selected>Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </>
                                :
                                <>
                                    <option value="L">Laki-laki</option>
                                    <option value="P" selected>Perempuan</option>
                                </>
                            }
                            </select>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="alamat" className="col-sm-3 col-form-label">Alamat</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="alamat" name='alamat' onChange={e => handlerChange(e)} value={fields.alamat}/>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="nohp" className="col-sm-3 col-form-label">Nomor Telepone</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="nohp" name='nohp' onChange={e => handlerChange(e)} value={fields.nohp}/>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={e => handlerSubmit(e)}>Simpan</button>
                </div>
                </div>
            </div>
            </div>
                <table className="table">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">KODEP</th>
                            <th scope="col">Nama Pelajaran</th>
                            <th scope="col">Jenis Kelamin</th>
                            <th scope="col">Alamat</th>
                            <th scope="col">No Telepone</th>
                            <th scope="col">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length !== 0 ?
                            data.map((element, index) => {
                                    return  <tr key={index}>
                                                <th scope="row">{index+1}</th>
                                                <td>{element.kodep}</td>
                                                <td>{element.nama}</td>
                                                <td>{element.jenisKelamin}</td>
                                                <td>{element.alamat}</td>
                                                <td>{element.nohp}</td>
                                                <td className='d-flex flex-row gap-1'>
                                                    <Link href={`/pelajaran/${element.kodep}`} className='btn btn-warning btn-sm'>Edit</Link>
                                                    <button className='btn btn-danger btn-sm' onClick={e => handlerDelete(e, element.kodep)}>Hapus</button>
                                                </td>
                                            </tr>
                                }):
                            <tr>
                                <td>Data Belum Tersedia</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Pelajaran