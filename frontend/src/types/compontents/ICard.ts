import type {RefObject} from "react";

export default interface ICard {
    title: string;
    value: string | number;
    ref?: RefObject<any>;
}
