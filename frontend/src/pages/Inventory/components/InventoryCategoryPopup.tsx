import PopUp from "../../../common/components/PopUp.tsx";
import Input from "../../../common/components/Input.tsx";

interface IInventoryCategoryPopupProps {
    onClose: () => void;
}

export default function InventoryCategoryPopup({onClose}: IInventoryCategoryPopupProps) {
    const error: string[] = [];

    return (
        <PopUp
            onClose={onClose}
            errors={error}
            button=""
            children={[
                <div className="w-full max-w-md mx-auto">
                    <div
                        className="w-full min-h-[160px] px-6 py-6 flex items-center justify-center text-sm font-medium
                            text-(--color-darkblue) bg-(--color-white) rounded-2xl
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                        <div className="w-full">
                            <Input type="text" id="category" label="Categorie naam" />
                        </div>
                    </div>
                </div>,
            ]}
        />
    );
}
