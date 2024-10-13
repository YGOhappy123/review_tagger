const DEFAULT_TOAST_OPTIONS = {
    position: 'top-right',
    theme: 'dark',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true
}

const getToastOptions = (overwrite) => ({
    ...DEFAULT_TOAST_OPTIONS,
    ...overwrite
})

export default getToastOptions
