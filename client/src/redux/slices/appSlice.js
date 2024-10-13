import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isSidebarOpen: false,
    isAuthModalOpen: false,
    isGlobalLoading: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsAuthModalOpen: (state, action) => {
            state.isAuthModalOpen = action.payload
        },

        setIsGlobalLoading: (state, action) => {
            state.isGlobalLoading = action.payload
        },

        setIsSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload
        }
    }
})

export const { setIsAuthModalOpen, setIsGlobalLoading, setIsSidebarOpen } =
    appSlice.actions

export default appSlice.reducer
