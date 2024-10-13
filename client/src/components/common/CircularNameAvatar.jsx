import Avatar from 'react-avatar'

const CircularNameAvatar = ({ name, size = 40, maxLength = 2 }) => {
    return (
        <Avatar
            name={name}
            size={size}
            round={true}
            maxInitials={maxLength}
            style={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                userSelect: 'none'
            }}
        />
    )
}

export default CircularNameAvatar
