import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="container header-container">
                <div className="logo-wrapper left-logo">
                    <img
                        src="/mits-logo.png"
                        alt="MITS Kochi"
                        className="header-logo"
                    />
                </div>
                <div className="logo-wrapper center-logo">
                    <img
                        src="/tecxell-logo.png"
                        alt="Tecxell 26 Logo"
                        className="header-logo"
                    />
                </div>
                <div className="logo-wrapper right-logo">
                    <img
                        src="/computex-logo.png"
                        alt="Computex"
                        className="header-logo"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
