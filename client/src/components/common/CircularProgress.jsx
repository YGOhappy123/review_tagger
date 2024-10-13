import { useCallback } from 'react'
import {
    CircularProgressbarWithChildren,
    buildStyles
} from 'react-circular-progressbar'

const CircularProgress = ({ size, value }) => {
    const getNearestMaxValue = useCallback(() => {
        let maxValue = 1
        while (maxValue < value) {
            maxValue *= 10
        }
        return maxValue
    }, [])

    return (
        <div style={{ width: size, height: size }}>
            <CircularProgressbarWithChildren
                maxValue={getNearestMaxValue()}
                value={value}
                styles={buildStyles({
                    pathColor: '#ec7532',
                    trailColor: '#fff'
                })}
            >
                <span className='font-poppins text-sm font-medium text-primary'>
                    {value.toFixed(1)}
                </span>
            </CircularProgressbarWithChildren>
        </div>
    )
}

export default CircularProgress
