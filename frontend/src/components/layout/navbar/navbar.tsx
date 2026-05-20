import './navbar.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons/faCircleArrowRight';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons/faCircleArrowLeft';

// -left-[180px]

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
        <div className={`left-slider flex flex-col absolute top-0 transition-all duration-400 ${isOpen ? "-left-[150px]" : "-left-[280px]"}`}>
            <div className="self-end">
                <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <FontAwesomeIcon size="2x" icon={faCircleArrowLeft} /> : <FontAwesomeIcon size="2x" icon={faCircleArrowRight} />}</button>
            </div>
        </div>
        <div className={`right-slider flex flex-col-reverse absolute bottom-0 transition-all duration-400 ${isOpen ? "-right-[160px]" : "-right-[240px]"}`}>
            <div>
                <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <FontAwesomeIcon size="2x" icon={faCircleArrowLeft} /> : <FontAwesomeIcon size="2x" icon={faCircleArrowRight} />}</button>
            </div>
        </div>
        </>
    )
}