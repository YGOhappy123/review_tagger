import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    favoritesList: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            if (action.payload.token) {
                localStorage.setItem('access-token', action.payload.token)
            }

            state.user = action.payload.data
        },

        signOut: (state, action) => {
            localStorage.removeItem('access-token')
            state.user = null
        },

        setFavoritesList: (state, action) => {
            state.favoritesList = action.payload
        },

        addToFavoritesList: (state, action) => {
            state.favoritesList.push(action.payload)
        },

        removeFromFavoritesList: (state, action) => {
            const { mediaId } = action.payload
            state.favoritesList = state.favoritesList.filter(
                (item) => item.mediaId.toString() !== mediaId.toString()
            )
        }
    }
})

export const {
    setUser,
    signOut,
    setFavoritesList,
    addToFavoritesList,
    removeFromFavoritesList
} = userSlice.actions

export default userSlice.reducer
