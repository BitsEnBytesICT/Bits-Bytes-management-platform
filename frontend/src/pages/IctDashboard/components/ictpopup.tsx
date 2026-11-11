import PopUp from "../../../common/components/PopUp";
import Button from "../../../common/components/Button";

export default function IctPopUp({setIsAddVmShown, onClose}) {
    const error: string[] = ["error"];
    return (
        <>
            <PopUp
                onClose={onClose}
                title={"Virtual Machine Toevoegen"}
                errors={error}
                children={[
                    <>
                        <div>
                            <p>hai</p>
                        </div>
                    </>,
                ]}
                button={<Button onClick={() => setIsAddVmShown(true)}>Volgende</Button>}
            />
        </>
    );
}
