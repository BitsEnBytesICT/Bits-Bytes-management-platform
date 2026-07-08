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

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

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
            setErrorText("Server reageert niet", "--color-red");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div
                className="py-12.5 px-10 flex flex-col w-full max-w-110 rounded-4xl bg-(--color-white)
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]
                    animate-[fade-in_0.3s_ease-in-out] transition-all duration-400">
                <div className="mb-15 flex flex-col items-center gap-3">
                    <h1 className="text-[32px] font-bold text-(--color-darkblue)">Welkom terug</h1>

                    <p className="text-[18px] font-medium text-(--color-orange)">Log in op je dashboard</p>
                </div>

                <form className="flex flex-col" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label
                                className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)"
                                htmlFor="username">
                                Gebruikersnaam
                            </label>

                            <input
                                className="px-5 py-3 text-[16px] text-(--color-offblack) rounded-xl
                                    bg-(--color-offwhite)
                                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                                    outline-none transition-colors focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]"
                                id="username"
                                placeholder="Gebruikersnaam"
                                ref={usernameRef}
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)"
                                htmlFor="password">
                                Wachtwoord
                            </label>

                            <input
                                className="px-5 py-3 text-[16px] text-(--color-offblack) rounded-xl
                                    bg-(--color-offwhite)
                                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                                    outline-none transition-colors focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]"
                                id="password"
                                placeholder="Wachtwoord"
                                ref={passwordRef}
                                type="password"
                            />
                        </div>
                    </div>

                    <p
                        key={errorMessage?.message}
                        className={`mt-[0.5rem] mb-8 ml-1.5 min-h-[24px] text-[14px font-medium
                            text-(${errorShown ? errorMessage.color : "--color-white"}) ${
                                errorShown ? "animate-[fade-in_0.3s_ease-in-out]" : ""
                            }`}>
                        {errorShown ? errorMessage.message : ""}
                    </p>

                    <button
                        className="py-4 w-full text-[18px] font-semibold text-(--color-white) rounded-xl
                            bg-(--color-darkblue) cursor-pointer transition-colors hover:bg-(--color-darkblue)/90"
                        ref={buttonRef}
                        type="submit">
                        Inloggen
                    </button>
                </form>
            </div>
        </div>
    );
}
