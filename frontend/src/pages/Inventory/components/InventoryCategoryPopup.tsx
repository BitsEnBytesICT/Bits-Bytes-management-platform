import PopUp from "../../../common/components/PopUp.tsx";
import Input from "../../../common/components/Input.tsx";
import {InventoryService} from "../inventory.service.ts";
import {useState} from "react";
import Button from "../../../common/components/Button.tsx";

interface IInventoryCategoryPopupProps {
    onClose: () => void;
    onCreated?: () => Promise<void> | void;
}

export default function InventoryCategoryPopup({onClose, onCreated}: IInventoryCategoryPopupProps) {
    const [error, setError] = useState<string[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryDescription, setCategoryDescription] = useState<string>("");

    const inventoryService = new InventoryService();

    const onSubmit = async () => {
        const errors = await inventoryService.createCategory(categoryName, categoryDescription);
        if (errors) {
            setError(errors);
            return;
        }

        await onCreated?.();
        onClose();
    };

    return (
        <PopUp
            onClose={onClose}
            title="Categorie toevoegen"
            errors={error}
            button={
                <div className="w-full flex justify-end">
                    <Button onClick={onSubmit}>Voeg categorie toe</Button>
                </div>
            }
            children={[
                <div className="flex w-full max-w-md mx-auto items-center">
                    <div
                        className="w-full min-h-[160px] px-6 py-6 flex items-center justify-center text-sm font-medium
                            text-(--color-darkblue) bg-(--color-white) rounded-2xl
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                        <div className="w-full flex flex-col gap-y-4">
                            <Input
                                type="text"
                                id="category"
                                label="Categorie naam"
                                required
                                onChange={setCategoryName}
                            />
                            <Input
                                type="textarea"
                                id="categoryDescription"
                                label="Omschrijving"
                                rows={3}
                                onChange={setCategoryDescription}
                            />
                        </div>
                    </div>
                </div>,
            ]}
        />
    );
}
