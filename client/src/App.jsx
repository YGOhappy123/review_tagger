import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import MainLayout from './layouts/MainLayout'
import routes from './routes/router'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<MainLayout />}>
                        {routes.map((route, index) =>
                            route.indexPage ? (
                                <Route
                                    key={index}
                                    index
                                    element={route.element}
                                />
                            ) : (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={route.element}
                                />
                            )
                        )}
                    </Route>
                </Routes>
            </BrowserRouter>

            <ToastContainer />
        </>
    )
}

export default App
