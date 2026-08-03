export default interface ISmallPopUp {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
