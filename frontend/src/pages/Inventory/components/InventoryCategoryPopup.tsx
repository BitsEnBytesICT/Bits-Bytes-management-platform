import PopUp from "../../../common/components/PopUp.tsx";
import Input from "../../../common/components/Input.tsx";
import {InventoryService} from "../inventory.service.ts";
import {useState} from "react";
import Button from "../../../common/components/Button.tsx";

interface IInventoryCategoryPopupProps {
    onClose: () => void;
}

export default function InventoryCategoryPopup({onClose}: IInventoryCategoryPopupProps) {
    const error: string[] = [];
    const [categoryName, setCategoryName] = useState<string>("");

    const inventoryService = new InventoryService();

    const onSubmit = async () => {
        await inventoryService.createCategory(categoryName);
    };

    return (
        <PopUp
            onClose={onClose}
            errors={error}
            button={
                <div className="w-full flex justify-end">
                    <Button onClick={onSubmit}>Add category</Button>
                </div>
            }
            children={[
                <div className="w-full max-w-md mx-auto">
                    <div
                        className="w-full min-h-[160px] px-6 py-6 flex items-center justify-center text-sm font-medium
                            text-(--color-darkblue) bg-(--color-white) rounded-2xl
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                        <div className="w-full">
                            <Input type="text" id="category" label="Categorie naam" onChange={setCategoryName} />
                        </div>
                    </div>
                </div>,
            ]}
        />
    );
}
