import {useEffect} from "react";
import http from "../../common/http";

export default function Inventory() {
    useEffect(() => {
        const fetchInventoryItems = async (): Promise<void> => {
            const inventory: Response = await http("/api/inventory/list", "GET");
            if (inventory.status === 200) {
                const items = await inventory.json();
                console.log("fetched inventory", items);
            }
        };

        Promise.all([fetchInventoryItems()])
            .then(() => {
                console.log("finished promise chain");
            })
            .catch(console.error);
    }, []);

    return <div></div>;
}
