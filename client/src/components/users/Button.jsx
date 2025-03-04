import React from 'react';
import ButtonLists from './ButtonLists';


const buttonNames = [
    "All", "Mobile", "Laptop", "Mouse", "Keybord", "Computer", "Tabs", 
    "Pendrive", "Printer", "VGA", "SD card", "UPS", "Headset", 
    "Smart Watch", "Charger", "Pointer", "Tuch Pad","spacker", "Joistick"
];

const Button = () => {
    return (
        <div className="relative w-full mx-auto flex items-center">

            {/* Scrollable Buttons */}
            <div className="flex  w-full overflow-x-hidden grow flex-wrap ">
                {buttonNames.map((name, index) => (
                    <ButtonLists key={index} name={name} id={index} />
                ))}
            </div>

            {/* Scroll Right Button */}
        </div>
    );
};

export default Button;
