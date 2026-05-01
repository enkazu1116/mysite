import { NavLink } from 'react-router'
export default function Header() {
    return (
        <header>
            <h1>Welcome to my profile website page</h1>

            <nav>
                <ul className="flex justify-center gap-4">
                    <li><NavLink to="/" className="text-red-500">Home</NavLink></li>
                    <li><NavLink to="/skills" className="text-green-500">Skills</NavLink></li>
                    <li><NavLink to="/projects" className="text-yellow-500">Projects</NavLink></li>
                    <li><NavLink to="/books" className="text-purple-500">Books</NavLink></li>
                </ul>
            </nav>
        </header>
   )
}