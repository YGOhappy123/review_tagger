/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#ec7532',
                secondary: '#fbbd61',
                black: '#101010',
                dropdown: '#303030',
                dropdownHover: 'rgba(255, 255, 255, 0.08)',
                modalOverlay: 'rgba(0, 0, 0, 0.4)',
                imgAlt: '#a9a9a9'
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(to right, #ec7532, #fbbd61)',
                'gradient-dark-to-t':
                    'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                'gradient-dark-to-r':
                    'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))'
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif']
            },
            keyframes: {
                'open-menu': {
                    '0%': { transform: 'scaleY(0)' },
                    '80%': { transform: 'scaleY(1.2)' },
                    '100%': { transform: 'scaleY(1)' }
                }
            },
            animation: {
                'open-menu': 'open-menu 0.5s ease-in-out forwards'
            }
        }
    },
    plugins: []
}
