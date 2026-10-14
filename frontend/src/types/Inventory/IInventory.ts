export default interface IInventory {
    id?: number;
    category: string;
    categoryId: number;
    description: string;
    quantity: number;
    serialNumber: string;
    createdAt?: string;
}
