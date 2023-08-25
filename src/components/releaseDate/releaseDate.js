import { Space } from 'antd'
import { format } from 'date-fns'

const ReleaseDate = (props) => {
    const { releaseDate } = props
    const release = releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : 'no release date'
    return (
        <Space direction="horizontal" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {release}
        </Space>
    )
}

export default ReleaseDate
