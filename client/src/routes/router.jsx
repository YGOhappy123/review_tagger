import HomePage from '../pages/HomePage'
import SearchPage from '../pages/SearchPage'
import MediaListPage from '../pages/MediaListPage'
import MediaDetailPage from '../pages/MediaDetailPage'
import PersonDetailPage from '../pages/PersonDetailPage'
import AuthProtector from '../components/layout/AuthProtector'
import MyReviewsPage from '../pages/MyReviewsPage'
import MyFavoritesPage from '../pages/MyFavoritesPage'
import UpdatePasswordPage from '../pages/UpdatePasswordPage'
import NotFoundPage from '../pages/NotFoundPage'

const routes = [
    {
        indexPage: true,
        element: <HomePage />
    },
    {
        path: '/update-password',
        element: (
            <AuthProtector>
                <UpdatePasswordPage />
            </AuthProtector>
        )
    },
    {
        path: '/favorites',
        element: (
            <AuthProtector>
                <MyFavoritesPage />
            </AuthProtector>
        )
    },
    {
        path: '/reviews',
        element: (
            <AuthProtector>
                <MyReviewsPage />
            </AuthProtector>
        )
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/person/:personId',
        element: <PersonDetailPage />
    },
    {
        path: '/:mediaType',
        element: <MediaListPage />
    },
    {
        path: '/:mediaType/:mediaId',
        element: <MediaDetailPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
]

export default routes
