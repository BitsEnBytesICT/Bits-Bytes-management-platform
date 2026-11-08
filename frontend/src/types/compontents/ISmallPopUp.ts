import type {ReactNode} from "react";

export interface ISmallPopBase {
    title: string;
    message: string | ReactNode;
    onCancel: () => void;
    nested?: boolean;
}

export interface ISmallPopUpWithoutButtons extends ISmallPopBase {
    onConfirm: () => void;
}

export interface ISmallPopUpWithButtons extends ISmallPopBase {
    confirmationButtons: ReactNode[];
}

type ISmallPopUp = ISmallPopUpWithButtons | ISmallPopUpWithoutButtons;

export type {ISmallPopUp as default};
