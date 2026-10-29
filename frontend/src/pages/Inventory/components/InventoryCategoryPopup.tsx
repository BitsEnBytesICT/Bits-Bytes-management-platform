import PopUp from "../../../common/components/PopUp.tsx";
import {useState} from "react";
import Input from "../../../common/components/Input.tsx";

interface IInventoryCategoryPopupProps {
    onClose: () => void;
}

export default function InventoryCategoryPopup({onClose}: IInventoryCategoryPopupProps) {
    const [error] = useState([]);

    return (
        <PopUp
            onClose={onClose}
            errors={error}
            button={""}
            children={[
                <div>
                    <div className={"grid grid-cols-2 gap-x-6 gap-y-4"}>
                        <Input type={"text"} id={"category"} label={"Categorie naam"} />
                    </div>
                </div>,
            ]}
        />
    );
}
