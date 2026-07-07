import React from "react";
import http from "../../common/http";

import {useNavigate} from "react-router-dom";

export default function Login() {
    const [errorMessage, setErrorMessage] = React.useState<{
        color: string;
        message: string;
    }>();
    const [errorShown, setErrorShown] = React.useState(false);

    const usernameRef = React.createRef<HTMLInputElement>();
    const passwordRef = React.createRef<HTMLInputElement>();

    const buttonRef = React.createRef<HTMLButtonElement>();

    const navigate = useNavigate();

    const setErrorText = (message: string, color: string): void => {
        setErrorMessage({
            color: color,
            message: message,
        });
        setErrorShown(true);
    };

    const toggleButtonDisabledState = (state?: boolean): void => {
        if (state == null) {
            state = true;
        }
        buttonRef.current && (buttonRef.current.disabled = state);
    };

    const onSubmitClick = async (_event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        let username = usernameRef.current.value;
        let password = passwordRef.current.value;

        toggleButtonDisabledState();

        const request = await http("/api/login", "POST", {
            username: username,
            password: password,
        });

        if (request.status === 200) {
            navigate("/");
            return;
        }

        const response = await request.json();
        let message = response[0];

        console.log(request.status);
        if (request.status) {
            if (request.status == 401) {
                setErrorText(message, "--color-red");
            } else if (request.status == 200) {
                setErrorText(message, "--color-green");
            } else {
                setErrorText(message, "--color-red");
            }
            toggleButtonDisabledState(false);
        } else {
            setErrorText("Backend geeft geen antwoord, vraag een icter.", "--color-red");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex w-full max-w-[28rem] flex-col gap-10 rounded-[2rem] bg-(--color-white) p-10 shadow-lg">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-[32px] font-bold text-(--color-darkblue)">Welkom terug</h1>

                    <p className="text-[18px] font-medium text-(--color-orange)">Log in op je dashboard</p>
                </div>

                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-(--color-darkblue)" htmlFor="username">
                            Gebruikersnaam
                        </label>

                        <input
                            className="rounded-xl border border-(--color-lightblue) bg-(--color-offwhite) px-5 py-3
                                text-[16px] text-(--color-offblack) outline-none transition-colors
                                focus:border-(--color-darkblue)"
                            id="username"
                            type="text"
                            placeholder="Gebruikersnaam123"
                            ref={usernameRef}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[16px] font-semibold text-(--color-darkblue)" htmlFor="password">
                            Wachtwoord
                        </label>

                        <input
                            className="rounded-xl border border-(--color-lightblue) bg-(--color-offwhite) px-5 py-3
                                text-[16px] text-(--color-offblack) outline-none transition-colors
                                focus:border-(--color-darkblue)"
                            id="password"
                            type="password"
                            placeholder="Wachtwoord123"
                            ref={passwordRef}
                        />
                        {errorShown ? (
                            <p className={`text-[14px] font-medium text-(${errorMessage.color})`}>
                                {errorMessage.message}
                            </p>
                        ) : null}
                    </div>

                    <button
                        className="w-full rounded-xl bg-(--color-darkblue) py-4 text-[18px] font-semibold
                            text-(--color-white) transition-colors hover:bg-(--color-darkblue)/90"
                        type="button"
                        onClick={onSubmitClick}
                        ref={buttonRef}>
                        Inloggen
                    </button>
                </form>
            </div>
        </div>
    );
}
