import React from 'react'
import { Link } from 'react-router-dom'

function DataTableReact() {
    return (
        <>
            <div className='m-2 d-flex'>
                <button className='btn btn-primary me-2 active'><Link className='text-white' to={'/'}>CounselorWiseSummary</Link></button>
                <button className='btn btn-primary me-2'><Link className='text-white' to={'/overall-Data-Table'}>Overall Summary</Link></button>
                <button className='btn btn-primary'><Link className='text-white' to={'/tltm'}>TL-TM</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/Excluding-TL'}>Excluding-TL</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/group-wise'}>Group-Wise</Link></button>
            </div>
        </>
    )
}

export default DataTableReact;