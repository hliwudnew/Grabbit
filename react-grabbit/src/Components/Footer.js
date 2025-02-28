import '../Styles/Footer.css'
function Footer(){

    return(
        <div className="Footer">
            <div className = 'copyright'>
                <p className='text'>Grabbit © 2025</p>
            </div>
            <div className = 'links'>
                <a href='/contact' className='text'>Contact Us</a>
                <a href= '/FAQ' className='text'>FAQ</a>
                <a href= '/Privacy' className='text'>Privacy & Policy</a>
                <a href= '/Accessibility' className='text'>Accessibility</a>
                <a href= '/Legal' className='text'>Legal</a>
            </div>
        </div>
    );

}

export default Footer;