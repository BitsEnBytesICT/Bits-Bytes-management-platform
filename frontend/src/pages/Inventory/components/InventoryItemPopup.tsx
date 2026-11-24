import {useState} from "react";
import PopUp from "../../../common/components/PopUp.tsx";
import Input from "../../../common/components/Input.tsx";
import Button from "../../../common/components/Button.tsx";
import {InventoryService} from "../inventory.service.ts";
import type ICategory from "../../../types/Inventory/ICategory.ts";

interface IInventoryItemPopupProps {
    categories: ICategory[];
    onClose: () => void;
    onCreated?: () => Promise<void> | void;
}

export default function InventoryItemPopup({categories, onClose, onCreated}: IInventoryItemPopupProps) {
    const [error, setError] = useState<string[]>([]);
    const [categoryId, setCategoryId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [serialNumber, setSerialNumber] = useState<string>("");

    const inventoryService = new InventoryService();

    const onSubmit = async () => {
        const errors: string[] = [];

        const category = categories.find(c => String(c.id) === categoryId);
        if (!category) errors.push("Categorie is verplicht");

        const parsedQuantity = Number(quantity);
        if (quantity.trim() === "" || !Number.isInteger(parsedQuantity) || parsedQuantity < 0)
            errors.push("Aantal moet een geheel getal van 0 of hoger zijn");

        if (errors.length > 0) {
            setError(errors);
            return;
        }

        const createErrors = await inventoryService.createItem({
            category: category!.name,
            categoryId: category!.id!,
            description,
            quantity: parsedQuantity,
            serialNumber,
        });
        if (createErrors) {
            setError(createErrors);
            return;
        }

        await onCreated?.();
        onClose();
    };

    return (
        <PopUp
            onClose={onClose}
            title="Item toevoegen"
            errors={error}
            button={
                <div className="w-full flex justify-end">
                    <Button onClick={onSubmit}>Voeg item toe</Button>
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
                                type="select"
                                id="itemCategory"
                                label="Categorie"
                                required
                                placeholder="Kies een categorie"
                                options={categories.map(category => ({
                                    value: String(category.id),
                                    label: category.name,
                                }))}
                                value={categoryId}
                                onChange={setCategoryId}
                            />
                            <Input type="text" id="itemDescription" label="Omschrijving" onChange={setDescription} />
                            <Input type="text" id="itemQuantity" label="Aantal" required onChange={setQuantity} />
                            <Input type="text" id="itemSerialNumber" label="Serienummer" onChange={setSerialNumber} />
                        </div>
                    </div>
                </div>,
            ]}
        />
    );
}
