/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { IconUserModel } from '../../../../app/modules/profile/ProfileModels'
import { UsersList } from '../../../../app/modules/profile/components/UsersList'
import { toAbsoluteUrl } from '../../../helpers'

type Props = {
    icon: string
    badgeColor: string
    status: string
    statusColor: string
    title: string
    description: string
    startDate: string
    endDate: string
    budget: string
    progress: number
    users?: Array<IconUserModel>
}

const Card6: FC<Props> = ({
    icon,
    badgeColor,
    status,
    statusColor,
    title,
    description,
    startDate,
    endDate,
    budget,
    progress,
    users = undefined,
}) => {
    return (
        <Link
            to='/crafted/pages/profile/overview'
            className='card border border-2 border-gray-300 border-hover'
            style={{ width: "22rem" }}
        >
            <div className='card-body p-10'>
                <div className="d-flex row">
                    <div className='fs-4 fw-bolder text-dark col-6'>{title}</div>

                    <div className='card-toolbar col-1'>
                        <span className={`badge badge-light-${badgeColor} fw-bolder me-auto px-4 py-3`}>
                            {status}
                        </span>
                    </div>
                </div>

                <br />

                <div className='d-flex flex-wrap flex-row justify-content-center'>
                    <div className='border border-gray-300 border-dashed rounded py-3 px-4 mb-3'>
                        <div className='fs-8 text-gray-800 fw-bolder'>{startDate}</div>
                    </div>
                    <div className='py-3 px-4 mb-3'>
                        <div className='fs-8 text-gray-800 fw-bolder'>-</div>
                    </div>
                    <div className='border border-gray-300 border-dashed rounded py-3 px-4 mb-3'>
                        <div className='fs-8 text-gray-800 fw-bolder'>{endDate}</div>
                    </div>
                </div>
            </div>
        </Link >
    )
}

export { Card6 }
